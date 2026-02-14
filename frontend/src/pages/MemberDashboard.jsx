import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Avatar, Descriptions, Button, Tag, Divider } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  CalendarOutlined,
  CrownOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { User, Building, Calendar, Store } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { baseURL } from '../local/l1';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch member details with creator info
  const { data: memberData, isLoading } = useQuery({
    queryKey: ['member', user._id],
    queryFn: async () => {
      const response = await axios.get(`/api/users/member/${user._id}`);
      return response.data;
    }
  });

  // Fetch store
  const { data: storeData } = useQuery({
    queryKey: ['store', user._id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/stores/store/owner/${user._id}`);
        return response.data;
      } catch (error) {
        return null;
      }
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg">
            <DashboardOutlined className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Member Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {memberData?.name}!
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to="/member/store">
            <Button
              type="primary"
              icon={<ShopOutlined />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 h-10 px-6 font-semibold"
            >
              {storeData ? 'Manage Store' : 'Create Store'}
            </Button>
          </Link>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="h-10 px-6"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card 
            className="shadow-xl rounded-xl border-0 h-full"
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">My Profile</span>
              </div>
            }
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                className="bg-gradient-to-r from-green-500 to-teal-500 shadow-lg"
              />
              <div className="text-center md:text-left">
                <Tag color="green" className="mb-2 px-3 py-1 text-sm">
                  Active Member
                </Tag>
                <h2 className="text-2xl font-bold text-gray-800">{memberData?.name}</h2>
                <p className="text-gray-500">Member since {new Date(memberData?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Divider className="my-4" />

            <Descriptions layout="vertical" bordered column={1} className="bg-gray-50">
              <Descriptions.Item label={<><MailOutlined className="mr-2" /> Email</>}>
                <span className="font-medium">{memberData?.email}</span>
              </Descriptions.Item>
              
              <Descriptions.Item label={<><PhoneOutlined className="mr-2" /> Phone</>}>
                <span className="font-medium">{memberData?.phone || 'Not provided'}</span>
              </Descriptions.Item>
              
              <Descriptions.Item label={<><HomeOutlined className="mr-2" /> Address</>}>
                <span className="font-medium">{memberData?.address || 'Not provided'}</span>
              </Descriptions.Item>
              
              <Descriptions.Item label={<><CalendarOutlined className="mr-2" /> Member ID</>}>
                <span className="font-mono text-sm">{memberData?._id}</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Creator Info Card */}
        <div className="lg:col-span-1">
          <Card 
            className="shadow-xl rounded-xl border-0 h-full bg-gradient-to-br from-blue-50 to-indigo-50"
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <CrownOutlined className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-semibold">Account Creator</span>
              </div>
            }
          >
            {memberData?.createdBy ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mb-3"
                  />
                  <h3 className="text-xl font-bold text-gray-800">{memberData.createdBy.name}</h3>
                  <Tag color="blue" className="mt-2 px-3 py-1">
                    Administrator
                  </Tag>
                </div>

                <Divider className="my-3">Contact Details</Divider>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <MailOutlined className="text-blue-600 text-lg" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{memberData.createdBy.email}</div>
                    </div>
                  </div>

                  {memberData.createdBy.phone && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <PhoneOutlined className="text-blue-600 text-lg" />
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="font-medium">{memberData.createdBy.phone}</div>
                      </div>
                    </div>
                  )}

                  {memberData.createdBy.address && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <HomeOutlined className="text-blue-600 text-lg" />
                      <div>
                        <div className="text-xs text-gray-500">Address</div>
                        <div className="font-medium">{memberData.createdBy.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserOutlined className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">Creator information not available</p>
              </div>
            )}
          </Card>
        </div>

        {/* Store Info Card */}
        <div className="lg:col-span-3">
          <Card 
            className="shadow-xl rounded-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50"
            title={
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">My Store</span>
              </div>
            }
          >
            {storeData ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {storeData.logo?.url ? (
                    <img 
                      src={`${baseURL}/${storeData.logo.url}`}
                      alt={storeData.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <ShopOutlined className="text-white text-2xl" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{storeData.name}</h3>
                    <p className="text-gray-500 text-sm">{storeData.description?.substring(0, 100)}...</p>
                    <Tag color="purple" className="mt-2">
                      {storeData.category || 'General Store'}
                    </Tag>
                  </div>
                </div>
                <Link to="/member/store">
                  <Button 
                    type="primary"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                  >
                    Manage Store
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">You haven't created a store yet.</p>
                <Link to="/member/store">
                  <Button 
                    type="primary"
                    icon={<ShopOutlined />}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                  >
                    Create Your Store
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;