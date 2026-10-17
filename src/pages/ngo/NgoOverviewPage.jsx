import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDeadline } from '../../utils/formatters';
import {
  Compass,
  Clock,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Layers,
  Building2
} from 'lucide-react';

export default function NgoOverviewPage() {
  const { donations, requests, pickups, currentOrg } = useApp();

  const myRequests = requests.filter(r => r.requestingOrganizationId === currentOrg?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const activePickups = pickups.filter(p => p.recipientId === currentOrg?.id && p.status !== 'delivered');
  const availableDonations = donations.filter(d => d.status === 'published').slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            <span>Accredited Community Food Partner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
            Welcome back, {currentOrg ? currentOrg.name : 'Hope Community Kitchen'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
            There are currently <strong>{donations.filter(d => d.status === 'published').length} safe surplus food batches</strong> available within your pickup radius.
          </p>
        </div>

        <Link to="/app/ngo/discover">
          <Button variant="primary" size="lg" icon={Compass}>
            Discover Live Surplus
          </Button>
        </Link>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Claims</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">{pendingRequests.length}</div>
          <p className="text-[11px] text-charcoal-500">Awaiting donor confirmation</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Pickups</span>
            <Truck className="w-4 h-4 text-terracotta-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">{activePickups.length}</div>
          <p className="text-[11px] text-terracotta-700 font-medium">In transit or queued today</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Meals Provided</span>
            <HeartHandshake className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">3,890</div>
          <p className="text-[11px] text-forest-700 font-medium">Estimated community yield</p>
        </Card>

        <Card className="border-ivory-300 space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Food Rescued</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-charcoal-900">1,940 kg</div>
          <p className="text-[11px] text-charcoal-500">Diverted from landfill</p>
        </Card>
      </div>

      {/* Urgent Surplus Opportunities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-charcoal-900">
              Urgent Nearby Surplus
            </h3>
            <p className="text-xs text-charcoal-500">Food nearing pickup deadlines requiring expedited claiming</p>
          </div>
          <Link to="/app/ngo/discover" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableDonations.map(don => (
            <Card key={don.id} padding="none" hoverable className="border-ivory-300 overflow-hidden flex flex-col justify-between">
              <div className="relative h-40 bg-ivory-200">
                <img src={don.image} alt={don.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge category={don.category} size="sm" />
                </div>
                <div className="absolute bottom-3 left-3 bg-charcoal-900/90 text-ivory-50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-terracotta-400" />
                  <span>{formatDeadline(don.pickupDeadline)}</span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase">{don.donorName}</span>
                  <h4 className="text-sm font-bold font-serif text-charcoal-900 line-clamp-1">{don.title}</h4>
                  <p className="text-xs text-charcoal-600 line-clamp-2">{don.description}</p>
                </div>

                <div className="pt-3 border-t border-ivory-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-700">~{don.estimatedServings} Servings</span>
                  <Link to={`/app/ngo/donations/${don.id}`}>
                    <Button size="sm" variant="outline">Inspect Batch</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Pickups Tracking Section */}
      {activePickups.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-charcoal-900">
            Live Deliveries in Progress
          </h3>
          <div className="space-y-3">
            {activePickups.map(pk => (
              <Card key={pk.id} className="border-ivory-300 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 border border-forest-200 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal-900">{pk.donationTitle}</h4>
                      <p className="text-xs text-charcoal-600">
                        From: <strong className="text-charcoal-800">{pk.donorName}</strong> • Courier: {pk.volunteerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={pk.status} size="md" />
                    <Link to="/app/ngo/pickups">
                      <Button size="sm" variant="ghost">Track Live</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
