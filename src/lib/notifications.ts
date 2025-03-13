import { NotificationType } from "../../types";
import { pusherServer } from "./pusher";

export async function sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    // data?: Record<string, any>
    data?: {
        orderId?: string;
        status?: string;
        message?: string;
    }
) {
    const notification = {
        id: crypto.randomUUID(),
        type,
        title,
        message,
        data,
        createdAt: new Date(),
        isRead: false,
        userId,
    };

    await pusherServer.trigger(
        `private-user-${userId}`,
        'notification',
        notification,
    );

    return notification;
};


export const NotificationServices = {
    async orderStatus(userId: string, orderId: string, status: string) {
        return sendNotification(
            userId,
            'ORDER_STATUS',
            'Order Status Update',
            `Your order ${orderId} has been ${status.toLowerCase()}`,
            { orderId, status },
        )
    },

    async paymentStatus(userId: string, orderId: string, status: string) {
        return sendNotification(
            userId,
            'PAYMENT_STATUS',
            'Payment Status Update',
            `Your payment for order ${orderId} has been ${status.toLowerCase()}`,
            { orderId, status },
        )
    },

    async deliveryUpdate(userId: string, orderId: string, status: string) {
        return sendNotification(
            userId,
            'DELIVERY_UPDATE',
            'Delivery Update',
            `Delivery for order #${orderId}: ${status}`,
            { orderId, status }
        );
    },

    async subscriptionUpdate(userId: string, status: string, message: string) {
        return sendNotification(
            userId,
            'SUBSCRIPTION_UPDATE',
            'Subscription Update',
            message,
            { status }
        );
    }
}