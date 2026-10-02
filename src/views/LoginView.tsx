import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

/* ── Inline SVG Illustration: Road & Shield ─────────────────────────── */
const RoadSafeIllustration: React.FC = () => (
  <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto" aria-hidden="true">
    {/* Sky gradient */}
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="420">
        <stop offset="0%" stopColor="#E8F0FE" />
        <stop offset="100%" stopColor="#FAF9F5" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="roadGrad" x1="240" y1="180" x2="240" y2="420">
        <stop offset="0%" stopColor="#585A62" />
        <stop offset="100%" stopColor="#8A8D96" />
      </linearGradient>
      <linearGradient id="shieldGrad" x1="240" y1="60" x2="240" y2="220">
        <stop offset="0%" stopColor="#C92A2A" />
        <stop offset="100%" stopColor="#961F1F" />
      </linearGradient>
    </defs>

    <rect width="480" height="420" fill="url(#skyGrad)" rx="24" />

    {/* Horizon line */}
    <ellipse cx="240" cy="260" rx="260" ry="8" fill="#E2E0D8" opacity="0.5" />

    {/* Road */}
    <path d="M180 420 L220 260 L260 260 L300 420 Z" fill="url(#roadGrad)" opacity="0.9" />

    {/* Road dashes */}
    <rect x="236" y="275" width="8" height="20" rx="4" fill="#FAF9F5" opacity="0.7" />
    <rect x="234" y="310" width="12" height="25" rx="6" fill="#FAF9F5" opacity="0.6" />
    <rect x="232" y="350" width="16" height="30" rx="8" fill="#FAF9F5" opacity="0.5" />
    <rect x="229" y="395" width="22" height="30" rx="10" fill="#FAF9F5" opacity="0.4" />

    {/* Trees/hills — organic shapes */}
    <ellipse cx="80" cy="255" rx="55" ry="50" fill="#2B8A3E" opacity="0.15" />
    <ellipse cx="65" cy="248" rx="35" ry="40" fill="#2B8A3E" opacity="0.22" />
    <ellipse cx="400" cy="252" rx="60" ry="48" fill="#2B8A3E" opacity="0.15" />
    <ellipse cx="420" cy="245" rx="38" ry="42" fill="#2B8A3E" opacity="0.22" />

    {/* Small hills */}
    <ellipse cx="160" cy="258" rx="40" ry="18" fill="#D2EED7" opacity="0.5" />
    <ellipse cx="340" cy="256" rx="45" ry="16" fill="#D2EED7" opacity="0.5" />

    {/* Shield icon — central focal */}
    <motion.g
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
    >
      <path
        d="M240 80 L200 105 L200 155 C200 185 220 210 240 220 C260 210 280 185 280 155 L280 105 Z"
        fill="url(#shieldGrad)"
        stroke="#961F1F"
        strokeWidth="2"
        opacity="0.95"
      />
      {/* Checkmark inside shield */}
      <path
        d="M222 148 L235 161 L260 132"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.g>

    {/* Signal waves from shield */}
    <motion.circle
      cx="240" cy="150" r="50"
      stroke="#C92A2A" strokeWidth="1.5" fill="none" opacity="0.15"
      initial={{ r: 40, opacity: 0.3 }}
      animate={{ r: 70, opacity: 0 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
    />
    <motion.circle
      cx="240" cy="150" r="50"
      stroke="#C92A2A" strokeWidth="1" fill="none" opacity="0.1"
      initial={{ r: 50, opacity: 0.2 }}
      animate={{ r: 90, opacity: 0 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
    />

    {/* Car silhouettes on road */}
    <rect x="245" y="320" width="16" height="10" rx="3" fill="#141517" opacity="0.2" />
    <rect x="220" y="355" width="20" height="12" rx="4" fill="#141517" opacity="0.15" />

    {/* Location pin */}
    <motion.g
      initial={{ y: -5 }}
      animate={{ y: 5 }}
      transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
    >
      <circle cx="240" cy="230" r="6" fill="#C92A2A" opacity="0.8" />
      <circle cx="240" cy="230" r="3" fill="white" />
      <path d="M240 236 L237 245 L243 245 Z" fill="#C92A2A" opacity="0.8" />
    </motion.g>
  </svg>
);

export const LoginView: React.FC = () => {
  const { login } = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('prashanth@example.com');
  const [password, setPassword] = useState('SafetyFirst2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setIsLoading(true);

    // Subtle 400ms loading state before navigation
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        type: 'success',
        title: 'Authentication Verified',
        message: 'Signed in to RoadSafe Active Safety Network.',
      });
      login(email);
    }, 450);
  };

  const handleForgotPassword = () => {
    showToast({
      type: 'info',
      title: 'Password Recovery',
      message: 'Demo mode: In production, a recovery token is sent via verified SMS/Email.',
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-hidden login-bg">
      {/* Decorative organic blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#C92A2A]/[0.04] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#2B8A3E]/[0.05] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[30%] right-[15%] w-[200px] h-[200px] rounded-full bg-[#364FC7]/[0.03] blur-2xl pointer-events-none" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10"
      >
        {/* Left Column: Illustration + editorial introduction */}
        <div className="md:col-span-6 lg:col-span-7 space-y-6 md:pr-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#141517] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-md">
              RS
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#141517]">
                ROADSAFE
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-[#8A8D96] uppercase">
                Emergency & Safety Network
              </span>
            </div>
          </div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="py-2"
          >
            <RoadSafeIllustration />
          </motion.div>

          {/* Editorial Display Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#141517] text-balance leading-[1.12]">
              Your safety network, <br className="hidden sm:inline" />
              one tap away.
            </h1>
            <p className="text-sm sm:text-base text-[#585A62] max-w-md leading-relaxed">
              Emergency assistance and road-safety information in one place.
            </p>
          </div>

          {/* Quiet Trust Anchors */}
          <div className="pt-4 border-t border-[#E2E0D8]/60 space-y-2.5 max-w-md">
            <div className="flex items-center gap-2.5 text-xs text-[#585A62]">
              <ShieldCheck className="w-4 h-4 text-[#2B8A3E] shrink-0" />
              <span>Real-time GPS telemetry & automatic collision escalation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#585A62]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#141517] mx-1 shrink-0" />
              <span>Direct regional trauma center and emergency contact routing</span>
            </div>
          </div>
        </div>

        {/* Right Column: Focused Login Panel — frosted glass */}
        <div className="md:col-span-6 lg:col-span-5 w-full">
          <div className="login-card bg-white/80 backdrop-blur-xl border border-[#E2E0D8]/70 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-[#141517]">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-[#585A62]">
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <TextInput
                id="login-email"
                label="Email"
                type="email"
                placeholder="name@domain.edu"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                error={emailError}
                autoComplete="email"
                required
              />

              {/* Password Input */}
              <TextInput
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
                autoComplete="current-password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="p-1 text-[#8A8D96] hover:text-[#141517] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              {/* Forgot Password link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Sign In Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In
                </Button>
              </div>

              {/* Subtle Demo Hint */}
              <div className="pt-3 text-center">
                <p className="text-[11px] text-[#8A8D96] tracking-tight">
                  Demo access — use any valid-looking credentials
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
