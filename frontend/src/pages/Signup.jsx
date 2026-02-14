import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Space } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Signup = () => {
  const { login } = useAuth();

  const onGoogleSuccess = async (response) => {
    try {
      console.log('Google signup success:', response);
      const userData = await login(response.tokenId);
      
      toast.success('Account created successfully!');
      
      // Navigation will be handled by the login function
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
    }
  };

  const onGoogleFailure = (error) => {
    console.error('Google signup failed:', error);
    toast.error('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Create Account
          </Title>
          <Text type="secondary" className="text-gray-600">
            Join Social Marketplace today
          </Text>
        </div>

        <div className="space-y-6">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={renderProps => (
              <Button
                type="default"
                size="large"
                icon={<GoogleOutlined />}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full h-12 text-base border-gray-300 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center"
              >
                Sign up with Google
              </Button>
            )}
            buttonText="Sign up with Google"
            onSuccess={onGoogleSuccess}
            onFailure={onGoogleFailure}
            cookiePolicy={'single_host_origin'}
            scope="profile email"
            prompt="select_account"
          />

          <div className="text-center">
            <Text type="secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </Text>
          </div>

          <div className="text-center">
            <Text type="secondary" className="text-xs">
              By creating an account, you agree to our Terms and Privacy Policy
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;