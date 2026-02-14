import React, { useState } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Input, 
  Select, 
  Form, 
  Steps, 
  Progress, 
  Avatar, 
  Menu, 
  Row, 
  Col,
  Tooltip,
  Divider,
  message,
  Tag,
  Rate,
  Tabs,
  Drawer,
  Image,
  Badge
} from 'antd';
import { 
  HomeOutlined, 
  GiftOutlined, 
  PhoneOutlined, 
  UserOutlined, 
  WhatsAppOutlined,
  HeartOutlined,
  DollarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TrophyOutlined,
  StarOutlined,
  SmileOutlined,
  BookOutlined,
  SafetyOutlined,
  GlobalOutlined,
  BankOutlined,
  FlagOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  MailOutlined,
  MenuOutlined,
  CloseOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  FireOutlined,
  WaterOutlined,
  BookFilled,
  MedicineBoxFilled,
  EnvironmentFilled
} from '@ant-design/icons';
import axios from 'axios';
import { LogInIcon } from 'lucide-react';
import logo from '../ass/logo.jpeg'
import M from '../ass/m.jpeg'
import f from '../ass/f.jpeg'
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

// WhatsApp floating button component
const WhatsAppFloatButton = () => {
  return (
    <div className="whatsapp-float">
      <Tooltip title="Chat with us on WhatsApp" placement="left">
        <a 
          href="https://wa.me/913369028755" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-float-button"
        >
          <WhatsAppOutlined className="whatsapp-icon" />
          <span className="whatsapp-text">Chat with Us</span>
        </a>
      </Tooltip>
    </div>
  );
};

// Dummy Images - Using placeholders with different colors and icons
const DummyImage = ({img, category, size = "h-56" }) => {
  const categoryConfig = {
    education: { color: "from-blue-400 to-blue-600",
        src:"https://media.istockphoto.com/id/538570416/photo/poor-indian-family-on-the-street-in-allahabad-india.jpg?s=612x612&w=0&k=20&c=QNKeBwf1_YIE_d9MYwoySEZ9VZq-wa1MTsy0QEizwFY=",
        
        icon: <BookFilled className="text-4xl text-white" />, text: "📚 Education" },
    health: { color: "from-green-400 to-green-600", icon: <MedicineBoxFilled className="text-4xl text-white" />, text: "🏥 Health" },
    community: { color: "from-purple-400 to-purple-600", icon: <TeamOutlined className="text-4xl text-white" />, text: "👨‍👩‍👧‍👦 Community" },
    environment: { color: "from-teal-400 to-teal-600", icon: <EnvironmentFilled className="text-4xl text-white" />, text: "🌿 Environment" },
    default: { color: "from-pink-400 to-pink-600", icon: <HeartOutlined className="text-4xl text-white" />, text: "❤️ Donation" }
  };

  const config = categoryConfig[category] || categoryConfig.default;

  return (
    <div className={`${size} w-full bg-gradient-to-br ${config.color} rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
       <img src={img} alt="" />
      <div className="relative z-10 flex flex-col items-center justify-center">
        {config.icon}
        <p className="text-white font-semibold mt-3 text-center text-lg">{config.text}</p>
      
        <p className="text-white/80 text-sm mt-2 text-center">Impactful change through donations</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
};

// Testimonial Component
const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Donor",
      content: "Transparent and impactful! I can see exactly where my donations are going through their detailed reports.",
      rating: 5,
      imageColor: "#1890ff",
      location: "Mumbai"
    },
    {
      name: "Rajesh Mehta",
      role: "Corporate Partner",
      content: "Excellent CSR partner. Their team is professional and the impact assessment reports are comprehensive.",
      rating: 5,
      imageColor: "#52c41a",
      location: "Delhi"
    },
    {
      name: "Ananya Reddy",
      role: "Volunteer",
      content: "I've volunteered with them for 2 years. The difference they make in communities is truly inspiring.",
      rating: 4,
      imageColor: "#722ed1",
      location: "Bangalore"
    },
    {
      name: "Vikram Singh",
      role: "Beneficiary",
      content: "Thanks to their education program, my daughter is now attending a good school. Forever grateful!",
      rating: 5,
      imageColor: "#fa8c16",
      location: "Rural Rajasthan"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Tag color="gold" className="mb-4 text-base px-4 py-1">Testimonials</Tag>
          <h2 className="text-3xl font-bold mb-4">What Our Supporters Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from donors, partners, and beneficiaries about their experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card hover:shadow-xl transition-all duration-300 h-full">
              <div className="flex items-start mb-4">
                <Avatar 
                  size={60} 
                  style={{ backgroundColor: testimonial.imageColor }}
                  className="mr-4 flex-shrink-0"
                >
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm mt-1 flex items-center">
                    <EnvironmentOutlined className="mr-1" /> {testimonial.location}
                  </p>
                </div>
              </div>
              
              <Rate 
                disabled 
                defaultValue={testimonial.rating} 
                className="mb-3"
                character={<StarOutlined />}
              />
              
              <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Gallery Component
const ImageGallery = () => {
  const images = [
    {
      title: "Education Program",
      description: "Children receiving educational kits",
      category: "education",
      img:"https://media.istockphoto.com/id/538570416/photo/poor-indian-family-on-the-street-in-allahabad-india.jpg?s=612x612&w=0&k=20&c=QNKeBwf1_YIE_d9MYwoySEZ9VZq-wa1MTsy0QEizwFY=",
    },
    {
      title: "Food Camp",
      description: "Free medical checkup camp in rural area",
      category: "health",
      img:"https://cimages.milaap.org/milaap/image/upload/c_fill,g_faces,h_315,w_420/v1557425912/production/images/campaign/11726/Donation_of_meal_to_poor_oldage_people_in_andhrapradesh_gduncx_1557425913.jpg",
    },
    {
      title: "Clean kambal Project",
      description: "New water well inauguration",
      category: "community",
      img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXaHGgPrCqqeZwbzJVUFCbIBoPjAgC69_Eeg&s"
    },
    
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Tag color="green" className="mb-4 text-base px-4 py-1">Gallery</Tag>
          <h2 className="text-3xl font-bold mb-4">Our Work in Pictures</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visual stories of impact and transformation across communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <Card
              key={index}
              className="gallery-card overflow-hidden group cursor-pointer h-full"
              hoverable
              cover={
                <div className="relative overflow-hidden">
                  <DummyImage img ={image.img} category={image.category} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <Button type="primary" ghost size="small" className="w-full">
                        View More
                      </Button>
                    </div>
                  </div>
                </div>
              }
            >
              <Card.Meta
                title={<span className="font-bold text-lg">{image.title}</span>}
                description={<span className="text-gray-600">{image.description}</span>}
              />
              <div className="mt-4">
                <Tag color={image.category === 'education' ? 'blue' : image.category === 'health' ? 'green' : image.category === 'community' ? 'purple' : 'cyan'}>
                  {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                </Tag>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Donation Card Component
const DonationCard = () => {
  const [donationAmount, setDonationAmount] = useState(500);
  const [donationType, setDonationType] = useState('one-time');
  const [currentStep, setCurrentStep] = useState(0);
  
  const donationOptions = [500, 1000, 2000, 5000, 10000, 'custom'];
  
  const handleDonate = async (values) => {
    try {
      const response = await axios.post('https://api.donatecard.com/donate', {
        amount: donationAmount,
        type: donationType,
        ...values
      });
      message.success(`Thank you for your generous donation of ₹${donationAmount.toLocaleString()}!`);
      setCurrentStep(2);
    } catch (error) {
      message.error('Donation failed. Please try again.');
    }
  };

  const customAmountInput = donationAmount === 'custom' && (
    <div className="mt-4">
      <Input
        type="number"
        placeholder="Enter custom amount"
        prefix={<DollarOutlined />}
        size="large"
        style={{ height: '50px' }}
        onChange={(e) => setDonationAmount(Number(e.target.value) || 500)}
      />
    </div>
  );

  return (
    <Card 
      className="donation-card premium-card" 
      title={
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <HeartOutlined className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold text-gray-800">Support a Cause</span>
        </div>
      }
      bordered={false}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">Education Fund Progress</span>
          <Badge count="Active" color="green" />
        </div>
        <Progress 
          percent={78} 
          status="active" 
          strokeColor={{
            '0%': '#1890ff',
            '100%': '#52c41a',
          }}
          strokeWidth={8}
          format={() => '₹3,12,000 / ₹4,00,000'}
        />
        <p className="text-center text-gray-500 mt-2">Education for 200 underprivileged children</p>
      </div>
      
      <Steps current={currentStep} className="mb-8">
        <Step title="Amount" icon={<DollarOutlined />} />
        <Step title="Details" icon={<UserOutlined />} />
        <Step title="Complete" icon={<CheckCircleOutlined />} />
      </Steps>
      
   
      
      
   
      
      {currentStep === 2 && (
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleOutlined className="text-green-500 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-green-700">Thank You!</h3>
          <p className="text-gray-600 mb-4">Your donation is making a difference. You'll receive a tax receipt and impact report via email.</p>
          <div className="flex gap-3 justify-center">
            <Button type="primary" onClick={() => setCurrentStep(0)}>
              Make Another Donation
            </Button>
            <Button type="default" icon={<BookOutlined />}>
              View Impact Report
            </Button>
          </div>
        </div>
      )}
      
      <Divider />
      
      <div className="text-center text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <SafetyOutlined className="mr-2 text-green-500" /> 
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center justify-center">
            <BankOutlined className="mr-2 text-blue-500" /> 
            <span className="text-sm">80G Tax Benefits</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// About Us Component
const AboutUsSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Tag color="blue" className="mb-4 px-4 py-1 text-base">About Us</Tag>
            <h2 className="text-3xl font-bold mb-6">Transforming Lives Since 2010</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              <strong>DonateCard Foundation</strong> is a non-profit organization dedicated to creating sustainable change 
              through education, healthcare, and community development initiatives across India.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start bg-blue-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FlagOutlined className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Our Mission</h4>
                  <p className="text-gray-600">Empower communities through sustainable development</p>
                </div>
              </div>
              
              <div className="flex items-start bg-green-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <EyeOutlined className="text-green-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Our Vision</h4>
                  <p className="text-gray-600">A world where every individual thrives with dignity</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button type="primary" size="large" icon={<BookOutlined />}>
                Read Our Story
              </Button>
              <Button size="large" icon={<TeamOutlined />}>
                Join as Volunteer
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <TrophyOutlined className="text-yellow-500 text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-center">12+ Years</h3>
                  <p className="text-gray-500 text-center">Of Service</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform mt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <TeamOutlined className="text-blue-500 text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-center">25+ States</h3>
                  <p className="text-gray-500 text-center">Across India</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <SmileOutlined className="text-green-500 text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-center">1,00,000+</h3>
                  <p className="text-gray-500 text-center">Lives Impacted</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform mt-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <HeartOutlined className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-center">500+</h3>
                  <p className="text-gray-500 text-center">Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Section Component
const TeamSection = () => {
  const teamMembers = [
    {
      name: "Rajesh paswan",
      role: "Founder & Chairman",
      expertise: "Social Entrepreneurship",
      experience: "15+ years",
      imageColor: "#1890ff",
      img:M,
      description: "Former UN Development from Ramgarh Jharkhand"
    },
    {
      name: "Miss Yashoda Kumari",
img:f,
      role: "vice chairman",
      expertise: "Non-profit Management",
      experience: "12+ years",
      imageColor: "#52c41a",
      description: "Ramgarh Jharkhand"
    },
   
    
  ];

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Tag color="purple" className="mb-4 px-4 py-1 text-base">Our Leadership</Tag>
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Passionate professionals dedicated to creating positive change
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="team-card text-center hover:shadow-xl transition-all duration-300 h-full border-0 shadow-md"
              hoverable
            >
              <div className="relative mb-6">
                <Avatar 
                  size={100} 
                  src={member.img}
                  style={{ backgroundColor: member.imageColor }}
                  className="mx-auto border-4 border-white shadow-lg"
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm mb-4">{member.description}</p>
              
              <div className="text-left mb-4 bg-gray-50 p-3 rounded-lg">
                <p className="flex items-center text-gray-600 mb-2 text-sm">
                  <CheckCircleOutlined className="mr-2 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Expertise:</span> {member.expertise}
                </p>
                <p className="flex items-center text-gray-600 text-sm">
                  <CheckCircleOutlined className="mr-2 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Experience:</span> {member.experience}
                </p>
              </div>
              
              
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const headerMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => {
        setCurrentPage('home');
        setMobileMenuVisible(false);
      }
    },
    {
      key: 'services',
      icon: <GiftOutlined />,
      label: 'Our Services',
      onClick: () => {
        setCurrentPage('services');
        setMobileMenuVisible(false);
      }
    },
  ];

  const renderHeader = () => (
    <Header className="header premium-header fixed w-full z-50 top-0 left-0 right-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="logo flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <img src={logo} alt="" />
            </div>
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-bold">DonateCard</h1>
              <p className="text-blue-200 text-xs sm:text-sm hidden sm:block">Creating Impact, Transforming Lives</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={headerMenuItems}
            className="flex-1 justify-center hidden lg:flex mx-8"
          />
          
          {/* Desktop Donate Button */}
          <Button 
            type="primary" 
            icon={<HeartOutlined />}
            className="donate-now-btn hidden sm:flex"
            onClick={() => {
              const donationSection = document.querySelector('.donation-card');
              if (donationSection) {
                donationSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Donate Now
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            type="text"
            icon={<MenuOutlined />}
            className="text-white lg:hidden"
            onClick={() => setMobileMenuVisible(true)}
          />
        </div>
      </div>
    </Header>
  );

  const renderMobileMenu = () => (
    <Drawer
      title={
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
            <HeartOutlined className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold">DonateCard</span>
        </div>
      }
      placement="right"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      className="mobile-menu-drawer"
      extra={
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => setMobileMenuVisible(false)}
        />
      }
    >
      <div className="flex flex-col space-y-4">
        {headerMenuItems.map(item => (
          <Button
            key={item.key}
            type={currentPage === item.key ? "primary" : "text"}
            icon={item.icon}
            onClick={item.onClick}
            className="text-left h-12 text-base justify-start"
            block
          >
            {item.label}
          </Button>
        ))}
        <Divider />
        <Button 
          type="primary" 
          icon={<HeartOutlined />}
          className="h-12"
          block
          onClick={() => {
            setMobileMenuVisible(false);
            const donationSection = document.querySelector('.donation-card');
            if (donationSection) {
              donationSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Donate Now
        </Button>
        <Button 
        onClick={()=>window.location.href='/login'}
          type="default" 
          icon={<LogInIcon />}
          className="h-12"
          block
        >
         LOGIN
        </Button>
      </div>
    </Drawer>
  );

  return (
    <Layout className="min-h-screen">
      {renderHeader()}
      {renderMobileMenu()}
      
      <Content className="content pt-16">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-0"></div>
              <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="text-center lg:text-left">
                    <Tag color="gold" className="mb-4 sm:mb-6 text-sm sm:text-base px-3 sm:px-4 py-1">Make a Difference</Tag>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                      Your <span className="text-blue-600">Donation</span> Creates<br />
                      Lasting <span className="text-purple-600">Change</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                      Join thousands of donors supporting education, healthcare, and community 
                      development initiatives that transform lives across India.
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                      <Button type="primary" size="large" icon={<HeartOutlined />} className="h-12 px-6 sm:px-8">
                        Donate Now
                      </Button>
                      <Button size="large" icon={<PlayCircleOutlined />} className="h-12 px-6 sm:px-8">
                        Watch Our Story
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl p-1 shadow-2xl">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                        <DonationCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Impact Stats */}
            <div className="py-8 sm:py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { icon: <BookFilled />, value: "50,000+", label: "Children Educated", color: "blue" },
                    { icon: <MedicineBoxFilled />, value: "200+", label: "Health Camps", color: "green" },
                    { icon: <EnvironmentFilled />, value: "500+", label: "Villages Served", color: "purple" },
                    { icon: <DollarOutlined />, value: "₹25Cr+", label: "Funds Deployed", color: "orange" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                        <div className={`text-xl sm:text-2xl text-${stat.color}-500`}>
                          {stat.icon}
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{stat.value}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <AboutUsSection />
            <ImageGallery />
            <TeamSection />
            <TestimonialSection />
            
            {/* CTA Section */}
            <div className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Ready to Make an Impact?</h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Your contribution can transform lives. Join our community of changemakers today.
                </p>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<HeartOutlined />}
                  className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg bg-white hover:bg-gray-100 font-semibold"
                  onClick={() => {
                    const donationSection = document.querySelector('.donation-card');
                    if (donationSection) {
                      donationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Start Donating
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Services Page
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-12">
              <Tag color="blue" className="mb-4 text-sm sm:text-base px-3 sm:px-4 py-1">Our Offerings</Tag>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Comprehensive Philanthropy Services</h1>
              <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                We offer a range of services to make your charitable giving effective, transparent, and impactful
              </p>
            </div>
            
            <div className="mb-8">
              <DummyImage category="default" size="h-48 sm:h-64" />
            </div>
            
            <Tabs defaultActiveKey="1" className="services-tabs" size="large">
              <TabPane 
                tab={
                  <span className="flex items-center">
                    <GiftOutlined className="mr-2" /> Individual Giving
                  </span>
                } 
                key="1"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <Card className="service-detail-card">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                      <DollarOutlined className="text-blue-500 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">One-time & Recurring Donations</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6">
                      Support causes you care about with flexible donation options. Choose from one-time gifts 
                      or set up monthly, quarterly, or yearly contributions.
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Real-time impact tracking dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Automated tax receipts (80G)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Personalized impact reports</span>
                      </li>
                    </ul>
                    <Button type="primary" size="large" block className="sm:w-auto">
                      Start Donating
                    </Button>
                  </Card>
                  
                  <Card className="service-detail-card">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                      <FlagOutlined className="text-green-500 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Campaign Fundraising</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6">
                      Create personalized fundraising campaigns for birthdays, anniversaries, 
                      memorials, or special events. Share your campaign with friends and family.
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Custom campaign landing pages</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Social media integration tools</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Progress tracking and analytics</span>
                      </li>
                    </ul>
                    <Button type="default" size="large" block className="sm:w-auto">
                      Create Campaign
                    </Button>
                  </Card>
                </div>
              </TabPane>
              
              <TabPane 
                tab={
                  <span className="flex items-center">
                    <BankOutlined className="mr-2" /> Corporate Partnerships
                  </span>
                } 
                key="2"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <Card className="service-detail-card">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                      <TeamOutlined className="text-purple-500 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">CSR Consulting</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6">
                      End-to-end CSR solutions compliant with Indian regulations. We help design, 
                      implement, and monitor impactful corporate social responsibility programs.
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>CSR compliance and reporting</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Employee volunteering programs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Impact assessment and ROI analysis</span>
                      </li>
                    </ul>
                    <Button type="primary" size="large" block className="sm:w-auto">
                      Schedule Consultation
                    </Button>
                  </Card>
                  
                  <Card className="service-detail-card">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                      <GlobalOutlined className="text-orange-500 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Corporate Giving Programs</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6">
                      Structured giving programs that align with your company's values and goals. 
                      Includes matching gift programs, payroll giving, and cause marketing initiatives.
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Employee donation matching</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Payroll deduction setup</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Brand visibility and recognition</span>
                      </li>
                    </ul>
                    <Button type="default" size="large" block className="sm:w-auto">
                      Explore Programs
                    </Button>
                  </Card>
                </div>
              </TabPane>
            </Tabs>
            
            <div className="mt-12">
              <TeamSection />
            </div>
          </div>
        )}
      </Content>
      
      <Footer className="footer premium-footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <HeartOutlined className="text-white text-lg sm:text-xl" />
                </div>
                <h3 className="text-white text-lg sm:text-xl font-bold">DonateCard</h3>
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Creating sustainable impact through transparent philanthropy since 2010.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {[FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined, LinkedinOutlined].map((Icon, index) => (
                  <Button 
                    key={index}
                    type="text" 
                    icon={<Icon className="text-white text-lg sm:text-xl" />} 
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/10 rounded-full"
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-base sm:text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                {['Home', 'About Us', 'Our Work', 'Get Involved', 'Blog'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-base sm:text-lg mb-4">Legal</h4>
              <ul className="space-y-2 sm:space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Transparency Report', 'Annual Report'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-base sm:text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 sm:space-y-4 text-gray-300">
                <li className="flex items-start">
                  <EnvironmentOutlined className="mr-2 mt-1 text-blue-300 flex-shrink-0" />
                  <span className="text-sm sm:text-base">H No 3639 Gali No. 93, Near Apex Public School, Sant Nagar, Burari, Delhi-110084</span>
                </li>
                <li className="flex items-center">
                  <PhoneOutlined className="mr-2 text-blue-300 flex-shrink-0" />
                  <span className="text-sm sm:text-base">+91 3369028755</span>
                </li>
                <li className="flex items-center">
                  <MailOutlined className="mr-2 text-blue-300 flex-shrink-0" />
                  <span className="text-sm sm:text-base">contact@donatecard.co.in</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Divider className="bg-gray-700 my-4 sm:my-6" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6">
            <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-0 text-center sm:text-left">
              © 2023 DonateCard Foundation. All rights reserved.
            </p>
            <div className="flex items-center">
              <SafetyOutlined className="text-green-400 mr-2" />
              <span className="text-gray-400 text-sm sm:text-base">
                Registered under Section 12A & 80G • Reg: 919/2019/20
              </span>
            </div>
          </div>
        </div>
      </Footer>
      
      <WhatsAppFloatButton />
    </Layout>
  );
};

export default App;