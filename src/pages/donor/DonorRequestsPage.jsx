import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { ClipboardList, CheckCircle2, XCircle } from 'lucide-react';

export default function DonorRequestsPage() {
  const { requests, donations, currentOrg, approveRequest, rejectRequest } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const myDonationIds = donations.filter(d => d.donorId === currentOrg?.id).map(d => d.id);
  const myRequests = requests.filter(r => myDonationIds.includes(r.donationId));

  const filtered = myRequests.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Status filter bar */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-ivory-300 rounded-xl shadow-xs w-fit">
        {['all', 'pending', 'approved', 'rejected'].map(st => (
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No incoming requests"
          description="When accredited NGOs and community shelters claim your surplus food listings, their requests will appear here for review."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <Card key={req.id} className="border-ivory-300 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                <div>
                  <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                    Claim #{req.id} • Submitted {formatDateTime(req.createdAt)}
                  </span>
                  <h3 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">
                    {req.requestingOrganizationName}
                  </h3>
                </div>
                <Badge status={req.status} size="md" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Food Listing</span>
                  <p className="font-semibold text-charcoal-900">{req.donationTitle}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Claimed Amount</span>
                  <p className="font-semibold text-charcoal-900">{req.requestedQuantity} {req.requestedUnit}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Pickup Window</span>
                  <p className="font-semibold text-charcoal-900">{req.pickupWindow}</p>
                </div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-200 rounded-lg text-xs text-charcoal-700">
                <strong>Recipient Transport Commitment:</strong> "{req.notes}"
              </div>

              {req.status === 'pending' && (
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectRequest(req.id, 'Unable to approve.')}
                  >
                    Decline Claim
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => approveRequest(req.id, 'Approved. Ready at delivery bay.')}
                  >
                    Approve & Dispatch Courier
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
