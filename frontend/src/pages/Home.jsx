import React, { useState } from 'react';
import { Layout, Input, Card, Button, Row, Col, Typography, Tag, Image, Modal } from 'antd';
import { SearchOutlined, PhoneOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/posts';
import BottomNavigation from '../components/BottomNavigation';
import { getImageUrl } from '../api/upload'; 
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', search],
    queryFn: () => getPosts({ search }),
    refetchOnWindowFocus: false
  });

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const categoryColors = {
    electronics: 'blue',
    fashion: 'pink',
    home: 'green',
    vehicles: 'orange',
    property: 'purple',
    services: 'red',
    others: 'gray'
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm px-4">
       
          <Title level={4} className="mb-0 text-gray-800">Social Marketplace</Title>
          <Input
            size="large"
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 rounded-full"
          />
        
      </Header>

      <Content className="p-4 mt-12  mx-auto  ">
        {isLoading ? (
          <div className="text-center py-8">
            <Title level={4}>Loading posts...</Title>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {postsData?.posts?.map(post => (
              <Col xs={24} sm={12} lg={8} key={post._id}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="h-48 overflow-hidden">
                      <Image
                        alt={post.title}
                          src={getImageUrl(post.images[0])} 
                        className="w-full h-full object-cover"
                        preview={false}
                      />
                    </div>
                  }
                  onClick={() => handlePostClick(post)}
                >
                  <Meta
                    title={
                      <div className="flex justify-between items-start">
                        <Text strong className="text-lg">{post.title}</Text>
                        <Tag color={categoryColors[post.category]} className="capitalize">
                          {post.category}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text className="text-gray-600 line-clamp-2 mb-2">
                          {post.description}
                        </Text>
                        <div className="flex justify-between items-center mt-4">
                          <Title level={4} className="mb-0 text-green-600">
                            ₹{post.price.toLocaleString()}
                          </Title>
                          <Button
                            type="primary"
                            icon={<PhoneOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(post.contactNumber);
                            }}
                          >
                            Call Now
                          </Button>
                        </div>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Text type="secondary">
                            {post.location?.village}, {post.location?.city}
                          </Text>
                          <div className="ml-auto flex space-x-2">
                            <Button type="text" icon={<HeartOutlined />} size="small" />
                            <Button type="text" icon={<ShareAltOutlined />} size="small" />
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {postsData?.posts?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Title level={4} className="text-gray-500">No posts found</Title>
            <Text type="secondary">Try searching for something else</Text>
          </div>
        )}
      </Content>

      <BottomNavigation />

      {/* Post Detail Modal */}
      <Modal
        title={selectedPost?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <div>
            <div className="mb-4">
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {selectedPost.images.map((img, index) => (
                    <Col span={8} key={index}>
                      <Image src={getImageUrl(img)} className="rounded" />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tag color={categoryColors[selectedPost.category]} className="capitalize">
                  {selectedPost.category}
                </Tag>
                <Title level={3} className="mb-0 text-green-600">
                  ₹{selectedPost.price.toLocaleString()}
                </Title>
              </div>
              
              <div>
                <Title level={5}>Description</Title>
                <Text className="text-gray-700">{selectedPost.description}</Text>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text strong>Location:</Text>
                  <div className="text-gray-600">
                    {selectedPost.location?.village}, {selectedPost.location?.city}<br />
                    {selectedPost.location?.state} - {selectedPost.location?.pincode}
                  </div>
                </div>
                <div>
                  <Text strong>Seller:</Text>
                  <div className="text-gray-600">
                    {selectedPost.user?.firstName} {selectedPost.user?.lastName}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PhoneOutlined />}
                  onClick={() => handleCall(selectedPost.contactNumber)}
                  className="w-full"
                >
                  Call Seller: {selectedPost.contactNumber}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Home;