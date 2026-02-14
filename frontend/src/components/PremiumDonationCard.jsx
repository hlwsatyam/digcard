import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Shield, Phone, Calendar, Download } from 'lucide-react';
import { Avatar, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import axios from 'axios';

const SinglePremiumCard = ({ user, donations = [] }) => {
  const frontCardRef = useRef();
  const backCardRef = useRef();
  
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const issueDate = new Date();
  
  // Generate membership number
  const generateMembershipNumber = () => {
    const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
    return numbers.join('').replace(/(.{4})/g, '$1 ');
  };

  const membershipNumber = generateMembershipNumber();

  // Download as 2-page PDF
  const downloadCard = async () => {
    try {
      toast.loading('Creating card...');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [210, 148]
      });

      // Front side
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const frontImg = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImg, 'PNG', 0, 0, 210, 148);

      // Back side
      pdf.addPage();
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const backImg = backCanvas.toDataURL('image/png');
      pdf.addImage(backImg, 'PNG', 0, 0, 210, 148);

      pdf.save(`lifeline-card-${user.username}.pdf`);
      
      toast.dismiss();
      toast.success('Card downloaded!');
      
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss();
      toast.error('Download failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Lifeline Membership Card
          </h1>
          <p className="text-gray-600 mb-4">Download your official donor card</p>
          
          <Button 
            onClick={downloadCard}
            className="bg-red-600 hover:bg-red-700 text-white h-10 px-6"
            icon={<Download className="w-4 h-4 mr-2" />}
          >
            Download Card
          </Button>
        </div>

        {/* Card Preview - Simple Layout */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mb-8">
          
          {/* Front Side - Simple */}
          <div 
            ref={frontCardRef}
            className="bg-white border-2 border-gray-300"
            style={{ 
              width: '350px', 
              height: '220px',
              position: 'relative'
            }}
          >
            {/* Top Bar */}
            <div className="h-2 bg-red-600"></div>
            
            <div className="p-3">
              {/* Organization Name */}
              <div className="text-center mb-1">
                <h1 className="text-sm font-bold text-red-600">
                  LIFELINE MULTI TECHNOLOGY DEVELOPMENT
                </h1>
                <p className="text-xs font-bold text-red-500">
                  Donate Help Money Member
                </p>
              </div>

              {/* Membership Number */}
              <div className="text-center mb-2">
                <p className="text-lg font-bold tracking-widest text-gray-800 font-mono">
                  {membershipNumber.substring(0, 19)}
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-4">
                <Avatar
                  src={user.profilePic ? `${axios.defaults.baseURL}/uploads/${user.profilePic}` : null}
                  size={50}
                  className="border border-red-500"
                />
                <div>
                  <h2 className="text-base font-bold text-gray-800 uppercase">
                    {user.name || user.username}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {user.address || 'LIFELINE MEMBER'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user.city || 'INDIA'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-[9px] text-gray-500">Issue Date</p>
                  <p className="text-xs font-bold text-gray-800">
                    {issueDate.toLocaleDateString('en-IN')}
                  </p>
                </div>
                
                <div className="text-center">
                  <Shield className="w-6 h-6 text-red-600 mx-auto" />
                  <p className="text-[9px] text-gray-500">LIFELINE</p>
                </div>
                
                <div>
                  <p className="text-[9px] text-gray-500">Valid Upto</p>
                  <p className="text-xs font-bold text-gray-800">L.T.M.D.P</p>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-600"></div>
          </div>

          {/* Back Side - Simple */}
          <div 
            ref={backCardRef}
            className="bg-white border-2 border-gray-300"
            style={{ 
              width: '350px', 
              height: '220px',
              position: 'relative'
            }}
          >
            {/* Top Bar */}
            <div className="h-2 bg-blue-600"></div>
            
            <div className="p-3">
              {/* Emergency Contact */}
              <div className="mb-2">
                <p className="text-xs font-bold text-red-700">
                  Customer Care Number (24 Hours) - 9234185303
                </p>
                <p className="text-xs text-red-600 font-medium">Emergency use Only</p>
              </div>

              {/* QR and Registration */}
              <div className="flex gap-3 mb-2">
                <div className="border border-gray-400 p-1">
                  <QRCodeCanvas
                    value={`LMT-${user._id}-${user.mobile || user.username}`}
                    size={60}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <div>
                  <div className="mb-1">
                    <p className="text-xs text-gray-500">Reg No.</p>
                    <p className="text-sm font-bold text-gray-800">919/2019/20</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unique ID No.</p>
                    <p className="text-sm font-bold text-gray-800">JH/2020/02632254</p>
                  </div>
                </div>
              </div>

              {/* Hindi Text */}
              <div className="mb-2">
                <p className="text-xs text-gray-700 leading-tight">
                  यह भारत का न्यू और भरासेमद काउडफिडिंग प्लेटफॉर्म है
                  हम सभी के लिए स्वास्थ्य सेवा में विश्वास करते हैं  
                </p>
              </div>

 

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>9234185303</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Issued: {issueDate.toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-600"></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Card Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold text-red-600 mb-1">₹{totalDonations.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Donations</p>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold text-red-600 mb-1">{user.username.toUpperCase()}</div>
              <p className="text-sm text-gray-600">Member ID</p>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xl font-bold text-red-600 mb-1">
                {issueDate.toLocaleDateString('en-IN')}
              </div>
              <p className="text-sm text-gray-600">Issue Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePremiumCard;