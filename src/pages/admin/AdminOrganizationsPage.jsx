import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Building2, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function AdminOrganizationsPage() {
  const { organizations, setOrganizationVerification } = useApp();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = organizations.filter(o => {
    if (tab === 'pending' && o.verified) return false;
    if (tab === 'verified' && !o.verified) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q) || o.contactPerson.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs w-fit">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              tab === 'all' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            All Organizations ({organizations.length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              tab === 'pending' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Pending Verification ({organizations.filter(o => !o.verified).length})
          </button>
          <button
            onClick={() => setTab('verified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              tab === 'verified' ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Verified Partners ({organizations.filter(o => o.verified).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search organizations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white border border-ivory-300 rounded-xl px-3.5 py-1.5 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Address & City</th>
                <th className="px-4 py-3">Contact Person</th>
                <th className="px-4 py-3">Accreditation Status</th>
                <th className="px-4 py-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-charcoal-500">
                    No organizations match your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(org => (
                  <tr key={org.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-charcoal-900">{org.name}</div>
                      <span className="text-[11px] text-charcoal-500 font-mono">ID: {org.id}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs uppercase font-bold text-charcoal-600 bg-ivory-200 px-2 py-0.5 rounded">
                        {org.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-charcoal-800">{org.address}</div>
                      <span className="text-[11px] text-charcoal-500">{org.city}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-charcoal-900">{org.contactPerson}</div>
                      <span className="text-[11px] text-charcoal-500 font-mono">{org.phone}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <Badge status={org.verified ? 'verified' : 'unverified'} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {org.verified ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setOrganizationVerification(org.id, false)}
                        >
                          Revoke
                        </Button>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="primary"
                            icon={CheckCircle2}
                            onClick={() => setOrganizationVerification(org.id, true)}
                          >
                            Verify & Approve
                          </Button>
                        </div>
                      )}
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
