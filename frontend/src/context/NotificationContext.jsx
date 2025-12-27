import React, { createContext, useContext, useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import api from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Initial Fetch
  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count')
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  // 2. Mark as Read Logic
  const markAsRead = (id) => {
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // If it was unread, decrease count
    // (This logic might need tuning depending on how you want the badge to behave)
    
    api.post(`/notifications/${id}/read`).catch(err => console.error(err));
  };

  const clearUnreadCount = () => {
      setUnreadCount(0);
      // Mark visibly loaded notifications as read in backend
      notifications.forEach(n => {
          if (!n.isRead && n.id) markAsRead(n.id);
      });
  };

  // 3. WebSocket Connection (Run ONCE for the app)
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) return; // Don't connect if not logged in

    fetchNotifications();

    const stompClient = Stomp.over(() => new SockJS('http://localhost:8080/ws'));
    stompClient.debug = () => {}; // Silence logs

    stompClient.connect({}, () => {
      setIsConnected(true);
      
      api.get('/users/me').then(res => {
          const userId = res.data.id;
          
          stompClient.subscribe(`/queue/notifications/${userId}`, (message) => {
            const newNotification = JSON.parse(message.body);
            
            // Prevent duplicates (in case of network blips)
            setNotifications(prev => {
                if (prev.some(n => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
            
            setUnreadCount(prev => prev + 1);
            toast.info(newNotification.message || "New Notification");
          });
      }).catch(err => console.error("WS Auth Error", err));
    });

    return () => {
      if (stompClient && stompClient.connected) {
          stompClient.disconnect();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, clearUnreadCount, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
};