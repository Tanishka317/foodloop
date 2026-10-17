import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { RotateCcw, Bell, Shield, MapPin, Database, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { resetAllDemoData, addToast } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsUrgent, setSmsUrgent] = useState(true);
  const [coldChainAutoCheck, setColdChainAutoCheck] = useState(true);

  const handleSave = () => {
    addToast('Preferences saved successfully', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Notification Preferences */}
      <Card className="border-ivory-300 p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
          <Bell className="w-5 h-5 text-forest-700" />
          <h3 className="text-base font-serif font-bold text-charcoal-900">
            Dispatch & Allocation Alerts
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-ivory-300 bg-ivory-50/70 cursor-pointer">
            <div>
              <span className="font-bold text-charcoal-900 block">Immediate Surplus Claim Notifications</span>
              <span className="text-charcoal-500">Receive alerts when commercial donors within 5 km post new surplus batches</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-ivory-300 bg-ivory-50/70 cursor-pointer">
            <div>
              <span className="font-bold text-charcoal-900 block">Critical Expiration Countdown Alerts</span>
              <span className="text-charcoal-500">Urgent notifications when food is within 90 minutes of pickup deadline</span>
            </div>
            <input
              type="checkbox"
              checked={smsUrgent}
              onChange={e => setSmsUrgent(e.target.checked)}
              className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
            />
          </label>
        </div>
      </Card>

      {/* Food Safety & Cold Chain Enforcement */}
      <Card className="border-ivory-300 p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
          <Shield className="w-5 h-5 text-forest-700" />
          <h3 className="text-base font-serif font-bold text-charcoal-900">
            Food Safety Compliance Settings
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-ivory-300 bg-ivory-50/70 cursor-pointer">
            <div>
              <span className="font-bold text-charcoal-900 block">Mandatory Cold-Chain Checklists</span>
              <span className="text-charcoal-500">Require volunteer couriers to confirm temperature compliance prior to handover</span>
            </div>
            <input
              type="checkbox"
              checked={coldChainAutoCheck}
              onChange={e => setColdChainAutoCheck(e.target.checked)}
              className="rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Demo State Control */}
      <Card className="border-ivory-300 p-6 space-y-4 bg-ivory-100/60">
        <div className="flex items-center gap-2 border-b border-ivory-200 pb-3">
          <Database className="w-5 h-5 text-charcoal-700" />
          <h3 className="text-base font-serif font-bold text-charcoal-900">
            Portfolio Demo State Management
          </h3>
        </div>

        <p className="text-xs text-charcoal-600 leading-relaxed">
          All changes made during this session (claims created, donations posted, status updates) are persisted locally in your browser. You can reset to the pristine initial domain seed at any time.
        </p>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={resetAllDemoData}
          >
            Reset All Demo Data to Seed Baseline
          </Button>
        </div>
      </Card>
    </div>
  );
}
