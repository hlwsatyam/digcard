import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, Typography, Row, Col, Tag, Divider,
  Button, Space, List, Tabs, Carousel
} from 'antd';
import {
  ShopOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, GlobalOutlined, ClockCircleOutlined,
  FacebookOutlined, InstagramOutlined, TwitterOutlined,
  YoutubeOutlined, TikTokOutlined,
  ShoppingOutlined, CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import WhatsAppShare from '../components/WhatsAppShare';
import { Notebook, StoreIcon } from 'lucide-react';
import StoreHeader from '../components/StoreHeader';
import StoreFooter from '../components/StoreFooter';
import { baseURL } from '../local/l1';

const { Title, Text, Paragraph } = Typography;
 

const StorePage = () => {
  const { slug } = useParams();

  // Fetch store by slug
  const { data: store, isLoading } = useQuery({
    queryKey: ['store', slug],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/api/stores/${slug}`);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="text-center p-12 shadow-2xl rounded-3xl border-0">
          <ShopOutlined className="text-7xl text-gray-300 mb-4" />
          <Title level={2} className="text-gray-800">Store Not Found</Title>
          <Text type="secondary" className="text-lg">The store you're looking for doesn't exist.</Text>
        </Card>
      </div>
    );
  }

  const theme = store.theme || {
    primaryColor: '#EC4899', // Pink
    secondaryColor: '#8B5CF6', // Purple
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    headerColor: '#111827'
  };

  // Format business hours
  const formatHours = (day) => {
    if (!day?.isOpen) return 'Closed';
    return `${day.openTime} - ${day.closeTime}`;
  };

  // Get social icon
  const getSocialIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'facebook': return <FacebookOutlined />;
      case 'instagram': return <InstagramOutlined />;
      case 'twitter': return <TwitterOutlined />;
      case 'youtube': return <YoutubeOutlined />;
      case 'tiktok': return <TikTokOutlined />;
      default: return <GlobalOutlined />;
    }
  };

  return (
    <div className="min-h-screen bg-white">

   <StoreHeader store={store} theme={theme} />

   {store.banner?.media?.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8 px-4 md:px-8">
          <Card 
            className="border-0 shadow-2xl rounded-3xl overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            <Carousel 
              autoplay={store.banner.settings?.autoplay}
              autoplaySpeed={store.banner.settings?.autoplaySpeed || 3000}
              effect="fade"
            >
              {store.banner.media.map((item, index) => (
                <div key={index}>
                  <div className="relative h-[350px] md:h-[450px]">
                    <img 
                      src={`${baseURL}/${item.url.replace(/\\/g, '/')}`}
                      alt={item.alt || store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
              ))}
            </Carousel>
          </Card>
        </div>
      )}







      {/* ========== HERO SECTION - EXACT MATCH TO YOUR IMAGE ========== */}
      <div 
        className={  `pb-6  ${store.banner?.media?.length > 0 ? "-mt-[120px]"  : null} px-4 md:px-8`}
        style={{ 
          background: `linear-gradient(135deg, ${theme.primaryColor}15 0%, ${theme.secondaryColor || theme.primaryColor}15 100%)`,
          borderBottom: `1px solid ${theme.primaryColor}30`
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            



            
            {/* Profile Image - Large & Prominent */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`,
                    transform: 'scale(1.05)',
                    opacity: 0.5,
                    filter: 'blur(10px)'
                  }}
                />
                {store.logo?.url ? (
                  <img 
                    src={`${baseURL}/${store.logo.url.replace(/\\/g, '/')}`}
                    alt={store.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl border-4 border-white relative z-10"
                  />
                ) : (
                  <div 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`
                    }}
                  >
                    <ShopOutlined className="text-white text-4xl md:text-5xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Store Info - EXACT STYLE FROM YOUR IMAGE */}
            <div className="flex-1 text-center md:text-left">
              {/* Name - Large and Bold */}
              <Title 
                level={1} 
                className="mb-2 font-bold"
                style={{ 
                  color: theme.headerColor,
                  fontSize: '2.5rem',
                  marginBottom: '0.25rem'
                }}
              >
                {store.name}
              </Title>
              
              {/* Professional Title */}
              <Title 
                level={4} 
                className="mb-3 font-medium"
                style={{ 
                  color: theme.primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '0.9rem'
                }}
              >
                {store.category?.replace('-', ' ') || 'Professional Makeup Artist'}
              </Title>
              
              {/* Description - Exactly as your image */}
              <Paragraph 
                className="text-gray-600 max-w-2xl mx-auto md:mx-0 text-lg leading-relaxed"
                style={{ fontSize: '1.1rem', lineHeight: '1.7' }}
              >
                {store.description || 'Unleashing your beauty with expert makeup artistry and specializing in bridal, editorial, and special events, with over 7+ years of perfecting flawless looks.'}
              </Paragraph>

              {/* Location - EXACT MATCH */}
              <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                <EnvironmentOutlined style={{ color: theme.primaryColor }} className="text-xl" />
                <Text className="text-gray-600 text-base font-medium">
                  {store.contact?.address ? 
                    `${store.contact.address.street}, ${store.contact.address.city}, ${store.contact.address.country}` : 
                    '10 Downing St, London SW1A 2AB, UK'}
                </Text>
              </div>

              {/* Contact Buttons - Minimal & Elegant */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                {store.contact?.phone && (
                  <Button 
                    shape="round"
                    icon={<PhoneOutlined />}
                    href={`tel:${store.contact.phone}`}
                    className="flex items-center shadow-md hover:shadow-xl transition-all"
                    style={{ 
                      borderColor: theme.primaryColor,
                      color: theme.primaryColor
                    }}
                  >
                    {store.contact.phone}
                  </Button>
                )}
                {store.contact?.email && (
                  <Button 
                    shape="round"
                    icon={<MailOutlined />}
                    href={`mailto:${store.contact.email}`}
                    className="flex items-center shadow-md hover:shadow-xl transition-all"
                    style={{ 
                      borderColor: theme.primaryColor,
                      color: theme.primaryColor
                    }}
                  >
                    {store.contact.email}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
  
      </div>




 



 

      {/* ========== MAIN CONTENT TABS ========== */}
      <div className="max-w-6xl mx-auto   px-4 md:px-8">
        <Tabs 
          defaultActiveKey="1" 
          size="large"
          className="store-tabs"
          tabBarStyle={{
            borderBottom: `2px solid ${theme.primaryColor}20`,
            marginBottom: '32px'
          }}
        >
          {/* ABOUT TAB - SERVICES & HOURS */}
          {/* <TabPane tab="About" key="1"> */}
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={16}>
                <div className="space-y-8">
                  {/* About Section */}
                  <div>
                    <Title level={2} style={{ color: theme.headerColor }} className="mb-4">
                     <p className='flex items-center gap-3'>  <StoreIcon color= {theme.primaryColor} /> {store.name} </p> 
                    </Title>
                    <Paragraph className="text-gray-600 text-lg leading-relaxed">
                    
                      <p className='flex items-center gap-3'>  <Notebook color= {theme.primaryColor} /> {store?.description} </p> 
                    
                     </Paragraph>


<div className="mt-6">
  <WhatsAppShare store={store} theme={theme} />
</div>

                  </div>

                  {/* Services Section */}
                  {store.services?.length > 0 && (
                    <div>
                      <Divider style={{ borderColor: theme.primaryColor + '30' }}>
                        <Title level={3} style={{ color: theme.primaryColor }} className="px-4">
                          Services & Pricing
                        </Title>
                      </Divider>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {store.services.map((service, index) => (
                          <div 
                            key={index}
                            className="p-6 rounded-2xl border-2 transition-all hover:shadow-xl"
                            style={{ 
                              borderColor: theme.primaryColor + '20',
                              background: 'white'
                            }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <Text strong className="text-lg" style={{ color: theme.headerColor }}>
                                  {service.name}
                                </Text>
                                <div className="text-sm text-gray-500 mt-1">
                                  {service.description}
                                </div>
                              </div>
                              <div 
                                className="px-4 py-1 rounded-full text-white font-bold"
                                style={{ 
                                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`
                                }}
                              >
                                ${service.price}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <ClockCircleOutlined />
                              <span>{service.duration} minutes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              <Col xs={24} lg={8}>
                {/* Business Hours Card */}
                <Card 
                  className="sticky top-8 rounded-2xl border-0 shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}08, ${theme.secondaryColor || theme.primaryColor}08)`
                  }}
                >
                  <Title level={4} style={{ color: theme.headerColor }} className="mb-6">
                    <ClockCircleOutlined className="mr-2" style={{ color: theme.primaryColor }} />
                    Business Hours
                  </Title>
                  
                  <List
                    dataSource={[
                      { day: 'Monday', hours: store.businessHours?.monday },
                      { day: 'Tuesday', hours: store.businessHours?.tuesday },
                      { day: 'Wednesday', hours: store.businessHours?.wednesday },
                      { day: 'Thursday', hours: store.businessHours?.thursday },
                      { day: 'Friday', hours: store.businessHours?.friday },
                      { day: 'Saturday', hours: store.businessHours?.saturday },
                      { day: 'Sunday', hours: store.businessHours?.sunday },
                    ]}
                    renderItem={item => (
                      <List.Item className="py-2 border-0">
                        <Text strong className="w-28">{item.day}</Text>
                        <Text className={!item.hours?.isOpen ? 'text-gray-400 italic' : ''}>
                          {formatHours(item.hours)}
                        </Text>
                      </List.Item>
                    )}
                  />

                  <Divider className="my-6" style={{ borderColor: theme.primaryColor + '20' }} />
                  
                  {/* Location Card */}
                  <Title level={4} style={{ color: theme.headerColor }} className="mb-4">
                    <EnvironmentOutlined className="mr-2" style={{ color: theme.primaryColor }} />
                    Location
                  </Title>
                  
                  {store.contact?.address ? (
                    <div className="space-y-2 text-gray-600">
                      <div>{store.contact.address.street}</div>
                      <div>
                        {store.contact.address.city}, {store.contact.address.state} {store.contact.address.zipCode}
                      </div>
                      <div>{store.contact.address.country}</div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-gray-600">
                      <div>10 Downing Street</div>
                      <div>London SW1A 2AB</div>
                      <div>United Kingdom</div>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          {/* </TabPane> */}

          {/* PRODUCTS TAB */}
          {store.products?.length > 0 && (
        
              <div className="space-y-6">
                <Title level={2} style={{ color: theme.headerColor }} className="mb-6">
                  Our Products
                </Title>
                <Row gutter={[24, 24]}>
                  {store.products.map((product, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <Card
                        hoverable
                        className="h-full rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all"
                        cover={
                          <div className="relative pt-[100%] overflow-hidden rounded-t-2xl">
                            {product.images?.[0] ? (
                              <img
                                alt={product.name}
                                src={`${baseURL}/${product.images[0].url.replace(/\\/g, '/')}`}
                                className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                <ShoppingOutlined className="text-5xl text-gray-300" />
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div className="text-center">
                          <Title level={4} className="mb-1" style={{ color: theme.headerColor }}>
                            {product.name}
                          </Title>
                          <Text type="secondary" className="text-sm block mb-2">
                            {product.category}
                          </Text>
                          <Divider className="my-3" style={{ borderColor: theme.primaryColor + '30' }} />
                          <div className="flex justify-between items-center mt-2">
                            <Text strong className="text-xl" style={{ color: theme.primaryColor }}>
                              ${product.price}
                            </Text>
                            <Tag color={theme.primaryColor} className="rounded-full px-3">
                              In Stock
                            </Tag>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
           
          )}

          {/* GALLERY TAB */}
          {store.gallery?.length > 0 && (
            
              <div className="space-y-6">
                <Title level={2} style={{ color: theme.headerColor }} className="mb-6">
                  Our Work
                </Title>
                <Row gutter={[16, 16]}>
                  {store.gallery.map((item, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <div className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                        <img
                          src={`${baseURL}/${item.url.replace(/\\/g, '/')}`}
                          alt={item.title || 'Gallery image'}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                          <Text className="text-white font-medium text-lg">
                            {item.title || 'Portfolio'}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
       
          )}

          {/* CONTACT TAB */}
          {/* <TabPane tab="Contact" key="4"> */}
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Card 
                  className="h-full rounded-2xl border-0 shadow-xl"
                  bodyStyle={{ padding: '32px' }}
                >
                  <Title level={2} style={{ color: theme.headerColor }} className="mb-6">
                    Get in Touch
                  </Title>
                  
                  <div className="space-y-6">
                    {store.contact?.email && (
                      <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                        style={{ background: theme.primaryColor + '08' }}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})` }}
                        >
                          <MailOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <Text type="secondary" className="text-sm">Email</Text>
                          <div>
                            <a href={`mailto:${store.contact.email}`} className="text-lg font-medium hover:underline" style={{ color: theme.primaryColor }}>
                              {store.contact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {store.contact?.phone && (
                      <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                        style={{ background: theme.primaryColor + '08' }}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})` }}
                        >
                          <PhoneOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <Text type="secondary" className="text-sm">Phone</Text>
                          <div>
                            <a href={`tel:${store.contact.phone}`} className="text-lg font-medium hover:underline" style={{ color: theme.primaryColor }}>
                              {store.contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {store.contact?.address && (
                      <div className="flex items-start gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                        style={{ background: theme.primaryColor + '08' }}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})` }}
                        >
                          <EnvironmentOutlined className="text-white text-xl" />
                        </div>
                        <div>
                          <Text type="secondary" className="text-sm">Address</Text>
                          <div className="text-lg font-medium">
                            {store.contact.address.street}<br />
                            {store.contact.address.city}, {store.contact.address.state} {store.contact.address.zipCode}<br />
                            {store.contact.address.country}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card 
                  className="h-full rounded-2xl border-0 shadow-xl"
                  bodyStyle={{ padding: '32px' }}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}05, ${theme.secondaryColor || theme.primaryColor}05)`
                  }}
                >
                  <Title level={2} style={{ color: theme.headerColor }} className="mb-6">
                    Follow Us
                  </Title>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {store.socialMedia?.map((social, index) => (
                      <Button
                        key={index}
                        size="large"
                        icon={React.cloneElement(getSocialIcon(social.platform), { className: 'text-xl' })}
                        href={social.url}
                        target="_blank"
                        className="flex items-center justify-center gap-2 h-14 rounded-xl border-0 shadow-md hover:shadow-xl transition-all"
                        style={{ 
                          background: social.platform === 'facebook' ? '#1877F2' :
                                     social.platform === 'instagram' ? 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)' :
                                     social.platform === 'twitter' ? '#1DA1F2' :
                                     social.platform === 'youtube' ? '#FF0000' :
                                     social.platform === 'tiktok' ? '#000000' : 
                                     `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`,
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        <span className="capitalize font-semibold">{social.platform}</span>
                      </Button>
                    ))}
                    
                    {(!store.socialMedia || store.socialMedia.length === 0) && (
                      <div className="col-span-2 text-center py-12">
                        <GlobalOutlined className="text-5xl text-gray-300 mb-3" />
                        <Text type="secondary" className="text-lg">No social media links yet</Text>
                      </div>
                    )}
                  </div>

                  {/* Booking CTA */}
                  <Divider className="my-8" style={{ borderColor: theme.primaryColor + '20' }} />
                  
                  <div className="text-center">
                    <Title level={4} style={{ color: theme.headerColor }} className="mb-4">
                      Ready to book your appointment?
                    </Title>
                    <Button
                      size="large"
                      icon={<CalendarOutlined />}
                      className="h-14 px-8 text-lg font-semibold border-0 shadow-lg hover:shadow-2xl transition-all"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor || theme.primaryColor})`,
                        color: 'white'
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          {/* </TabPane> */}
        </Tabs>
      </div>

      {/* Footer */}
       <StoreFooter store={store} theme={theme} />

      <style jsx>{`
        .store-tabs .ant-tabs-tab {
          font-size: 16px;
          padding: 12px 24px;
          margin: 0 4px;
          border-radius: 50px;
          transition: all 0.3s;
        }
        .store-tabs .ant-tabs-tab:hover {
          color: ${theme.primaryColor};
          background: ${theme.primaryColor}10;
        }
        .store-tabs .ant-tabs-tab-active {
          font-weight: 600;
        }
        .store-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${theme.primaryColor} !important;
        }
        .store-tabs .ant-tabs-ink-bar {
          display: none;
        }
        .store-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
};

export default StorePage;