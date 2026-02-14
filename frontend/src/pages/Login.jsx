import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {   LogIn } from 'lucide-react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('admin');

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email: values.email,
        password: values.password
      });

      if (response.data.role !== loginType) {
        toast.error(`This account is not registered as ${loginType}`);
        setLoading(false);
        return;
      }

    
     
      if (response.data.role === 'admin') {
        window.location.href=('/admin/dashboard');
          localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Login successful!');
      } else {
        window.location.href=('/member/dashboard');
          localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Login successful!');
      }
    } catch (error) {

      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mt-6 -mx-6 mb-6 p-6">
          <Title level={2} className="text-white text-center m-0">
            Welcome Back!
          </Title>
          <Text className="text-blue-100 block text-center mt-2">
            Sign in to continue to your dashboard
          </Text>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            type={loginType === 'admin' ? 'primary' : 'default'}
            onClick={() => setLoginType('admin')}
            className={`flex-1 h-12 font-semibold ${
              loginType === 'admin' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-0' 
                : ''
            }`}
            icon={<UserOutlined />}
          >
            Admin Login
          </Button>
          <Button
            type={loginType === 'member' ? 'primary' : 'default'}
            onClick={() => setLoginType('member')}
            className={`flex-1 h-12 font-semibold ${
              loginType === 'member' 
                ? 'bg-gradient-to-r from-green-600 to-teal-600 border-0' 
                : ''
            }`}
            icon={<UserOutlined />}
          >
            Member Login
          </Button>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={`w-full h-12 font-semibold text-base rounded-lg border-0 ${
                loginType === 'admin' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600'
              }`}
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign in as {loginType.charAt(0).toUpperCase() + loginType.slice(1)}
            </Button>
          </Form.Item>
        </Form>

    
 
      </Card>
    </div>
  );
};

export default Login;