import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowRight, Compass } from 'lucide-react';

export default function NgoRequestsPage() {
  const { requests, donations, currentOrg, updateDonationStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const myRequests = requests.filter(r => r.requestingOrganizationId === currentOrg?.id);

  const filteredRequests = myRequests.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs">
          {['all', 'pending', 'approved', 'completed', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-forest-700 text-ivory-50 shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100'
              }`}
            >
              {st} {st !== 'all' && `(${myRequests.filter(r => r.status === st).length})`}
            </button>
          ))}
        </div>

        <Link to="/app/ngo/discover">
          <Button variant="primary" size="sm" icon={Compass}>
            Browse More Surplus
          </Button>
        </Link>
      </div>

      {/* Requests Ledger Table / Cards */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No food requests found"
          description="You haven't submitted any claims under this status category yet."
          actionLabel="Browse Available Surplus"
          onAction={() => window.location.href = '#/app/ngo/discover'}
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const donation = donations.find(d => d.id === req.donationId);

            return (
              <Card key={req.id} className="border-ivory-300 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                  <div>
                    <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      Claim Reference #{req.id} • Submitted {formatDateTime(req.createdAt)}
                    </span>
                    <h3 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">
                      {req.donationTitle}
                    </h3>
                  </div>
                  <Badge status={req.status} size="md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Claimed Amount</span>
                    <p className="font-semibold text-charcoal-900">{req.requestedQuantity} {req.requestedUnit}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Target Pickup Window</span>
                    <p className="font-semibold text-charcoal-900">{req.pickupWindow || 'Standard window'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Transport Commitment</span>
                    <p className="text-charcoal-600 line-clamp-2">{req.notes || 'Safe cold-chain transport confirmed.'}</p>
                  </div>
                </div>

                {req.approvalNote && (
                  <div className="p-3 bg-forest-50 border border-forest-200 rounded-lg text-xs text-forest-900">
                    <strong>Donor Note:</strong> {req.approvalNote}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-charcoal-500">
                    {req.status === 'approved' && (
                      <span className="text-forest-700 font-semibold">✓ Courier assigned and pickup scheduled</span>
                    )}
                    {req.status === 'pending' && (
                      <span className="text-amber-700 font-medium">⏳ Awaiting donor kitchen confirmation</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {donation && (
                      <Link to={`/app/ngo/donations/${donation.id}`}>
                        <Button size="sm" variant="ghost">View Listing</Button>
                      </Link>
                    )}
                    {req.status === 'approved' && (
                      <Link to="/app/ngo/pickups">
                        <Button size="sm" variant="primary">Track Pickup</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
