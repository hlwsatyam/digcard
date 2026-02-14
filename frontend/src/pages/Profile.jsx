import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Avatar, 
  Button, 
  Row, 
  Col, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Upload,
  QRCode,
  Tabs,
  message
} from 'antd';
import { 
 
  UploadOutlined, 
  PhoneOutlined, 
  MailOutlined,
 
  CrownOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getMyPosts } from '../api/user';
import { uploadSingleImage } from '../api/upload';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom'; // Add this import
const { Title, Text } = Typography;
const { TabPane } = Tabs;


const Profile = () => {

  const navigate = useNavigate(); // Add this line

  const { user, logout, updateUser } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!user
  });
 console.log(userData)
  const { data: myPosts, refetch: refetchPosts } = useQuery({
    queryKey: ['myPosts'],
    queryFn: getMyPosts
  });

  const subscriptionPlans = [
    {
      name: 'Free',
      price: 0,
      features: ['Basic listing', '5 posts limit', 'Community access']
    },
    {
      name: 'Premium',
      price: 299,
      features: ['Unlimited posts', 'Priority listing', 'Analytics', 'Verified badge']
    },
    {
      name: 'Business',
      price: 999,
      features: ['All Premium features', 'Business page', 'Advertisement credits', 'Dedicated support']
    }
  ];

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('ID', userData._id);
      
      const response = await uploadSingleImage(formData);
      
      // Update user profile with new image
      updateUser({ ...userData, profileImage: response.url });
      refetchUser();
      message.success('Profile image updated successfully');
    } catch (error) {
      message.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
    
    return false; // Prevent default upload
  };

  const handleUpgrade = (plan) => {
    // Implement upgrade logic here
    message.success(`Upgraded to ${plan} plan`);
    setUpgradeModalVisible(false);
    refetchUser();
  };

  const [editForm] = Form.useForm();

  const handleEditSubmit = (values) => {
    // Implement edit profile logic here
    console.log('Edit values:', values);
    setEditModalVisible(false);
    message.success('Profile updated successfully');
    refetchUser();
  };



  const handleLogout = () => {
    logout();
    navigate('/login'); // Add navigation after logout
  };







  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Profile Header */}
        <Card className="shadow-lg mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar 
                size={120} 
                src={userData?.profileImage} 
                icon={<CameraOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <Upload
                accept="image/*"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                disabled={uploadingImage}
              >
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<UploadOutlined />}
                  size="small"
                  loading={uploadingImage}
                  className="absolute bottom-2 right-2"
                />
              </Upload>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div>
                  <Title level={2} className="mb-1">
                    {userData?.firstName} {userData?.lastName}
                  </Title>
                  <Tag 
                    color={userData?.subscriptionPlan === 'free' ? 'default' : 'gold'}
                    icon={userData?.subscriptionPlan !== 'free' ? <CrownOutlined /> : null}
                    className="text-sm"
                  >
                    {userData?.subscriptionPlan?.toUpperCase()} MEMBER
                  </Tag>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button 
                    type="primary" 
                    onClick={() => setQrModalVisible(true)}
                  >
                    View QR Code
                  </Button>
                  <Button 
                    type="default"
                    onClick={() => setUpgradeModalVisible(true)}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <MailOutlined className="mr-2" />
                  <Text>{userData?.email}</Text>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneOutlined className="mr-2" />
                  <Text>{userData?.mobileNumber}</Text>
                </div>
                <div className="flex items-center text-gray-600 md:col-span-2">
                  <PhoneOutlined className="mr-2" />
                  <Text>
                    {userData?.village}, {userData?.city}, {userData?.state} - {userData?.pincode}
                  </Text>
                </div>
              </div>
              
              <div className="mt-4">
                <Text strong className="mr-2">Caste:</Text>
                <Text>{userData?.caste}</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Card className="shadow-lg">
          <Tabs defaultActiveKey="posts">
            <TabPane tab="My Posts" key="posts">
              <Row gutter={[16, 16]}>
                {myPosts?.map(post => (
                  <Col xs={24} sm={12} lg={8} key={post._id}>
                    <PostCard post={post} editable />
                  </Col>
                ))}
                
                {(!myPosts || myPosts.length === 0) && (
                  <div className="text-center w-full py-12">
                    <Title level={4} className="text-gray-500">No posts yet</Title>
                    <Text type="secondary">Create your first post to start selling</Text>
                  </div>
                )}
              </Row>
            </TabPane>
            
            <TabPane tab="Activity" key="activity">
              <div className="text-center py-12">
                <Title level={4} className="text-gray-500">Activity feed coming soon</Title>
              </div>
            </TabPane>
            
            <TabPane tab="Settings" key="settings">
              <div className="max-w-md mx-auto space-y-4">
                <Button block size="large" onClick={() => setEditModalVisible(true)}>
                  Edit Profile
                </Button>
                <Button block size="large" onClick={() => setQrModalVisible(true)}>
                  View QR Code
                </Button>
                <Button block size="large" type="primary" onClick={() => setUpgradeModalVisible(true)}>
                  Upgrade Subscription
                </Button>
                <Button   block size="large" danger onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <BottomNavigation />

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText="Save Changes"
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={userData}
          onFinish={handleEditSubmit}
        >
          <Form.Item name="firstName" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="mobileNumber" label="Mobile Number">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title="Your QR Code"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={null}
      >
        <div className="text-center">
          <QRCode
            value={JSON.stringify({
              userId: userData?._id,
              name: `${userData?.firstName} ${userData?.lastName}`,
              type: userData?.userType
            })}
            size={256}
            className="mx-auto"
          />
          <Text type="secondary" className="mt-4 block">
            Scan to view profile
          </Text>
        </div>
      </Modal>

      {/* Upgrade Plan Modal */}
      <Modal
        title="Upgrade Your Plan"
        open={upgradeModalVisible}
        onCancel={() => setUpgradeModalVisible(false)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {subscriptionPlans.map(plan => (
            <Col span={8} key={plan.name}>
              <Card 
                className={`text-center h-full ${
                  userData?.subscriptionPlan === plan.name.toLowerCase() ? 'border-blue-500 border-2' : ''
                }`}
              >
                <Title level={3}>{plan.name}</Title>
                <div className="my-4">
                  <Text className="text-3xl font-bold">₹{plan.price}</Text>
                  <Text type="secondary">/year</Text>
                </div>
                <ul className="text-left mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <Text>{feature}</Text>
                    </li>
                  ))}
                </ul>
                <Button 
                  type={userData?.subscriptionPlan === plan.name.toLowerCase() ? 'default' : 'primary'}
                  block
                  disabled={userData?.subscriptionPlan === plan.name.toLowerCase()}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {userData?.subscriptionPlan === plan.name.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default Profile;