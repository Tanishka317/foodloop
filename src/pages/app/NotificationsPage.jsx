import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, currentRole, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState('all');

  const myNotifications = notifications.filter(n => n.role === currentRole);
  const filtered = myNotifications.filter(n => filter === 'unread' ? n.unread : true);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            All Alerts ({myNotifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Unread Only ({myNotifications.filter(n => n.unread).length})
          </button>
        </div>

        {myNotifications.some(n => n.unread) && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllNotificationsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! New dispatch alerts and claim status updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => (
            <Card
              key={notif.id}
              className={`p-4 transition-all ${
                notif.unread ? 'bg-white border-l-4 border-l-terracotta-500 shadow-warm' : 'bg-ivory-50/70 border-ivory-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-charcoal-900">{notif.title}</h4>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-charcoal-400 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.time}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.unread && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-[11px] text-forest-700 hover:underline font-semibold"
                    >
                      Mark read
                    </button>
                  )}
                  {notif.link && (
                    <Link to={notif.link} onClick={() => markNotificationRead(notif.id)}>
                      <Button size="sm" variant="outline" icon={ExternalLink}>
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
