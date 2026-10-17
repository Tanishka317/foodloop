import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { Input, Select } from '../../components/common/FormInputs';
import { Building2, HeartHandshake, Truck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { switchRole, addToast } = useApp();

  const [role, setRole] = useState('donor');
  const [form, setForm] = useState({
    name: '',
    orgName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      switchRole(role);
      addToast(`Account created as ${role.toUpperCase()} partner!`, 'success');
      navigate(`/app/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" to="/" />
          <h2 className="text-2xl font-serif font-bold text-charcoal-900 mt-3">
            Register with FoodLoop
          </h2>
          <p className="text-xs text-charcoal-500">
            Join the regional food waste redistribution network
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-ivory-200 rounded-2xl border border-ivory-300 text-xs">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
              role === 'donor'
                ? 'bg-white font-bold text-forest-800 shadow-sm border border-ivory-300'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-terracotta-600" />
            <span>Food Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
              role === 'ngo'
                ? 'bg-white font-bold text-forest-800 shadow-sm border border-ivory-300'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-forest-700" />
            <span>Recipient NGO</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
              role === 'volunteer'
                ? 'bg-white font-bold text-forest-800 shadow-sm border border-ivory-300'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Courier Volunteer</span>
          </button>
        </div>

        {/* Form Card */}
        <Card className="border-ivory-300 p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Full Name"
                placeholder="e.g. Maria Santos"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                label={role === 'volunteer' ? 'Vehicle Make & Model' : 'Organization Name'}
                placeholder={role === 'volunteer' ? 'e.g. Toyota Sienna Cargo' : 'e.g. Westside Community Bakery'}
                value={form.orgName}
                onChange={e => setForm({ ...form, orgName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="name@organization.org"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <Input
              label="Street Address / Facility Hub"
              placeholder="123 Market St, San Francisco, CA"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              icon={CheckCircle2}
            >
              Complete Registration & Enter App
            </Button>
          </form>

          <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-ivory-200">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-forest-700 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
