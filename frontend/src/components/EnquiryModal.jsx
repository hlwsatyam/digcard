import React from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const EnquiryModal = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const enquiryMutation = useMutation({
    mutationFn: (formData) => {
      return axios.post('/api/enquiries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      toast.success('Enquiry submitted successfully!');
      form.resetFields();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  });

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('mobile', values.mobile);
    formData.append('reason', values.reason);
    formData.append('profilePic', values.profilePic[0].originFileObj);

    enquiryMutation.mutate(formData);
  };

  return (
    <Modal
      title="Enquiry Form"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your full name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="mobile"
          label="Mobile Number"
          rules={[
            { required: true, message: 'Please enter your mobile number' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10 digit number' }
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Enter your mobile number"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Enquiry"
          rules={[{ required: true, message: 'Please enter reason' }]}
        >
          <Input.TextArea
            placeholder="Tell us why you're interested"
            rows={4}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="profilePic"
          label="Profile Picture"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Please upload profile picture' }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={enquiryMutation.isLoading}
            block
            size="large"
            className="bg-lifeline-green hover:bg-green-600"
          >
            Submit Enquiry
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnquiryModal;