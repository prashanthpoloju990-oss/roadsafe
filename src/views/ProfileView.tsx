import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Users,
  Compass,
  Bell,
  CheckCircle,
  EyeOff,
  Info,
  LogOut,
  ChevronRight,
  X,
  Shield,
  Heart,
  Sliders,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AboutTopicInfo {
  title: string;
  badge: string;
  summary: string;
  points: string[];
}

const ABOUT_TOPICS: Record<string, AboutTopicInfo> = {
  how_it_works: {
    title: 'How RoadSafe works',
    badge: 'Architecture',
    summary:
      'RoadSafe bridges the critical minutes between a vehicular collision and hospital trauma bay arrival by automating location discovery and direct institutional dispatch.',
    points: [
      'Automated collision detection via vehicle telemetry and manual SOS triggers.',
      'Instant GPS locking with high accuracy (±8 m) without requiring mapping API keys.',
      'Simultaneous dispatch to family emergency circle and regional hospital triage desk.',
    ],
  },
  safety_info: {
    title: 'Road safety information',
    badge: 'Education',
    summary:
      'A curated collection of practical driving protocols designed to reduce roadway risk before an emergency happens.',
    points: [
      'Comprehensive guidance on helmet fastening, seat belts, speed limits, and night driving.',
      'Direct DO and AVOID behavioral matrices for everyday drivers.',
      'Contextual linkage to immediate SOS dispatch in case of unforeseen hazards.',
    ],
  },
  emergency_workflow: {
    title: 'Emergency workflow',
    badge: 'Protocol',
    summary:
      'The multi-tier response cycle ensuring intentional activations and zero accidental dispatches.',
    points: [
      '3-second perimeter hold with live countdown prevents accidental triggers in pocket.',
      'GPS coordinate confirmation screen shows exact recipients before final alert broadcast.',
      'Continuous status progression: Alert sent → Hospital notified → Trauma team en route.',
    ],
  },
  about_project: {
    title: 'About this project',
    badge: 'Academic Demo',
    summary:
      'RoadSafe was developed as an emergency-response and trauma hospital notification system for college presentation and public safety research.',
    points: [
      'Built purely on modern frontend React and TypeScript with zero external database dependencies.',
      'Simulates the full end-to-end ecosystem: Driver App → SOS Dispatch → Hospital Triage Gateway.',
      'Compliant with strict Editorial Utility design principles: calm, operational, and trustworthy.',
    ],
  },
};

export const ProfileView: React.FC = () => {
  const { navigate, logout } = useRouter();
  const {
    currentUser,
    updateCurrentUser,
    emergencyContacts,
    resetDemoState,
    preferences,
    updatePreferences,
  } = useProductState();
  const { showToast } = useToast();

  // Find user's active primary contact
  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAboutKey, setSelectedAboutKey] = useState<string | null>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Profile Form Edit state
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Prashanth Poloju',
    phone: currentUser.phone || '+91 98490 12345',
    email: currentUser.email || 'prashanth@example.com',
    city: currentUser.city || 'Hyderabad',
  });

  // Settings Toggles state (persisted centrally)
  const allowLocationSharing = preferences.allowLocationSharing ?? true;
  const safetyReminders = preferences.safetyReminders ?? true;
  const emergencyConfirmation = preferences.emergencyConfirmation ?? true;
  const reduceMotion = preferences.reduceMotion ?? false;

  // Compute initials
  const initials = formData.name
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast({
        type: 'warning',
        title: 'Required Fields',
        message: 'Name and phone number cannot be empty.',
      });
      return;
    }

    updateCurrentUser({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
    });

    setIsEditModalOpen(false);
    showToast({
      type: 'success',
      title: 'Profile updated',
      message: 'Your personal information has been saved.',
    });
  };

  // Handle Sign Out
  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    logout();
    navigate('/login');
    showToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been signed out of RoadSafe.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto py-2 sm:py-6 space-y-8 select-none"
    >
      {/* 1. Profile Header */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141517]">
            Your profile
          </h1>
          <p className="text-sm sm:text-base text-[#585A62]">
            Keep your emergency information up to date.
          </p>
        </div>

        <div className="relative bg-gradient-to-r from-white via-white to-[#FAF9F5]/90 border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#2B8A3E]/[0.03] pointer-events-none" aria-hidden="true" />

          <div className="flex items-center gap-4 relative z-10">
            {/* Initials Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#141517] to-[#3A3B40] text-white flex items-center justify-center text-xl font-bold tracking-tight shrink-0 shadow-md">
              {initials || 'PP'}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#141517] tracking-tight">
                {currentUser.name || 'Prashanth Poloju'}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#585A62]">RoadSafe Driver</span>
                <span className="text-[10px] font-mono font-semibold text-[#2B8A3E] bg-[#F2F9F3] border border-[#D2EED7] px-2 py-0.5 rounded-full">
                  Verified Identity
                </span>
                <span className="text-[10px] font-mono text-[#8A8D96] bg-[#FAF9F5] border border-[#E2E0D8] px-2 py-0.5 rounded-full">
                  {currentUser.vehicle.licensePlate}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({
                name: currentUser.name || 'Prashanth Poloju',
                phone: currentUser.phone || '+91 98490 12345',
                email: currentUser.email || 'prashanth@example.com',
                city: currentUser.city || 'Hyderabad',
              });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#141517] hover:bg-[#FAF9F5] bg-white border border-[#E2E0D8] rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm self-start sm:self-center"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit profile</span>
          </button>
        </div>
      </section>

      {/* 2. Personal Information */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            Personal information
          </h2>
          <span className="text-xs text-[#8A8D96] font-mono">Locally stored</span>
        </div>

        <div className="bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl divide-y divide-[#EDECE7]/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#8A8D96]">Full name</span>
            <span className="font-semibold text-[#141517]">{currentUser.name}</span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#8A8D96]">Phone number</span>
            <span className="font-mono text-[#141517] font-semibold">{currentUser.phone}</span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#8A8D96]">Email</span>
            <span className="text-[#141517] font-medium">{currentUser.email}</span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#8A8D96]">City</span>
            <span className="font-medium text-[#141517]">{currentUser.city || 'Hyderabad'}</span>
          </div>
        </div>
      </section>

      {/* 3. Emergency Preferences */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            Emergency preferences
          </h2>
          <span className="text-xs text-[#2B8A3E] font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Active Protection</span>
          </span>
        </div>

        <div className="bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl divide-y divide-[#EDECE7]/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {/* Primary Contact Reference */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
                Primary emergency contact
              </p>
              {primaryContact ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-[#141517]">
                    {primaryContact.name}
                  </span>
                  <span className="text-xs text-[#585A62]">({primaryContact.relationship})</span>
                  <span className="text-[11px] font-mono text-[#8A8D96]">
                    · {primaryContact.phone}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#C92A2A]">No primary contact set</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F2F1EA] border border-[#E2E0D8] rounded-xl text-xs font-semibold text-[#141517] transition-colors cursor-pointer self-start sm:self-center"
            >
              <span>Manage contacts</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8D96]" />
            </button>
          </div>

          {/* Location Sharing Toggle */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-[#141517]">
                Allow location access during emergency
              </p>
              <p className="text-xs text-[#585A62] leading-relaxed">
                RoadSafe uses your location only to demonstrate the emergency alert flow.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={allowLocationSharing}
                onChange={e => {
                  updatePreferences({ allowLocationSharing: e.target.checked });
                  showToast({
                    type: 'info',
                    title: 'Location Preference',
                    message: e.target.checked
                      ? 'Emergency telemetry coordinate broadcast enabled.'
                      : 'Emergency location broadcast suppressed.',
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#E2E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#141517]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* 4. Safety Preferences */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
          Safety preferences
        </h2>

        <div className="bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl divide-y divide-[#EDECE7]/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {/* Safety Reminders */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-[#141517]">
                Safety reminders
              </p>
              <p className="text-xs text-[#585A62]">
                Show defensive driving reminders and pre-ride checklists.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={safetyReminders}
                onChange={e => updatePreferences({ safetyReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#E2E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#141517]"></div>
            </label>
          </div>

          {/* Emergency Confirmation */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-[#141517]">
                Emergency confirmation
              </p>
              <p className="text-xs text-[#585A62]">
                Require 3-second hold to avoid accidental dispatch in pocket.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={emergencyConfirmation}
                onChange={e => updatePreferences({ emergencyConfirmation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#E2E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#141517]"></div>
            </label>
          </div>

          {/* Reduce Motion */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-[#141517]">
                Reduce motion
              </p>
              <p className="text-xs text-[#585A62]">
                Minimize interface transitions and background effects.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={e => {
                  updatePreferences({ reduceMotion: e.target.checked });
                  showToast({
                    type: 'info',
                    title: 'Interface Motion',
                    message: e.target.checked
                      ? 'Motion minimized.'
                      : 'Standard transitions enabled.',
                  });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-[#E2E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#141517]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* 5. About RoadSafe */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
          About RoadSafe
        </h2>

        <div className="bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl divide-y divide-[#EDECE7]/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {[
            { id: 'how_it_works', label: 'How RoadSafe works' },
            { id: 'safety_info', label: 'Road safety information' },
            { id: 'emergency_workflow', label: 'Emergency workflow' },
            { id: 'about_project', label: 'About this project' },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedAboutKey(item.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-semibold text-[#141517]">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8A8D96] transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}

          {/* Project Lockup Footer */}
          <div className="p-4 sm:p-5 bg-[#FAF9F5] text-xs text-[#585A62] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[#141517] block">RoadSafe</span>
              <span className="text-[11px] text-[#8A8D96] block">
                Road Safety & Hospital Notification System
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase text-[#8A8D96] px-2.5 py-1 bg-white border border-[#E2E0D8] rounded-full">
              v1.0.4 Demo
            </span>
          </div>
        </div>
      </section>

      {/* 6. Sign Out */}
      <section className="pt-2 space-y-3">
        <button
          type="button"
          onClick={() => setIsSignOutModalOpen(true)}
          className="w-full py-3.5 px-4 bg-white hover:bg-[#FDF2F2] border border-[#F8D7DA]/80 text-[#C92A2A] rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(201,42,42,0.06)]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>

        {/* Discreet Presentation Demo Reset */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              resetDemoState();
              showToast({
                type: 'info',
                title: 'Demo State Reset',
                message: 'All contacts, cases, and telemetry restored to initial presentation state.',
              });
            }}
            className="text-[11px] font-mono text-[#8A8D96] hover:text-[#141517] transition-colors cursor-pointer"
          >
            Reset demo data to initial defaults
          </button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDECE7]">
                <h3 className="text-base sm:text-lg font-bold text-[#141517]">
                  Edit personal profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-[#8A8D96] hover:text-[#141517] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] outline-none"
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] font-mono outline-none"
                    placeholder="Phone number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] outline-none"
                    placeholder="Email address"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] outline-none"
                    placeholder="City"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#141517] hover:bg-[#2A2B2F] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Save profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About RoadSafe Informational Modal */}
      <AnimatePresence>
        {selectedAboutKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDECE7]">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8D96] px-2 py-0.5 bg-[#FAF9F5] border border-[#E2E0D8] rounded font-semibold">
                    {ABOUT_TOPICS[selectedAboutKey]?.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#141517]">
                    {ABOUT_TOPICS[selectedAboutKey]?.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAboutKey(null)}
                  className="p-1.5 text-[#8A8D96] hover:text-[#141517] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#585A62] leading-relaxed">
                {ABOUT_TOPICS[selectedAboutKey]?.summary}
              </p>

              <div className="space-y-2 pt-1">
                {ABOUT_TOPICS[selectedAboutKey]?.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#141517]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#141517] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedAboutKey(null)}
                  className="w-full py-2.5 bg-[#141517] hover:bg-[#2A2B2F] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#FDF2F2] border border-[#F8D7DA] flex items-center justify-center text-[#C92A2A]">
                <LogOut className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#141517]">
                  Sign out of RoadSafe?
                </h3>
                <p className="text-xs text-[#585A62] leading-relaxed">
                  You will need to sign in again to access emergency telemetry, contacts, and personal preferences.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  className="px-4 py-2 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
