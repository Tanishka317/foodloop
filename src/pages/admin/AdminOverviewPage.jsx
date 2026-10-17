import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Building2,
  Users,
  Layers,
  ClipboardList,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { organizations, users, donations, requests, reports, setOrganizationVerification } = useApp();

  const pendingOrgs = organizations.filter(o => !o.verified);
  const activeDonations = donations.filter(d => d.status === 'published');
  const activeReports = reports.filter(r => r.status !== 'resolved');

  return (
    <div className="space-y-8">
      {/* Overview Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            <span>Platform Governance & Compliance Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900">
            System Administration Console
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
            Monitoring food safety accreditation, organization verification, donor throughput, and platform integrity across the Bay Area network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/app/admin/organizations">
            <Button variant="primary" size="md" icon={Building2}>
              Verify Organizations ({pendingOrgs.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-ivory-300 p-5 space-y-1">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orgs</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-charcoal-900">{pendingOrgs.length}</div>
          <p className="text-[11px] text-amber-700 font-semibold">Requires license check</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="text-2xl font-serif font-bold text-charcoal-900">{activeDonations.length}</div>
          <p className="text-[11px] text-forest-700 font-semibold">Published across network</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Claims Submitted</span>
            <ClipboardList className="w-4 h-4 text-charcoal-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-charcoal-900">{requests.length}</div>
          <p className="text-[11px] text-charcoal-500">Total system transactions</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Flagged Incidents</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-charcoal-900">{activeReports.length}</div>
          <p className="text-[11px] text-rose-700 font-semibold">Under active investigation</p>
        </Card>
      </div>

      {/* Pending Organizations Queue */}
      {pendingOrgs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-charcoal-900">
              Organizations Awaiting Food-Safety Verification
            </h3>
            <Link to="/app/admin/organizations" className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingOrgs.map(org => (
              <Card key={org.id} className="border-ivory-300 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-charcoal-400">
                      {org.type.toUpperCase()} • ID #{org.id}
                    </span>
                    <h4 className="text-sm font-bold text-charcoal-900">{org.name}</h4>
                    <p className="text-xs text-charcoal-600">{org.address}, {org.city}</p>
                    <p className="text-[11px] text-charcoal-500 mt-1">Contact: {org.contactPerson} ({org.phone})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOrganizationVerification(org.id, false)}
                    >
                      Reject Application
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={CheckCircle2}
                      onClick={() => setOrganizationVerification(org.id, true)}
                    >
                      Verify & Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Flagged Reports Section */}
      {activeReports.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-charcoal-900">
            Open Food Safety & Integrity Reports
          </h3>
          <div className="space-y-3">
            {activeReports.map(rep => (
              <Card key={rep.id} className="border-ivory-300 p-4 space-y-2 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal-900">Report #{rep.id}: {rep.targetTitle}</span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {rep.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-charcoal-600">{rep.reason}</p>
                <div className="text-[11px] text-charcoal-500 pt-1">Reported by: <strong>{rep.reportedBy}</strong></div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
