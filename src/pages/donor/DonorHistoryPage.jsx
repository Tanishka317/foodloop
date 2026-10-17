import React from 'react';
import { useApp } from '../../context/AppContext';
import { StorageAdapter } from '../../services/storageAdapter';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatters';
import { Download } from 'lucide-react';

export default function DonorHistoryPage() {
  const { donations, currentOrg, addToast } = useApp();

  const dbOrgId = currentOrg?.databaseOrgId || StorageAdapter.getDatabaseOrgId(currentOrg);
  const completed = donations.filter(
    (d) => (d.donorId === currentOrg?.id || (dbOrgId && d.donorId === dbOrgId)) && d.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-bold text-charcoal-900">Completed Surplus Donations</h3>
          <p className="text-xs text-charcoal-500">Verified audit trail of commercial surplus food collected and safely repurposed</p>
        </div>
        <Button variant="outline" size="sm" icon={Download} onClick={() => addToast('Tax & ESG audit log downloaded (Demo Mode)', 'info')}>
          Export Tax Audit Report
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Listing ID</th>
                <th className="px-4 py-3">Surplus Food Batch</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Meals Provided</th>
                <th className="px-4 py-3">Completed Date</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {completed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-charcoal-500">
                    No completed donations recorded yet.
                  </td>
                </tr>
              ) : (
                completed.map(don => (
                  <tr key={don.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-charcoal-500">#{don.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-charcoal-900">{don.title}</td>
                    <td className="px-4 py-3.5 text-charcoal-700">{don.quantity} {don.unit}</td>
                    <td className="px-4 py-3.5 font-semibold text-forest-700">~{don.estimatedServings} Meals</td>
                    <td className="px-4 py-3.5 text-charcoal-600">{formatDateTime(don.createdAt)}</td>
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
