import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { Input } from '../../components/common/FormInputs';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { switchRole, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Demo sign-in successful', 'success');
      navigate('/app');
    }, 400);
  };

  const handleQuickLogin = (role) => {
    switchRole(role);
    navigate(`/app/${role}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" to="/" />
          <h2 className="text-2xl font-serif font-bold text-charcoal-900 mt-3">
            Sign in to FoodLoop
          </h2>
          <p className="text-xs text-charcoal-500">
            Access your food rescue dispatch and operations console
          </p>
        </div>

        {/* Demo Fast Login Switcher Card */}
        <div className="p-4 bg-forest-50 border border-forest-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-forest-900">
            <UserCheck className="w-4 h-4 text-forest-700" />
            <span>Fast Demo Sign-In (Select Persona)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button size="sm" variant="outline" className="bg-white justify-start" onClick={() => handleQuickLogin('ngo')}>
              Hope Kitchen (NGO)
            </Button>
            <Button size="sm" variant="outline" className="bg-white justify-start" onClick={() => handleQuickLogin('donor')}>
              Daily Harvest (Donor)
            </Button>
            <Button size="sm" variant="outline" className="bg-white justify-start" onClick={() => handleQuickLogin('volunteer')}>
              David O. (Volunteer)
            </Button>
            <Button size="sm" variant="outline" className="bg-white justify-start" onClick={() => handleQuickLogin('admin')}>
              Dr. Sarah (Admin)
            </Button>
          </div>
        </div>

        {/* Regular Login Form */}
        <Card className="border-ivory-300 p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="e.g. elena@dailyharvest.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-forest-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Workspace
            </Button>
          </form>

          <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-ivory-200">
            Don't have an organization account?{' '}
            <Link to="/register" className="font-semibold text-forest-700 hover:underline">
              Register now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
