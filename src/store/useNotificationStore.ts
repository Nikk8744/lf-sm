import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../../types';

interface NotificationState {
    notifications: Notification[];
    addNotifications: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    removenotification: (id: string) => void;
    clearAll: () => void;
    getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],

            addNotifications: (notification) => 
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                })
            ),

            markAsRead: (id) => 
                set((state) => ({
                    notifications: state.notifications.map((notif) => notif.id === id ? { ...notif, isRead: true } : notif),
                })),

            removenotification: (id) => 
                set((state) => ({
                    notifications: state.notifications.filter((notif) => notif.id !== id),
                })),

            clearAll: () => set({ notifications: [] }),

            getUnreadCount: () => {
                return get().notifications.filter(n => !n.isRead).length;
              },
        }),
        {
            name: 'notification-storage',
        }
    )
)