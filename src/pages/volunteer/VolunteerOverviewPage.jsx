import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export default function VolunteerOverviewPage() {
  const { pickups, currentUser, updatePickupStatus } = useApp();

  const myTasks = pickups.filter(p => p.volunteerId === currentUser?.id);
  const activeTask = myTasks.find(p => p.status !== 'delivered');
  const completedTasks = myTasks.filter(p => p.status === 'delivered');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Certified Community Courier • Food Safety Trained</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
            Courier Console: {currentUser?.name || 'David O\'Connor'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
            Vehicle registered: <strong>{currentUser?.vehicleType || 'Refrigerated Cargo Van'}</strong>. You have safely transported over <strong>1,200 kg of food</strong> to regional shelters.
          </p>
        </div>

        <Link to="/app/volunteer/tasks">
          <Button variant="primary" size="lg" icon={Truck}>
            View Task Roster
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Active Assignment</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">
            {activeTask ? '1 Active Task' : 'Standby'}
          </div>
          <p className="text-[11px] text-terracotta-700 font-medium">
            {activeTask ? `Status: ${activeTask.status.replace('_', ' ').toUpperCase()}` : 'Ready for next dispatch'}
          </p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Completed Rescues</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">{completedTasks.length}</div>
          <p className="text-[11px] text-forest-700 font-medium">100% on-time delivery rate</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Courier Milestone</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">Gold Dispatch</div>
          <p className="text-[11px] text-charcoal-500">Top 5% bay area rescue courier</p>
        </Card>
      </div>

      {/* Active Assignment Card */}
      {activeTask && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-charcoal-900">
              Current Active Pickup Task
            </h3>
            <Link to={`/app/volunteer/tasks/${activeTask.id}`} className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
              <span>Full Route Instructions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-ivory-300 p-6 space-y-5 bg-ivory-50/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400">Task #{activeTask.id}</span>
                <h4 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">{activeTask.donationTitle}</h4>
              </div>
              <Badge status={activeTask.status} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-ivory-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">1. Pickup from Donor</span>
                <p className="font-bold text-charcoal-900">{activeTask.donorName}</p>
                <p className="text-charcoal-600">{activeTask.donorAddress}</p>
                <p className="text-[11px] text-terracotta-700">Dock note: {activeTask.notes}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-ivory-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">2. Deliver to Recipient</span>
                <p className="font-bold text-charcoal-900">{activeTask.recipientName}</p>
                <p className="text-charcoal-600">{activeTask.recipientAddress}</p>
                <p className="text-[11px] text-forest-700">Present code: <strong>{activeTask.verificationCode}</strong></p>
              </div>
            </div>

            {/* Quick state progress action */}
            <div className="pt-2 border-t border-ivory-200 flex items-center justify-between">
              <span className="text-xs text-charcoal-600">Simulate workflow step:</span>
              <div className="flex items-center gap-2">
                {activeTask.status === 'assigned' && (
                  <Button size="sm" variant="primary" onClick={() => updatePickupStatus(activeTask.id, 'accepted')}>
                    Accept Task
                  </Button>
                )}
                {activeTask.status === 'accepted' && (
                  <Button size="sm" variant="primary" onClick={() => updatePickupStatus(activeTask.id, 'en_route')}>
                    Start Driving (En Route)
                  </Button>
                )}
                {activeTask.status === 'en_route' && (
                  <Button size="sm" variant="primary" onClick={() => updatePickupStatus(activeTask.id, 'collected')}>
                    Confirm Food Collected
                  </Button>
                )}
                {activeTask.status === 'collected' && (
                  <Button size="sm" variant="primary" onClick={() => updatePickupStatus(activeTask.id, 'delivered')}>
                    Confirm Delivery to Shelter
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
