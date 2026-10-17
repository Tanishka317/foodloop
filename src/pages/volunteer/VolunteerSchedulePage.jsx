import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react';

export default function VolunteerSchedulePage() {
  const shifts = [
    {
      id: 'sh_1',
      date: 'Today, Oct 10',
      time: '15:00 - 18:00',
      area: 'Downtown / SOMA Corridor',
      assignedPickups: 2,
      status: 'active'
    },
    {
      id: 'sh_2',
      date: 'Tomorrow, Oct 11',
      time: '09:00 - 12:00',
      area: 'Mission District Grocery Run',
      assignedPickups: 1,
      status: 'scheduled'
    },
    {
      id: 'sh_3',
      date: 'Friday, Oct 14',
      time: '16:00 - 19:30',
      area: 'Catering Surplus Evening Route',
      assignedPickups: 0,
      status: 'standby'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-ivory-300 text-xs text-charcoal-600 flex items-center justify-between">
        <span>Volunteer Dispatch Schedule & Regional Routing Windows</span>
        <span className="text-forest-700 font-semibold">Active Vehicle: Cargo Van</span>
      </div>

      <div className="space-y-4">
        {shifts.map(sh => (
          <Card key={sh.id} className="border-ivory-300 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0 border border-forest-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">{sh.date}</h4>
                  <p className="text-xs text-charcoal-600 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>{sh.time}</span>
                  </p>
                </div>
              </div>
              <Badge status={sh.status === 'active' ? 'published' : 'pending'} size="sm">
                {sh.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest-700" />
                <span>Zone: <strong>{sh.area}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-terracotta-600" />
                <span>Assigned pickups: <strong>{sh.assignedPickups} scheduled</strong></span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
