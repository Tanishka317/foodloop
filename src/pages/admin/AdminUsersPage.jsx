import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Users, Search, Mail, Phone } from 'lucide-react';

export default function AdminUsersPage() {
  const { users } = useApp();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs w-fit">
          {['all', 'ngo', 'donor', 'volunteer', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                roleFilter === r ? 'bg-forest-700 text-ivory-50 shadow-xs' : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search user name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white border border-ivory-300 rounded-xl px-3.5 py-1.5 text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 w-full sm:w-64"
        />
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Account ID</th>
                <th className="px-4 py-3 text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-ivory-300" />
                      <div>
                        <div className="font-bold text-charcoal-900">{u.name}</div>
                        <span className="text-[11px] text-charcoal-500">{u.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs uppercase font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-charcoal-800">{u.email}</div>
                    <span className="text-[11px] text-charcoal-500 font-mono">{u.phone}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-charcoal-500">
                    {u.id}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="text-xs text-emerald-700 font-semibold">Active & Verified</span>
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
