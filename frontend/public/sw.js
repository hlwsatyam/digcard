// public/sw.js
self.addEventListener("push", function (event) {
  console.log("Push received:", event);
  
  if (!event.data) {
    console.log("Empty push event");
    return;
  }

  try {
    const data = event.data.json();
    console.log("Push data:", data);
    
    const options = {
      body: data.body || "New notification",
      icon: data.icon  , // Default icon if none provided
      image: data.image, // Optional large image
   
      vibrate: [200, 100, 200], // Vibration pattern
      data: {
        url: data.url || "/", // URL to open when clicked
        timestamp: Date.now()
      },
      actions: data.actions || [
        
      ],
      tag: "notification-" + Date.now(), // Prevents duplicate notifications
      renotify: false,
      requireInteraction: false // Auto-close after some time
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Notification", options)
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close(); // Close the notification

  // Get the URL from notification data or use default
  const urlToOpen = event.notification.data?.url || '/';

  // Handle action buttons
  if (event.action === 'close') {
    return; // Just close the notification
  }

  // Open or focus the window
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(function(clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Optional: Handle notification close event
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed without clicking:', event);
});