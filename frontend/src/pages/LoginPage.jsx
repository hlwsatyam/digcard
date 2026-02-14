import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/authSlice';
import toast from 'react-hot-toast';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Modal,
  Upload,
  message
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  UploadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Link } = Typography;
const { TextArea } = Input;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [enquiryForm] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [enquiryModalVisible, setEnquiryModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const onLoginFinish = async (values) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      toast.success('Login successful!');
      
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  const onRegisterFinish = async (values) => {
    try {
      await dispatch(register(values)).unwrap();
      toast.success('Registration successful! Please login.');
      setIsLogin(true);
      form.resetFields();
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };
const [s,se]=useState(false)
  const onEnquiryFinish = async (values) => {
    se(true)
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
        console.log(fileList)
      if (fileList[0]) {
        console.log(fileList[0])
        formData.append('profilePic', fileList[0]);
      }

      // const response = await fetch(`http://localhost:5900/api/enquiries/create`, {
      const response = await fetch(`${axios.defaults.baseURL}/api/enquiries/create`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Enquiry submitted successfully! We will contact you soon.');
        setEnquiryModalVisible(false);
        enquiryForm.resetFields();
        setFileList([]);
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (error) {
      toast.error('Submission failed');
    }finally{
      se(false)
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lifeline-blue/10 via-white to-lifeline-green/10">
      <div className="container mx-auto px-4 py-8">
        <Row justify="center" align="middle" className="min-h-[90vh]">
          <Col xs={24} md={20} lg={16} xl={12}>
            <Card className="shadow-2xl rounded-2xl overflow-hidden border-0 fade-in">
              <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-lifeline-red to-lifeline-blue rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <Title level={2} className="m-0 bg-gradient-to-r from-lifeline-blue to-lifeline-green bg-clip-text text-transparent">
                      Lifeline Multi Technology
                    </Title>
                  </div>
                  <Text type="secondary" className="text-base md:text-lg">
                    {isLogin ? 'Welcome back! Please login to continue' : 'Create your account'}
                  </Text>
                </div>

                {isLogin ? (
                  <Form
                    form={form}
                    name="login"
                    onFinish={onLoginFinish}
                    layout="vertical"
                    size="large"
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email or mobile!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined className="text-gray-400" />} 
                        placeholder="Email or Adhar Number" 
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please input your password!' }
                      ]}
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
                        loading={isLoading}
                        block
                        size="large"
                        className="rounded-lg bg-gradient-to-r from-lifeline-blue to-lifeline-green hover:from-blue-700 hover:to-green-700 h-12 text-lg shadow-lg"
                      >
                        Login
                      </Button>
                    </Form.Item>

                  
                  </Form>
                ) : (
                  <Form
                    form={form}
                    name="register"
                    onFinish={onRegisterFinish}
                    layout="vertical"
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                          <Input 
                            prefix={<UserOutlined className="text-gray-400" />} 
                            placeholder="Full Name" 
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="mobile"
                          rules={[
                            { required: true, message: 'Please input your mobile!' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit mobile number!' }
                          ]}
                        >
                          <Input 
                            prefix={<PhoneOutlined className="text-gray-400" />} 
                            placeholder="Mobile Number" 
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter valid email!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined className="text-gray-400" />} 
                        placeholder="Email Address" 
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm Password"
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                        size="large"
                        className="rounded-lg bg-gradient-to-r from-lifeline-green to-lifeline-blue hover:from-green-600 hover:to-blue-600 h-12 text-lg shadow-lg"
                      >
                        Register
                      </Button>
                    </Form.Item>

                    <div className="text-center">
                      <Text type="secondary">
                        Already have an account?{' '}
                        <Link onClick={() => setIsLogin(true)} className="font-semibold text-lifeline-green hover:text-green-700">
                          Login here
                        </Link>
                      </Text>
                    </div>
                  </Form>
                )}

                <Divider>
                  <Text type="secondary">OR</Text>
                </Divider>

                <div className="text-center">
                  <Button
                    type="default"
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={() => setEnquiryModalVisible(true)}
                    className="rounded-lg border-2 border-lifeline-purple text-lifeline-purple hover:border-purple-600 hover:text-purple-600 h-12 px-8 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Apply Form
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Enquiry Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <MessageOutlined className="text-lifeline-purple mr-2" />
            <span className="text-lg font-semibold">New Enquiry</span>
          </div>
        }
        open={enquiryModalVisible}
        onCancel={() => setEnquiryModalVisible(false)}
        footer={null}
        width={600}
        centered
        className="rounded-lg"
      >
        <Form
          form={enquiryForm}
          name="enquiry"
          onFinish={onEnquiryFinish}
          layout="vertical"
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Full Name" 
                  className="rounded-lg"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: 'Please input your mobile!' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit mobile number!' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="text-gray-400" />} 
                  placeholder="Mobile Number" 
                  className="rounded-lg"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
           
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="email/Adhar" 
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="message"
            rules={[{ required: true, message: 'Please input your message!' }]}
          >
            <TextArea
              placeholder="Tell us about your enquiry..."
              rows={4}
              showCount
              maxLength={500}
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <TextArea
              placeholder="enter your address"
              rows={4}
              showCount
              maxLength={500}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item label="Profile Picture (Optional)">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} className="rounded-lg">Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={s}
              loading={s}
              size="large"
              className="rounded-lg bg-gradient-to-r from-lifeline-purple to-pink-600 hover:from-purple-600 hover:to-pink-700 h-12 shadow-lg"
            >
              Submit Enquiry
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;