import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const WhatsAppShare = ({ store, theme }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Get store URL
  const storeUrl = `${window.location.origin}/store/${store?.slug}`;

  // Format WhatsApp message
  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `*${store?.name || 'Store'}*\n\n` +
      `${store?.description || 'Check out our store!'}\n\n` +
      `📍 *Location:* ${store?.contact?.address?.street || '10 Downing St'}, ${store?.contact?.address?.city || 'London'}\n\n` +
      `🔗 *Visit us:* ${storeUrl}`
    );
  };

  // Handle share
  const handleShare = () => {
    // Remove all non-digits and check if exactly 10 digits
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (!cleanNumber || cleanNumber.length !== 10) {
      toast.error('❌ Please enter a valid 10-digit Indian mobile number');
      return;
    }

    const whatsappLink = `https://wa.me/91${cleanNumber}?text=${getWhatsAppMessage()}`;
    window.open(whatsappLink, '_blank');
    setPhoneNumber('');
    toast.success('✅ WhatsApp opened successfully!');
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Indian Flag +91 */}
      <div 
        className="flex items-center gap-1 px-3 py-2 rounded-lg border"
        style={{ 
          borderColor: theme?.primaryColor + '40',
          background: theme?.primaryColor + '08',
          minWidth: '90px'
        }}
      >
       
        <span className="font-large text-[16px] text-gray-700">+91</span>
      </div>

      {/* Phone Number Input */}
      <Input
        placeholder="10-digit mobile number"
        value={phoneNumber}
        onChange={(e) => {
          // Only allow digits, max 10 digits
          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
          setPhoneNumber(value);
        }}
        className="flex-1 h-11"
        style={{
          borderColor: theme?.primaryColor + '40',
          borderRadius: '8px'
        }}
        maxLength={10}
      />

      {/* Share Button */}
      <Button
        type="primary"
        icon={<WhatsAppOutlined />}
        onClick={handleShare}
        className="h-11 px-6 font-semibold shadow-md hover:shadow-lg transition-all"
        style={{
          background:theme?.backgroundColor || '#25D366',
          borderColor: theme.secondaryColor || '#25D366',
          color: theme.headerColor || 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        Share
      </Button>
    </div>
  );
};

export default WhatsAppShare;