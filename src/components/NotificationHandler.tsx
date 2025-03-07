'use client'
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Notification } from "../../types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { toast } from "@/hooks/use-toast";

const NotificationHandler = () => {

    const { data: session, status } = useSession();
    const addNotification = useNotificationStore((state) => state.addNotifications);

    useEffect(() => {
        // if(!session?.user?.id) return;

        // Don't subscribe if session is loading or user is not authenticated
        if (status === 'loading' || !session?.user?.id) return;

        try {
            const channel = pusherClient.subscribe(`private-user-${session.user.id}`);
    
            const handleNotification = (notification: Notification) => {
    
                const notificationWithUser = {
                    ...notification,
                    userId: session.user.id,
                    createdAt: new Date(),
                }
    
                addNotification(notificationWithUser);
    
                toast({
                    title: notification.title,
                    description: notification.message,
                    variant: "default",
                })
            }
    
            channel.bind('notification', handleNotification);
    
            return () => {
                channel.unbind('notification', handleNotification);
                pusherClient.unsubscribe(`private-user-${session.user.id}`);
            }
        } catch (error) {
            console.error("Error subscribing to Pusher channel:", error);
        }
    }, [session, status, addNotification]);

  return null;
};

export default NotificationHandler;
