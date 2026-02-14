import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  HeartOutlined,
  HistoryOutlined,
  IdcardOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import MemberDashboard from '../components/MemberDashboard';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const Member = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/member'),
    },
    {
      key: 'donate',
      icon: <HeartOutlined />,
      label: 'Donate Now',
      onClick: () => navigate('/member/donate'),
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: 'Donation History',
      onClick: () => navigate('/member/history'),
    },
    {
      key: 'card',
      icon: <IdcardOutlined />,
      label: 'My Donation Card',
      onClick: () => navigate('/member/card'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/member/profile'),
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        theme="light"
        className="shadow-lg border-r border-gray-200"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={user?.profilePic ? `${axios.defaults.baseURL}/uploads/${user.profilePic}` : null}
              size={40}
              className="border-2 border-lifeline-blue"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">{user?.username}</h1>
              <p className="text-gray-500 text-xs">Member</p>
            </div>
          </div>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-lifeline-blue">
              {process.env.REACT_APP_APP_NAME}
            </h2>
            <p className="text-gray-500 text-sm">Making a difference, one donation at a time</p>
          </div>

          <div className="flex items-center space-x-4">
            <Badge count={3}>
              <Button 
                type="text" 
                icon={<BellOutlined className="text-xl" />}
                className="hover:bg-gray-100"
              />
            </Badge>
            
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Avatar 
                src={user?.profilePic ? `${axios.defaults.baseURL}/uploads/${user.profilePic}` : null}
                icon={<UserOutlined />}
                className="cursor-pointer bg-lifeline-blue hover:opacity-80 transition-opacity"
                size="large"
              />
            </Dropdown>
          </div>
        </Header>

        <Content className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            {/* Default content if no sub-route */}
            {!window.location.pathname.includes('/member/') && <MemberDashboard />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Member;