import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Notification } from "../../types";
import { useNotificationStore } from "@/store/useNotificationStore";
import { toast } from "@/hooks/use-toast";

const NotificationHandler = () => {

    const { data: session } = useSession();
    const addNotification = useNotificationStore((state) => state.addNotifications);

    useEffect(() => {
        if(!session?.user?.id) return;

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
    }, [session, addNotification]);

  return null;
};

export default NotificationHandler;
