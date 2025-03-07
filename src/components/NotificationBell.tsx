'use client';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const { 
    notifications, 
    markAsRead, 
    getUnreadCount,
    clearAll 
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                notifications
                  .filter(n => !n.isRead)
                  .forEach(n => markAsRead(n.id));
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-4 ${
                  !notification.isRead ? 'bg-muted/50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">
                  {notification.message}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-destructive hover:text-destructive"
              onClick={() => clearAll()}
            >
              Clear all
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}