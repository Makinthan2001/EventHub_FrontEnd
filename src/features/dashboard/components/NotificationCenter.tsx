import React, { useState } from 'react';
import { authService } from '../../auth/services/auth.service';
import { X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgent?: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClose }) => {
  const [filter, setFilter] = useState('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-slate-200">
          {['all', 'unread', 'read'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 font-medium capitalize ${filter === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          <div className="space-y-3 p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border flex gap-4 ${getBgColor(notification.type)}`}
                >
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
