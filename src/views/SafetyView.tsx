import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Gauge,
  PhoneOff,
  Moon,
  CloudRain,
  ChevronRight,
  ArrowRight,
  Footprints,
  Compass,
  AlertTriangle,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

import { useRouter } from '../context/RouterContext';

interface SafetyTopic {
  id: string;
  category: 'rules' | 'driving' | 'emergency';
  title: string;
  description: string;
  icon: React.ReactNode;
  readTime: string;
  image?: string;
  imageAlt?: string;
  fullContent: {
    rule: string;
    actionablePoints: string[];
    riskFactor: string;
  };
}

export const SafetyView: React.FC = () => {
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState<'all' | 'rules' | 'driving' | 'emergency'>('all');
  const [selectedTopic, setSelectedTopic] = useState<SafetyTopic | null>(null);

  const topics: SafetyTopic[] = [
    {
      id: 'helmet-safety',
      category: 'driving',
      title: 'Helmet safety',
      description: 'ISI/DOT certified full-face helmet strapped securely for every ride.',
      icon: <Shield className="w-4 h-4 text-[#141517]" />,
      readTime: '2 min read',
      image: '/assets/images/helmet_safety.jpg',
      imageAlt: 'Certified full-face motorcycle helmet with double D-ring strap',
      fullContent: {
        rule: 'Section 129 Motor Vehicles Act · Mandatory for rider and pillion passenger.',
        actionablePoints: [
          'Choose a full-face helmet with certified EPS impact liner.',
          'Fasten the retention chin strap so no more than two fingers fit under the chin.',
          'Replace immediately after any significant impact or every 3 to 5 years.',
        ],
        riskFactor: 'Reduces the likelihood of fatal head trauma by over 69%.',
      },
    },
    {
      id: 'seat-belt-safety',
      category: 'rules',
      title: 'Seat belt safety',
      description: 'Three-point restraint for all vehicle occupants, reducing fatal injury risk by 45%.',
      icon: <CheckCircle2 className="w-4 h-4 text-[#141517]" />,
      readTime: '2 min read',
      image: '/assets/images/seatbelt_safety.jpg',
      imageAlt: 'Vehicle 3-point seatbelt clicked into locking buckle',
      fullContent: {
        rule: 'Section 138(3) Central Motor Vehicle Rules · Mandatory for all seating positions.',
        actionablePoints: [
          'Position lap belt flat across pelvis/hips, never over the soft stomach.',
          'Ensure shoulder sash rests firmly across center of clavicle without neck chafing.',
          'Never tuck shoulder strap behind the back or under the arm.',
        ],
        riskFactor: 'Prevents occupant ejection, the leading cause of fatality in rollover crashes.',
      },
    },
    {
      id: 'speed-awareness',
      category: 'rules',
      title: 'Speed awareness',
      description: 'Observe posted corridor limits and adjust speed for surface grip and braking distance.',
      icon: <Gauge className="w-4 h-4 text-[#141517]" />,
      readTime: '3 min read',
      image: '/assets/images/highway_safety.jpg',
      imageAlt: 'Highway electronic speed corridor and safe vehicle following distance',
      fullContent: {
        rule: 'Section 112 Motor Vehicles Act · Strict electronic corridor enforcement.',
        actionablePoints: [
          'Maintain speed calibrated to stopping sight distance, especially on curve approaches.',
          'At 60 km/h, emergency stopping requires ~37 meters on dry asphalt.',
          'Observe automated speed trap limits on Outer Ring Road and city flyovers.',
        ],
        riskFactor: 'Each 5 km/h increase in travel speed doubles pedestrian fatality likelihood.',
      },
    },
    {
      id: 'traffic-signals',
      category: 'rules',
      title: 'Traffic signals',
      description: 'Strict adherence to amber-clearing phases, stop lines, and pedestrian crossings.',
      icon: <Lightbulb className="w-4 h-4 text-[#141517]" />,
      readTime: '2 min read',
      fullContent: {
        rule: 'Section 119 Motor Vehicles Act · Automated red-light violation camera monitoring.',
        actionablePoints: [
          'Stop completely behind the solid white stop line before the pedestrian zebra zone.',
          'Amber phase indicates clearance: prepare to halt safely, do not accelerate through.',
          'Always verify intersection cross-traffic before proceeding on fresh green lights.',
        ],
        riskFactor: 'Right-angle T-bone impacts at signal junctions carry high fatality rates.',
      },
    },
    {
      id: 'mobile-distraction',
      category: 'driving',
      title: 'Mobile phone distraction',
      description: 'Zero phone handling while driving; cognitive distraction persists 27 seconds after use.',
      icon: <PhoneOff className="w-4 h-4 text-[#141517]" />,
      readTime: '2 min read',
      fullContent: {
        rule: 'Section 184(c) Dangerous Driving Regulation · Handheld device prohibition.',
        actionablePoints: [
          'Configure navigation routes before starting the vehicle ignition.',
          'Activate Driving Focus / Do Not Disturb to silence incoming notification chimes.',
          'If an urgent call must be made, exit active traffic lanes and park safely.',
        ],
        riskFactor: 'Glancing at a message for 4 seconds at 60 km/h equals traversing 66 meters blind.',
      },
    },
    {
      id: 'night-driving',
      category: 'driving',
      title: 'Night driving',
      description: 'Dip high beams within 150m of opposing vehicles; keep windshields free of glare.',
      icon: <Moon className="w-4 h-4 text-[#141517]" />,
      readTime: '3 min read',
      fullContent: {
        rule: 'Rule 106 Central Motor Vehicle Rules · Anti-glare and headlight dipping guidelines.',
        actionablePoints: [
          'Shift focus toward the left lane boundary marker when facing oncoming glare.',
          'Thoroughly clean interior windshield glass to eliminate optical scatter and halo effects.',
          'Reduce standard highway speed by 15-20% to account for reduced perimeter peripheral vision.',
        ],
        riskFactor: 'Fatal crashes peak between 10:00 PM and 4:00 AM due to lighting and driver fatigue.',
      },
    },
    {
      id: 'rainy-road-safety',
      category: 'driving',
      title: 'Rainy road safety',
      description: 'Double your following distance to counter hydroplaning and wet braking friction drop.',
      icon: <CloudRain className="w-4 h-4 text-[#141517]" />,
      readTime: '3 min read',
      fullContent: {
        rule: 'Advisory Protocol · Wet Weather Surface Traction & Hazard Guidelines.',
        actionablePoints: [
          'Maintain minimum 4-second following distance behind preceding vehicles.',
          'Avoid sudden heavy braking or sharp steering inputs when encountering standing water pools.',
          'Inspect tire tread depth: minimum 2.5mm needed to channel water and resist aquaplaning.',
        ],
        riskFactor: 'Road surface friction decreases by over 50% during the first 15 minutes of rain.',
      },
    },
    {
      id: 'pedestrian-awareness',
      category: 'rules',
      title: 'Pedestrian awareness',
      description: 'Yield unconditionally at zebra crossings and anticipate foot traffic near transit hubs.',
      icon: <Footprints className="w-4 h-4 text-[#141517]" />,
      readTime: '2 min read',
      fullContent: {
        rule: 'Rules of the Road Regulations · Right of Way at Uncontrolled Pedestrian Crossings.',
        actionablePoints: [
          'Slow down and scan road shoulders near school zones, transit stops, and markets.',
          'Never overtake a vehicle that has stopped or slowed ahead of a zebra crossing.',
          'Make direct eye contact with waiting pedestrians before proceeding at low speed.',
        ],
        riskFactor: 'Vulnerable road users account for over 40% of urban collision casualties.',
      },
    },
    {
      id: 'breakdown-protocol',
      category: 'emergency',
      title: 'Vehicle breakdown protocol',
      description: 'Move vehicle onto shoulder, deploy warning triangle 50m behind, activate hazard flashers.',
      icon: <AlertTriangle className="w-4 h-4 text-[#C92A2A]" />,
      readTime: '3 min read',
      image: '/assets/images/breakdown_safety.jpg',
      imageAlt: 'Reflective emergency breakdown triangle placed on highway shoulder',
      fullContent: {
        rule: 'Highway Emergency SOP · Incident Scene Isolation and Secondary Crash Prevention.',
        actionablePoints: [
          'Steer onto the extreme left breakdown shoulder or emergency refuge bay immediately.',
          'Activate 4-way hazard flashers and place reflective triangle 50 meters behind the vehicle.',
          'Instruct all passengers to exit from the left side and wait behind the highway crash barrier.',
        ],
        riskFactor: 'Secondary rear-end collisions on highway shoulders carry extreme severity.',
      },
    },
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'rules', label: 'Traffic Rules' },
    { id: 'driving', label: 'Safe Driving' },
    { id: 'emergency', label: 'Emergency Guide' },
  ] as const;

  const filteredTopics = activeCategory === 'all'
    ? topics
    : topics.filter(t => t.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto py-2 sm:py-4 space-y-8 sm:space-y-10 select-none"
    >
      {/* 1. Header */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider text-[#8A8D96] uppercase px-2 py-0.5 bg-white border border-[#E2E0D8] rounded">
            Safety guide · 08 topics
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141517]">
          Drive safer.
        </h1>
        <p className="text-base sm:text-lg text-[#585A62] font-normal leading-relaxed">
          Small decisions on the road can make a big difference.
        </p>
      </section>

      {/* 2. Prominent Featured Editorial Section with Visual Banner */}
      <section className="relative bg-gradient-to-br from-white via-white to-[#FAF9F5]/90 border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Visual Hero Banner with Informational Overlay */}
        <div className="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden border border-[#E2E0D8] shadow-sm">
          <img
            src="/assets/images/safety_hero_banner.jpg"
            alt="Driver buckled with hands at ten-and-two position on open highway"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141517]/90 via-[#141517]/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#F59F00]" />
                Featured Directive · Daily Road Habits
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Before you ride
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Three essential foundational habits that preserve your safety on every journey.
            </p>
          </div>
        </div>

        {/* 3 Numbered Organic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-1 relative z-10">
          {/* 01 */}
          <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-xs border border-[#EDECE7] rounded-2xl space-y-2.5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#2B8A3E] bg-[#F2F9F3] px-2 py-0.5 rounded-full">
                01
              </span>
              <Shield className="w-4 h-4 text-[#2B8A3E]" />
            </div>
            <h3 className="text-base font-bold text-[#141517] tracking-tight">
              Wear your helmet
            </h3>
            <p className="text-xs text-[#585A62] leading-relaxed">
              Fasten the chin strap firmly every time. A certified helmet is your primary defense against head trauma.
            </p>
          </div>

          {/* 02 */}
          <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-xs border border-[#EDECE7] rounded-2xl space-y-2.5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#364FC7] bg-[#EDF2FF] px-2 py-0.5 rounded-full">
                02
              </span>
              <Compass className="w-4 h-4 text-[#364FC7]" />
            </div>
            <h3 className="text-base font-bold text-[#141517] tracking-tight">
              Stay focused
            </h3>
            <p className="text-xs text-[#585A62] leading-relaxed">
              Silence distractions before ignition. Keep full visual and cognitive attention locked on the corridor ahead.
            </p>
          </div>

          {/* 03 */}
          <div className="p-4 sm:p-5 bg-white/80 backdrop-blur-xs border border-[#EDECE7] rounded-2xl space-y-2.5 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#D97706] bg-[#FFF9DB] px-2 py-0.5 rounded-full">
                03
              </span>
              <Gauge className="w-4 h-4 text-[#D97706]" />
            </div>
            <h3 className="text-base font-bold text-[#141517] tracking-tight">
              Keep safe distance
            </h3>
            <p className="text-xs text-[#585A62] leading-relaxed">
              Maintain a strict 3-second cushion behind preceding traffic to preserve crucial reaction and braking margin.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Category Navigation */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EDECE7]/80 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#141517] text-white shadow-xs'
                    : 'text-[#585A62] hover:text-[#141517] hover:bg-white border border-transparent hover:border-[#E2E0D8]/60'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Refined Organic Grid of Safety Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: idx * 0.04 }}
              onClick={() => navigate(`/safety/${topic.id}` as any)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/safety/${topic.id}` as any);
                }
              }}
              whileHover={{ y: -2 }}
              className="relative p-5 bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:border-[#CEC9BD] transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              {/* Optional Informational Image Thumbnail */}
              {topic.image && (
                <div className="relative h-40 sm:h-44 w-full overflow-hidden rounded-2xl bg-[#EDECE7] mb-3.5">
                  <img
                    src={topic.image}
                    alt={topic.imageAlt || topic.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                    Protocol Guide
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center shrink-0 group-hover:bg-[#F2F1EA] transition-colors">
                    {topic.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#8A8D96] uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#EDECE7] rounded-full">
                      {topic.category}
                    </span>
                    <span className="text-xs text-[#8A8D96] font-mono">
                      {topic.readTime}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#141517] group-hover:text-black transition-colors flex items-center justify-between">
                    <span>{topic.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#8A8D96] group-hover:text-[#141517] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-[#585A62] leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Editorial Topic Detail Modal / Reading Sheet */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#EDECE7]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8A8D96] uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#EDECE7] rounded">
                      Standard Directive
                    </span>
                    <span className="text-xs text-[#8A8D96]">
                      {selectedTopic.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#141517] tracking-tight">
                    {selectedTopic.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="p-1.5 text-[#8A8D96] hover:text-[#141517] rounded-lg transition-colors cursor-pointer"
                  aria-label="Close detail modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Content */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* Legal / Authority Anchor */}
                <div className="p-3 bg-[#FAF9F5] border border-[#EDECE7] rounded-xl space-y-1">
                  <p className="text-[11px] font-semibold uppercase text-[#8A8D96]">
                    Regulatory Standard
                  </p>
                  <p className="font-medium text-[#141517]">
                    {selectedTopic.fullContent.rule}
                  </p>
                </div>

                {/* Practical Checklist */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase text-[#8A8D96]">
                    Actionable Procedures
                  </p>
                  <ul className="space-y-2">
                    {selectedTopic.fullContent.actionablePoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-[#585A62] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factor Callout */}
                <div className="p-3 bg-[#FDF2F2] border border-[#F8D7DA] rounded-xl space-y-1">
                  <p className="text-[11px] font-semibold uppercase text-[#C92A2A]">
                    Key Safety Impact
                  </p>
                  <p className="text-xs text-[#141517] leading-relaxed font-medium">
                    {selectedTopic.fullContent.riskFactor}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="w-full py-2.5 bg-[#141517] text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer hover:bg-[#2A2B2F] transition-colors"
                >
                  I Understand This Directive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
