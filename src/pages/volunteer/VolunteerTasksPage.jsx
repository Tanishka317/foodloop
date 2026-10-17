import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { Truck, MapPin, KeyRound, CheckCircle2, ChevronRight } from 'lucide-react';

export default function VolunteerTasksPage() {
  const { pickups, currentUser, updatePickupStatus } = useApp();
  const [tab, setTab] = useState('active');

  const myTasks = pickups.filter(p => p.volunteerId === currentUser?.id);
  const activeTasks = myTasks.filter(p => p.status !== 'delivered');
  const completedTasks = myTasks.filter(p => p.status === 'delivered');

  const displayed = tab === 'active' ? activeTasks : completedTasks;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs w-fit">
        <button
          onClick={() => setTab('active')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'active' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Active Tasks ({activeTasks.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'completed' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Completed Rescues ({completedTasks.length})
        </button>
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={tab === 'active' ? 'No active pickups right now' : 'No completed tasks yet'}
          description="When donors approve claims, courier pickups are dispatched to your console."
        />
      ) : (
        <div className="space-y-4">
          {displayed.map(pk => (
            <Card key={pk.id} className="border-ivory-300 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-charcoal-400 uppercase">Dispatch #{pk.id}</span>
                  <h3 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">{pk.donationTitle}</h3>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded border border-forest-200">
                    {pk.verificationCode}
                  </span>
                  <Badge status={pk.status} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Pickup Location</span>
                  <p className="font-bold text-charcoal-900">{pk.donorName}</p>
                  <p className="text-charcoal-600">{pk.donorAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Destination Kitchen</span>
                  <p className="font-bold text-charcoal-900">{pk.recipientName}</p>
                  <p className="text-charcoal-600">{pk.recipientAddress}</p>
                </div>
              </div>

              {/* Status transition action buttons */}
              <div className="pt-3 border-t border-ivory-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <Link to={`/app/volunteer/tasks/${pk.id}`} className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
                  <span>Open Step-by-Step Courier Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  {pk.status === 'assigned' && (
                    <Button size="sm" variant="primary" onClick={() => updatePickupStatus(pk.id, 'accepted')}>
                      Accept Assignment
                    </Button>
                  )}
                  {pk.status === 'accepted' && (
                    <Button size="sm" variant="primary" onClick={() => updatePickupStatus(pk.id, 'en_route')}>
                      Mark En Route
                    </Button>
                  )}
                  {pk.status === 'en_route' && (
                    <Button size="sm" variant="primary" onClick={() => updatePickupStatus(pk.id, 'collected')}>
                      Confirm Food Collected
                    </Button>
                  )}
                  {pk.status === 'collected' && (
                    <Button size="sm" variant="primary" icon={CheckCircle2} onClick={() => updatePickupStatus(pk.id, 'delivered')}>
                      Confirm Delivered
                    </Button>
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
