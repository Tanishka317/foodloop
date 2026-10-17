import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { Truck, KeyRound, Building2, Phone, CheckCircle2 } from 'lucide-react';

export default function DonorPickupsPage() {
  const { pickups, currentOrg } = useApp();

  const myPickups = pickups.filter(p => p.donorId === currentOrg?.id && p.status !== 'delivered');

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-ivory-300 text-xs text-charcoal-600 flex items-center justify-between">
        <span>Loading Dock Collection Schedule for <strong>{currentOrg?.name || 'Daily Harvest'}</strong></span>
        <span className="text-forest-700 font-semibold">Verify Courier Code Before Handover</span>
      </div>

      {myPickups.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No active collections today"
          description="Approved donation claims will appear here with scheduled pickup windows and courier details."
        />
      ) : (
        <div className="space-y-4">
          {myPickups.map(pk => (
            <Card key={pk.id} className="border-ivory-300 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">Task #{pk.id}</span>
                  <h3 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">{pk.donationTitle}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-forest-50 border border-forest-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-forest-700" />
                    <span className="text-xs font-mono font-bold text-forest-900">Code: {pk.verificationCode}</span>
                  </div>
                  <Badge status={pk.status} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Recipient Shelter</span>
                  <p className="font-semibold text-charcoal-900">{pk.recipientName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Scheduled Window</span>
                  <p className="font-semibold text-charcoal-900">{formatDateTime(pk.scheduledPickupTime)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Courier Contact</span>
                  <p className="font-semibold text-charcoal-900">{pk.volunteerName} ({pk.volunteerPhone})</p>
                </div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-200 rounded-lg text-xs text-charcoal-600">
                <strong>Dock Instructions:</strong> {pk.notes}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
