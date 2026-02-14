import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Modal,
  Input,
  InputNumber,
  QRCode,
  Upload,
  Form,
  message,
  Avatar,
  Badge,
  Tag,
  Divider,
  Tabs,
  Descriptions,
  Space,
  Progress
} from 'antd';
import {
  DashboardOutlined,
  DollarOutlined,
  IdcardOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QrcodeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PremiumCard from '../components/PremiumCard';
import ReactDOM from 'react-dom/client';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const MemberDashboard = () => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [activeKey, setActiveKey] = useState('1');
  const cardRef = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch user data
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: () => axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data.user)
  });

  // Fetch donations
  const { data: donationsData, refetch: refetchDonations } = useQuery({
    queryKey: ['donations'],
    queryFn: () => axios.get('/api/donations/my-donations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data)
  });

  // Create donation mutation
  const createDonationMutation = useMutation({
    mutationFn: (amount) => 
      axios.post('/api/donations/create', { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
    onSuccess: (response) => {
      toast.success('Donation QR code generated!');
      setSelectedDonation(response.data.donation);
      setDonateModalOpen(false);
      setPaymentModalOpen(true);
      refetchDonations();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Donation creation failed');
    }
  });

  // Submit payment mutation
  const submitPaymentMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'screenshot') {
          formData.append(key, data[key]);
        }
      });
      if (data.screenshot) {
        formData.append('screenshot', data.screenshot.file);
      }
      return axios.put(`/api/donations/${selectedDonation._id}/submit`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      toast.success('Payment submitted for verification!');
      setPaymentModalOpen(false);
      refetchDonations();
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Payment submission failed');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

 const downloadCards = async () => {
  try {
    toast.loading('Generating premium card...');
    
    // Create a temporary div for rendering both sides
    const tempDiv = document.createElement('div');
    // tempDiv.style.position = 'fixed';
    // tempDiv.style.top = '-2000px';
    // tempDiv.style.left = '-2000px';
    // tempDiv.style.width = '1600px'; // Double width for two cards
    tempDiv.style.height = '500px';
    // tempDiv.style.background = 'white';
    tempDiv.style.display = 'flex';
    document.body.appendChild(tempDiv);

    // Create a React portal or render component
    const root = ReactDOM.createRoot(tempDiv);
    root.render(
     
       
        
        
          <PremiumCard  
          user={userData || user} 
          donations={donationsData?.donations || []} />
       
    
    );

    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = await html2canvas(tempDiv, {
      scale: 1,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF with two pages
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 450]
    });

    // Add front side to first page
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 650, 'FRONT', 'FAST');
    
    // // Add new page for back side
    // pdf.addPage([800, 450], 'landscape');
    // // For back side, we need to crop the second part of the image
    // pdf.addImage(imgData, 'PNG', 0, 0, 800, 450, 'BACK', 'FAST');

    pdf.save(`lifeline-card-${user.username}.pdf`);

    // Cleanup
    root.unmount();
    document.body.removeChild(tempDiv);
    
    toast.dismiss();
    toast.success('Premium card downloaded successfully!');
    
  } catch (error) {
    console.error('Download error:', error);
    toast.dismiss();
    toast.error('Failed to download card');
  }
};


const downloadCard = async () => {
  try {
    toast.loading('Generating premium card...');
 
    // Create separate containers with EXACT card dimensions
    const frontContainer = document.createElement('div');
    frontContainer.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      width: 350px;
      height: 220px;
      background: white;
      border: 1px solid #ccc;
      transform: scale(1);
    `;
    document.body.appendChild(frontContainer);

    const backContainer = document.createElement('div');
    backContainer.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      width: 350px;
      height: 220px;
      background: white;
      border: 1px solid #ccc;
      transform: scale(1);
    `;
    document.body.appendChild(backContainer);

    // Render front card
    const frontRoot = ReactDOM.createRoot(frontContainer);
    frontRoot.render(
      <div style={{ width: '350px', height: '220px' }}>
        {/* FRONT CARD COMPONENT */}
        <div style={{
          width: '350px',
          height: '220px',
          background: 'white',
          position: 'relative',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* Top Red Bar */}
          <div style={{ height: '8px', background: '#dc2626', width: '100%' }}></div>
          
          <div style={{ padding: '10px' }}>
            {/* Organization Name */}
            <div style={{ textAlign: 'center', marginBottom: '5px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626' }}>
                Donate Card
              </div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ef4444' }}>
                Donate Help Money Member
              </div>
            </div>

            {/* Membership Number */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                color: '#000',
                fontFamily: 'monospace'
              }}>
          {userData?.membershipNumber}
              </div>
            </div>

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img
             src={`${axios.defaults.baseURL}/uploads/${userData.profilePic}`} 
              
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                background: '#f3f4f6',
                border: '2px solid #dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              
              /  >


                {/* <span style={{ fontSize: '16px', color: '#dc2626' }}>
                  {user.name?.charAt(0) || 'U'}
                </span> */}
              {/* </div> */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>
                  {userData.name || 'User Name'}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {userData.address || 'Ranchi'}
                </div>


 






                
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '8px', color: '#888' }}>Issue Date</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}>
                  {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '8px', color: '#888', marginBottom: '2px' }}>LIFELINE</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#dc2626' }}>SHIELD</div>
              </div>
              
              <div>
                <div style={{ fontSize: '8px', color: '#888' }}>Valid Upto</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}>2028</div>
              </div>
            </div>
          </div>
          
          {/* Bottom Red Bar */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '8px', background: '#dc2626' }}></div>
        </div>
      </div>
    );

    // Render back card
    const backRoot = ReactDOM.createRoot(backContainer);
    backRoot.render(
      <div style={{ width: '350px', height: '220px' }}>
        {/* BACK CARD COMPONENT */}
        <div style={{
          width: '350px',
          height: '220px',
          background: 'white',
          position: 'relative',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* Top Blue Bar */}
          <div style={{ height: '8px', background: '#2563eb', width: '100%' }}></div>
          
          <div style={{ padding: '10px' }}>
            {/* Emergency Contact */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#b91c1c' }}>
                Customer Care Number (24 Hours) - 03369028755
              </div>
              <div style={{ fontSize: '9px', color: '#dc2626', fontWeight: '500' }}>
                Emergency use Only
              </div>
            </div>

            {/* QR Code Area */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <div style={{ border: '1px solid #9ca3af', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* QR Placeholder */}
                <img src='https://media.istockphoto.com/id/1270779408/vector/money.jpg?s=612x612&w=0&k=20&c=terPvOaUaP3O8KFIQXvbpVZ9bEGTn27DDhnzlDhACVM=' style={{ width: '60px', height: '60px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  />
                   
                
              </div>
              
              <div>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#666' }}>Reg No.</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>{userData?.membershipNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#666' }}>Unique ID No.</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>{userData?.username}</div>
                </div>
              </div>
            </div>

            {/* Hindi Text */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', color: '#374151', lineHeight: '1.3' }}>
                यह भारत का न्यू और भरासेमद काउडफिडिंग प्लेटफॉर्म है
                हम सभी के लिए स्वास्थ्य सेवा में विश्वास करते हैं
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                📞 <span>03369028755</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                📅 <span>Issued: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          {/* Bottom Blue Bar */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '8px', background: '#2563eb' }}></div>
        </div>
      </div>
    );

    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Capture each card separately
    const frontCanvas = await html2canvas(frontContainer, {
      scale: 3, // High resolution
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: 350,
      height: 220,
      windowWidth: 350,
      windowHeight: 220
    });

    const backCanvas = await html2canvas(backContainer, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: 350,
      height: 220,
      windowWidth: 350,
      windowHeight: 220
    });

    // Create PDF with A6 size (105x148mm = perfect for two cards side by side)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [148, 105] // A6 landscape = 2 credit cards side by side
    });

    const frontImg = frontCanvas.toDataURL('image/png');
    const backImg = backCanvas.toDataURL('image/png');

    // Calculate positions for perfect alignment
    // A6 size: 148mm x 105mm
    // Each card: 85.6mm x 53.98mm (standard credit card size in mm)
    // Add margins for perfect fit
    
    const cardWidthMM = 70; // Slightly smaller than credit card for margins
    const cardHeightMM = 44; // Maintain 350:220 aspect ratio
    const marginX = (148 - (cardWidthMM * 2)) / 3; // Equal margins on sides and between
    const marginY = (105 - cardHeightMM) / 2; // Center vertically

    // Add front card (left side)
    pdf.addImage(
      frontImg, 
      'PNG', 
      marginX, // X position
      marginY, // Y position
      cardWidthMM, 
      cardHeightMM,
      '', 
      'FAST'
    );

    // Add back card (right side)
    pdf.addImage(
      backImg, 
      'PNG', 
      marginX * 2 + cardWidthMM, // X position for right card
      marginY, // Same Y position
      cardWidthMM, 
      cardHeightMM,
      '', 
      'FAST'
    );

    pdf.save(`lifeline-card-${user.username}.pdf`);

    // Cleanup
    frontRoot.unmount();
    backRoot.unmount();
    document.body.removeChild(frontContainer);
    document.body.removeChild(backContainer);
    
    toast.dismiss();
    toast.success('Premium card downloaded successfully!');
    
  } catch (error) {
    console.error('Download error:', error);
    toast.dismiss();
    toast.error('Failed to download card');
  }
};




  const donationColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('en-IN')
    },
    {
      title: 'Amount (₹)',
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
          failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Failed' },
          cancelled: { color: 'gray', icon: <CloseCircleOutlined />, text: 'Cancelled' }
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
      title: 'Verified By',
      dataIndex: 'verifiedBy',
      key: 'verifiedBy',
      render: (user) => user?.name || '-'
    },
     
  ];

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '2',
      icon: <DollarOutlined />,
      label: 'Donations'
    },
   
    {
      key: '4',
      icon: <UserOutlined />,
      label: 'Profile'
    },
    
    {
      key: '6',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="light"
        className="shadow-lg"
      >
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Avatar
              size="large"
              src={userData?.profilePic ? `${axios.defaults.baseURL}/uploads/${userData.profilePic}` : null}
              icon={!userData?.profilePic && <UserOutlined />}
              className="mr-3"
            />
            <div>
              <div className="font-semibold">{userData?.name || user.name}</div>
              <div className="text-xs text-gray-500">{userData?.membershipNumber}</div>
            </div>
          </div>
        </div>
        <Menu
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
              {activeKey === '1' && 'Dashboard'}
              {activeKey === '2' && 'Donations'}
              {activeKey === '3' && 'Membership Card'}
              {activeKey === '4' && 'Profile'}
              {activeKey === '5' && 'Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              <Badge count={donationsData?.donations?.filter(d => d.status === 'pending').length || 0}>
                <Button 
                  type="primary" 
                  icon={<DollarOutlined />}
                  onClick={() => setDonateModalOpen(true)}
                  className="bg-lifeline-green"
                >
                  Donate Now
                </Button>
              </Badge>
            </div>
          </div>
        </Header>

        <Content className="p-6 overflow-auto">
          {activeKey === '1' && (
            <>
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg border-t-4 border-t-lifeline-blue">
                    <Statistic
                      title="Total Donations"
                      value={userData?.totalDonations || 0}
                      prefix="₹"
                      valueStyle={{ color: '#1e40af' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg border-t-4 border-t-lifeline-green">
                    <Statistic
                      title="Donation Count"
                      value={userData?.donationCount || 0}
                      valueStyle={{ color: '#059669' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg border-t-4 border-t-lifeline-red">
                    <Statistic
                      title="Pending Donations"
                      value={donationsData?.donations?.filter(d => d.status === 'pending').length || 0}
                      valueStyle={{ color: '#dc2626' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-lg border-t-4 border-t-lifeline-gold">
                    <Statistic
                      title="Member Since"
                      value={userData ? new Date(userData.createdAt).getFullYear() : '2024'}
                      suffix="year"
                      valueStyle={{ color: '#d97706' }}
                    />
                  </Card>
                </Col>
              </Row>
{
  console.log(userData)
}
              <Card title="Recent Donations" className="shadow-lg mb-6">
                <Table
                scroll={{x:true}}
                  columns={donationColumns}
                  dataSource={donationsData?.donations?.slice(0, 5) || []}
                  loading={isLoading}
                  rowKey="_id"
                  pagination={false}
                />
              </Card>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="Quick Actions" className="shadow-lg">
                    <Space wrap>
                      <Button 
                        type="primary" 
                        icon={<QrcodeOutlined />}
                        size="large"
                        onClick={() => setDonateModalOpen(true)}
                        className="bg-lifeline-green"
                      >
                        New Donation
                      </Button>
                      <Button 
                        icon={<IdcardOutlined />}
                        size="large"
                        onClick={downloadCard}
                      >
                        Download Card
                      </Button>
                      <Button 
                        icon={<HistoryOutlined />}
                        size="large"
                        onClick={() => setActiveKey('2')}
                      >
                        View All Donations
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {activeKey === '2' && (
            <Card title="All Donations" className="shadow-lg">
              <Tabs defaultActiveKey="all">
                <TabPane tab="All Donations" key="all">
                  <Table
                  scroll={{x:true}}
                    columns={donationColumns}
                    dataSource={donationsData?.donations || []}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="Pending" key="pending">
                  <Table
                   scroll={{x:true}}
                    columns={donationColumns}
                    dataSource={donationsData?.donations?.filter(d => d.status === 'pending') || []}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="Completed" key="completed">
                  <Table
                   scroll={{x:true}}
                    columns={donationColumns}
                    dataSource={donationsData?.donations?.filter(d => d.status === 'completed') || []}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          )}

          {activeKey === '3' && (
            <div>
              <Card title="Premium Membership Card" className="shadow-lg mb-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-4">
                    Download your official Lifeline Multi Technology premium membership card
                  </p>
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<IdcardOutlined />}
                    onClick={downloadCard}
                    className="bg-lifeline-purple"
                  >
                    Download Premium Card
                  </Button>
                </div>
                
                <div className="flex justify-center">
                  <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                    <div ref={cardRef}>
                      <PremiumCard 
                        user={userData || user} 
                        donations={donationsData?.donations || []} 
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeKey === '4' && (
            <Card title="Profile" className="shadow-lg">
              <Descriptions 
                bordered 
                column={1} 
                size="middle"
                className="max-w-2xl"
              >
                <Descriptions.Item label="Membership Number">
                  <Tag color="blue">{userData?.membershipNumber}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Full Name">
                  {userData?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email/Adhar">
                  {userData?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Mobile">
                  {userData?.mobile}
                </Descriptions.Item>
                <Descriptions.Item label="Total Donations">
                  <span className="font-bold text-green-700">
                    ₹{userData?.totalDonations?.toLocaleString('en-IN') || 0}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Donation Count">
                  {userData?.donationCount || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Member Since">
                  {userData ? new Date(userData.createdAt).toLocaleDateString('en-IN') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Login">
                  {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString('en-IN') : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Content>
      </Layout>

      {/* Donation Modal */}
      <Modal
        title="Make a Donation"
        open={donateModalOpen}
        onCancel={() => setDonateModalOpen(false)}
        footer={null}
        width={500}
        centered
      >
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Donation Amount</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100, 500, 1000, 2000, 5000, 10000].map(amount => (
                <Button
                  key={amount}
                  type="default"
                  className={`h-16 text-lg ${selectedDonation?.amount === amount ? 'border-2 border-lifeline-green' : ''}`}
                  onClick={() => createDonationMutation.mutate(amount)}
                  loading={createDonationMutation.isLoading && selectedDonation?.amount === amount}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Or enter custom amount:</p>
              <InputNumber
                min={10}
                max={1000000}
                style={{ width: '200px' }}
                size="large"
                prefix="₹"
                onChange={(value) => {
                  if (value) createDonationMutation.mutate(value);
                }}
                disabled={createDonationMutation.isLoading}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Payment Submission Modal */}
      <Modal
        title="Submit Payment Proof"
        open={paymentModalOpen}
        onCancel={() => setPaymentModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        {selectedDonation && (
          <Form
            onFinish={submitPaymentMutation.mutate}
            layout="vertical"
            size="large"
          >
            <div className="text-center mb-6">
              {/* <QRCode
                value={selectedDonation.qrCode || `donation:${selectedDonation._id}`}
                size={200}
                className="mb-4 mx-auto"
              /> */}



              <img src="https://i.ibb.co/jZsGr0jf/Whats-App-Image-2026-02-09-at-11-44-04-PM.jpg" alt="" />
              <p className="text-lg font-bold text-gray-800">
                Amount: ₹{selectedDonation.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600">
                Transaction ID: {selectedDonation.transactionId}
              </p>
            </div>

            <Form.Item
              name="transactionId"
              label="Transaction ID from Payment App"
              rules={[{ required: true, message: 'Please enter transaction ID' }]}
            >
              <Input placeholder="Enter UPI/Transaction ID" />
            </Form.Item>

            <Form.Item
              name="upiId"
              label="UPI ID (Optional)"
            >
              <Input placeholder="Enter UPI ID if applicable" />
            </Form.Item>

            <Form.Item
              name="remarks"
              label="Remarks (Optional)"
            >
              <Input.TextArea placeholder="Any additional remarks" rows={3} />
            </Form.Item>

            <Form.Item
              name="screenshot"
              label="Payment Screenshot"
              rules={[{ required: true, message: 'Please upload payment screenshot' }]}
            >
              <Upload
                accept="image/*"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload Screenshot</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitPaymentMutation.isPending}
                block
                size="large"
                className="bg-lifeline-green"
              >
                Submit Payment Proof
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Layout>
  );
};

export default MemberDashboard;