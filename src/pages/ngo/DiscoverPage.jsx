import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select, Textarea } from '../../components/common/FormInputs';
import { formatDeadline, formatTimeRange, calculateDistance } from '../../utils/formatters';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Map as MapIcon,
  LayoutGrid,
  List as ListIcon,
  ChefHat,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function DiscoverPage() {
  const { donations, submitRequest, currentOrg } = useApp();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [sortBy, setSortBy] = useState('deadline');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  const [selectedPinId, setSelectedPinId] = useState(null);

  // Claim Request Modal State
  const [claimingDonation, setClaimingDonation] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [claimPickupWindow, setClaimPickupWindow] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Reference coordinates for Hope Kitchen
  const userLat = currentOrg?.latitude || 37.7792;
  const userLng = currentOrg?.longitude || -122.4082;

  // Filter and sort donations
  const filteredDonations = useMemo(() => {
    return donations
      .filter(item => {
        // Exclude completed or expired
        if (item.status === 'completed' || item.status === 'expired') return false;

        // Search text
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDonor = item.donorName.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTags = item.dietaryTags?.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDonor && !matchDesc && !matchTags) return false;
        }

        // Category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Distance check
        const dist = calculateDistance(userLat, userLng, item.latitude, item.longitude);
        if (dist !== null && dist > maxDistanceKm) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.pickupDeadline) - new Date(b.pickupDeadline);
        }
        if (sortBy === 'quantity') {
          return b.estimatedServings - a.estimatedServings;
        }
        if (sortBy === 'distance') {
          const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude) || 0;
          const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude) || 0;
          return distA - distB;
        }
        return 0;
      });
  }, [donations, searchTerm, selectedCategory, maxDistanceKm, sortBy, userLat, userLng]);

  const categories = [
    { id: 'all', label: 'All Surplus' },
    { id: 'prepared', label: 'Prepared Meals' },
    { id: 'bakery', label: 'Bakery & Bread' },
    { id: 'produce', label: 'Fresh Produce' },
    { id: 'dairy', label: 'Dairy & Chilled' },
    { id: 'packaged', label: 'Pantry / Shelf Stable' }
  ];

  const handleOpenClaim = (donation) => {
    setClaimingDonation(donation);
    setClaimQuantity(donation.quantity);
    setClaimPickupWindow('Today between 15:00 and 17:30');
    setClaimNotes('We will transport this food in insulated temperature-safe containers.');
  };

  const handleConfirmClaim = async (e) => {
    e.preventDefault();
    if (!claimingDonation) return;

    setSubmittingClaim(true);
    try {
      await submitRequest({
        donationId: claimingDonation.id,
        requestedQuantity: Number(claimQuantity),
        pickupWindow: claimPickupWindow,
        notes: claimNotes
      });
      setClaimingDonation(null);
    } catch {
      // Toast already handled by context
    } finally {
      setSubmittingClaim(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-ivory-300 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by food type, donor name, or dietary tags (e.g. Halal, Vegan)..."
              className="w-full bg-ivory-50 border border-ivory-300 rounded-xl pl-10 pr-4 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Distance and Sort */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-600 bg-ivory-100 px-3 py-2 rounded-xl border border-ivory-300">
              <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Radius:</span>
              <select
                value={maxDistanceKm}
                onChange={e => setMaxDistanceKm(Number(e.target.value))}
                className="bg-transparent font-semibold text-charcoal-900 focus:outline-none cursor-pointer"
              >
                <option value={3}>Within 3 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-charcoal-600 bg-ivory-100 px-3 py-2 rounded-xl border border-ivory-300">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-charcoal-900 focus:outline-none cursor-pointer"
              >
                <option value="deadline">Earliest Deadline</option>
                <option value="quantity">Largest Servings</option>
                <option value="distance">Nearest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-ivory-300 rounded-xl p-0.5 bg-ivory-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-forest-800 shadow-xs font-semibold' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-white text-forest-800 shadow-xs font-semibold' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
                title="Table/List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'map' ? 'bg-white text-forest-800 shadow-xs font-semibold' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
                title="Interactive Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-forest-700 text-ivory-50 border-forest-700 font-semibold shadow-xs'
                    : 'bg-ivory-50 text-charcoal-700 border-ivory-300 hover:bg-ivory-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Results Count & Urgency notice */}
      <div className="flex items-center justify-between text-xs text-charcoal-600 px-1">
        <p>
          Showing <strong className="text-charcoal-900">{filteredDonations.length}</strong> active food batches available for rescue
        </p>
        <span className="inline-flex items-center gap-1.5 text-terracotta-700 font-medium">
          <Clock className="w-3.5 h-3.5" />
          Urgent: Food nearing pickup deadlines must be claimed promptly
        </span>
      </div>

      {/* Interactive Simulated Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-2xl border border-ivory-300 p-4 shadow-subtle space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-ivory-200 pb-3">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-forest-700" />
              <span className="font-semibold text-charcoal-900">PostGIS Location Dispatch Map (Simulated Markers)</span>
            </div>
            <span className="text-charcoal-500 text-[11px]">
              Center: Hope Community Kitchen (SOMA, San Francisco)
            </span>
          </div>

          {/* Interactive Map Visual Grid Canvas */}
          <div className="relative h-72 sm:h-80 w-full bg-[#E8E6DB] rounded-xl overflow-hidden border border-ivory-400 flex items-center justify-center select-none">
            {/* Grid styling to look like a clean cartographic blueprint */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#245744_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-ivory-400/80 -translate-y-1/2" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-ivory-400/80 -translate-x-1/2" />

            {/* NGO Home Marker */}
            <div className="absolute left-[48%] top-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-forest-800 text-ivory-50 border-2 border-white flex items-center justify-center shadow-lifted">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-forest-900 text-white px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">
                You: Hope Kitchen
              </span>
            </div>

            {/* Donation Pins */}
            {filteredDonations.map((don, idx) => {
              // Simulated pin offsets
              const offsets = [
                { left: '32%', top: '35%' },
                { left: '65%', top: '28%' },
                { left: '42%', top: '68%' },
                { left: '72%', top: '60%' },
                { left: '25%', top: '55%' },
                { left: '55%', top: '40%' },
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = selectedPinId === don.id;

              return (
                <div
                  key={don.id}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => setSelectedPinId(don.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 z-20 ${
                    isSelected ? 'scale-110' : ''
                  }`}
                >
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lifted border-2 border-white ${
                    isSelected ? 'bg-terracotta-600 text-white' : 'bg-forest-700 text-ivory-50'
                  }`}>
                    <MapPin className="w-3 h-3" />
                    <span>{don.estimatedServings} servings</span>
                  </div>
                  <span className="text-[9px] font-semibold text-charcoal-800 bg-white/90 px-1.5 py-0.2 rounded shadow-xs mt-0.5 max-w-[110px] truncate">
                    {don.donorName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Pin Details Preview */}
          {selectedPinId && (() => {
            const don = filteredDonations.find(d => d.id === selectedPinId);
            if (!don) return null;
            return (
              <div className="p-3.5 rounded-xl bg-ivory-100 border border-ivory-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={don.image} alt={don.title} className="w-12 h-12 rounded-lg object-cover border border-ivory-300" />
                  <div>
                    <h5 className="text-xs font-bold text-charcoal-900">{don.title}</h5>
                    <p className="text-[11px] text-charcoal-600">{don.donorName} • {formatDeadline(don.pickupDeadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link to={`/app/ngo/donations/${don.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                  <Button size="sm" variant="primary" onClick={() => handleOpenClaim(don)}>Claim Now</Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Main Grid or List View */}
      {filteredDonations.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No surplus food matching filters"
          description="Try broadening your search term, extending the distance radius, or checking another category."
          actionLabel="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setMaxDistanceKm(25);
          }}
        />
      ) : viewMode === 'list' ? (
        /* List / Table Mode */
        <div className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-ivory-100 text-charcoal-800 font-semibold border-b border-ivory-300">
                <tr>
                  <th className="px-4 py-3">Food Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Servings & Quantity</th>
                  <th className="px-4 py-3">Donor & Location</th>
                  <th className="px-4 py-3">Pickup Deadline</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredDonations.map(don => {
                  const dist = calculateDistance(userLat, userLng, don.latitude, don.longitude);
                  return (
                    <tr key={don.id} className="hover:bg-ivory-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={don.image} alt={don.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-ivory-300" />
                          <div>
                            <Link to={`/app/ngo/donations/${don.id}`} className="font-semibold text-charcoal-900 hover:text-forest-700 line-clamp-1">
                              {don.title}
                            </Link>
                            <span className="text-[11px] text-charcoal-500 line-clamp-1">{don.storageInstructions}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge category={don.category} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-charcoal-900">{don.quantity} {don.unit}</div>
                        <span className="text-[11px] text-forest-700 font-medium">~{don.estimatedServings} meals</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-charcoal-900">{don.donorName}</div>
                        <span className="text-[11px] text-charcoal-500">{dist ? `${dist} km away` : don.pickupAddress}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-terracotta-700">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDeadline(don.pickupDeadline)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/app/ngo/donations/${don.id}`}>
                            <Button size="sm" variant="ghost">Inspect</Button>
                          </Link>
                          <Button size="sm" variant="primary" onClick={() => handleOpenClaim(don)}>
                            Claim
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode (Card Showcase) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map(don => {
            const dist = calculateDistance(userLat, userLng, don.latitude, don.longitude);
            const isAllocated = don.status === 'allocated';

            return (
              <Card
                key={don.id}
                padding="none"
                hoverable
                className="flex flex-col h-full overflow-hidden group border-ivory-300"
              >
                {/* Image Banner */}
                <div className="relative h-44 w-full bg-ivory-200 overflow-hidden">
                  <img
                    src={don.image}
                    alt={don.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <Badge category={don.category} size="sm" />
                  </div>

                  {/* Deadline Urgency Pill */}
                  <div className="absolute bottom-3 left-3 bg-charcoal-900/85 backdrop-blur-sm text-ivory-50 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-terracotta-400" />
                    <span>{formatDeadline(don.pickupDeadline)}</span>
                  </div>

                  {/* Distance pill */}
                  {dist !== null && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-charcoal-800 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-ivory-300">
                      <MapPin className="w-3 h-3 text-forest-700" />
                      <span>{dist} km</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-charcoal-500">
                      <span className="font-semibold text-charcoal-700 truncate max-w-[200px]">{don.donorName}</span>
                      <span>{don.workflowType === 'instant_claim' ? '⚡ Instant Claim' : '📋 Review Req.'}</span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-charcoal-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {don.title}
                    </h3>

                    <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                      {don.description}
                    </p>

                    {/* Quantity & Servings Bar */}
                    <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-300/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">Available</span>
                        <strong className="text-charcoal-900 font-bold">{don.quantity} {don.unit}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">Yield</span>
                        <strong className="text-forest-700 font-bold">~{don.estimatedServings} Meals</strong>
                      </div>
                    </div>

                    {/* Dietary Tags */}
                    {don.dietaryTags && don.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {don.dietaryTags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-forest-50 text-forest-800 px-2 py-0.5 rounded border border-forest-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-ivory-200 flex items-center justify-between gap-2">
                    <Link to={`/app/ngo/donations/${don.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Details
                      </Button>
                    </Link>
                    <Button
                      variant={isAllocated ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={isAllocated}
                      onClick={() => handleOpenClaim(don)}
                      className="flex-1"
                    >
                      {isAllocated ? 'Allocated' : 'Claim Food'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Multi-Step Claim & Reservation Flow Modal */}
      {claimingDonation && (
        <Modal
          isOpen={true}
          onClose={() => !submittingClaim && setClaimingDonation(null)}
          title="Confirm Food Claim & Allocation"
          subtitle={`Claiming surplus food from ${claimingDonation.donorName}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleConfirmClaim} className="space-y-4">
            {/* Summary preview */}
            <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 flex items-center gap-3">
              <img src={claimingDonation.image} alt={claimingDonation.title} className="w-12 h-12 rounded-lg object-cover border border-ivory-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-charcoal-900 truncate">{claimingDonation.title}</h4>
                <p className="text-[11px] text-charcoal-600">Total batch: {claimingDonation.quantity} {claimingDonation.unit} (~{claimingDonation.estimatedServings} servings)</p>
                <p className="text-[10px] text-terracotta-700 font-semibold">{formatDeadline(claimingDonation.pickupDeadline)}</p>
              </div>
            </div>

            {/* Quantity allocation field */}
            <div className="space-y-1">
              <Input
                label={`Quantity to Claim (Max: ${claimingDonation.quantity} ${claimingDonation.unit})`}
                type="number"
                min="1"
                max={claimingDonation.quantity}
                value={claimQuantity}
                onChange={e => setClaimQuantity(e.target.value)}
                required
              />
              <p className="text-[11px] text-charcoal-500">
                Estimated meals you will provide: <strong>~{Math.round((claimQuantity / claimingDonation.quantity) * claimingDonation.estimatedServings)} meals</strong>
              </p>
            </div>

            {/* Pickup window proposal */}
            <Input
              label="Proposed Pickup Arrival Window"
              value={claimPickupWindow}
              onChange={e => setClaimPickupWindow(e.target.value)}
              placeholder="e.g. Today between 16:00 and 17:00"
              required
              helper="Must fall before the donor's collection deadline."
            />

            {/* Handling note & transport method */}
            <Textarea
              label="Transportation & Storage Confirmation"
              value={claimNotes}
              onChange={e => setClaimNotes(e.target.value)}
              rows={2}
              required
              helper="Confirm safe handling (insulated cooler bags, refrigerated van, etc.)."
            />

            {/* Safe handling pledge checkbox */}
            <div className="p-3 bg-forest-50/70 border border-forest-200 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-forest-900 leading-relaxed">
                By submitting, your organization commits to adhering to local health safety guidelines and picking up the food within the designated window.
              </p>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-ivory-300 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setClaimingDonation(null)}
                disabled={submittingClaim}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submittingClaim}
                icon={CheckCircle2}
              >
                {claimingDonation.workflowType === 'instant_claim' ? 'Confirm Instant Claim' : 'Submit Claim Request'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
