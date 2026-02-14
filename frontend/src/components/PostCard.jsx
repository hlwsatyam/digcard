import React from 'react';
import { Card, Image, Typography, Tag, Button, Popconfirm, message } from 'antd';
import { PhoneOutlined,   DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/posts';
import { getImageUrl } from '../api/upload'; 
const { Text, Title } = Typography;
const { Meta } = Card;

const PostCard = ({ post, editable = false }) => {
  const queryClient = useQueryClient();
  
  const categoryColors = {
    electronics: 'blue',
    fashion: 'pink',
    home: 'green',
    vehicles: 'orange',
    property: 'purple',
    services: 'red',
    others: 'gray'
  };

  const { mutate: deletePostMutation, isLoading } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      message.success('Post deleted successfully');
      queryClient.invalidateQueries(['myPosts']);
    },
    onError: (error) => {
      message.error(error.message);
    }
  });

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleDelete = () => {
    deletePostMutation(post._id);
  };

  return (
    <Card
      hoverable
      className="h-full"
      cover={
        <div className="h-48 overflow-hidden relative">
          <Image
            alt={post.title}
          src={getImageUrl(post.images?.[0])}
            className="w-full h-full object-cover"
            preview={false}
          />
          <div className="absolute top-2 right-2">
            <Tag color={categoryColors[post.category]} className="capitalize">
              {post.category}
            </Tag>
          </div>
        </div>
      }
      actions={
        editable ? [
         
          <Popconfirm
            title="Delete this post?"
            description="Are you sure you want to delete this post?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            key="delete"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              loading={isLoading}
            />
          </Popconfirm>
        ] : [
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            key="view"
            onClick={() => {/* Handle view */}}
          />,
          <Button 
            type="text" 
            icon={<PhoneOutlined />}
            key="call"
            onClick={() => handleCall(post.contactNumber)}
          >
            Call
          </Button>
        ]
      }
    >
      <Meta
        title={
          <div className="flex justify-between items-start">
            <Text strong className="text-lg truncate">{post.title}</Text>
          </div>
        }
        description={
          <div>
            <Text className="text-gray-600 line-clamp-2 mb-2">
              {post.description}
            </Text>
            <div className="flex justify-between items-center mt-4">
              <Title level={4} className="mb-0 text-green-600">
                ₹{post.price?.toLocaleString()}
              </Title>
              <div className="flex items-center text-gray-500">
                <EyeOutlined className="mr-1" />
                <Text type="secondary">{post.views || 0}</Text>
              </div>
            </div>
            <div className="mt-2 text-gray-500">
              <Text type="secondary">
                {post.status === 'sold' ? (
                  <Tag color="red">Sold</Tag>
                ) : post.status === 'expired' ? (
                  <Tag color="orange">Expired</Tag>
                ) : (
                  <Tag color="green">Active</Tag>
                )}
              </Text>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default PostCard;