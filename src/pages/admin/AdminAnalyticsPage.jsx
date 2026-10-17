import React from 'react';
import Card from '../../components/common/Card';
import { BarChart3, TrendingUp, Users, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const dailyRescueData = [
    { day: 'Mon', kg: 1420 },
    { day: 'Tue', kg: 1890 },
    { day: 'Wed', kg: 1650 },
    { day: 'Thu', kg: 2100 },
    { day: 'Fri', kg: 2450 },
    { day: 'Sat', kg: 1980 },
    { day: 'Sun', kg: 1340 },
  ];

  const maxKg = Math.max(...dailyRescueData.map(d => d.kg));

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Platform Demonstration Analytics:</strong> Sample throughput metrics modeled for San Francisco metropolitan area.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
          DEMO DATA
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">7-Day Food Rescued</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">12,830 kg</div>
          <p className="text-[11px] text-emerald-700 font-semibold">+18.4% from last week</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Avg Rescue Velocity</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">42 minutes</div>
          <p className="text-[11px] text-forest-700 font-semibold">From listing to collection</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Active Donors</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">42 facilities</div>
          <p className="text-[11px] text-charcoal-500">Commercial kitchens & delis</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Redistribution Rate</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">98.4%</div>
          <p className="text-[11px] text-forest-700 font-semibold">Zero waste efficiency</p>
        </Card>
      </div>

      {/* Daily Volume Bar Chart */}
      <Card className="border-ivory-300 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
          <div>
            <h4 className="text-base font-serif font-bold text-charcoal-900">
              Daily Kilograms Rescued (Past 7 Days)
            </h4>
            <p className="text-xs text-charcoal-500">Total surplus food volume collected by community couriers</p>
          </div>
          <span className="text-xs font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-200">
            Peak: Friday (2,450 kg)
          </span>
        </div>

        {/* Visual Bar representation */}
        <div className="grid grid-cols-7 gap-3 pt-6 items-end h-56">
          {dailyRescueData.map(item => {
            const heightPercent = Math.round((item.kg / maxKg) * 100);

            return (
              <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-charcoal-700 font-mono">
                  {item.kg} kg
                </span>
                <div className="w-full bg-ivory-200 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-forest-700 rounded-t-lg transition-all duration-500 hover:bg-forest-800"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-charcoal-600 mt-1">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
