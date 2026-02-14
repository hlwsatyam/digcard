import React, { useState } from 'react';
import { Form, Input, Button, Card, Divider, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import EnquiryModal from './EnquiryModal';

const LoginPage = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [loginForm] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: (credentials) => 
      axios.post('/api/auth/login', credentials),
    onSuccess: (data) => {
      toast.success('Login successful!');
      // Store token and redirect based on role
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      if (data.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/member';
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });

  const onLoginFinish = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lifeline-blue to-lifeline-green flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl rounded-2xl"
        bordered={false}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lifeline-blue mb-2">
            Lifeline Multi Technology
          </h1>
          <p className="text-gray-600">Login to access your account</p>
        </div>

        <Form
          form={loginForm}
          name="login"
          onFinish={onLoginFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
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
              loading={loginMutation.isLoading}
              className="w-full bg-lifeline-blue hover:bg-blue-700 h-12 text-lg rounded-lg"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider>OR</Divider>

        <Button
          type="default"
          icon={<QuestionCircleOutlined />}
          onClick={() => setIsEnquiryModalOpen(true)}
          className="w-full h-12 text-lg rounded-lg border-lifeline-blue text-lifeline-blue hover:text-blue-700 hover:border-blue-700"
        >
          Enquiry Now
        </Button>

        <EnquiryModal
          open={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
        />
      </Card>
    </div>
  );
};

export default LoginPage;