import React from 'react';
import { Table, Tag, Card, Statistic, Row, Col } from 'antd';
import { 
  RiseOutlined, 
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { donationAPI } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const DonationHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['memberDonations'],
    queryFn: () => donationAPI.getMemberDonations(),
  });

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => formatDateTime(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Tag color="blue" className="uppercase">
          {method}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          completed: {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: 'Completed',
          },
          pending: {
            color: 'orange',
            icon: <ClockCircleOutlined />,
            text: 'Pending',
          },
          failed: {
            color: 'red',
            icon: <CloseCircleOutlined />,
            text: 'Failed',
          },
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
          <Tag 
            color={config.color} 
            icon={config.icon}
            className="flex items-center gap-1"
          >
            {config.text}
          </Tag>
        );
      },
    },
  ];

  const stats = [
    {
      title: 'Total Donated',
      value: data?.totalDonations || 0,
      prefix: '₹',
      icon: <RiseOutlined />,
      color: '#0e9f6e',
    },
    {
      title: 'Donation Count',
      value: data?.donationCount || 0,
      icon: <HistoryOutlined />,
      color: '#1a56db',
    },
    {
      title: 'Last Donation',
      value: data?.lastDonation ? formatCurrency(data.lastDonation.amount) : '₹0',
      icon: <CheckCircleOutlined />,
      color: '#ffc107',
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card className="shadow-lg hover-lift">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        title="Donation History" 
        className="shadow-lg"
        extra={
          <div className="flex items-center space-x-2">
            <HistoryOutlined className="text-lifeline-blue" />
            <span className="font-medium">All Transactions</span>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={data?.donations || []}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default DonationHistory;