import React from 'react';
import { Typography, Divider, Button } from 'antd';
import {
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  GlobalOutlined,
  CopyrightOutlined
} from '@ant-design/icons';
import { baseURL } from '../local/l1';

const { Title, Text, Link } = Typography;

const StoreFooter = ({ store, theme }) => {
console.log(theme)
  const colors = {
    primary: theme?.primaryColor || '#EC4899',
    secondary: theme?.secondaryColor || '#8B5CF6',
    background: theme?.backgroundColor || '#F9FAFB',
    text: theme?.textColor || '#4B5563',
    header: theme?.headerColor || '#111827'
  };

  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'facebook': return <FacebookOutlined />;
      case 'instagram': return <InstagramOutlined />;
      case 'twitter': return <TwitterOutlined />;
      case 'youtube': return <YoutubeOutlined />;
      default: return <GlobalOutlined />;
    }
  };

  return (
    <footer
      className="w-full mt-10 pt-10 pb-6"
      style={{
        background: `linear-gradient(180deg, ${colors.background}, ${colors.primary}08)`,
        borderTop: `1px solid ${colors.primary}30`
      }}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Store Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {store?.logo?.url ? (
                <img
                  src={`${baseURL}/${store.logo.url.replace(/\\/g, '/')}`}
                  alt={store.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  <ShopOutlined className="text-white" />
                </div>
              )}
              <Title level={5} className="mb-0" style={{ color: colors.header }}>
                {store?.name || 'Store Name'}
              </Title>
            </div>

            <Text className="text-sm" style={{ color: colors.text }}>
              {store?.description?.slice(0, 100)}
            </Text>
          </div>

          {/* Contact */}
          <div>
            <Title level={5} style={{ color: colors.header }}>Contact</Title>

            {store?.contact?.phone && (
              <div className="flex items-center gap-2 mt-2">
                <PhoneOutlined style={{ color: colors.primary }} />
                <Link href={`tel:${store.contact.phone}`} style={{ color: colors.text }}>
                  {store.contact.phone}
                </Link>
              </div>
            )}

            {store?.contact?.email && (
              <div className="flex items-center gap-2 mt-2">
                <MailOutlined style={{ color: colors.primary }} />
                <Link href={`mailto:${store.contact.email}`} style={{ color: colors.text }}>
                  {store.contact.email}
                </Link>
              </div>
            )}

            {store?.contact?.address?.city && (
              <div className="flex items-center gap-2 mt-2">
                <EnvironmentOutlined style={{ color: colors.primary }} />
                <Text style={{ color: colors.text }}>
                  {store.contact.address.city}
                </Text>
              </div>
            )}
          </div>

          {/* Social */}
          <div>
            <Title level={5} style={{ color: colors.header }}>Follow</Title>
            <div className="flex gap-3 mt-3 flex-wrap">
              {store?.socialMedia?.map((social, index) => (
                <Button
                  key={index}
                  shape="circle"
                  icon={getSocialIcon(social.platform)}
                  href={social.url}
                  target="_blank"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: 'white',
                    border: 'none'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        <Divider style={{ borderColor: colors.primary + '30', margin: '28px 0 20px' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <Text className="text-xs" style={{ color: colors.text }}>
            <CopyrightOutlined /> {currentYear} {store?.name}. All rights reserved.
          </Text>

          <Text className="text-xs" style={{ color: colors.text }}>
            Powered by{' '}
            <span
              className="px-2 py-1 rounded text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              }}
            >
              Techmintlab
            </span>
          </Text>
        </div>

      </div>
    </footer>
  );
};

export default StoreFooter;
