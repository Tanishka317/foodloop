import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/FormInputs';
import { formatDeadline, formatTimeRange, formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Building2,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Info,
  ChevronRight,
  Share2,
  Sparkles,
  Utensils
} from 'lucide-react';

export default function DonationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donations, submitRequest } = useApp();

  const donation = donations.find(d => d.id === id);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimQuantity, setClaimQuantity] = useState(donation ? donation.quantity : 1);
  const [claimPickupWindow, setClaimPickupWindow] = useState('Today between 15:30 and 17:00');
  const [claimNotes, setClaimNotes] = useState('Our team will collect this in insulated transport bins.');
  const [submitting, setSubmitting] = useState(false);

  if (!donation) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-serif font-bold text-charcoal-900">Donation Listing Not Found</h2>
        <p className="text-sm text-charcoal-600">The listing may have expired or been removed from the network.</p>
        <Link to="/app/ngo/discover">
          <Button variant="primary">Return to Discovery</Button>
        </Link>
      </div>
    );
  }

  const isAllocated = donation.status === 'allocated';
  const isCompleted = donation.status === 'completed';

  const handleClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitRequest({
        donationId: donation.id,
        requestedQuantity: Number(claimQuantity),
        pickupWindow: claimPickupWindow,
        notes: claimNotes
      });
      setClaimModalOpen(false);
      navigate('/app/ngo/requests');
    } catch {
      // Toast handled by context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link to="/app/ngo/discover" className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surplus Discovery</span>
        </Link>
      </div>

      {/* Main Listing Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Primary Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="none" className="overflow-hidden border-ivory-300">
            <div className="relative h-72 sm:h-80 w-full bg-ivory-200">
              <img
                src={donation.image}
                alt={donation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge category={donation.category} size="md" />
                <Badge status={donation.status} size="md" />
              </div>
              <div className="absolute bottom-4 left-4 bg-charcoal-900/90 text-ivory-50 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-terracotta-400" />
                <span>Deadline: {formatDeadline(donation.pickupDeadline)}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">
                  Surplus Food Batch #{donation.id}
                </span>
                <h1 className="text-2xl font-serif font-bold text-charcoal-900 mt-1">
                  {donation.title}
                </h1>
                <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">
                  {donation.description}
                </p>
              </div>

              {/* Yield & Portion Box */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-ivory-100 rounded-xl border border-ivory-300 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Total Quantity</span>
                  <strong className="text-base font-bold text-charcoal-900">{donation.quantity} {donation.unit}</strong>
                </div>
                <div className="border-x border-ivory-300">
                  <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Estimated Servings</span>
                  <strong className="text-base font-bold text-forest-700">~{donation.estimatedServings} Meals</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Total Weight</span>
                  <strong className="text-base font-bold text-charcoal-900">~{donation.estimatedWeightKg || Math.round(donation.quantity * 0.5)} kg</strong>
                </div>
              </div>

              {/* Storage & Allergens */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-ivory-50 border border-ivory-300 space-y-2">
                  <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-4 h-4 text-forest-700" />
                    Storage & Transport Protocol
                  </h4>
                  <p className="text-xs text-charcoal-700 leading-relaxed">
                    {donation.storageInstructions}
                  </p>
                </div>

                {/* Dietary and Allergens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-ivory-300 bg-white">
                    <h5 className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">Dietary Tags</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {donation.dietaryTags?.map((tag, i) => (
                        <span key={i} className="text-xs font-medium px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-ivory-300 bg-white">
                    <h5 className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-2">Declared Allergens</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {donation.allergens?.map((al, i) => (
                        <span key={i} className="text-xs font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                          {al}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Donor Information & Claim CTA Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="border-ivory-300 space-y-5">
            <h3 className="text-base font-serif font-bold text-charcoal-900 border-b border-ivory-300 pb-3">
              Redistribution Action
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Availability:</span>
                <span className="font-bold text-forest-700">{donation.status === 'published' ? 'Ready for claim' : donation.status}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Workflow:</span>
                <span className="font-semibold text-charcoal-900">
                  {donation.workflowType === 'instant_claim' ? '⚡ Instant Allocation' : '📋 Donor Review Required'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Pickup Deadline:</span>
                <span className="font-semibold text-terracotta-700">{formatDeadline(donation.pickupDeadline)}</span>
              </div>
            </div>

            <Button
              variant={isAllocated || isCompleted ? 'secondary' : 'primary'}
              size="lg"
              disabled={isAllocated || isCompleted}
              onClick={() => setClaimModalOpen(true)}
              className="w-full"
              icon={CheckCircle2}
            >
              {isAllocated ? 'Already Allocated' : isCompleted ? 'Collection Completed' : 'Claim This Food'}
            </Button>

            <p className="text-[11px] text-charcoal-500 text-center leading-relaxed">
              No fees or transaction costs. FoodLoop is a 100% nonprofit surplus distribution network.
            </p>
          </Card>

          {/* Donor Profile Card */}
          <Card className="border-ivory-300 space-y-4">
            <div className="flex items-center gap-2 border-b border-ivory-300 pb-3">
              <Building2 className="w-4 h-4 text-forest-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Donor Information</h4>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-charcoal-900">{donation.donorName}</h4>
              <p className="text-xs text-charcoal-600 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                <span>{donation.pickupAddress}</span>
              </p>
            </div>

            {/* Simulated Location Coordinates */}
            <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block">PostGIS Geocoded Point</span>
              <p className="font-mono text-charcoal-700">
                LAT: {donation.latitude.toFixed(4)}, LON: {donation.longitude.toFixed(4)}
              </p>
              <p className="text-[10px] text-forest-700 font-medium">✓ Verified Commercial Kitchen Facility</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setClaimModalOpen(false)}
          title="Confirm Food Claim"
          subtitle={`Requesting surplus food from ${donation.donorName}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleClaim} className="space-y-4">
            <Input
              label={`Portion Quantity (Max: ${donation.quantity} ${donation.unit})`}
              type="number"
              min="1"
              max={donation.quantity}
              value={claimQuantity}
              onChange={e => setClaimQuantity(e.target.value)}
              required
            />
            <Input
              label="Pickup Arrival Window"
              value={claimPickupWindow}
              onChange={e => setClaimPickupWindow(e.target.value)}
              required
              helper="Must occur before the donor pickup deadline."
            />
            <Textarea
              label="Notes & Safe Transport Confirmation"
              value={claimNotes}
              onChange={e => setClaimNotes(e.target.value)}
              required
              rows={2}
            />

            <div className="pt-3 border-t border-ivory-300 flex items-center justify-end gap-2.5">
              <Button type="button" variant="ghost" onClick={() => setClaimModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>Submit Claim Request</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
