import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageAdapter } from '../../services/storageAdapter';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDeadline, formatDateTime } from '../../utils/formatters';
import { Layers, PackagePlus, Clock, Eye, Trash2 } from 'lucide-react';

export default function DonationsListPage() {
  const { donations, currentOrg, updateDonationStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const dbOrgId = currentOrg?.databaseOrgId || StorageAdapter.getDatabaseOrgId(currentOrg);
  const myDonations = donations.filter(
    (d) => d.donorId === currentOrg?.id || (dbOrgId && d.donorId === dbOrgId)
  );

  const filtered = myDonations.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs">
          {['all', 'published', 'allocated', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-forest-700 text-ivory-50 shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100'
              }`}
            >
              {st} {st !== 'all' && `(${myDonations.filter(d => d.status === st).length})`}
            </button>
          ))}
        </div>

        <Link to="/app/donor/donations/new">
          <Button variant="terracotta" size="sm" icon={PackagePlus}>
            Post New Donation
          </Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No food listings found"
          description="You don't have any surplus listings in this status tab."
          actionLabel="Post New Surplus Listing"
          onAction={() => window.location.href = '#/app/donor/donations/new'}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
                <tr>
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Servings</th>
                  <th className="px-4 py-3">Pickup Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filtered.map(don => (
                  <tr key={don.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={don.image} alt={don.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-ivory-300" />
                        <div>
                          <Link to={`/app/donor/donations/${don.id}`} className="font-semibold text-charcoal-900 hover:text-forest-700 line-clamp-1">
                            {don.title}
                          </Link>
                          <span className="text-[11px] text-charcoal-500 font-mono">#{don.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge category={don.category} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-charcoal-900">
                      {don.quantity} {don.unit}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-forest-700">
                      ~{don.estimatedServings} meals
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-terracotta-700">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDeadline(don.pickupDeadline)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge status={don.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/app/donor/donations/${don.id}`}>
                          <Button size="sm" variant="ghost" icon={Eye}>Inspect</Button>
                        </Link>
                        {don.status === 'published' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDonationStatus(don.id, 'expired')}
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
