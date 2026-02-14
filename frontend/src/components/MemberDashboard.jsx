import React, { useState, useRef } from 'react';
import { Card, Button, Row, Col, Statistic, Table, Modal, InputNumber, QRCode } from 'antd';
import { 
 
  HistoryOutlined, 
  IdcardOutlined, 
  DownloadOutlined,
  QrcodeOutlined 
} from '@ant-design/icons';
import ReactDOM from 'react-dom/client'; // Add this import

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import DonationCard from './DonationCard';
import PremiumDonationCard from './PremiumDonationCard';
const MemberDashboard = () => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(100);
  const [showQR, setShowQR] = useState(false);
  const cardRef = useRef();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { data: memberData, isLoading, refetch } = useQuery({
    queryKey: ['memberData'],
    queryFn: () => axios.get('/api/donations/member').then(res => res.data)
  });

  const donateMutation = useMutation({
    mutationFn: (amount) => 
      axios.post('/api/donations/donate', { amount }),
    onSuccess: (data) => {
      toast.success('Donation initiated! Please scan QR code to complete.');
      setShowQR(true);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Donation failed');
    }
  });

 

 const downloadCard = async () => {
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.height = '450px';
    tempContainer.style.background = '#ffffff';
    document.body.appendChild(tempContainer);

    // Render the premium card
    const root = ReactDOM.createRoot(tempContainer);
    root.render(
      <PremiumDonationCard 
        user={user} 
        donations={memberData?.donations || []} 
      />
    );

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: 800,
      height: 450
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 450]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 800, 450);
    pdf.save(`lifeline-premium-card-${user.username}.pdf`);

    // Cleanup
    root.unmount();
    document.body.removeChild(tempContainer);
    
    toast.success('Premium donation card downloaded successfully! 🎉');
    
  } catch (error) {
    console.error('Error generating premium card:', error);
    toast.error('Failed to generate premium card');
    
    // Fallback: Create simple PDF
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text('Lifeline Multi Technology', 105, 40, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text('Premium Donation Card', 105, 60, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Member: ${user.username}`, 105, 80, { align: 'center' });
    pdf.text(`Total Donations: ₹100`, 105, 95, { align: 'center' });
    pdf.save(`lifeline-card-${user.username}.pdf`);
  }
};

  const donationColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <Card className="shadow-lg border-t-4 border-t-lifeline-blue">
            <Statistic
              title="Total Donations"
              value={memberData?.totalDonations || 0}
              prefix="₹"
              valueStyle={{ color: '#0e9f6e' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="shadow-lg border-t-4 border-t-lifeline-green">
            <Statistic
              title="Donation Count"
              value={memberData?.donationCount || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="shadow-lg border-t-4 border-t-lifeline-gold">
            <Statistic
              title="Last Donation"
              value={memberData?.lastDonation ? `₹${memberData.lastDonation.amount}` : '₹0'}
              valueStyle={{ color: '#ffc107' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Donation History" 
            className="shadow-lg"
            extra={<HistoryOutlined className="text-xl" />}
          >
            <Table
              columns={donationColumns}
              dataSource={memberData?.donations || []}
              loading={isLoading}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-lg">
            <div className="space-y-4">
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                size="large"
                block
                className="bg-lifeline-blue h-12 text-lg"
                onClick={() => setDonateModalOpen(true)}
              >
                Donate Now
              </Button>

              <Button
                type="default"
                icon={<IdcardOutlined />}
                size="large"
                block
                className="h-12 text-lg border-lifeline-green text-lifeline-green"
                onClick={downloadCard}
              >
                Download Donation Card
              </Button>

              <div ref={cardRef} className="hidden">
                <DonationCard user={user} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>


 
      <PremiumDonationCard 
        user={user} 
        donations={memberData?.donations || []} 
      />






      {/* Donation Modal */}
      <Modal
        title="Make a Donation"
        open={donateModalOpen}
        onCancel={() => {
          setDonateModalOpen(false);
          setShowQR(false);
        }}
        footer={null}
        width={500}
        centered
      >
        {!showQR ? (
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Enter Donation Amount</h3>
              <InputNumber
                min={10}
                max={100000}
                value={donationAmount}
                onChange={setDonationAmount}
                prefix="₹"
                size="large"
                className="w-48"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000, 2000, 5000, 10000].map(amount => (
                <Button
                  key={amount}
                  type={donationAmount === amount ? 'primary' : 'default'}
                  onClick={() => setDonationAmount(amount)}
                  className="h-12"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              loading={donateMutation.isLoading}
              onClick={() => donateMutation.mutate(donationAmount)}
              className="bg-lifeline-green hover:bg-green-600 h-12 px-8"
            >
              Proceed to Donate ₹{donationAmount}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-semibold">Scan QR Code to Donate</h3>
            <div className="flex justify-center">
              <QRCode
                value={`donation:${user._id}:${donationAmount}:${Date.now()}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <p className="text-gray-600">
              Scan this QR code with your payment app to complete donation of ₹{donationAmount}
            </p>
            <Button
              type="primary"
              onClick={() => {
                setShowQR(false);
                setDonateModalOpen(false);
              }}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MemberDashboard;