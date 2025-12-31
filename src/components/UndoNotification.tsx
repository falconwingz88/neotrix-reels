import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Undo2 } from 'lucide-react';

interface UndoNotificationItem {
  id: string;
  message: string;
  onUndo: () => void;
  createdAt: number;
}

interface UndoNotificationProps {
  notifications: UndoNotificationItem[];
  onDismiss: (id: string) => void;
}

const UndoNotification = ({ notifications, onDismiss }: UndoNotificationProps) => {
  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimers: { [key: string]: number } = {};
      
      notifications.forEach(notif => {
        const elapsed = now - notif.createdAt;
        const remaining = Math.max(0, 10000 - elapsed);
        newTimers[notif.id] = remaining;
        
        if (remaining === 0) {
          onDismiss(notif.id);
        }
      });
      
      setTimers(newTimers);
    }, 100);

    return () => clearInterval(interval);
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm">
      {notifications.map((notif) => {
        const remaining = timers[notif.id] ?? 10000;
        const progress = (remaining / 10000) * 100;

        return (
          <div
            key={notif.id}
            className="bg-zinc-900 text-white rounded-lg shadow-xl border border-white/10 overflow-hidden animate-in slide-in-from-right-full duration-300"
          >
            <div className="p-4 flex items-center gap-3">
              <span className="text-sm flex-1">{notif.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  notif.onUndo();
                  onDismiss(notif.id);
                }}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 flex items-center gap-1"
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDismiss(notif.id)}
                className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-1 bg-white/10">
              <div 
                className="h-full bg-yellow-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UndoNotification;
export type { UndoNotificationItem };
