import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Input, Textarea } from '../../components/common/FormInputs';
import { User, Building2, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, currentOrg, currentRole, updateCurrentUserProfile } = useApp();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    title: currentUser?.title || '',
    phone: currentUser?.phone || '',
    orgName: currentOrg?.name || '',
    orgAddress: currentOrg?.address || '',
    orgCity: currentOrg?.city || '',
    orgDescription: currentOrg?.description || ''
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCurrentUserProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Identity Card */}
        <Card className="border-ivory-300 p-6 space-y-5">
          <div className="flex items-center gap-4 border-b border-ivory-200 pb-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-forest-700 shadow-sm"
            />
            <div>
              <h3 className="text-lg font-serif font-bold text-charcoal-900">{currentUser?.name}</h3>
              <p className="text-xs text-charcoal-500 capitalize">{currentUser?.title || currentRole}</p>
              <span className="text-[10px] uppercase font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 inline-block mt-1">
                Active Persona: {currentRole.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Operational Role / Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              label="Direct Contact Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
        </Card>

        {/* Organization Information (if applicable) */}
        {currentOrg && (
          <Card className="border-ivory-300 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-forest-700" />
                <h3 className="text-base font-serif font-bold text-charcoal-900">
                  Registered Facility & Accreditation
                </h3>
              </div>
              <Badge status={currentOrg.verified ? 'verified' : 'unverified'} size="sm" />
            </div>

            <div className="space-y-4">
              <Input
                label="Organization / Business Name"
                value={form.orgName}
                onChange={e => setForm({ ...form, orgName: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Street Address & Loading Bay"
                  value={form.orgAddress}
                  onChange={e => setForm({ ...form, orgAddress: e.target.value })}
                  required
                />
                <Input
                  label="City, State & Postal Code"
                  value={form.orgCity}
                  onChange={e => setForm({ ...form, orgCity: e.target.value })}
                  required
                />
              </div>

              <Textarea
                label="Public Facility Description & Receiving Rules"
                value={form.orgDescription}
                onChange={e => setForm({ ...form, orgDescription: e.target.value })}
                rows={2}
              />

              {/* Geocoding indicator */}
              <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 text-xs text-charcoal-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">PostGIS Geocoded Coordinate</span>
                <p className="font-mono">Latitude: {currentOrg.latitude}, Longitude: {currentOrg.longitude}</p>
                <p className="text-[11px] text-forest-700 font-medium">✓ Precision coordinates registered for route dispatch</p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-forest-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes saved to demo session
            </span>
          )}
          <Button type="submit" variant="primary" icon={CheckCircle2}>
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
}
