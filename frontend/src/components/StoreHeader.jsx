import React from 'react';
import { Typography, Tag, Button } from 'antd';
import {
  ShopOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { baseURL } from '../local/l1';

const { Title } = Typography;

const StoreHeader = ({ store, theme }) => {

  // Default theme
  const colors = {
    primary: theme?.primaryColor || '#EC4899',
    secondary: theme?.secondaryColor || '#8B5CF6',
    background: theme?.backgroundColor || '#FFFFFF',
    text: theme?.textColor || '#1F2937',
    header: theme?.headerColor || '#111827'
  };

  // 🔥 Share Function
  const handleShare = async () => {
    const shareData = {
      title: store?.name || "My Store",
      text: `Check out ${store?.name}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md backdrop-blur-md bg-opacity-95"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)`,
        borderBottom: `2px solid ${colors.primary}30`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="px-4 flex justify-between items-center h-20 md:h-24">

        {/* LEFT: Logo + Name */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Logo */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                opacity: 0.2,
                filter: 'blur(4px)'
              }}
            />
            {store?.logo?.url ? (
              <img
                src={`${baseURL}/${store.logo.url.replace(/\\/g, '/')}`}
                alt={store.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border-2 relative z-10"
                style={{ borderColor: colors.primary }}
              />
            ) : (
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center relative z-10"
                style={{
                  background: `linear-gradient(131deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <ShopOutlined className="text-white text-lg md:text-xl" />
              </div>
            )}
          </div>

          {/* Store Name */}
          <div className="flex flex-col">
            <Title
              level={4}
              className="mb-0 leading-tight"
              style={{
                color: colors.header,
                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                fontWeight: 700
              }}
            >
              {store?.name || 'Store Name'}
            </Title>

            {store?.category && (
              <Tag
                className="w-fit mt-1 px-3 py-0.5 text-xs rounded-full border-0"
                style={{
                  background: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                {store.category}
              </Tag>
            )}
          </div>

        </div>

        {/* RIGHT: Share Button */}
        <div className="flex items-center">
          <Button
            type="primary"
            shape="round"
            icon={<GlobalOutlined />}
            onClick={handleShare}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              fontWeight: 600
            }}
          >
            Share
          </Button>
        </div>

      </div>
    </header>
  );
};

export default StoreHeader;
