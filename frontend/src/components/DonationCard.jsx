import React from 'react';
import { Avatar } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
  GlobalOutlined,
  HeartOutlined,
  IdcardOutlined,
  SafetyOutlined,
  MailOutlined
} from '@ant-design/icons';
import axios from 'axios';

const DonationCard = ({ user }) => {
  // Generate membership number
  const membershipNumber = `LMT${Date.now().toString().slice(-8)}`;
  
  // Issue and expiry dates
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5)
    .toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  return (
    <div className="donation-card-container">
      {/* FRONT SIDE */}
      <div className="front-card w-[800px] h-[450px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Background patterns */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500"></div>
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/3 rounded-full"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              LIFELINE MULTI TECHNOLOGY
            </h1>
            <p className="text-blue-200 text-lg mt-2">Premium Donor Card</p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-full flex items-center">
            <SafetyOutlined className="text-white mr-2" />
            <span className="text-white font-bold">Verified Donor</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-blue-200 mb-1">Card Holder</p>
              <h2 className="text-3xl font-bold text-white">
                {user?.name?.toUpperCase() || user?.username?.toUpperCase()}
              </h2>
            </div>
            
            <div className="flex items-center mb-4">
              <HomeOutlined className="text-blue-300 mr-3 text-xl" />
              <div>
                <p className="text-blue-200">Address</p>
                <p className="text-white text-lg">
                  {user?.address || 'Registered Member'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <GlobalOutlined className="text-blue-300 mr-3 text-xl" />
              <div>
                <p className="text-blue-200">Location</p>
                <p className="text-white text-lg">
                  {user?.city || 'India'} • {user?.state || 'Global Network'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <Avatar
            src={user?.profilePic ? `${axios.defaults.baseURL}/uploads/${user.profilePic}` : null}
            size={120}
            className="border-4 border-white/30 shadow-2xl"
          >
            {!user?.profilePic && (user?.name?.[0] || user?.username?.[0])?.toUpperCase()}
          </Avatar>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-200 text-sm mb-1">MEMBERSHIP NO.</p>
            <p className="text-white font-bold text-xl tracking-widest">
              {membershipNumber}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-blue-200 text-sm mb-1">ISSUED ON</p>
            <div className="flex items-center justify-center">
              <CalendarOutlined className="text-yellow-400 mr-2" />
              <p className="text-white font-bold text-lg">{issueDate}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-blue-200 text-sm mb-1">VALID THROUGH</p>
            <p className="text-green-400 font-bold text-xl">{expiryDate}</p>
          </div>
        </div>

        {/* Decorative chip */}
        <div className="absolute bottom-8 left-8 w-12 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-md flex items-center justify-center shadow-lg">
          <div className="w-8 h-6 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-sm"></div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="back-card w-[800px] h-[450px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl p-8 mt-8 relative overflow-hidden">
        
        {/* Top emergency strip */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 flex items-center justify-center">
          <div className="flex items-center">
            <PhoneOutlined className="text-white mr-3 text-xl" />
            <span className="text-white font-bold text-lg">
              24/7 Emergency: 9234185303
            </span>
          </div>
        </div>

        <div className="pt-16">
          {/* QR Code Section */}
          <div className="flex mb-10">
            <div className="mr-10">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <QRCodeCanvas
                  value={JSON.stringify({
                    memberId: user?._id,
                    membershipNo: membershipNumber,
                    name: user?.name,
                    verified: true
                  })}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
              <p className="text-gray-400 text-sm mt-2 text-center">Scan to Verify</p>
            </div>

            {/* Emergency Info */}
            <div className="flex-1">
              <h3 className="text-yellow-400 text-2xl font-bold mb-4">
                Emergency Contact
              </h3>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <PhoneOutlined className="text-red-400 mr-3 text-xl" />
                  <span className="text-white text-xl font-bold">9234185303</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Available 24 hours for emergency assistance
                </p>
              </div>

              {/* Registration Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">REG NO.</p>
                  <p className="text-white font-bold">919/2019/20</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">UNIQUE ID</p>
                  <p className="text-white font-bold">JH/2020/02632254</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hindi Text */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-2xl mb-8 border border-white/10">
            <p className="text-white text-center text-lg leading-relaxed">
              यह भारत का नया और भरोसेमंद क्राउडफंडिंग प्लेटफॉर्म है। 
              हम सभी के लिए स्वास्थ्य सेवा में विश्वास करते हैं।
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-around">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <IdcardOutlined className="text-white text-2xl" />
              </div>
              <p className="text-gray-400 text-sm">Member ID</p>
              <p className="text-white font-bold">{user?.username}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <HeartOutlined className="text-white text-2xl" />
              </div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-bold">{user?.email}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <MailOutlined className="text-white text-2xl" />
              </div>
              <p className="text-gray-400 text-sm">Mobile</p>
              <p className="text-white font-bold">{user?.mobile}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-8 right-8 text-center">
            <p className="text-gray-500 text-sm">
              This card is property of Lifeline Multi Technology Development. Use only for authorized purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;