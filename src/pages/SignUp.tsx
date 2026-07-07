import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function SignUp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = (userRole: string) => {
    if (userRole === 'owner') navigate('/onboarding/owner');
    else navigate('/dashboard/user');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <CheckCircle className="h-8 w-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-500 mb-6">Welcome to Venuewala. You can now log in and start exploring venues.</p>
          <Link to="/login"><Button variant="primary" className="w-full py-3">Go to Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        </div>

        <div className="rounded-card bg-white p-6 shadow-sm">
          {/* Role toggle */}
          <div className="flex rounded-input border border-gray-200 overflow-hidden mb-5">
            <button onClick={() => setRole('customer')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${role === 'customer' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Customer</button>
            <button onClick={() => setRole('owner')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${role === 'owner' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Venue Owner</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm your password" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
              {confirm && password !== confirm && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 mt-0.5" required />
              <span>I agree to the <span className="text-primary-500 font-medium">Terms of Service</span> and <span className="text-primary-500 font-medium">Privacy Policy</span></span>
            </label>
            <Button variant="cta" className="w-full py-3" disabled={loading || !agreed || password !== confirm}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}Create Account
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Email/password signup isn't connected to the backend yet - use Google below to actually create an account.
            </p>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleSignInButton
            intendedRole={role}
            onSuccess={handleGoogleSuccess}
            onError={setGoogleError}
          />
          {googleError && (
            <p className="text-xs text-red-500 text-center mt-2">{googleError}</p>
          )}

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
