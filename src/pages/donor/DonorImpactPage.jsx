import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Award, Download, Leaf, Utensils, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';

export default function DonorImpactPage() {
  const { currentOrg, addToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Demo notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Corporate ESG Demonstration Model:</strong> Calculations align with GHG Protocol Scope 3 Category 5 waste reduction standards.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
          DEMO DATA
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-ivory-300 p-5 space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Food Diverted</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">1,840 kg</div>
          <p className="text-[11px] text-emerald-700 font-semibold">100% landfill diversion</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Meals Provided</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">3,680</div>
          <p className="text-[11px] text-forest-700 font-semibold">Distributed to 4 local shelters</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Emissions Avoided</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">4,600 kg CO₂e</div>
          <p className="text-[11px] text-terracotta-700 font-semibold">Methane prevention index</p>
        </Card>

        <Card className="border-ivory-300 p-5 space-y-1 text-center">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Estimated Tax Credit</span>
          <div className="text-2xl font-serif font-bold text-charcoal-900">$14,720</div>
          <p className="text-[11px] text-charcoal-500">Enhanced deduction value</p>
        </Card>
      </div>

      {/* Action banner */}
      <Card className="border-ivory-300 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-forest-50/50">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-forest-700" />
            Download Corporate Sustainability & Tax Deduction Package
          </h4>
          <p className="text-xs text-charcoal-600">
            Export certified receipts matching IRS Section 170(e)(3) requirements for charitable food inventory donation.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Download} onClick={() => addToast('ESG & Tax Package Downloaded (Demo)', 'success')}>
          Download Package (PDF)
        </Button>
      </Card>
    </div>
  );
}
