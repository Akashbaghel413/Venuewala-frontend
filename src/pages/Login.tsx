import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownerLogin, setOwnerLogin] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const navigate = useNavigate();

  // NOTE: the backend currently only supports Google login
  // (POST /api/auth/google). There is no email/password route yet, so this
  // form can't actually authenticate anyone - it's left as a visual
  // placeholder until that backend endpoint exists.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleGoogleSuccess = (role: string) => {
    if (role === 'owner') navigate('/dashboard/owner');
    else if (role === 'admin') navigate('/dashboard/admin');
    else navigate('/dashboard/user');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login to your account</h1>
        </div>

        <div className="rounded-card bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-input border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" required />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-500 font-medium hover:text-primary-600">Forgot Password?</Link>
            </div>
            <Button variant="cta" className="w-full py-3" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}Login
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Email/password login isn't connected to the backend yet - use Google below to actually sign in.
            </p>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleSignInButton
            intendedRole={ownerLogin ? 'owner' : 'customer'}
            onSuccess={handleGoogleSuccess}
            onError={setGoogleError}
          />
          {googleError && (
            <p className="text-xs text-red-500 text-center mt-2">{googleError}</p>
          )}

          <p className="text-sm text-gray-500 text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 font-medium hover:text-primary-600">Sign Up</Link>
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button onClick={() => setOwnerLogin(!ownerLogin)} className="text-sm text-gray-500 hover:text-primary-500 transition-colors">
              {ownerLogin ? '← Login as Customer' : 'Login as Venue Owner →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
