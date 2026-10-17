import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';
import { History, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NgoHistoryPage() {
  const { pickups, currentOrg, addToast } = useApp();

  const completedPickups = pickups.filter(p => p.recipientId === currentOrg?.id && p.status === 'delivered');

  const handleExportCsv = () => {
    addToast('Simulated CSV export generated for audit log', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-bold text-charcoal-900">Distribution Audit Archive</h3>
          <p className="text-xs text-charcoal-500">Historical food donations received, verified, and distributed to community guests</p>
        </div>
        <Button variant="outline" size="sm" icon={Download} onClick={handleExportCsv}>
          Export Audit Ledger (.CSV)
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Task ID</th>
                <th className="px-4 py-3">Donation Item</th>
                <th className="px-4 py-3">Donor Facility</th>
                <th className="px-4 py-3">Delivered Timestamp</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {completedPickups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-charcoal-500">
                    No completed distributions recorded in active session.
                  </td>
                </tr>
              ) : (
                completedPickups.map(pk => (
                  <tr key={pk.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-charcoal-500">#{pk.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-charcoal-900">{pk.donationTitle}</td>
                    <td className="px-4 py-3.5 text-charcoal-700">{pk.donorName}</td>
                    <td className="px-4 py-3.5 text-charcoal-600">{formatDateTime(pk.scheduledDeliveryTime)}</td>
                    <td className="px-4 py-3.5 text-charcoal-800">{pk.volunteerName}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-forest-700 font-bold">{pk.verificationCode}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Badge status="completed" size="sm" />
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
