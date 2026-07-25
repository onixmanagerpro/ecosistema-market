import React from 'react';
import { Bell, Check, Clock, Award, CheckCircle2, AlertTriangle, X, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'reputation':
        return <Award className="w-4 h-4 text-indigo-400" />;
      case 'application':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 lg:p-8 bg-slate-950/40 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 text-slate-100 mt-12 animate-in slide-in-from-top-2">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Notificaciones en Tiempo Real</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                {unreadCount}
              </span>
            )}
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Header */}
        {unreadCount > 0 && (
          <div className="flex justify-end pt-2 pb-1">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Marcar todas como leídas</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto space-y-2 mt-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  !notif.read 
                    ? 'bg-slate-800/80 border-indigo-500/30' 
                    : 'bg-slate-900/40 border-slate-800 opacity-70'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-white line-clamp-1">{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{notif.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
