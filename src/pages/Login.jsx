import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, ShieldCheck, Sparkles, ArrowRight, Activity, UserPlus, LogIn } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('RESEARCHER');
  const [regOrg, setRegOrg] = useState('');
  const [regTitle, setRegTitle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your email and password', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      addToast(`Welcome back, ${loggedUser?.name || email}!`, 'success');
      navigate(loggedUser?.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      addToast('Please fill in all required fields (Name, Email, Password)', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const newUser = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        organization: regOrg || 'Health Research Institute',
        title: regTitle || 'Clinical Researcher'
      });
      addToast(`Account created successfully! Welcome, ${newUser?.name || regName}!`, 'success');
      navigate(newUser?.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Left Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-clinical-teal/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-clinical-teal text-white shadow-xl shadow-brand-500/20">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">{APP_NAME}</h1>
            <p className="text-xs text-brand-400 font-medium tracking-wide uppercase">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Middle Visual Illustration & Tagline */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Trust Distributed Health Analytics</span>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Query Clinical Datasets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-clinical-teal">
              Without Moving the Data.
            </span>
          </h2>

          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Perform privacy-preserving, federated analytics across hospital networks. Access heterogeneous clinical datasets with instant AI schema translation and k-anonymity guarantees.
          </p>

          {/* Architecture Feature Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
              <p className="font-bold text-slate-200">Zero Raw Data Leakage</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Raw PHI stays inside local hospital firewalls.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <Activity className="w-4 h-4 text-brand-400 mb-1.5" />
              <p className="font-bold text-slate-200">Heterogeneous Schemas</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Automatic SQL translation for MySQL & Postgres.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 relative z-10">
          FederateHealth Platform v2.4 • Enterprise Security Enabled
        </p>
      </div>

      {/* Right Login / Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-brand-600 to-clinical-teal text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-brand-600 to-clinical-teal text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {activeTab === 'login' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Data Fabric</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered institutional credentials to access the platform.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@organization.org"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-clinical-teal hover:from-brand-500 hover:to-clinical-teal text-white font-bold text-sm shadow-xl shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In to Platform'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">⚡ Quick Demo Login</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Admin', email: 'admin@demo.com', pass: 'admin123', color: 'text-purple-400 bg-purple-500/10 border-purple-800/50' },
                    { label: 'Researcher', email: 'researcher@demo.com', pass: 'researcher123', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-800/50' },
                    { label: 'Auditor', email: 'auditor@demo.com', pass: 'auditor123', color: 'text-amber-400 bg-amber-500/10 border-amber-800/50' },
                    { label: 'Inst. Admin', email: 'instadmin@demo.com', pass: 'instadmin123', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-800/50' },
                  ].map(({ label, email: demoEmail, pass, color }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setEmail(demoEmail); setPassword(pass); }}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold text-left transition hover:opacity-80 ${color}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Register New Account</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Create your researcher or administrative credentials for the federated network.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institutional Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="jane.doe@hospital.org"
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Security Password * (min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      System Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-brand-500 outline-none"
                    >
                      <option value="RESEARCHER">Researcher</option>
                      <option value="INSTITUTION_ADMIN">Institution Admin</option>
                      <option value="AUDITOR">Auditor</option>
                      <option value="ADMIN">System Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="Senior Lead"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    placeholder="Global Health Center"
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:border-brand-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-clinical-teal hover:from-brand-500 hover:to-clinical-teal text-white font-bold text-sm shadow-xl shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-slate-500">
            Connected to Spring Boot backend API with automatic JWT session management.
          </p>
        </div>
      </div>
    </div>
  );
};
