import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Statistic,
  Timeline,
  Avatar,
  Descriptions,
  Badge,
  Tabs,
  Space,
  notification,
  Popconfirm
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  HistoryOutlined,
  TeamOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  DeleteFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LocateFixedIcon } from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const AdminPanel = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const navigate = useNavigate();

  // Fetch enquiries
  const { data: enquiriesData, isLoading: enquiriesLoading, refetch: refetchEnquiries } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => axios.get('/api/enquiries/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data)
  });

  // Fetch all donations
  const { data: allDonations, isLoading: donationsLoading, refetch: refetchDonations } = useQuery({
    queryKey: ['allDonations'],
    queryFn: () => axios.get('/api/admin/donations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data)
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => axios.get('/api/admin/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data)
  });
console.log(stats)
  // Convert enquiry to member
  const convertMutation = useMutation({
    mutationFn: ({ enquiryId, generatePassword }) =>
      axios.put(`/api/enquiries/convert/${enquiryId}`, { generatePassword }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: (response) => {
      toast.success('Enquiry converted to member successfully!');
      setConvertModalOpen(false);
      setSelectedEnquiry(null);
      refetchEnquiries();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Conversion failed');
    }
  });

  // Verify donation
  const verifyDonationMutation = useMutation({
    mutationFn: ({ donationId, status, remarks }) =>
      axios.put(`/api/donations/${donationId}/verify`, { status, remarks }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: () => {
      toast.success('Donation verified successfully!');
      setDonationModalOpen(false);
      setSelectedDonation(null);
      refetchDonations();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  });


  const deletett=async(id)=>{
 axios.delete(`/api/enquiries/delete?_id=${id}`)

 refetchEnquiries()
  }
  const deletettt=async(id)=>{
 axios.delete(`/api/donations/delete?_id=${id}`)

 refetchDonations()
  }


  // Add note to enquiry
  const addNoteMutation = useMutation({
    mutationFn: ({ enquiryId, note }) =>
      axios.post(`/api/enquiries/${enquiryId}/notes`, { note }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: () => {
      toast.success('Note added successfully!');
      refetchEnquiries();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add note');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '2',
      icon: <MessageOutlined />,
      label: 'Enquiries'
    },
    {
      key: '3',
      icon: <DollarOutlined />,
      label: 'Donations'
    },
   
    
     
    {
      key: '7',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const enquiryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            src={record.profilePic ? `${axios.defaults.baseURL}/uploads/${record.profilePic}` : null}
            icon={!record.profilePic && <UserOutlined />}
            className="mr-3"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text) => (
        <div className="flex items-center">
          <PhoneOutlined className="mr-2 text-gray-400" />
          {text}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          new: { color: 'blue', text: 'New' },
          contacted: { color: 'orange', text: 'Contacted' },
          converted: { color: 'green', text: 'Converted' },
          rejected: { color: 'red', text: 'Rejected' }
        };
        const config = statusConfig[status] || statusConfig.new;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('en-IN')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedEnquiry(record);
              setEnquiryModalOpen(true);
            }}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<DeleteFilled />}
            onClick={() => {
              deletett(record._id)
            }}
          >
            Delete
          </Button>
          {record.status === 'new' && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setSelectedEnquiry(record);
                setConvertModalOpen(true);
              }}
            >
              Convert
            </Button>
          )}
        </Space>
      )
    }
  ];

  const donationColumns = [
    {
      title: 'Member',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          <div className="font-medium">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.membershipNumber}</div>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-bold text-green-700">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      )
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (id) => <code className="text-xs">{id}</code>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' },
          completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
          failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Failed' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('en-IN')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <><Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedDonation(record);
            setDonationModalOpen(true);
          } }
        >
          Verify
        </Button><Button
          size="small"
          icon={<DeleteFilled />}
          onClick={() => {
            deletettt(record._id);
          } }
        >
            Delete
          </Button></>


      )
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
        className="shadow-lg"
      >
        <div className="p-4 text-white">
          <div className="text-xl font-bold mb-2">Lifeline Admin</div>
          <div className="text-sm opacity-80">Administration Panel</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={({ key }) => setActiveKey(key)}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Badge count={enquiriesData?.enquiries?.filter(e => e.status === 'new').length || 0}>
                <Tag color="blue">New Enquiries</Tag>
              </Badge>
              <Badge count={allDonations?.donations?.filter(d => d.status === 'pending').length || 0}>
                <Tag color="orange">Pending Donations</Tag>
              </Badge>
            </div>
          </div>
        </Header>

        <Content className="p-6 overflow-auto">
          {activeKey === '1' && (
            <>
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg">
                    <Statistic
                      title="Total Members"
                      value={stats?.totalMembers || 0}
                      valueStyle={{ color: '#1e40af' }}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg">
                    <Statistic
                      title="Total Donations"
                      value={stats?.totalDonations || 0}
                      prefix="₹"
                      valueStyle={{ color: '#059669' }}
                     
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg">
                    <Statistic
                      title="New Enquiries"
                      value={enquiriesData?.enquiries?.filter(e => e.status === 'new').length || 0}
                      valueStyle={{ color: '#dc2626' }}
                      prefix={<MessageOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg">
                    <Statistic
                      title="Pending Donations"
                      value={allDonations?.donations?.filter(d => d.status === 'pending').length || 0}
                      valueStyle={{ color: '#d97706' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title="Recent Enquiries" className="shadow-lg">
                    <Table
                    scroll={{x:true}}
                      columns={enquiryColumns}
                      dataSource={enquiriesData?.enquiries?.slice(0, 5) || []}
                      loading={enquiriesLoading}
                      rowKey="_id"
                      pagination={false}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Recent Donations" className="shadow-lg">
                    <Table
                    scroll={{x:true}}
                      columns={donationColumns}
                      dataSource={allDonations?.donations?.slice(0, 5) || []}
                      loading={donationsLoading}
                      rowKey="_id"
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {activeKey === '2' && (
            <Card title="All Enquiries" className="shadow-lg">
              <Tabs defaultActiveKey="all">
                <TabPane tab="All Enquiries" key="all">
                  <Table
                     scroll={{x:true}}
                    columns={enquiryColumns}
                    dataSource={enquiriesData?.enquiries || []}
                    loading={enquiriesLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="New" key="new">
                  <Table
                     scroll={{x:true}}
                    columns={enquiryColumns}
                    dataSource={enquiriesData?.enquiries?.filter(e => e.status === 'new') || []}
                    loading={enquiriesLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="Converted" key="converted">
                  <Table
                     scroll={{x:true}}
                    columns={enquiryColumns}
                    dataSource={enquiriesData?.enquiries?.filter(e => e.status === 'converted') || []}
                    loading={enquiriesLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          )}

          {activeKey === '3' && (
            <Card title="All Donations" className="shadow-lg">
              <Tabs defaultActiveKey="pending">
                <TabPane tab="Pending Verification" key="pending">
                  <Table
                  scroll={{x:true}}
                    columns={donationColumns}
                    dataSource={allDonations?.donations?.filter(d => d.status === 'pending') || []}
                    loading={donationsLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="Completed" key="completed">
                  <Table
                    columns={donationColumns}
                    dataSource={allDonations?.donations?.filter(d => d.status === 'completed') || []}
                    loading={donationsLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="All Donations" key="all">
                  <Table
                    columns={donationColumns}
                    dataSource={allDonations?.donations || []}
                    loading={donationsLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          )}
        </Content>
      </Layout>

      {/* Enquiry Details Modal */}
      <Modal
        title="Enquiry Details"
        open={enquiryModalOpen}
        onCancel={() => setEnquiryModalOpen(false)}
        width={700}
        footer={null}
      >
        {selectedEnquiry && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Name" span={2}>
                <div className="flex items-center">
                  <Avatar
                    src={selectedEnquiry.profilePic ? `${axios.defaults.baseURL}/uploads/${selectedEnquiry.profilePic}` : null}
                    icon={!selectedEnquiry.profilePic && <UserOutlined />}
                    className="mr-3"
                  />
                  <span className="font-bold">{selectedEnquiry.name}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Email/Adhar">
                <div className="flex items-center">
                  <MailOutlined className="mr-2" />
                  {selectedEnquiry.email}
                </div>
              </Descriptions.Item>
            
              <Descriptions.Item label="Mobile">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {selectedEnquiry.mobile}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={
                  selectedEnquiry.status === 'new' ? 'blue' :
                  selectedEnquiry.status === 'contacted' ? 'orange' :
                  selectedEnquiry.status === 'converted' ? 'green' : 'red'
                }>
                  {selectedEnquiry.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Message" span={2}>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedEnquiry.message}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Date Submitted">
                {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
              </Descriptions.Item>
            </Descriptions>

            {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold mb-3">Notes</h4>
                <Timeline>
                  {selectedEnquiry.notes.map((note, index) => (
                    <Timeline.Item key={index}>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm">{note.note}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}

            <div className="mt-6">
              <Form
                onFinish={(values) => {
                  addNoteMutation.mutate({
                    enquiryId: selectedEnquiry._id,
                    note: values.note
                  });
                }}
              >
                <Form.Item
                  name="note"
                  rules={[{ required: true, message: 'Please enter a note' }]}
                >
                  <Input.TextArea rows={3} placeholder="Add a note..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={addNoteMutation.isLoading}>
                    Add Note
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </Modal>

      {/* Convert Enquiry Modal */}
      <Modal
        title="Convert to Member"
        open={convertModalOpen}
        onCancel={() => setConvertModalOpen(false)}
        footer={null}
      >
        {selectedEnquiry && (
          <>
            <div className="mb-6">
              <p>Convert <strong>{selectedEnquiry.name}</strong> to a Lifeline member?</p>
              <p className="text-sm text-gray-600 mt-2">
                This will create a member account with auto-generated credentials.
              </p>
            </div>

            <Form
              onFinish={(values) => {
                convertMutation.mutate({
                  enquiryId: selectedEnquiry._id,
                  generatePassword: values.generatePassword
                });
              }}
            >
              <Form.Item
                name="generatePassword"
                label="Generate Password"
                initialValue={true}
              >
                <Select>
                  <Option value={true}>Auto-generate password</Option>
                  <Option value={false}>Use enquiry details as password</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={convertMutation.isPending}
                  >
                    Convert to Member
                  </Button>
                  <Button onClick={() => setConvertModalOpen(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      {/* Donation Verification Modal */}
      <Modal
        title="Verify Donation"
        open={donationModalOpen}
        onCancel={() => setDonationModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedDonation && (
          <>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Member">
                <div className="font-bold">{selectedDonation.user?.name}</div>
                <div className="text-sm text-gray-600">{selectedDonation.user?.membershipNumber}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <div className="text-xl font-bold text-green-700">
                  ₹{selectedDonation.amount?.toLocaleString('en-IN')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Transaction ID">
                <code>{selectedDonation.transactionId}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedDonation.paymentMethod?.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted On">
                {new Date(selectedDonation.createdAt).toLocaleString('en-IN')}
              </Descriptions.Item>
              {selectedDonation.screenshot && (
                <Descriptions.Item label="Screenshot">
                  <img
                    src={`${axios.defaults.baseURL}/uploads/${selectedDonation.screenshot}`}
                    alt="Payment proof"
                    className="max-w-full h-auto rounded"
                  />
                </Descriptions.Item>
              )}
              {selectedDonation.remarks && (
                <Descriptions.Item label="Remarks">
                  {selectedDonation.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="mt-6">
              <h4 className="font-bold mb-3">Verification Action</h4>
              <Form
                onFinish={(values) => {
                  verifyDonationMutation.mutate({
                    donationId: selectedDonation._id,
                    ...values
                  });
                }}
              >
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select verification status">
                    <Option value="completed">Approve (Completed)</Option>
                    <Option value="failed">Reject (Failed)</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="remarks"
                  label="Remarks (Optional)"
                >
                  <Input.TextArea rows={3} placeholder="Add verification remarks..." />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={verifyDonationMutation.isPending}
                    >
                      Submit Verification
                    </Button>
                    <Button onClick={() => setDonationModalOpen(false)}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminPanel;