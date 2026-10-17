import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  KeyRound
} from 'lucide-react';

export default function NgoPickupsPage() {
  const { pickups, currentOrg } = useApp();

  const myPickups = pickups.filter(p => p.recipientId === currentOrg?.id);

  const stages = [
    { id: 'assigned', label: 'Claim Assigned' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'en_route', label: 'Courier En Route' },
    { id: 'collected', label: 'Collected from Donor' },
    { id: 'delivered', label: 'Delivered & Stored' }
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'assigned': return 0;
      case 'accepted': return 1;
      case 'en_route': return 2;
      case 'collected': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-ivory-300 text-xs text-charcoal-600 flex items-center justify-between">
        <span>Managing logistics and collection tracking for <strong>{currentOrg?.name || 'Hope Kitchen'}</strong></span>
        <span className="text-forest-700 font-semibold">Cold-Chain Verification Enabled</span>
      </div>

      {myPickups.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No pickups scheduled"
          description="When your donation claims are approved by food donors, pickup tasks will appear here with live tracking."
        />
      ) : (
        <div className="space-y-6">
          {myPickups.map(pk => {
            const currentIdx = getStageIndex(pk.status);

            return (
              <Card key={pk.id} className="border-ivory-300 p-6 space-y-6">
                {/* Header with Title and Verification Code */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ivory-200 pb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      Pickup Task #{pk.id} • Scheduled {formatDateTime(pk.scheduledPickupTime)}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-charcoal-900 mt-0.5">
                      {pk.donationTitle}
                    </h3>
                  </div>

                  {/* Verification Code Box */}
                  <div className="bg-forest-50 border border-forest-200 rounded-xl px-4 py-2 flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-forest-700" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-forest-800 block">Verification Code</span>
                      <strong className="text-base font-mono font-extrabold text-forest-900 tracking-wider">
                        {pk.verificationCode}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 5-Stage Visual Progress Stepper */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {stages.map((st, idx) => {
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={st.id} className="flex-1 flex flex-col items-center text-center relative">
                          {/* Connector line */}
                          {idx < stages.length - 1 && (
                            <div
                              className={`absolute top-3.5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                                idx < currentIdx ? 'bg-forest-700' : 'bg-ivory-300'
                              }`}
                            />
                          )}

                          {/* Node circle */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                              isCurrent
                                ? 'bg-terracotta-600 text-white ring-4 ring-terracotta-100'
                                : isCompleted
                                ? 'bg-forest-700 text-ivory-50'
                                : 'bg-ivory-300 text-charcoal-500'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <span className={`text-[10px] mt-2 max-w-[80px] leading-tight ${
                            isCurrent ? 'font-bold text-terracotta-700' : isCompleted ? 'font-semibold text-charcoal-900' : 'text-charcoal-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Routing & Contact Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ivory-200 text-xs">
                  {/* Donor collection point */}
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-forest-700" />
                      Collection Location
                    </span>
                    <h5 className="font-bold text-charcoal-900">{pk.donorName}</h5>
                    <p className="text-charcoal-600 leading-relaxed">{pk.donorAddress}</p>
                    <p className="text-[11px] text-terracotta-700 font-medium">Note: {pk.notes}</p>
                  </div>

                  {/* Destination */}
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      Delivery Destination
                    </span>
                    <h5 className="font-bold text-charcoal-900">{pk.recipientName}</h5>
                    <p className="text-charcoal-600 leading-relaxed">{pk.recipientAddress}</p>
                    <p className="text-[11px] text-forest-700 font-medium">Recipient Kitchen Receiving Dock</p>
                  </div>

                  {/* Assigned Volunteer Courier */}
                  <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-forest-700" />
                      Assigned Volunteer Courier
                    </span>
                    <h5 className="font-bold text-charcoal-900">{pk.volunteerName}</h5>
                    <p className="text-charcoal-600 font-mono">{pk.volunteerPhone}</p>
                    <p className="text-[11px] text-charcoal-600">Vehicle: {pk.transportVehicle}</p>
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
