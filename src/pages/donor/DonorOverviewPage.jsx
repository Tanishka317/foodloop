import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageAdapter } from '../../services/storageAdapter';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDeadline, formatDateTime } from '../../utils/formatters';
import {
  PackagePlus,
  Layers,
  ClipboardList,
  Truck,
  Leaf,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function DonorOverviewPage() {
  const { donations, requests, pickups, currentOrg, approveRequest, rejectRequest } = useApp();

  const dbOrgId = currentOrg?.databaseOrgId || StorageAdapter.getDatabaseOrgId(currentOrg);
  const myDonations = donations.filter(
    (d) => d.donorId === currentOrg?.id || (dbOrgId && d.donorId === dbOrgId)
  );
  const activeDonations = myDonations.filter(d => d.status === 'published');
  
  // Incoming requests for my donations
  const myDonationIds = myDonations.map(d => d.id);
  const incomingRequests = requests.filter(r => myDonationIds.includes(r.donationId));
  const pendingRequests = incomingRequests.filter(r => r.status === 'pending');

  const scheduledPickups = pickups.filter(p => p.donorId === currentOrg?.id && p.status !== 'delivered');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            <span>Certified Food Donor Partner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
            {currentOrg ? currentOrg.name : 'The Daily Harvest Bakery & Kitchen'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
            Your commercial kitchen has diverted <strong>1,840 kg of surplus food</strong> to date, providing over 3,600 meals to local community kitchens.
          </p>
        </div>

        <Link to="/app/donor/donations/new">
          <Button variant="terracotta" size="lg" icon={PackagePlus}>
            List Surplus Food
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">{activeDonations.length}</div>
          <p className="text-[11px] text-forest-700 font-medium">Available on network</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Requests</span>
            <ClipboardList className="w-4 h-4 text-terracotta-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">{pendingRequests.length}</div>
          <p className="text-[11px] text-terracotta-700 font-medium">Require your review</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pickups Today</span>
            <Truck className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">{scheduledPickups.length}</div>
          <p className="text-[11px] text-charcoal-500">Coordinated collection slots</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Meals Provided</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">3,680</div>
          <p className="text-[11px] text-charcoal-500">Lifetime community impact</p>
        </Card>
      </div>

      {/* Pending Requests Triage */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-charcoal-900">
              Incoming Allocation Requests ({pendingRequests.length})
            </h3>
            <Link to="/app/donor/requests" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
              <span>View All Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRequests.map(req => (
              <Card key={req.id} className="border-ivory-300 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Request #{req.id}</span>
                    <h4 className="text-sm font-bold text-charcoal-900">{req.requestingOrganizationName}</h4>
                    <p className="text-xs text-charcoal-600">
                      Requested: <strong className="text-charcoal-900">{req.requestedQuantity} {req.requestedUnit}</strong> of "{req.donationTitle}"
                    </p>
                    <p className="text-[11px] text-charcoal-500 mt-1">Proposed window: {req.pickupWindow}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectRequest(req.id, 'Unable to accommodate requested window.')}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approveRequest(req.id, 'Approved. Ready at delivery bay.')}
                    >
                      Approve & Dispatch
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-charcoal-900">
            Active Food Listings ({activeDonations.length})
          </h3>
          <Link to="/app/donor/donations" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
            <span>Manage Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myDonations.slice(0, 3).map(don => (
            <Card key={don.id} padding="none" hoverable className="border-ivory-300 overflow-hidden flex flex-col justify-between">
              <div className="relative h-40 bg-ivory-200">
                <img src={don.image} alt={don.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge status={don.status} size="sm" />
                </div>
                <div className="absolute bottom-3 left-3 bg-charcoal-900/90 text-ivory-50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-terracotta-400" />
                  <span>{formatDeadline(don.pickupDeadline)}</span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold font-serif text-charcoal-900 line-clamp-1">{don.title}</h4>
                  <p className="text-xs text-charcoal-600 line-clamp-2 mt-1">{don.description}</p>
                  <p className="text-xs text-forest-700 font-semibold mt-2">{don.quantity} {don.unit} (~{don.estimatedServings} servings)</p>
                </div>

                <div className="pt-3 border-t border-ivory-200 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-500">{don.pickupAddress}</span>
                  <Link to={`/app/donor/donations/${don.id}`}>
                    <Button size="sm" variant="ghost">Manage</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
