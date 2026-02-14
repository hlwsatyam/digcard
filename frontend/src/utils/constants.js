// Application constants

export const APP_NAME = process.env.REACT_APP_APP_NAME || 'Lifeline Multi Technology';

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

export const ENQUIRY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const DONATION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const PAYMENT_METHODS = {
  QR: 'qr',
  CARD: 'card',
  BANK: 'bank',
};

export const DONATION_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export const SIDEBAR_MENU = {
  ADMIN: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardOutlined',
      path: '/admin/dashboard',
    },
    {
      key: 'enquiries',
      label: 'Enquiries',
      icon: 'InboxOutlined',
      path: '/admin/enquiries',
    },
    {
      key: 'donations',
      label: 'Donations',
      icon: 'HeartOutlined',
      path: '/admin/donations',
    },
    {
      key: 'users',
      label: 'Users',
      icon: 'TeamOutlined',
      path: '/admin/users',
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: 'BarChartOutlined',
      path: '/admin/reports',
    },
  ],
  MEMBER: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardOutlined',
      path: '/member/dashboard',
    },
    {
      key: 'donate',
      label: 'Donate Now',
      icon: 'HeartOutlined',
      path: '/member/donate',
    },
    {
      key: 'history',
      label: 'Donation History',
      icon: 'HistoryOutlined',
      path: '/member/history',
    },
    {
      key: 'card',
      label: 'My Donation Card',
      icon: 'IdcardOutlined',
      path: '/member/card',
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: 'UserOutlined',
      path: '/member/profile',
    },
  ],
};

export const COLORS = {
  PRIMARY: '#1a56db',
  SECONDARY: '#0e9f6e',
  SUCCESS: '#52c41a',
  WARNING: '#ffc107',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
  LIFELINE_BLUE: '#1a56db',
  LIFELINE_GREEN: '#0e9f6e',
  LIFELINE_GOLD: '#ffc107',
};