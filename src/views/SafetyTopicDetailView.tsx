import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import {
  ArrowLeft,
  AlertOctagon,
  Check,
  X as CloseIcon,
  Shield,
  Gauge,
  PhoneOff,
  Moon,
  CloudRain,
  Footprints,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface TopicDetailData {
  title: string;
  intro: string;
  keyRule: string;
  image?: string;
  imageCaption?: string;
  guidance: {
    number: string;
    heading: string;
    explanation: string;
  }[];
  doItems: string[];
  avoidItems: string[];
  emergencyNote: string;
}

const TOPICS_DATA: Record<string, TopicDetailData> = {
  'helmet-safety': {
    title: 'Helmet Safety',
    intro: 'A properly worn helmet can reduce the severity of head injuries during a crash.',
    keyRule: 'Wear your helmet every time you ride — and make sure it is properly fastened.',
    image: '/assets/images/helmet_safety.jpg',
    imageCaption: 'Certified full-face protection with securely fastened retention strap reduces fatal head trauma by >69%.',
    guidance: [
      {
        number: '01',
        heading: 'Select a certified full-face shell',
        explanation: 'Always verify an authentic ISI, DOT, or ECE certification sticker before purchasing.',
      },
      {
        number: '02',
        heading: 'Fasten the chin strap firmly',
        explanation: 'No more than two fingers should fit between the fastened retention strap and your chin.',
      },
      {
        number: '03',
        heading: 'Replace after any major impact',
        explanation: 'Internal EPS foam compacts during collisions to absorb force and does not recover.',
      },
      {
        number: '04',
        heading: 'Mandate pillion passenger protection',
        explanation: 'The passenger faces equivalent kinematic impact force; never ride with an unhelmeted pillion.',
      },
    ],
    doItems: [
      'Ensure the helmet fits snugly without painful pressure points',
      'Keep the clear face visor clean and scratch-free for night clarity',
      'Fasten the chin retention buckle before touching the starter ignition',
    ],
    avoidItems: [
      'Wearing an unfastened helmet loosely resting on your crown',
      'Using open-face novelty helmets with zero jawline impact defense',
      'Continuing to wear a helmet that has survived a previous crash',
    ],
    emergencyNote: 'Move to a safe location if possible and use RoadSafe Emergency when immediate assistance is required.',
  },
  'seat-belt-safety': {
    title: 'Seat Belt Safety',
    intro: 'Three-point seat belts distribute crash forces across the strongest skeletal structures of your body.',
    keyRule: 'Buckle up before the wheels turn — in every seat, on every trip.',
    image: '/assets/images/seatbelt_safety.jpg',
    imageCaption: 'Three-point restraint clicks firmly across pelvis and shoulder to prevent cabin ejection during impact.',
    guidance: [
      {
        number: '01',
        heading: 'Position the lap band across your hips',
        explanation: 'Keep the lap belt flat across your pelvic bones, never high across your soft abdomen.',
      },
      {
        number: '02',
        heading: 'Route shoulder strap over the clavicle',
        explanation: 'Center the diagonal belt over your collarbone to prevent chest ejection during deceleration.',
      },
      {
        number: '03',
        heading: 'Enforce rear-seat passenger buckling',
        explanation: 'Unbelted rear occupants become high-speed human projectiles inside the vehicle cabin during impacts.',
      },
      {
        number: '04',
        heading: 'Check tensioner retractor action',
        explanation: 'Gently pull the belt with a quick jerk; the inertia reel must lock instantly without slack.',
      },
    ],
    doItems: [
      'Listen for the audible click confirming the buckle latch is locked',
      'Adjust shoulder anchor height so belt does not rub your neck',
      'Insist every passenger buckles up before engaging drive gear',
    ],
    avoidItems: [
      'Tucking the shoulder sash behind your back or under your armpit',
      'Using dummy seat-belt alarm silencing clips in the buckle socket',
      'Reclining passenger seats excessively flat while vehicle is in motion',
    ],
    emergencyNote: 'If a collision has occurred, inspect occupants for internal seat-belt compression injuries and alert dispatch.',
  },
  'speed-awareness': {
    title: 'Speed Awareness',
    intro: 'Excess speed reduces available decision reaction time and dramatically multiplies crash force exponentially.',
    keyRule: 'Match your travel speed to visibility, weather friction, and roadway geometry.',
    image: '/assets/images/highway_safety.jpg',
    imageCaption: 'Maintaining safe following distance and observing electronic corridor speed limits prevents collision chain reactions.',
    guidance: [
      {
        number: '01',
        heading: 'Calibrate to stopping sight distance',
        explanation: 'Ensure you can come to a complete, controlled stop within the roadway distance clearly visible ahead.',
      },
      {
        number: '02',
        heading: 'Decelerate prior to curve entry',
        explanation: 'Complete all braking in a straight line before turning the steering wheel into a bend.',
      },
      {
        number: '03',
        heading: 'Respect urban intersection limits',
        explanation: 'Drop speed when approaching flyover merge points, pedestrian zones, and busy market corridors.',
      },
      {
        number: '04',
        heading: 'Account for braking physics',
        explanation: 'Doubling your speed quadruples your vehicle stopping distance on asphalt.',
      },
    ],
    doItems: [
      'Monitor speedometer periodically rather than relying on sensory perception',
      'Drop 15 km/h below the limit during rain, fog, or nighttime darkness',
      'Maintain an open visual buffer around your vehicle in heavy traffic',
    ],
    avoidItems: [
      'Accelerating hard to beat an amber traffic light at junctions',
      'Tailgating the vehicle ahead to intimidate or pressure them to move',
      'Treating multi-lane city expressways as high-speed speedways',
    ],
    emergencyNote: 'High-speed impacts carry severe trauma risk. Alert emergency services immediately for high-G events.',
  },
  'traffic-signals': {
    title: 'Traffic Signals',
    intro: 'Intersection signals govern the right-of-way to prevent catastrophic right-angle vehicle collisions.',
    keyRule: 'Red means complete stop. Amber means prepare to halt safely.',
    guidance: [
      {
        number: '01',
        heading: 'Halt behind the solid white stop line',
        explanation: 'Leave the entire pedestrian zebra crosswalk unblocked for pedestrians and wheelchairs.',
      },
      {
        number: '02',
        heading: 'Treat amber as a stopping signal',
        explanation: 'If safe to do so without causing a rear collision, halt smoothly when the light turns amber.',
      },
      {
        number: '03',
        heading: 'Verify cross-traffic before moving on green',
        explanation: 'Scan left and right before accelerating into the intersection to check for red-light runners.',
      },
      {
        number: '04',
        heading: 'Yield on free left turns',
        explanation: 'A free left turn requires yielding unconditionally to oncoming traffic and crossing pedestrians.',
      },
    ],
    doItems: [
      'Keep your foot firmly on the brake pedal while halted at red lights',
      'Watch for illuminated pedestrian crossing signals before turning',
      'Yield to emergency ambulances and fire units regardless of light phase',
    ],
    avoidItems: [
      'Creeping forward past the stop line into active pedestrian paths',
      'Blasting your horn the instant the signal turns green',
      'Following large trucks blindly through yellow lights with zero line of sight',
    ],
    emergencyNote: 'If stranded in an active intersection after a stalled engine, turn on hazard flashers immediately.',
  },
  'mobile-distraction': {
    title: 'Mobile Phone Distraction',
    intro: 'Dividing your cognitive focus between a screen and the road severely degrades reaction reflexes.',
    keyRule: 'Zero screen interaction while operating a moving vehicle.',
    guidance: [
      {
        number: '01',
        heading: 'Set navigation before putting vehicle in drive',
        explanation: 'Mount your device securely at eye level and input destination routes prior to departure.',
      },
      {
        number: '02',
        heading: 'Activate Driving Focus mode',
        explanation: 'Silence non-critical notification chimes, text previews, and group chats automatically.',
      },
      {
        number: '03',
        heading: 'Recognize cognitive lag',
        explanation: 'The human brain requires up to 27 seconds to regain full roadway situational awareness after checking a phone.',
      },
      {
        number: '04',
        heading: 'Pull over for urgent communications',
        explanation: 'If you must read or reply to an urgent message, exit active traffic lanes and park safely.',
      },
    ],
    doItems: [
      'Use hands-free voice commands solely for essential brief responses',
      'Ask a front passenger to manage navigation changes and incoming calls',
      'Place phone inside the center console or bag if tempted to check it',
    ],
    avoidItems: [
      'Typing messages or browsing social media while waiting at red lights',
      'Holding a phone between your shoulder and ear while steering',
      'Taking calls in complex traffic, roundabouts, or merging corridors',
    ],
    emergencyNote: 'If a collision occurs due to distraction, preserve scene safety and immediately notify 112 emergency dispatch.',
  },
  'night-driving': {
    title: 'Night Driving',
    intro: 'Reduced ambient illumination compresses forward sight distance and magnifies glare fatigue.',
    keyRule: 'Dip high beams within 150 meters of opposing and preceding vehicles.',
    guidance: [
      {
        number: '01',
        heading: 'Switch to low beams when meeting traffic',
        explanation: 'Avoid blinding oncoming drivers; switch low beams the moment you see headlights or taillights.',
      },
      {
        number: '02',
        heading: 'Clean glass surfaces inside and out',
        explanation: 'A hazy interior film on windshields causes blinding optical scatter from oncoming headlights.',
      },
      {
        number: '03',
        heading: 'Look toward the left lane boundary',
        explanation: 'If blinded by oncoming high beams, guide your vehicle by watching the road edge marker on your left.',
      },
      {
        number: '04',
        heading: 'Increase following gap after sunset',
        explanation: 'Judging depth and deceleration rates of vehicles ahead is significantly more difficult in darkness.',
      },
    ],
    doItems: [
      'Ensure all headlight, taillight, and indicator lenses are clean and working',
      'Dim interior dashboard display screens to preserve natural night-vision adaptation',
      'Take regular 15-minute breaks on journeys extending past midnight',
    ],
    avoidItems: [
      'Driving with high beams on inside illuminated city street limits',
      'Wearing tinted or dark sunglasses while driving after sundown',
      'Staring directly into oncoming LED high-beam headlights',
    ],
    emergencyNote: 'If stopped on a dark road due to mechanical failure, deploy reflective markers and stay behind crash barriers.',
  },
  'rainy-road-safety': {
    title: 'Rain Safety',
    intro: 'Wet roads drastically reduce tire friction and create dangerous hydroplaning conditions.',
    keyRule: 'Double your following distance and steer with smooth, progressive inputs.',
    guidance: [
      {
        number: '01',
        heading: 'Double following cushion to 4–6 seconds',
        explanation: 'Wet asphalt increases braking distances significantly; maintain generous stopping clearance.',
      },
      {
        number: '02',
        heading: 'Combat hydroplaning calmly',
        explanation: 'If tires lift onto a layer of standing water, ease off the accelerator and hold the wheel straight.',
      },
      {
        number: '03',
        heading: 'Turn on low-beam headlights',
        explanation: 'Help other drivers spot your vehicle through spray and reduced rain visibility; avoid hazard lights while moving.',
      },
      {
        number: '04',
        heading: 'Avoid standing puddle edges',
        explanation: 'Water pooled near curb edges can conceal severe potholes and cause asymmetric steering pull.',
      },
    ],
    doItems: [
      'Inspect windshield wiper blades regularly for streak-free clearing',
      'Check tire tread depth; minimum 2.5mm is needed to evacuate water effectively',
      'Drive in the tracks cleared by preceding vehicles when safe',
    ],
    avoidItems: [
      'Slamming hard on brakes if vehicle begins skidding on water sheets',
      'Driving with 4-way hazard flashers turned on during normal moving rain',
      'Attempting to cross flooded road dips or underpasses with unknown depth',
    ],
    emergencyNote: 'If your vehicle stalls in rapidly rising water, unbuckle immediately, unlock doors, and exit to higher ground.',
  },
  'pedestrian-awareness': {
    title: 'Pedestrian Awareness',
    intro: 'Pedestrians and cyclists are the most vulnerable individuals sharing urban roadway spaces.',
    keyRule: 'Yield unconditionally at zebra crossings and anticipate foot traffic in transit zones.',
    guidance: [
      {
        number: '01',
        heading: 'Yield at marked pedestrian crossings',
        explanation: 'Bring your vehicle to a complete stop when a pedestrian steps onto a zebra crossing.',
      },
      {
        number: '02',
        heading: 'Never overtake a stopped vehicle at a crosswalk',
        explanation: 'The vehicle ahead has likely halted to allow an unseen child or pedestrian to cross safely.',
      },
      {
        number: '03',
        heading: 'Reduce speed in high foot-traffic corridors',
        explanation: 'Drive with heightened caution near schools, bus terminals, metro stations, and local markets.',
      },
      {
        number: '04',
        heading: 'Make eye contact at low speeds',
        explanation: 'Establish clear visual confirmation with crossing pedestrians before continuing through intersections.',
      },
    ],
    doItems: [
      'Leave at least 1.5 meters clearance when passing cyclists or pedestrians on shoulders',
      'Check blind spots thoroughly before opening car doors into traffic lanes',
      'Anticipate pedestrians stepping out from between parked vehicles',
    ],
    avoidItems: [
      'Honking aggressively at slow-moving elderly individuals or children crossing',
      'Blocking pedestrian curb ramps and zebra stripes with your vehicle bumper',
      'Accelerating around a vehicle that has slowed down near a transit stop',
    ],
    emergencyNote: 'In any pedestrian collision, call 112 immediately and provide comfort without moving the victim improperly.',
  },
  'breakdown-protocol': {
    title: 'Breakdown & Hazard Protocol',
    intro: 'Safely securing your vehicle and passengers during roadside stalls or tire failures prevents secondary collisions.',
    keyRule: 'Guide the vehicle to the leftmost shoulder immediately and deploy hazard triangles.',
    image: '/assets/images/breakdown_safety.jpg',
    imageCaption: 'Reflective red warning triangle deployed 50m behind disabled vehicle on highway shoulder with hazard lights active.',
    guidance: [
      {
        number: '01',
        heading: 'Activate hazard warning lights instantly',
        explanation: 'Alert trailing traffic before coasting toward the breakdown lane or hard shoulder.',
      },
      {
        number: '02',
        heading: 'Exit through passenger side doors',
        explanation: 'Never disembark toward active traffic lanes; move all occupants behind highway barriers.',
      },
      {
        number: '03',
        heading: 'Place reflective warning triangles 50m behind',
        explanation: 'Position early warning indicators to give oncoming drivers ample braking distance.',
      },
      {
        number: '04',
        heading: 'Transmit RoadSafe emergency location',
        explanation: 'Use the RoadSafe SOS button to broadcast exact GPS telemetry to rescue operators.',
      },
    ],
    doItems: [
      'Steer smoothly toward the leftmost unpaved shoulder or emergency bay',
      'Keep hazard flashers blinking throughout the recovery procedure',
      'Stand behind the metal barrier or raised verge away from asphalt',
    ],
    avoidItems: [
      'Attempting tire changes on the active roadway shoulder side',
      'Remaining seated inside a stationary car on high-speed expressways',
      'Neglecting to position reflective emergency markers behind the car',
    ],
    emergencyNote: 'If stopped in an unlit or hazardous high-speed corridor, activate RoadSafe Emergency immediately.',
  },
};

// Aliases for friendly slug routing
TOPICS_DATA['mobile-phone-distraction'] = TOPICS_DATA['mobile-distraction'];
TOPICS_DATA['mobile-distraction'] = TOPICS_DATA['mobile-phone-distraction'] || TOPICS_DATA['mobile-distraction'];
TOPICS_DATA['rain-safety'] = TOPICS_DATA['rainy-road-safety'];
TOPICS_DATA['rainy-road-safety'] = TOPICS_DATA['rain-safety'] || TOPICS_DATA['rainy-road-safety'];

interface SafetyTopicDetailViewProps {
  topicSlug?: string;
}

export const SafetyTopicDetailView: React.FC<SafetyTopicDetailViewProps> = ({ topicSlug }) => {
  const { navigate } = useRouter();

  // Normalize slug or fallback to helmet-safety
  const slug = (topicSlug || 'helmet-safety').toLowerCase();
  const data = TOPICS_DATA[slug] || TOPICS_DATA['helmet-safety'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto py-2 sm:py-6 space-y-8 sm:space-y-10 select-none"
    >
      {/* 1. Header */}
      <section className="space-y-4">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate('/safety')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Safety Hub</span>
        </button>

        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider text-[#8A8D96] uppercase px-2 py-0.5 bg-white border border-[#E2E0D8] rounded">
              ROAD SAFETY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141517]">
            {data.title}
          </h1>
          <p className="text-base sm:text-lg text-[#585A62] font-normal leading-relaxed max-w-2xl">
            {data.intro}
          </p>
        </div>

        {/* Visual Topic Banner if available */}
        {data.image && (
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E2E0D8]/80 bg-[#FAF9F5] shadow-[0_4px_20px_rgba(0,0,0,0.04)] mt-4">
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              {data.imageCaption && (
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                    Field Demonstration
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed">
                    {data.imageCaption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Key Principle (Editorial Statement) */}
      <section className="relative bg-gradient-to-br from-[#FAF9F5] via-white to-[#F5F4EE] border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#D97706]/[0.03] pointer-events-none" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96] relative z-10">
          The core directive
        </p>
        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#141517] leading-snug relative z-10">
          "{data.keyRule}"
        </blockquote>
      </section>

      {/* 3. Practical Guidance (01, 02, 03, 04) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            Standard operating procedure
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141517]">
            Practical guidance
          </h2>
        </div>

        <div className="space-y-3">
          {data.guidance.map(item => (
            <div
              key={item.number}
              className="p-5 sm:p-6 bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center text-xs font-bold font-mono text-[#141517] shrink-0 mt-0.5">
                {item.number}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#141517]">
                  {item.heading}
                </h3>
                <p className="text-xs sm:text-sm text-[#585A62] leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Do / Avoid (Balanced 2-column on desktop, stacked on mobile) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            Behavioral guidelines
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141517]">
            Directives & Risk Factors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* DO */}
          <div className="bg-[#F2F9F3]/60 border border-[#D2EED7]/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#D2EED7]/70">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B8A3E]" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#236E33]">
                DO
              </h3>
            </div>
            <ul className="space-y-3">
              {data.doItems.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#38423B] leading-relaxed">
                  <Check className="w-4 h-4 text-[#2B8A3E] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AVOID */}
          <div className="bg-[#FDF2F2]/50 border border-[#F8D7DA]/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#F8D7DA]/70">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C92A2A]" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C92A2A]">
                AVOID
              </h3>
            </div>
            <ul className="space-y-3">
              {data.avoidItems.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4E3939] leading-relaxed">
                  <CloseIcon className="w-4 h-4 text-[#C92A2A] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Emergency Note (Contextual emergency section) */}
      <section className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            If an accident has already happened
          </p>
          <p className="text-xs sm:text-sm text-[#585A62] max-w-lg leading-relaxed">
            {data.emergencyNote}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/emergency')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C92A2A] to-[#A61E1E] hover:from-[#B52525] hover:to-[#911818] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Open Emergency</span>
        </button>
      </section>
    </motion.div>
  );
};
