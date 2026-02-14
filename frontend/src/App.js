 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberStore from './pages/MemberStore';
import StorePage from './pages/StorePage';
import { useEffect } from 'react';
import { baseURL } from './local/l1';

const queryClient = new QueryClient();

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  





 
 
 
 
useEffect(() => {
  registerPush();
}, []);

async function registerPush() {
  try {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return;
    }

    // Check if push is supported
    if (!('PushManager' in window)) {
      console.log('Push notifications not supported');
      return;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered');

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe if no existing subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BCaktoh-AkWnW9QHYTWojeUd9XAsMgWjCji2DgVOYDTl1nyXFDVS98agktx7def2E1-1Don3A6uLLJ9gpS-bSik"
        ),
      });
      console.log('New subscription created');
    } else {
      console.log('Using existing subscription');
    }



    // Send subscription to server
    const response = await fetch(`${baseURL}/subscribe`, {
      method: "POST",
      body:
       JSON.stringify({
    subscription,
    ownerId:JSON.parse(localStorage.getItem('user')),
    currentUrl: window.location.href,   // 👈 current page URL
    pathname: window.location.pathname, // 👈 sirf route bhi bhej sakte ho
  }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription on server');
    }

    console.log("Successfully subscribed to push notifications");
  } catch (error) {
    console.error("Push registration error:", error);
    
    // Handle specific error cases
    if (error.name === 'AbortError') {
      console.log('Push service error - check VAPID keys and permissions');
    } else if (error.name === 'NotAllowedError') {
      console.log('Notification permission denied');
    } else if (error.name === 'InvalidStateError') {
      console.log('Service worker already has a subscription');
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}














  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/store/:slug" element={<StorePage />} />
          
          <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/member/*" element={user?.role === 'member' ? <MemberDashboard /> : <Navigate to="/login" />} />
          <Route path="/member/store" element={user?.role === 'member' ? <MemberStore /> : <Navigate to="/login" />} />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;