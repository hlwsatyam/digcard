import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Select, 
  Upload, 
  message,
  Space,
  InputNumber
} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { createPost } from '../api/posts';
import { getImageUrl, uploadImages } from '../api/upload';
import BottomNavigation from '../components/BottomNavigation';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreatePost = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Kitchen' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'property', label: 'Property' },
    { value: 'services', label: 'Services' },
    { value: 'others', label: 'Others' }
  ];

  const { mutate: createPostMutation, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('Post created successfully!');
      form.resetFields();
      setImages([]);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleImageUpload = async (file) => {
    if (images.length >= 10) {
      message.error('Maximum 10 images allowed');
      return false;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', file);
      
      const response = await uploadImages(formData);
      setImages(prev => [...prev, ...response.imageUrls]);
      message.success('Image uploaded successfully');
    } catch (error) {
      message.error('Image upload failed');
    } finally {
      setUploading(false);
    }
    
    return false; // Prevent default upload
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onFinish = (values) => {
    if (images.length === 0) {
      message.error('Please upload at least one image');
      return;
    }
    
    createPostMutation({
      ...values,
      images
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-800">
              Create New Post
            </Title>
            <Text type="secondary">
              Sell your products to the community
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: 'Please enter post title' },
                  { max: 100, message: 'Title cannot exceed 100 characters' }
                ]}
              >
                <Input size="large" placeholder="Enter product title" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select size="large" placeholder="Select category">
                  {categories.map(cat => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Price (₹)"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
                className="md:col-span-2"
              >
                <InputNumber
                  size="large"
                  placeholder="Enter price"
                  className="w-full"
                  min={1}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter description' },
                  { min: 50, message: 'Description must be at least 50 characters' }
                ]}
                className="md:col-span-2"
              >
                <TextArea
                  rows={4}
                  size="large"
                  placeholder="Describe your product in detail..."
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </div>

            <Form.Item label="Product Images">
              <div className="space-y-4">
                <Upload
                  accept="image/*"
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  disabled={uploading || images.length >= 10}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    size="large"
                    loading={uploading}
                    className="w-full"
                  >
                    Upload Images ({images.length}/10)
                  </Button>
                </Upload>
                {
                  console.log(images)
                }
                {images.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item className="text-center">
              <Space>
                <Button 
                  size="large" 
                  onClick={() => navigate('/')}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  loading={isLoading}
                  className="px-8"
                >
                  Create Post
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CreatePost;