 
import { QRCodeSVG } from 'qrcode.react';
import { Card, Button, Space } from 'antd';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const QRCodeGenerator = ({ value, size = 200, title = "Scan QR Code" }) => {
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    saveAs(blob, 'qrcode.svg');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Card 
      title={title}
      className="shadow-lg rounded-xl"
      extra={
        <Space>
          <Button 
            icon={<CopyOutlined />} 
            onClick={copyToClipboard}
            size="small"
          >
            Copy
          </Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={downloadQRCode}
            size="small"
            className="bg-lifeline-green"
          >
            Download
          </Button>
        </Space>
      }
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="p-4 bg-white rounded-lg shadow-inner">
          <QRCodeSVG
            id="qr-code-svg"
            value={value}
            size={size}
            level="H"
            includeMargin
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Scan this QR code with your payment app
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Transaction will be securely processed
          </p>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;