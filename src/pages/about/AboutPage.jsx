import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ShieldCheck, HeartHandshake, Database, MapPin, Scale, Leaf, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
          Our Purpose & Infrastructure
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-charcoal-900 leading-tight">
          Eliminating hunger by solving the last-mile logistics of surplus food.
        </h1>
        <p className="text-base text-charcoal-700 leading-relaxed">
          FoodLoop is an open civic technology platform that transforms edible commercial surplus into timely community meals through verified, cold-chain-conscious redistribution.
        </p>
      </div>

      {/* The Legal & Safety Framework */}
      <Card className="border-ivory-300 p-8 space-y-4 bg-white shadow-subtle">
        <div className="flex items-center gap-3 border-b border-ivory-200 pb-3">
          <Scale className="w-6 h-6 text-forest-700" />
          <h2 className="text-lg font-serif font-bold text-charcoal-900">
            Legal Liability Protection: Good Samaritan Legislation
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          In the United States, commercial donors are federally protected under the <strong>Bill Emerson Good Samaritan Food Donation Act</strong> (42 U.S. Code § 1791). This law shields restaurants, caterers, groceries, and corporate canteens from civil and criminal liability when donating safe food in good faith to nonprofit organizations. FoodLoop enforces this standard by requiring all recipient partners to be accredited 501(c)(3) charities with verified food-handling permits.
        </p>
      </Card>

      {/* Engineering & PostGIS Architecture Roadmap */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-terracotta-600">
            System Design Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Engineered for Spatial Intelligence & High Throughput
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-ivory-300 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">PostgreSQL + PostGIS</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Spatial indexing via PostGIS geometries allows sub-millisecond geofenced queries (<code className="text-xs font-mono bg-ivory-200 px-1 py-0.5 rounded">ST_DWithin</code>) to pair short-lived hot food with the nearest active volunteer couriers.
            </p>
          </Card>

          <Card className="border-ivory-300 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">Decoupled REST API</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              The frontend client communicates with future Node.js / Express microservices through isolated domain service modules, supporting standard OpenAPI 3.0 documentation.
            </p>
          </Card>

          <Card className="border-ivory-300 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">Audit Proof Logging</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Every status step (<code className="text-xs font-mono bg-ivory-200 px-1 py-0.5 rounded">Allocated</code>, <code className="text-xs font-mono bg-ivory-200 px-1 py-0.5 rounded">En Route</code>, <code className="text-xs font-mono bg-ivory-200 px-1 py-0.5 rounded">Delivered</code>) creates an immutable timestamped log with verification codes for food safety inspection.
            </p>
          </Card>
        </div>
      </div>

      {/* Join CTA */}
      <div className="text-center pt-8 border-t border-ivory-300 space-y-4">
        <h3 className="text-2xl font-serif font-bold text-charcoal-900">
          Explore the FoodLoop Workspaces
        </h3>
        <p className="text-xs text-charcoal-600 max-w-md mx-auto">
          Switch between roles at any time using the top demonstration bar to experience each stakeholder console.
        </p>
        <Link to="/app">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Open FoodLoop Console
          </Button>
        </Link>
      </div>
    </div>
  );
}
