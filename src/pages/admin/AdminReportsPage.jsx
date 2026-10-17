import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const { reports, addToast } = useApp();
  const [localReports, setLocalReports] = useState(reports);

  const resolveReport = (id) => {
    setLocalReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    addToast('Incident report marked as investigated and resolved', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-ivory-300 text-xs text-charcoal-600">
        Quality Assurance & Incident Reporting: Investigating allergen non-disclosures, no-shows, and safety flags.
      </div>

      <div className="space-y-4">
        {localReports.map(rep => (
          <Card key={rep.id} className="border-ivory-300 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ivory-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400">Report #{rep.id}</span>
                <h4 className="text-base font-serif font-bold text-charcoal-900 mt-0.5">{rep.targetTitle}</h4>
              </div>
              <Badge status={rep.status === 'resolved' ? 'completed' : 'pending'} size="md">
                {rep.status.toUpperCase()}
              </Badge>
            </div>

            <div className="text-xs space-y-1.5">
              <p><strong>Reason:</strong> {rep.reason}</p>
              <p className="text-charcoal-500">Filed by: <strong>{rep.reportedBy}</strong> • Severity: <span className="uppercase font-semibold text-rose-700">{rep.severity}</span></p>
            </div>

            {rep.status !== 'resolved' && (
              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="primary" icon={CheckCircle2} onClick={() => resolveReport(rep.id)}>
                  Mark as Resolved & Audited
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
