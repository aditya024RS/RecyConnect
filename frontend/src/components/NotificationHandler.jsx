import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const NotificationHandler = () => {
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    // Decode the token to get the user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub; // 'sub' is standard for subject (user's email/ID)

    // In your backend, ensure the JWT subject is the User ID for this to work.
    // If it's the email, we'd need another way to get the ID.
    // Let's assume for now the JWT 'sub' is the User ID.

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    client.onConnect = (frame) => {
      // Subscribe to the user-specific notification queue
      client.subscribe(`/queue/notifications/${userId}`, (message) => {
        const notification = JSON.parse(message.body);
        // Display the notification as a toast
        toast.info(notification.content);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();

    // Cleanup on component unmount
    return () => {
      client.deactivate();
    };
  }, []); // Empty dependency array ensures this runs only once

  return null; // This component does not render anything
};

export default NotificationHandler;