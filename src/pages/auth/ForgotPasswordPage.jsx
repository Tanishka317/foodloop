import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { Input } from '../../components/common/FormInputs';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" to="/" />
          <h2 className="text-2xl font-serif font-bold text-charcoal-900 mt-3">
            Reset Your Password
          </h2>
          <p className="text-xs text-charcoal-500">
            Enter your verified organization email address
          </p>
        </div>

        <Card className="border-ivory-300 p-6 sm:p-8 space-y-5">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-charcoal-900">Reset Link Sent</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a recovery link has been dispatched to your inbox.
              </p>
              <Link to="/login" className="inline-block pt-2">
                <Button size="sm" variant="outline">Return to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@organization.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Recovery Instructions
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-charcoal-900">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
