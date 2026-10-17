import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDeadline } from '../../utils/formatters';
import {
  Compass,
  PackagePlus,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Building2,
  Users,
  Leaf,
  CheckCircle2,
  Truck
} from 'lucide-react';

export default function LandingPage() {
  const { donations } = useApp();

  const previewDonations = donations.filter(d => d.status === 'published').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-16 overflow-hidden border-b border-ivory-300 bg-ivory-100/50">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-300 text-forest-800 text-xs sm:text-[13px] font-semibold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span>Closing the Loop on Commercial Food Waste</span>
              </div>

              <h1 className="text-[34px] sm:text-[44px] md:text-[50px] lg:text-[52px] xl:text-[56px] font-serif font-extrabold text-charcoal-900 tracking-tight leading-[1.12] max-w-[620px]">
                Safe surplus food, redistributed before{' '}
                <span className="text-forest-700 italic font-serif inline-block">it goes to waste.</span>
              </h1>

              <p className="text-base sm:text-[17px] lg:text-lg text-charcoal-700 max-w-[560px] leading-relaxed">
                FoodLoop connects commercial kitchens, canteens, and grocers with accredited community shelters and volunteer couriers through a transparent, time-sensitive redistribution network.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <Link to="/app/ngo/discover">
                  <Button variant="primary" size="lg" icon={Compass} className="w-full sm:w-auto font-semibold">
                    Browse Available Surplus
                  </Button>
                </Link>
                <Link to="/app/donor/donations/new">
                  <Button variant="terracotta" size="lg" icon={PackagePlus} className="w-full sm:w-auto font-semibold">
                    Donate Commercial Surplus
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-ivory-300/80 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[12px] sm:text-[13px] text-charcoal-700">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
                  <span className="font-medium">Good Samaritan Act Protected</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                  <span className="font-medium">100% Accredited Nonprofits</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                  <span className="font-medium">Sub-90 Min Dispatch Avg</span>
                </div>
              </div>
            </div>

            {/* Right Card Mockup Showcase */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[460px] lg:max-w-[480px] bg-white p-5 sm:p-6 rounded-2xl border border-ivory-300 shadow-lifted space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">Live Feed • SOMA Hub</span>
                  </div>
                  <span className="text-[11px] text-terracotta-700 font-semibold bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                    Updated 4m ago
                  </span>
                </div>

                {/* Featured item card snippet */}
                <div className="rounded-xl overflow-hidden border border-ivory-300 bg-ivory-50 transition-all hover:shadow-subtle">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
                      alt="Warm Roasted Chicken & Quinoa Bowls"
                      className="w-full h-40 sm:h-44 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-charcoal-800 border border-ivory-300 shadow-xs">
                      Prepared Meals
                    </div>
                    <div className="absolute bottom-3 right-3 bg-charcoal-900/85 backdrop-blur-sm text-ivory-50 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-terracotta-400" />
                      <span>Closes in 45m</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal-600">Greens & Grains Canteen</span>
                      <span className="text-forest-700 font-bold bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                        San Francisco, CA
                      </span>
                    </div>
                    <h4 className="text-[15px] font-serif font-bold text-charcoal-900 leading-snug">
                      Warm Roasted Chicken & Quinoa Bowls
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs sm:text-[13px] font-bold text-forest-800">
                        65 Meals Ready for Pickup
                      </span>
                      <Link to="/app/ngo/discover">
                        <Button size="sm" variant="primary" className="font-semibold">
                          Claim Batch
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Micro tracker card */}
                <div className="p-3 bg-ivory-100 rounded-xl border border-ivory-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-forest-100 border border-forest-200 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-forest-700" />
                    </div>
                    <div>
                      <strong className="block text-charcoal-900 text-xs">Hope Community Kitchen</strong>
                      <span className="text-[11px] text-charcoal-600">Claimed 40L Lentil Stew • Courier en route</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded border border-forest-200 shrink-0">
                    FL-8824
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Food Waste Problem & Impact */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700">
            The Redistribution Gap
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal-900">
            High quality food is discarded while local community pantries face shortages.
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            In our cities, commercial cafeterias and bakeries prepare safe, delicious meals that must be cleared at closing time due to strict rotation policies. Without digital logistics, this wholesome food ends up in landfills.
          </p>
        </div>

        {/* 3 Core Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-ivory-300 p-8 space-y-3 text-center">
            <div className="text-4xl font-serif font-extrabold text-forest-700">38%</div>
            <h4 className="text-base font-bold text-charcoal-900">Of All Food Is Never Eaten</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Nearly 40% of the edible food supply in developed metropolitan areas is lost or discarded annually.
            </p>
          </Card>

          <Card className="border-ivory-300 p-8 space-y-3 text-center">
            <div className="text-4xl font-serif font-extrabold text-terracotta-600">8%</div>
            <h4 className="text-base font-bold text-charcoal-900">Of Global Greenhouse Gases</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Decomposing food in landfills releases massive quantities of methane, a greenhouse gas 28x more potent than carbon dioxide.
            </p>
          </Card>

          <Card className="border-ivory-300 p-8 space-y-3 text-center">
            <div className="text-4xl font-serif font-extrabold text-charcoal-900">&lt; 90 min</div>
            <h4 className="text-base font-bold text-charcoal-900">The Critical Rescue Window</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              FoodLoop's time-sensitive dispatch matches surplus with nearby kitchens before cold-chain boundaries are breached.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. How FoodLoop Works (4 Steps) */}
      <section id="how-it-works" className="bg-ivory-100/70 py-16 border-y border-ivory-300">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-forest-700">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl font-serif font-bold text-charcoal-900">
              How FoodLoop Operates in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600">
              A transparent, audited coordination loop between commercial kitchens, recipient shelters, and volunteers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-ivory-300 p-6 space-y-3 relative">
              <span className="text-2xl font-serif font-bold text-forest-700">01</span>
              <h4 className="text-sm font-bold text-charcoal-900">Donor Posts Surplus</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Kitchens specify portions, allergens, packaging condition, and strict pickup deadlines.
              </p>
            </Card>

            <Card className="border-ivory-300 p-6 space-y-3 relative">
              <span className="text-2xl font-serif font-bold text-forest-700">02</span>
              <h4 className="text-sm font-bold text-charcoal-900">NGO Claims Batch</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Accredited community kitchens discover nearby food within their travel radius and confirm pickup windows.
              </p>
            </Card>

            <Card className="border-ivory-300 p-6 space-y-3 relative">
              <span className="text-2xl font-serif font-bold text-forest-700">03</span>
              <h4 className="text-sm font-bold text-charcoal-900">Verified Courier Handoff</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Volunteer or shelter transport collects food using secure single-use codes (e.g. FL-8824) and temperature checks.
              </p>
            </Card>

            <Card className="border-ivory-300 p-6 space-y-3 relative">
              <span className="text-2xl font-serif font-bold text-forest-700">04</span>
              <h4 className="text-sm font-bold text-charcoal-900">Impact Certified</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Food weight in kilograms, meals served, and CO₂ offset are recorded for compliance and ESG sustainability reports.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Live Food Listings Preview */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-forest-700">
              Live Network Surplus
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Currently Available for Rescue
            </h2>
          </div>
          <Link to="/app/ngo/discover">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Available Listings
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewDonations.map(don => (
            <Card key={don.id} padding="none" hoverable className="border-ivory-300 overflow-hidden flex flex-col justify-between">
              <div className="relative h-44 bg-ivory-200">
                <img src={don.image} alt={don.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge category={don.category} size="sm" />
                </div>
                <div className="absolute bottom-3 left-3 bg-charcoal-900/90 text-ivory-50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-terracotta-400" />
                  <span>{formatDeadline(don.pickupDeadline)}</span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase">{don.donorName}</span>
                  <h4 className="text-sm font-bold font-serif text-charcoal-900 line-clamp-1">{don.title}</h4>
                  <p className="text-xs text-charcoal-600 line-clamp-2 mt-1">{don.description}</p>
                </div>

                <div className="pt-3 border-t border-ivory-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-700">~{don.estimatedServings} Meals</span>
                  <Link to={`/app/ngo/donations/${don.id}`}>
                    <Button size="sm" variant="primary">Claim Batch</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Four Persona Portals Showcase */}
      <section className="bg-forest-900 text-ivory-100 py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-terracotta-400">
              Role-Specific Workspaces
            </span>
            <h2 className="text-3xl font-serif font-bold text-ivory-50">
              Built for Every Stakeholder in the Rescue Chain
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-300">
              Tailored workspaces engineered for operational throughput, not generic dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Donor */}
            <div className="bg-forest-800/80 p-6 rounded-2xl border border-forest-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <Building2 className="w-6 h-6 text-terracotta-400" />
                <h4 className="text-base font-serif font-bold text-ivory-50">Food Donors</h4>
                <p className="text-charcoal-300 leading-relaxed">
                  Bakeries, corporate cafeterias, and grocery stores publish listings in 60 seconds with portion counters and pickup bays.
                </p>
              </div>
              <Link to="/app/donor">
                <Button variant="ghost" size="sm" className="text-ivory-50 hover:bg-forest-700 w-full justify-between">
                  <span>Enter Donor Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {/* NGO */}
            <div className="bg-forest-800/80 p-6 rounded-2xl border border-forest-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <HeartHandshake className="w-6 h-6 text-emerald-400" />
                <h4 className="text-base font-serif font-bold text-ivory-50">Recipient NGOs</h4>
                <p className="text-charcoal-300 leading-relaxed">
                  Community kitchens and shelters browse geofenced surplus, claim whole batches, and schedule intake arrivals.
                </p>
              </div>
              <Link to="/app/ngo">
                <Button variant="ghost" size="sm" className="text-ivory-50 hover:bg-forest-700 w-full justify-between">
                  <span>Enter NGO Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {/* Volunteer */}
            <div className="bg-forest-800/80 p-6 rounded-2xl border border-forest-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <Truck className="w-6 h-6 text-terracotta-400" />
                <h4 className="text-base font-serif font-bold text-ivory-50">Volunteer Couriers</h4>
                <p className="text-charcoal-300 leading-relaxed">
                  Community drivers manage assigned tasks, execute safety checklists, and verify collection codes at loading bays.
                </p>
              </div>
              <Link to="/app/volunteer">
                <Button variant="ghost" size="sm" className="text-ivory-50 hover:bg-forest-700 w-full justify-between">
                  <span>Enter Courier Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {/* Admin */}
            <div className="bg-forest-800/80 p-6 rounded-2xl border border-forest-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
                <h4 className="text-base font-serif font-bold text-ivory-50">Platform Admins</h4>
                <p className="text-charcoal-300 leading-relaxed">
                  Governance team verifies organization credentials, investigates safety flags, and audits regional metrics.
                </p>
              </div>
              <Link to="/app/admin">
                <Button variant="ghost" size="sm" className="text-ivory-50 hover:bg-forest-700 w-full justify-between">
                  <span>Enter Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ready to Join CTA Banner */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-700 text-ivory-50 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-lifted">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold max-w-2xl mx-auto">
            Ready to stop food waste in your community?
          </h2>
          <p className="text-sm text-ivory-200 max-w-xl mx-auto leading-relaxed">
            Join the FoodLoop network today as a commercial donor, accredited nonprofit food program, or volunteer courier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register">
              <Button variant="terracotta" size="lg">
                Create Organization Account
              </Button>
            </Link>
            <Link to="/app/ngo/discover">
              <Button variant="outline" size="lg" className="border-ivory-200 text-ivory-50 hover:bg-forest-800">
                Explore Demo Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
