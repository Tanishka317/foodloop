import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDeadline } from '../../utils/formatters';
import { Layers, ShieldCheck, Eye, Ban } from 'lucide-react';

export default function AdminDonationsPage() {
  const { donations, updateDonationStatus } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = donations.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs w-fit">
        {['all', 'published', 'allocated', 'completed', 'expired'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              filter === st ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Listing Details</th>
                <th className="px-4 py-3">Donor Kitchen</th>
                <th className="px-4 py-3">Quantity & Yield</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filtered.map(don => (
                <tr key={don.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={don.image} alt={don.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-ivory-300" />
                      <div>
                        <div className="font-bold text-charcoal-900 line-clamp-1">{don.title}</div>
                        <span className="text-[11px] text-charcoal-500 font-mono">#{don.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-charcoal-900">{don.donorName}</div>
                    <span className="text-[11px] text-charcoal-500">{don.pickupAddress}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>{don.quantity} {don.unit}</div>
                    <span className="text-forest-700 font-bold">~{don.estimatedServings} Meals</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-terracotta-700 font-semibold">
                    {formatDeadline(don.pickupDeadline)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge status={don.status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {don.status === 'published' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDonationStatus(don.id, 'expired')}
                      >
                        Suspend Listing
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateDonationStatus(don.id, 'published')}
                      >
                        Re-List
                      </Button>
                    )}
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
