import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';
import { Award, CheckCircle2, Sparkles, HeartHandshake } from 'lucide-react';

export default function VolunteerHistoryPage() {
  const { pickups, currentUser } = useApp();

  const completed = pickups.filter(p => p.volunteerId === currentUser?.id && p.status === 'delivered');

  const badges = [
    { title: 'Gold Route Courier', desc: 'Completed over 25 verified rescues', icon: Award, unlocked: true },
    { title: 'Zero Food Left Behind', desc: '100% on-time temperature compliance', icon: CheckCircle2, unlocked: true },
    { title: 'Community Hero', desc: 'Over 1,000 kg safely delivered to shelters', icon: HeartHandshake, unlocked: true }
  ];

  return (
    <div className="space-y-6">
      {/* Milestone Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <Card key={i} className="border-ivory-300 p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-charcoal-900">{b.title}</h4>
              <p className="text-[11px] text-charcoal-500">{b.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Completed Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="p-4 bg-ivory-50 border-b border-ivory-200">
          <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">Completed Delivery History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Task ID</th>
                <th className="px-4 py-3">Rescued Food</th>
                <th className="px-4 py-3">Donor Facility</th>
                <th className="px-4 py-3">Shelter Recipient</th>
                <th className="px-4 py-3">Handoff Code</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {completed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-charcoal-500">
                    No completed tasks recorded in current session.
                  </td>
                </tr>
              ) : (
                completed.map(pk => (
                  <tr key={pk.id} className="hover:bg-ivory-50/70">
                    <td className="px-4 py-3.5 font-mono text-charcoal-500">#{pk.id}</td>
                    <td className="px-4 py-3.5 font-bold text-charcoal-900">{pk.donationTitle}</td>
                    <td className="px-4 py-3.5 text-charcoal-700">{pk.donorName}</td>
                    <td className="px-4 py-3.5 text-charcoal-700">{pk.recipientName}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-forest-700">{pk.verificationCode}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Badge status="delivered" size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
