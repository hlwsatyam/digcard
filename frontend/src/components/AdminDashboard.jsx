import React, { useState } from 'react';
import { Table, Button, Modal, Card, Tag, Avatar, Space, Input } from 'antd';
import { EyeOutlined,   UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [searchText, setSearchText] = useState('');

  const { data: enquiries, isLoading, refetch } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => axios.get('/api/enquiries').then(res => res.data)
  });

  const generateCredentialsMutation = useMutation({
    mutationFn: (enquiryId) => 
      axios.post(`/api/enquiries/${enquiryId}/generate-credentials`),
    onSuccess: () => {
      toast.success('Credentials generated and sent successfully!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate credentials');
    }
  });

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profilePic',
      key: 'profile',
      render: (pic) => (
        <Avatar 
          src={`${axios.defaults.baseURL}/uploads/${pic}`} 
          size={50}
          className="border-2 border-primary"
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={
            status === 'approved' ? 'green' : 
            status === 'rejected' ? 'red' : 'orange'
          }
        >
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => viewEnquiryDetails(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={() => generateCredentialsMutation.mutate(record._id)}
              loading={generateCredentialsMutation.isLoading && generateCredentialsMutation.variables === record._id}
              className="bg-green-600 hover:bg-green-700"
            >
              Generate ID
            </Button>
          )}
        </Space>
      )
    }
  ];

  const viewEnquiryDetails = (enquiry) => {
    Modal.info({
      title: 'Enquiry Details',
      width: 600,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar 
              src={`${axios.defaults.baseURL}/uploads/${enquiry.profilePic}`} 
              size={100}
              className="border-4 border-primary"
            />
            <div>
              <h3 className="text-xl font-bold">{enquiry.name}</h3>
              <p className="text-gray-600">{enquiry.email}</p>
              <p className="text-gray-600">{enquiry.mobile}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Reason:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{enquiry.reason}</p>
          </div>
          {enquiry.generatedCredentials && (
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-700 mb-2">Generated Credentials:</h4>
              <p><strong>Username:</strong> {enquiry.generatedCredentials.username}</p>
              <p><strong>Password:</strong> {enquiry.generatedCredentials.password}</p>
            </div>
          )}
        </div>
      )
    });
  };

  const filteredEnquiries = enquiries?.filter(enquiry => 
    enquiry.name.toLowerCase().includes(searchText.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchText.toLowerCase()) ||
    enquiry.mobile.includes(searchText)
  );

  return (
    <div className="p-6">
      <Card className="mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-lifeline-blue">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage enquiries and generate member IDs</p>
          </div>
          <div className="w-64">
            <Input
              placeholder="Search enquiries..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </div>
        </div>
      </Card>

      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredEnquiries}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;