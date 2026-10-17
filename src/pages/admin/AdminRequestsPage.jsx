import React from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';

export default function AdminRequestsPage() {
  const { requests } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-ivory-300 text-xs text-charcoal-600">
        Platform Allocation Ledger: Central immutable audit trail of food requests and claims.
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Donation Item</th>
                <th className="px-4 py-3">Claiming Organization</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-ivory-50/70">
                  <td className="px-4 py-3.5 font-mono text-charcoal-500">#{req.id}</td>
                  <td className="px-4 py-3.5 font-bold text-charcoal-900">{req.donationTitle}</td>
                  <td className="px-4 py-3.5 text-charcoal-700">{req.requestingOrganizationName}</td>
                  <td className="px-4 py-3.5 font-semibold text-charcoal-800">{req.requestedQuantity} {req.requestedUnit}</td>
                  <td className="px-4 py-3.5 text-charcoal-500">{formatDateTime(req.createdAt)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Badge status={req.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
