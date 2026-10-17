import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDateTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Building2,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  ThermometerSnowflake
} from 'lucide-react';

export default function VolunteerTaskDetailPage() {
  const { id } = useParams();
  const { pickups, updatePickupStatus } = useApp();

  const pickup = pickups.find(p => p.id === id);

  const [checklist, setChecklist] = useState({
    vehicleInspected: true,
    tempCheckPassed: true,
    containersSealed: true,
    donorCodeConfirmed: false
  });

  if (!pickup) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-serif font-bold text-charcoal-900">Task Not Found</h3>
        <Link to="/app/volunteer/tasks" className="mt-3 inline-block">
          <Button variant="primary">Return to Tasks</Button>
        </Link>
      </div>
    );
  }

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link to="/app/volunteer/tasks" className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Task List</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Instructions & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-ivory-300 p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-ivory-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-charcoal-400 uppercase">Rescue Task #{pickup.id}</span>
                <h2 className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">{pickup.donationTitle}</h2>
              </div>
              <Badge status={pickup.status} size="md" />
            </div>

            {/* Verification Code Box */}
            <div className="p-4 bg-forest-50 border border-forest-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <KeyRound className="w-6 h-6 text-forest-700" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-forest-800 block">Handoff Verification Code</span>
                  <p className="text-xs text-forest-900">Present to donor kitchen manager upon arrival.</p>
                </div>
              </div>
              <span className="text-xl font-mono font-extrabold text-forest-900 bg-white px-3 py-1 rounded-lg border border-forest-300 tracking-wider">
                {pickup.verificationCode}
              </span>
            </div>

            {/* Stepped Waypoints */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Dispatch Route</h4>

              <div className="relative pl-6 border-l-2 border-forest-700 space-y-6">
                {/* Step 1: Donor */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-forest-700 border-2 border-white" />
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">WayPoint 1: Donor Collection Point</span>
                  <h5 className="font-bold text-sm text-charcoal-900">{pickup.donorName}</h5>
                  <p className="text-xs text-charcoal-600">{pickup.donorAddress}</p>
                  <p className="text-xs text-terracotta-700 font-medium mt-1">Instructions: {pickup.notes}</p>
                </div>

                {/* Step 2: Recipient */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-terracotta-600 border-2 border-white" />
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">WayPoint 2: Destination Shelter</span>
                  <h5 className="font-bold text-sm text-charcoal-900">{pickup.recipientName}</h5>
                  <p className="text-xs text-charcoal-600">{pickup.recipientAddress}</p>
                  <p className="text-xs text-forest-700 font-medium mt-1">Staff at receiving dock will sign off on receipt.</p>
                </div>
              </div>
            </div>

            {/* Courier Safety Checklist */}
            <div className="pt-4 border-t border-ivory-200 space-y-3">
              <h4 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
                Food Safety Courier Checklist
              </h4>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-ivory-300 bg-ivory-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.vehicleInspected}
                    onChange={() => toggleCheck('vehicleInspected')}
                    className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
                  />
                  <span>Insulated thermal vehicle cargo compartment sanitized</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-ivory-300 bg-ivory-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.tempCheckPassed}
                    onChange={() => toggleCheck('tempCheckPassed')}
                    className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
                  />
                  <span>Cold-chain temperature confirmed (≤4°C chilled / ≥60°C hot held)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-ivory-300 bg-ivory-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.containersSealed}
                    onChange={() => toggleCheck('containersSealed')}
                    className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
                  />
                  <span>Containers unbroken, tamper-evident seals intact</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Workflow Actions */}
        <div className="space-y-6">
          <Card className="border-ivory-300 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 border-b border-ivory-200 pb-2">
              Progress Task Stage
            </h4>

            <div className="space-y-2">
              {pickup.status === 'assigned' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => updatePickupStatus(pickup.id, 'accepted')}
                >
                  Accept Assignment
                </Button>
              )}
              {pickup.status === 'accepted' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => updatePickupStatus(pickup.id, 'en_route')}
                >
                  Mark En Route to Donor
                </Button>
              )}
              {pickup.status === 'en_route' && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => updatePickupStatus(pickup.id, 'collected')}
                >
                  Confirm Collected from Donor
                </Button>
              )}
              {pickup.status === 'collected' && (
                <Button
                  variant="primary"
                  className="w-full"
                  icon={CheckCircle2}
                  onClick={() => updatePickupStatus(pickup.id, 'delivered')}
                >
                  Confirm Delivered to Shelter
                </Button>
              )}
              {pickup.status === 'delivered' && (
                <div className="p-3 bg-forest-50 border border-forest-200 rounded-lg text-center text-xs text-forest-900 font-bold">
                  ✓ This delivery has been successfully verified!
                </div>
              )}
            </div>
          </Card>

          <Card className="border-ivory-300 p-5 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Assigned Volunteer</span>
            <p className="font-bold text-charcoal-900">{pickup.volunteerName}</p>
            <p className="text-charcoal-600">Vehicle: {pickup.transportVehicle}</p>
            <p className="text-charcoal-600 font-mono">Contact: {pickup.volunteerPhone}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
