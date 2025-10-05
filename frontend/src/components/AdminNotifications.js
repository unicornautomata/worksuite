// AdminNotifications.js
import React, { useEffect, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationContext } from "./NotificationContext";

let todoStompClient = null;
let blogStompClient = null;

function AdminNotifications() {
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    // ========== TODO SERVICE WebSocket (Port 8081) ==========
    const todoSocket = new SockJS("http://localhost:8081/ws");
    todoStompClient = new Client({
      webSocketFactory: () => todoSocket,
      onConnect: () => {
        console.log("✅ Connected to Todo WebSocket");
        todoStompClient.subscribe("/topic/admin-notifications", (message) => {
          const notificationMessage = message.body;

          // Show toast
          toast.info(notificationMessage, {
            position: "top-right",
            autoClose: 5000
          });

          // Add to bell notification
          addNotification({
            id: Date.now() + Math.random(),
            message: notificationMessage,
            timestamp: new Date(),
            read: false,
          });
        });
      },
      onStompError: (frame) => {
        console.error("Todo WebSocket error:", frame.headers["message"]);
      },
    });

    todoStompClient.activate();

    // ========== BLOG SERVICE WebSocket (Port 8083) ==========
    const blogSocket = new SockJS("http://localhost:8083/ws");
    blogStompClient = new Client({
      webSocketFactory: () => blogSocket,
      onConnect: () => {
        console.log("✅ Connected to Blog WebSocket");
        blogStompClient.subscribe("/topic/admin-notifications", (message) => {
          const notificationMessage = message.body;

          // Show toast
          toast.info(notificationMessage, {
            position: "top-right",
            autoClose: 5000
          });

          // Add to bell notification
          addNotification({
            id: Date.now() + Math.random(),
            message: notificationMessage,
            timestamp: new Date(),
            read: false,
          });
        });
      },
      onStompError: (frame) => {
        console.error("Blog WebSocket error:", frame.headers["message"]);
      },
    });

    blogStompClient.activate();

    // Cleanup on unmount
    return () => {
      if (todoStompClient) {
        todoStompClient.deactivate();
      }
      if (blogStompClient) {
        blogStompClient.deactivate();
      }
    };
  }, [addNotification]);

  return <ToastContainer />;
}

export default AdminNotifications;
