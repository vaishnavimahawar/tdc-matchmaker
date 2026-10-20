import fs from "node:fs";
import path from "node:path";
import type {
  Diet,
  FamilyType,
  Gender,
  MaritalStatus,
  OccupationBucket,
  Profile,
  ProfileStatus,
  Values,
} from "../lib/matching/types";

/**
 * Seeded PRNG (Mulberry32) ensures reproducible generation across runs.
 */
function createPrng(seed: number) {
  let state = seed;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createPrng(20261020);

function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randPick<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// 60 Unique Female First Names
const FEMALE_FIRST_NAMES = [
  "Aadhya", "Aanya", "Aditi", "Ahana", "Alisha", "Ananya", "Anika", "Anushka",
  "Avani", "Bhavna", "Charu", "Deepika", "Dia", "Divya", "Garima", "Gauri",
  "Isha", "Ishani", "Jasleen", "Kavya", "Keerthi", "Khushi", "Kriti", "Lavanya",
  "Madhuri", "Mansi", "Meenakshi", "Meera", "Mitali", "Navya", "Neha", "Nidhi",
  "Niharika", "Pallavi", "Pooja", "Prachi", "Prerna", "Radhika", "Rashmi", "Rhea",
  "Riddhima", "Riya", "Roshni", "Sakshi", "Samiksha", "Sanya", "Shambhavi", "Shreya",
  "Shruti", "Simran", "Sneha", "Sonali", "Tanvi", "Tara", "Trisha", "Vaishnavi",
  "Varsha", "Vidya", "Yamini", "Zara"
];

// 60 Unique Male First Names
const MALE_FIRST_NAMES = [
  "Aakash", "Aarav", "Abhay", "Abhinav", "Aditya", "Advait", "Aman", "Amit",
  "Anand", "Aniket", "Aniruddh", "Arjun", "Armaan", "Aryan", "Ayush", "Bhavin",
  "Chetan", "Darshan", "Dev", "Dhruv", "Gaurav", "Harsh", "Hrithik", "Ishaan",
  "Karan", "Kartik", "Kunal", "Madhav", "Manish", "Mayank", "Naveen", "Nikhil",
  "Nirav", "Pranav", "Prateek", "Rahul", "Rajesh", "Rishi", "Rohan", "Rohit",
  "Sachin", "Sahil", "Samar", "Sameer", "Sanjay", "Sarthak", "Saurabh", "Shashank",
  "Shivam", "Siddharth", "Soham", "Tanmay", "Tarun", "Uday", "Utkarsh", "Varun",
  "Vedant", "Vikas", "Vikram", "Yash"
];

const LAST_NAMES = [
  "Agarwal", "Bansal", "Goel", "Gupta", "Mittal", "Singhal", "Garg", // North Bania
  "Sharma", "Verma", "Trivedi", "Pandey", "Mishra", "Chaturvedi",    // North Brahmin
  "Kapoor", "Khanna", "Malhotra", "Sethi", "Bhasin", "Chadha",       // Punjabi
  "Patel", "Shah", "Mehta", "Desai", "Joshi", "Parikh",              // Gujarati
  "Iyer", "Iyengar", "Natarajan", "Subramanian", "Raman", "Balaji",  // Tamil
  "Reddy", "Rao", "Chowdary", "Naidu", "Varma",                      // Telugu
  "Banerjee", "Mukherjee", "Chatterjee", "Bose", "Ghosh", "Sen",     // Bengali
  "Jain", "Lodha", "Kothari", "Surana", "Bhandari",                  // Jain / Marwari
  "Khan", "Ahmed", "Syed", "Qureshi", "Mirza",                       // Muslim
  "Kulkarni", "Deshmukh", "Patil", "Shinde", "Pawar",                // Marathi
  "Nair", "Menon", "Pillai", "Kurian", "Mathew"                      // Kerala
];

type LocationInfo = {
  city: string;
  state: string;
  isMetro: boolean;
};

const LOCATIONS: LocationInfo[] = [
  { city: "Mumbai", state: "Maharashtra", isMetro: true },
  { city: "Delhi", state: "Delhi", isMetro: true },
  { city: "Bengaluru", state: "Karnataka", isMetro: true },
  { city: "Pune", state: "Maharashtra", isMetro: true },
  { city: "Hyderabad", state: "Telangana", isMetro: true },
  { city: "Bhopal", state: "Madhya Pradesh", isMetro: false },
  { city: "Indore", state: "Madhya Pradesh", isMetro: false },
  { city: "Jaipur", state: "Rajasthan", isMetro: false },
  { city: "Chennai", state: "Tamil Nadu", isMetro: true },
  { city: "Kolkata", state: "West Bengal", isMetro: true },
  { city: "London", state: "United Kingdom", isMetro: true },
  { city: "Singapore", state: "Singapore", isMetro: true },
  { city: "Dubai", state: "United Arab Emirates", isMetro: true },
  { city: "New York", state: "United States", isMetro: true },
];

type CultureInfo = {
  community: string;
  religion: string;
  motherTongue: string;
  gotras: string[];
  commonDiets: Diet[];
};

const CULTURES: CultureInfo[] = [
  {
    community: "Agarwal",
    religion: "Hindu",
    motherTongue: "Hindi",
    gotras: ["Garg", "Bansal", "Mittal", "Goel", "Jindal", "Singhal", "Kansal"],
    commonDiets: ["veg", "jain"],
  },
  {
    community: "Tamil Brahmin",
    religion: "Hindu",
    motherTongue: "Tamil",
    gotras: ["Bharadwaj", "Kashyapa", "Kaushika", "Vadhula", "Gauthama", "Haritha"],
    commonDiets: ["veg"],
  },
  {
    community: "Punjabi Khatri",
    religion: "Hindu",
    motherTongue: "Punjabi",
    gotras: ["Kapoor", "Sethi", "Khanna", "Sahni", "Malhotra"],
    commonDiets: ["non_veg", "eggetarian", "veg"],
  },
  {
    community: "Patel",
    religion: "Hindu",
    motherTongue: "Gujarati",
    gotras: ["Kashyap", "Sandilya", "Vatsa"],
    commonDiets: ["veg", "jain"],
  },
  {
    community: "Reddy",
    religion: "Hindu",
    motherTongue: "Telugu",
    gotras: ["Pakanati", "Motati", "Pedakanti", "Gudati"],
    commonDiets: ["non_veg", "eggetarian"],
  },
  {
    community: "Bengali",
    religion: "Hindu",
    motherTongue: "Bengali",
    gotras: ["Sandilya", "Kashyap", "Bharadwaj", "Alambayana"],
    commonDiets: ["non_veg", "eggetarian"],
  },
  {
    community: "Jain",
    religion: "Jainism",
    motherTongue: "Hindi",
    gotras: ["Kashyap", "Gautam", "Parshvanath"],
    commonDiets: ["jain", "veg"],
  },
  {
    community: "Hyderabadi Muslim",
    religion: "Islam",
    motherTongue: "Urdu",
    gotras: [],
    commonDiets: ["non_veg"],
  },
  {
    community: "Maharashtrian Brahmin",
    religion: "Hindu",
    motherTongue: "Marathi",
    gotras: ["Vashishta", "Jamadagni", "Bharadwaj", "Atri"],
    commonDiets: ["veg", "eggetarian"],
  },
  {
    community: "Malayali",
    religion: "Hindu",
    motherTongue: "Malayalam",
    gotras: [],
    commonDiets: ["non_veg", "eggetarian"],
  },
];

type ProfessionTemplate = {
  bucket: OccupationBucket;
  occupations: string[];
  educations: { title: string; rank: number }[];
  baseIncomeByAge: (age: number) => number;
};

const PROFESSIONS: ProfessionTemplate[] = [
  {
    bucket: "tech",
    occupations: [
      "Staff Software Engineer",
      "Principal Product Manager",
      "Cloud Architect",
      "Senior Frontend Engineer",
      "AI/ML Research Scientist",
      "VP of Engineering",
      "DevOps Lead",
      "Mobile Tech Lead",
    ],
    educations: [
      { title: "B.Tech, IIT Bombay", rank: 4 },
      { title: "MS in Computer Science, CMU", rank: 4 },
      { title: "B.Tech, BITS Pilani", rank: 4 },
      { title: "B.E. Computer Science, VJTI", rank: 3 },
      { title: "M.Tech, IIIT Hyderabad", rank: 4 },
    ],
    baseIncomeByAge: (age) => Math.round(18 + (age - 22) * 4.2 + randInt(-3, 8)),
  },
  {
    bucket: "finance",
    occupations: [
      "Chartered Accountant",
      "Investment Banking Associate",
      "Private Equity Analyst",
      "VP, Risk Management",
      "Treasury Manager",
      "Portfolio Strategist",
    ],
    educations: [
      { title: "CA, First Attempt (Ranked)", rank: 4 },
      { title: "MBA Finance, IIM Ahmedabad", rank: 4 },
      { title: "CFA, Level 3 Qualified", rank: 4 },
      { title: "M.Com, Shri Ram College of Commerce", rank: 3 },
      { title: "MBA, SPJIMR Mumbai", rank: 4 },
    ],
    baseIncomeByAge: (age) => Math.round(14 + (age - 22) * 3.8 + randInt(-4, 6)),
  },
  {
    bucket: "medicine",
    occupations: [
      "Senior Resident, Cardiology",
      "Consultant Pediatrician",
      "Radiologist",
      "Orthopedic Surgeon",
      "Dermatologist & Cosmetologist",
      "Dental Surgeon",
    ],
    educations: [
      { title: "MBBS, MD (Medicine), AIIMS New Delhi", rank: 4 },
      { title: "MBBS, MS (Surgery), CMC Vellore", rank: 4 },
      { title: "MDS, Conservative Dentistry", rank: 4 },
      { title: "MBBS, KMC Manipal", rank: 3 },
    ],
    baseIncomeByAge: (age) => Math.round(12 + (age - 22) * 3.2 + randInt(-2, 5)),
  },
  {
    bucket: "business",
    occupations: [
      "Managing Director, Family Textiles",
      "Founder & CEO, D2C Wellness",
      "Operations Director, Auto Ancillaries",
      "Partner, Construction & Infra Firm",
      "Retail Chain Regional Head",
    ],
    educations: [
      { title: "MBA, ISB Hyderabad", rank: 4 },
      { title: "B.Com (Hons), Narsee Monjee", rank: 3 },
      { title: "M.Sc International Business, Manchester", rank: 4 },
      { title: "BBA, Family Business Management", rank: 2 },
    ],
    baseIncomeByAge: (age) => Math.round(16 + (age - 22) * 4.6 + randInt(-5, 12)),
  },
  {
    bucket: "creative",
    occupations: [
      "Principal UX Architect",
      "Lead Interior Architect",
      "Brand & Design Director",
      "Creative Producer & Filmmaker",
      "Urban Landscape Designer",
    ],
    educations: [
      { title: "B.Des, National Institute of Design", rank: 3 },
      { title: "M.Arch, CEPT University", rank: 4 },
      { title: "Master of Fine Arts, JJ School of Art", rank: 3 },
      { title: "B.Arch, SPA Delhi", rank: 3 },
    ],
    baseIncomeByAge: (age) => Math.round(10 + (age - 22) * 2.8 + randInt(-2, 5)),
  },
  {
    bucket: "public",
    occupations: [
      "Assistant Commissioner, IRS",
      "Deputy Director, Ministry of Commerce",
      "State Civil Services Officer",
      "Policy Research Specialist, NITI Aayog",
    ],
    educations: [
      { title: "BA (Hons) History, St. Stephen's; UPSC CSE", rank: 4 },
      { title: "MA Public Policy, NLSIU", rank: 4 },
      { title: "B.Tech & State Admin Services", rank: 3 },
    ],
    baseIncomeByAge: (age) => Math.round(10 + (age - 22) * 1.8 + randInt(-1, 3)),
  },
  {
    bucket: "other",
    occupations: [
      "Corporate Legal Counsel",
      "Senior HR Business Partner",
      "Global Supply Chain Lead",
      "Management Consultant",
    ],
    educations: [
      { title: "BA LLB (Hons), NALSAR Hyderabad", rank: 4 },
      { title: "MBA HR, XLRI Jamshedpur", rank: 4 },
      { title: "B.Tech + MBA, Symbiosis Pune", rank: 3 },
    ],
    baseIncomeByAge: (age) => Math.round(13 + (age - 22) * 3.3 + randInt(-3, 6)),
  },
];

// 120 unique about / bio lines (60 female, 60 male)
const FEMALE_BIOS = [
  "Early morning runner, filter-coffee purist, and weekend ceramicist who cherishes quiet home evenings.",
  "Believes family dinners are non-negotiable; enjoys hosting terrace barbecues and exploring heritage art walks.",
  "Driven tech strategist on weekdays; spends Saturdays volunteering at animal shelters and baking sourdough.",
  "Rooted in classical Bharatanatyam while thriving in fast-paced corporate product roadmaps.",
  "A thoughtful listener with a warm sense of humor, fond of monsoon road trips and indie bookshops.",
  "Values intellectual depth, open communication, and laughing through failed culinary experiments.",
  "Balanced modern perspective grounded in respectful family traditions; passionate about sustainable architecture.",
  "Avid badminton player and amateur violinist looking for someone who values career ambition and personal downtime.",
  "Loves Sunday crosswords, old Hindi melodies, and impromptu travel plans across coastal towns.",
  "Warm-hearted CA who manages spreadsheets with precision and weekend treks with pure enthusiasm.",
  "Passionate pediatric resident who unwinds with watercolor painting and deep family conversations.",
  "Pragmatic, emotionally grounded, and loves finding hidden coffee spots in old city quarters.",
  "Equal parts ambitious and domestic; enjoys organizing intimate dinners with close friends and cousins.",
  "Close to her grandparents, deeply respectful of traditions, yet completely independent in thought.",
  "Tech professional who values mental wellness, mindfulness retreats, and board game marathons.",
  "Design lead with an eye for aesthetics and an undeniable weakness for street food and old cinema.",
  "Easygoing nature paired with clear long-term goals; dreams of building a home filled with books and plants.",
  "Loves mountain hikes, Carnatic concerts, and meaningful conversations that go beyond small talk.",
  "Empathetic, clear-headed, and dedicated to both professional excellence and family harmony.",
  "Grounded Gujarati girl who can talk balance sheets or Garba steps with equal passion.",
  "Creative director who loves interior styling, flea markets, and peaceful tea on the balcony.",
  "Believes a great marriage thrives on mutual respect, shared laughter, and personal space.",
  "Spiritual yet progressive; cherishes festival celebrations and quiet reading corners alike.",
  "Enjoys weekend cycling, specialty brewing, and honest conversations over long walks.",
  "Warm personality with an infectious laugh; believes in growing together while celebrating each other's wins.",
  "Calm presence in a busy city, fond of historical podcasts, gardening, and family gatherings.",
  "Passionate about education and social impact; enjoys theatre weekends and culinary experiments.",
  "Independent architect who loves minimalist design, classical vocal music, and thoughtful travel.",
  "Known among friends for her sharp wit, loyalty, and unmatched playlist curation skills.",
  "Family-oriented professional who values financial prudence, emotional security, and good humor.",
  "Cherishes her morning meditation, Sunday brunch routines, and sincere, transparent conversations.",
  "Doctor by profession, nature lover at heart, seeking a compassionate partner to share life's simple joys.",
  "Thoughtful and articulate; enjoys live music gigs, dog walking, and planning yearly beach trips.",
  "Values simplicity, ethical living, and a partner who treats everyone with kindness.",
  "Dynamic corporate lawyer who prioritizes family get-togethers and evening strolls after work.",
  "Loves cooking regional delicacies from scratch and curling up with non-fiction history.",
  "Optimistic and supportive; believes life is best enjoyed with curiosity, kindness, and humor.",
  "Enthusiastic photographer who captures family moments and loves weekend drives through the hills.",
  "Comfortable in traditional silk sarees and trekking boots alike; values emotional honesty above all.",
  "Strategic thinker at work, warm daughter and sister at home; seeks an equal partner in every sense.",
  "Enjoys poetry recitals, heritage walks, and spending festive holidays surrounded by cousins.",
  "Rooted in South Indian traditions, enjoys modern art galleries and weekend baking rituals.",
  "Quiet confidence with a big heart; seeks a genuine companionship built on trust and shared values.",
  "Financial analyst who balances career momentum with home-cooked meals and badminton matches.",
  "Loves road trips, visiting ancient temples, and having late-night philosophical chats.",
  "Affectionate, organized, and deeply loyal; wants a partner who embraces both ambition and family warmth.",
  "Believes in continuous self-improvement, fitness, and keeping weekends sacred for family.",
  "Creative soul working in UI/UX; loves pottery, indie music festivals, and exploring street markets.",
  "Grounded personality with strong moral compass; loves evening terrace tea with parents.",
  "Curious traveler who collects postcards, reads architectural history, and loves quiet mornings.",
  "Balances corporate consulting with Hindustani classical vocals; values patience and warmth.",
  "Energetic, supportive, and loves planning family road trips across historic destinations.",
  "Believes emotional maturity and a sense of humor are the foundation of any lasting bond.",
  "Prudent investor, enthusiastic plant mom, and lover of regional Indian cuisine.",
  "Values clear communication, shared laughter over tea, and standing by each other through life's phases.",
  "Healthcare specialist who finds peace in yoga, weekend farm visits, and classical music.",
  "Warm, welcoming hostess who brings positive energy and thoughtful care into every space.",
  "Loves crisp winter mornings, volunteering on weekends, and heartfelt conversation with elders.",
  "Creative marketer with an adventurous spirit; enjoys kayaking, baking, and quiet movie nights.",
  "Seeking an honest, intellectually curious partner who values kindness and mutual encouragement."
];

const MALE_BIOS = [
  "Early morning cyclist and software architect who never skips Sunday lunch with his parents.",
  "Calm, thoughtful problem solver who values straightforward communication and quiet mountain vacations.",
  "Fintech founder with grounded values; loves cooking regional curries and watching cricket test matches.",
  "Believes in staying humble, working with purpose, and keeping family at the absolute center of life.",
  "Loves weekend book hunts, black coffee, and driving down coastal highways with classic rock playing.",
  "Empathetic doctor who balances demanding hospital hours with family dinners and badminton matches.",
  "Values emotional stability, mutual respect, and laughing together through life's unexpected twists.",
  "Curious engineer who tinkers with home automation, plays amateur tennis, and loves lively family dinners.",
  "Pragmatic yet warm; believes marriage is about partnership, shared values, and steady encouragement.",
  "Investment analyst who enjoys morning jogging, exploring local street food, and weekend film festivals.",
  "Quiet confidence with deep respect for elders; enjoys weekend carpentry and family get-togethers.",
  "Tech lead by day, weekend home chef who loves experimenting with slow-cooked biryanis and pastas.",
  "Focused on career growth while ensuring weekends are dedicated to parents, fitness, and relaxation.",
  "Grounded Punjabi boy who values honesty, close-knit family bonds, and energetic celebratory dinners.",
  "Civil servant with high integrity, a wry sense of humor, and a genuine interest in social development.",
  "Believes in financial wisdom, healthy habits, and celebrating both small wins and major milestones.",
  "Product director who loves minimalist interiors, indie podcasts, and weekend tennis matches.",
  "Compassionate listener who believes a great partnership starts with transparency and patience.",
  "Takes work seriously but never takes himself too seriously; avid chess player and weekend hiker.",
  "Third-generation business owner who respects traditional roots while driving modern expansion.",
  "Architect with a keen eye for heritage preservation; enjoys sketching old monuments and quiet reads.",
  "Believes in teamwork, equality at home, and carving out dedicated time for travel every year.",
  "Warm personality who easily connects across generations; loves family road trips and cricket.",
  "Fitness enthusiast who starts his day at 6 AM and winds down with non-fiction reading and herbal tea.",
  "Supportive brother and son who wants a partner with her own aspirations and passions.",
  "Enjoys open-air live music, brewing espresso, and having long weekend conversations over brunch.",
  "Prudent, disciplined, and genuinely kind; seeks a companion who values family warmth and peace of mind.",
  "Dedicated surgeon who finds relaxation in long evening runs, classical instrumental music, and chess.",
  "Believes in mutual compromise, open dialogue, and never letting ego stand in the way of harmony.",
  "Loves weekend drives to the outskirts, visiting organic farmers' markets, and camping under stars.",
  "Creative brand strategist who enjoys photography, historic walking tours, and family board games.",
  "Patient and dependable; values honest communication and making his partner feel genuinely heard.",
  "Passionate about clean tech; spends free time reading philosophy and swimming laps.",
  "Rooted in South Indian cultural traditions, enjoys carnatic flute, and loves cooking for the family.",
  "Straightforward and transparent; believes a strong relationship thrives on trust and lighthearted humor.",
  "Corporate attorney with a calm demeanor; loves weekend tennis, history books, and filter coffee.",
  "Family-oriented entrepreneur who values simple pleasures, evening walks, and deep loyalty.",
  "Enjoys curating jazz playlists, exploring coastal seafood spots, and spending quiet Sundays at home.",
  "Optimistic and grounded; believes in building a loving home filled with warmth, respect, and laughter.",
  "Tech consultant who travels often for work but treasures coming home to home-cooked meals.",
  "Believes in giving 100% to both profession and family; avid runner and amateur landscape painter.",
  "Respectful of tradition with progressive values; loves festival gatherings and quiet evening reads.",
  "Calm presence in high-stress situations; values balance, fitness, and spending quality time with elders.",
  "Easygoing nature, loyal to friends and family; enjoys weekend barbecue sessions and classic cinema.",
  "Driven operations director who values punctuality, mutual support, and sharing life's daily highlights.",
  "Enjoys outdoor trekking, wildlife photography, and deep conversations about human nature and society.",
  "Warm, grounded CA who values family guidance and looks forward to building a meaningful future together.",
  "Pragmatic thinker who enjoys financial planning, cycling along scenic routes, and family dinners.",
  "Curious mind with an interest in global affairs, world cinema, and regular badminton sessions.",
  "Values honesty and emotional presence above everything; loves cooking breakfast on Sunday mornings.",
  "Software engineer with an adventurous streak; enjoys mountain climbing, scuba diving, and quiet tea.",
  "Kind-hearted and responsible; seeks an authentic partnership where both people can be their true selves.",
  "Believes laughter and mutual respect keep a marriage resilient; loves comedy clubs and indie movies.",
  "Family-first professional who appreciates heritage architecture, traditional rituals, and good literature.",
  "Grounded, health-conscious, and loves weekend nature retreats away from city hustle.",
  "Dedicated professional with a creative side; loves playing acoustic guitar and cooking family meals.",
  "Patient, emotionally mature, and looking for a meaningful life partnership grounded in shared values.",
  "Loves discovering offbeat destinations, road-tripping with cousins, and brewing the perfect pour-over.",
  "Dependable and honest; values clear communication, domestic tranquility, and shared laughter.",
  "Driven yet grounded; looking for a kind, forward-thinking partner to build a joyful life with."
];

// Matchmaker note templates
const MATCHMAKER_NOTE_TEMPLATES = [
  "Very polite and articulate on the phone. Family is well-settled and values good education.",
  "High intent to settle down within 6-12 months. Open-minded parents who respect candidate's choice.",
  "Candidate prioritizes emotional connection and mutual respect over strict horoscope matching.",
  "Family has strong roots in the community but candidate is modern in lifestyle and communication.",
  "Extremely well-spoken; clear about career aspirations and expects an intellectually equal partner.",
  "Warm family background. Mother is keen on vegetarian household; candidate is slightly more flexible.",
  "Candidate is independent, lives on own, and values financial transparency and shared home roles.",
  "Family prefers same or allied community, but candidate is open to broad matches if values align.",
  "Prefers someone with a calm demeanor. Both parents are retired professionals.",
  "High-achiever professionally, very grounded personally. Flexible on city for the right person.",
];

export function generateProfilesPool(): Profile[] {
  const pool: Profile[] = [];
  const assignedMatchmakers = ["priya", "rakesh"];

  // Helper to generate 60 profiles of a given gender
  function generateGenderSet(
    gender: Gender,
    firstNames: string[],
    bios: string[],
    minH: number,
    maxH: number,
    offset: number
  ) {
    for (let i = 0; i < 60; i++) {
      const index = offset + i;
      const firstName = firstNames[i];
      const lastName = LAST_NAMES[i % LAST_NAMES.length];
      const id = `${slugify(firstName)}-${slugify(lastName)}-${index + 1}`;
      const matchmakerId = assignedMatchmakers[i % 2];

      const age = randInt(22, 38);
      const heightCm = randInt(minH, maxH);
      const loc = randPick(LOCATIONS);
      const cult = randPick(CULTURES);
      const gotra = cult.gotras.length > 0 ? randPick(cult.gotras) : undefined;
      const diet = randPick(cult.commonDiets);

      const profTemplate = randPick(PROFESSIONS);
      const occupation = randPick(profTemplate.occupations);
      const educationObj = randPick(profTemplate.educations);
      const incomeLakh = Math.max(8, profTemplate.baseIncomeByAge(age));

      const familyType: FamilyType = randPick(["nuclear", "joint", "flexible"]);
      const values: Values = randPick(["balanced", "traditional", "progressive"]);

      // Marital status distribution: ~85% never_married, ~12% divorced, ~3% widowed
      const msRoll = random();
      const maritalStatus: MaritalStatus =
        msRoll < 0.85 ? "never_married" : msRoll < 0.97 ? "divorced" : "widowed";

      // Status: 75% active, 15% intro_pending, 10% on_hold
      const stRoll = random();
      const status: ProfileStatus =
        stRoll < 0.75 ? "active" : stRoll < 0.90 ? "intro_pending" : "on_hold";

      // 90% verified true (e.g. index % 10 !== 7 gives exactly 90% true)
      const verified = i % 10 !== 7;

      const wantKids = random() > 0.15; // 85% yes
      const openToRelocate = random() > 0.35; // 65% open
      const openToPets = random() > 0.30; // 70% open

      const bio = bios[i];

      // Partner preferences realistic for this profile
      const ageMin = gender === "man" ? Math.max(21, age - randInt(1, 4)) : Math.max(21, age - 1);
      const ageMax = gender === "man" ? age + randInt(1, 2) : age + randInt(2, 6);

      const prefCities = [loc.city];
      const otherMetros = LOCATIONS.filter((l) => l.isMetro && l.city !== loc.city).map(
        (l) => l.city
      );
      if (openToRelocate) {
        prefCities.push(randPick(otherMetros));
        prefCities.push(randPick(otherMetros));
      }
      const uniqueCities = [...new Set(prefCities)];

      const prefCommunities =
        random() < 0.6 ? [cult.community] : []; // 60% prefer same community, 40% open

      const prefDiets: Diet[] =
        diet === "jain"
          ? ["jain", "veg"]
          : diet === "veg"
          ? ["veg", "eggetarian"]
          : ["non_veg", "eggetarian", "veg"];

      const prefFamilyTypes: FamilyType[] =
        familyType === "joint" ? ["joint", "flexible"] : ["nuclear", "flexible"];

      const preferences = {
        ageMin,
        ageMax,
        cities: uniqueCities,
        communities: prefCommunities,
        diets: prefDiets,
        familyTypes: prefFamilyTypes,
        minEducationRank: Math.max(2, educationObj.rank - 1),
      };

      const matchmakerNotes = randPick(MATCHMAKER_NOTE_TEMPLATES);

      const profile: Profile = {
        id,
        matchmakerId,
        firstName,
        lastName,
        gender,
        age,
        heightCm,
        city: loc.city,
        state: loc.state,
        community: cult.community,
        gotra,
        motherTongue: cult.motherTongue,
        education: educationObj.title,
        educationRank: educationObj.rank,
        occupation,
        occupationBucket: profTemplate.bucket,
        incomeLakh,
        maritalStatus,
        familyType,
        diet,
        values,
        bio,
        about: bio,
        preferences,
        matchmakerNotes,
        status,
        verified,
        wantKids,
        openToRelocate,
        openToPets,
        religion: cult.religion,
        caste: cult.community,
      };

      pool.push(profile);
    }
  }

  // 60 women (heights 150-175 cm)
  generateGenderSet("woman", FEMALE_FIRST_NAMES, FEMALE_BIOS, 150, 175, 0);

  // 60 men (heights 163-190 cm)
  generateGenderSet("man", MALE_FIRST_NAMES, MALE_BIOS, 163, 190, 60);

  return pool;
}

// Write to data/pool.json when run directly
const pool = generateProfilesPool();
const outPath = path.resolve(__dirname, "../data/pool.json");

fs.writeFileSync(outPath, JSON.stringify(pool, null, 2) + "\n", "utf8");

const menCount = pool.filter((p) => p.gender === "man").length;
const womenCount = pool.filter((p) => p.gender === "woman").length;
const verifiedCount = pool.filter((p) => p.verified).length;

console.log(`Generated pool of ${pool.length} profiles successfully!`);
console.log(`- Men: ${menCount}`);
console.log(`- Women: ${womenCount}`);
console.log(`- Verified: ${verifiedCount} (${((verifiedCount / pool.length) * 100).toFixed(1)}%)`);
console.log(`- Written to: ${outPath}`);
