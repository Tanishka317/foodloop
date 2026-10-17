import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDeadline, formatDateTime } from '../../utils/formatters';
import { ArrowLeft, Clock, MapPin, CheckCircle2, XCircle, ClipboardList, ShieldCheck } from 'lucide-react';

export default function DonorDonationDetailPage() {
  const { id } = useParams();
  const { donations, requests, approveRequest, rejectRequest, updateDonationStatus } = useApp();

  const donation = donations.find(d => d.id === id);
  const relatedRequests = requests.filter(r => r.donationId === id);

  if (!donation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-serif font-bold text-charcoal-900">Listing Not Found</h3>
        <Link to="/app/donor/donations" className="mt-3 inline-block">
          <Button variant="primary">Return to Inventory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link to="/app/donor/donations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-ivory-300 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Listing #{donation.id}</span>
                <h2 className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">{donation.title}</h2>
              </div>
              <Badge status={donation.status} size="md" />
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">{donation.description}</p>

            <div className="grid grid-cols-3 gap-3 p-3.5 bg-ivory-100 rounded-xl text-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Quantity</span>
                <strong className="text-charcoal-900">{donation.quantity} {donation.unit}</strong>
              </div>
              <div className="border-x border-ivory-300">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Yield</span>
                <strong className="text-forest-700 font-bold">~{donation.estimatedServings} Meals</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Pickup Deadline</span>
                <strong className="text-terracotta-700">{formatDeadline(donation.pickupDeadline)}</strong>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-2">
              <p><strong>Storage Instructions:</strong> {donation.storageInstructions}</p>
              <p><strong>Collection Bay:</strong> {donation.pickupAddress}</p>
            </div>
          </Card>

          {/* Associated Allocation Requests */}
          <div className="space-y-4">
            <h3 className="text-base font-serif font-bold text-charcoal-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-forest-700" />
              Incoming Organization Claims ({relatedRequests.length})
            </h3>

            {relatedRequests.length === 0 ? (
              <Card className="border-ivory-300 p-6 text-center text-xs text-charcoal-500">
                No claims have been submitted for this batch yet.
              </Card>
            ) : (
              relatedRequests.map(req => (
                <Card key={req.id} className="border-ivory-300 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-charcoal-900">{req.requestingOrganizationName}</h4>
                      <p className="text-xs text-charcoal-600">
                        Requested: {req.requestedQuantity} {req.requestedUnit} • Window: {req.pickupWindow}
                      </p>
                    </div>
                    <Badge status={req.status} size="sm" />
                  </div>

                  <p className="text-xs text-charcoal-600 bg-ivory-50 p-2.5 rounded-lg border border-ivory-200">
                    "{req.notes}"
                  </p>

                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button size="sm" variant="outline" onClick={() => rejectRequest(req.id, 'Unable to approve.')}>
                        Decline
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => approveRequest(req.id, 'Approved. Ready at bay.')}>
                        Approve & Allocate
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="border-ivory-300 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 border-b border-ivory-200 pb-2">
              Listing Administration
            </h4>
            <div className="space-y-2">
              {donation.status === 'published' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => updateDonationStatus(donation.id, 'allocated')}
                >
                  Mark as Fully Allocated
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => updateDonationStatus(donation.id, 'published')}
                >
                  Reopen Listing
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
