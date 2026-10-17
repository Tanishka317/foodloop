import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Award, Download, Leaf, Utensils, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export default function NgoImpactPage() {
  const { currentOrg, addToast } = useApp();

  const handleDownloadCertificate = () => {
    addToast('ESG & Sustainability Certificate downloaded (Demo Mode)', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Demo Data Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demonstration Impact Model:</strong> Metrics are modeled based on standard EPA WARM and ReFED food rescue emission benchmarks.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
          DEMO DATA
        </span>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-ivory-300 p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-700 mx-auto flex items-center justify-center mb-2">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-charcoal-400 block">Total Meals Served</span>
          <div className="text-3xl font-serif font-extrabold text-charcoal-900">3,890</div>
          <p className="text-xs text-forest-700 font-medium">Nutritious meals provided to families</p>
        </Card>

        <Card className="border-ivory-300 p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-2">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-charcoal-400 block">Food Diverted</span>
          <div className="text-3xl font-serif font-extrabold text-charcoal-900">1,940 kg</div>
          <p className="text-xs text-emerald-700 font-medium">Prevented from organic waste stream</p>
        </Card>

        <Card className="border-ivory-300 p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-terracotta-50 text-terracotta-700 mx-auto flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold tracking-wider text-charcoal-400 block">CO₂e Avoided</span>
          <div className="text-3xl font-serif font-extrabold text-charcoal-900">4,850 kg</div>
          <p className="text-xs text-terracotta-700 font-medium">Equivalent to 12,000 miles driven</p>
        </Card>
      </div>

      {/* Breakdown by Food Category */}
      <Card className="border-ivory-300 p-6 space-y-5">
        <h4 className="text-base font-serif font-bold text-charcoal-900 border-b border-ivory-200 pb-3">
          Surplus Redistribution by Food Category
        </h4>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-charcoal-800">Fresh Produce & Vegetables</span>
              <span className="text-charcoal-600">820 kg (42%)</span>
            </div>
            <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-charcoal-800">Prepared Kitchen Meals & Soups</span>
              <span className="text-charcoal-600">580 kg (30%)</span>
            </div>
            <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-terracotta-500 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-charcoal-800">Bakery & Grains</span>
              <span className="text-charcoal-600">340 kg (18%)</span>
            </div>
            <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-charcoal-800">Dairy & Chilled Staples</span>
              <span className="text-charcoal-600">200 kg (10%)</span>
            </div>
            <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Certificate Download Card */}
      <Card className="border-ivory-300 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-forest-50/50">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-forest-700" />
            Download Verified Impact Statement
          </h4>
          <p className="text-xs text-charcoal-600">
            Generate an accredited quarterly certificate documenting your community hunger relief and sustainability metrics.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Download} onClick={handleDownloadCertificate}>
          Download Statement (PDF)
        </Button>
      </Card>
    </div>
  );
}
