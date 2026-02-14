import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <HomeOutlined />, label: 'Home' },
    { path: '/create-post', icon: <PlusCircleOutlined />, label: 'Post' },
    { path: '/profile', icon: <UserOutlined />, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              type="text"
              icon={React.cloneElement(item.icon, {
                style: { fontSize: '20px' },
                className: isActive ? 'text-blue-600' : 'text-gray-500'
              })}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center h-full px-4 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;