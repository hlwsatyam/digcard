import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Table, Input, Button, Space, Modal, Form, Pagination, Avatar, Badge, Tag } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { UserPlus, Users, Filter, LockIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch members with pagination and search
  const { data, isLoading } = useQuery({
    queryKey: ['members', currentPage, searchText],
    queryFn: async () => {
      const response = await axios.get('/api/users/members', {
        params: {
          page: currentPage,
          limit: 5,
          search: searchText,
          createdBy: user._id
        }
      });
      return response.data;
    }
  });

  // Create member mutation
  const createMember = useMutation({
    mutationFn: async (memberData) => {
      const response = await axios.post('/api/users/member', {
        ...memberData,
        createdBy: user._id,
        password: memberData.password || 'member123'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
      toast.success('Member created successfully');
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create member');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const columns = [
    {
      title: 'Member',
      key: 'member',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            className="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
          <div>
            <div className="font-semibold">{record.name}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
            <div className="text-xs text-gray-500">{record.password}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HomeOutlined className="text-gray-400" />
            <span className="truncate max-w-[200px]">{record.address || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Badge status="success" text="Active" />
      ),
    },
    {
      title: 'Joined',
      key: 'createdAt',
      render: (_, record) => (
        <div className="text-sm">
          {new Date(record.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <DashboardOutlined className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {user?.name || 'Admin'}!
            </p>
          </div>
        </div>
        
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-10 px-6 font-semibold"
          >
            Create Member
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="h-10 px-6"
          >
            Logout
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <Users className="w-8 h-8 opacity-80" />
              <div className="text-2xl font-bold mt-2">{data?.total || 0}</div>
              <div className="text-sm opacity-90">Total Members</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <UserPlus className="w-8 h-8 opacity-80" />
              <div className="text-2xl font-bold mt-2">
                {data?.members?.length || 0}
              </div>
              <div className="text-sm opacity-90">This Page</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <Filter className="w-8 h-8 opacity-80" />
              <div className="text-2xl font-bold mt-2">{data?.totalPages || 0}</div>
              <div className="text-sm opacity-90">Total Pages</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Members Table Card */}
      <Card className="shadow-xl rounded-xl border-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Member Management
          </h2>
          
          <Search
            placeholder="Search members by name, email or phone"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={(value) => {
              setSearchText(value);
              setCurrentPage(1);
            }}
            className="w-full md:w-96"
          />
        </div>
 
        <Table
          columns={columns}
          dataSource={data?.members}
          loading={isLoading}
          pagination={false}
          rowKey="_id"
          className="overflow-x-auto"
        />

        <div className="flex justify-end mt-6">
          <Pagination
            current={currentPage}
            total={data?.total || 0}
            pageSize={5}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} members`}
          />
        </div>
      </Card>

      {/* Create Member Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Create New Member
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createMember.mutate(values)}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter member name' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="Enter email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input 
              prefix={<PhoneOutlined className="text-gray-400" />} 
              placeholder="Enter phone number"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="password  "
          >
            <Input 
              prefix={<LockIcon className="text-gray-400" />} 
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input 
              prefix={<HomeOutlined className="text-gray-400" />} 
              placeholder="Enter address"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={createMember.isPending}
              block
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 font-semibold"
            >
              Create Member
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;