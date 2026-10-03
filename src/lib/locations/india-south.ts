import type { Place } from "./types";

// South India — Hyderabad and Bengaluru are priority markets.

export const SOUTH: Place[] = [
  {
    slug: "telangana",
    name: "Telangana",
    kind: "state",
    region: "Telangana",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in Telangana | Aksharum",
    description:
      "School ERP for Telangana's SSC, CBSE, ICSE and IB schools: attendance, online fees, exams, report cards and multi-branch management on one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "Telangana",
    lead: "Telangana's schools range from state-board SSC schools in every district to CBSE, ICSE and international campuses in Hyderabad. Aksharum brings admissions, attendance, fees, exams and parent communication into one cloud platform that fits all of them.",
    sections: [
      {
        heading: "State board and central boards together",
        body: "Class 10 students in Telangana's state-board schools take the SSC examination of the Board of Secondary Education, Telangana, while intermediate education (classes 11 and 12) is overseen by the state's Board of Intermediate Education. CBSE and ICSE schools have grown quickly, particularly around Hyderabad.\n\nIn Aksharum, each school defines its own classes, subjects and exam terms, so every board's results and report cards come from one platform.",
      },
      {
        heading: "Built for multi-branch school groups",
        body: "Telangana is home to many school groups that run branches across several districts. Aksharum grows from one campus to many without changing software; every branch's data is isolated in its own environment and protected by server-side role checks, so staff only ever see their own school.",
      },
      {
        heading: "Telugu, Urdu, Hindi and English",
        body: "Families across Telangana read Telugu, Urdu, Hindi or English. Circulars and messages are written by your school, so each notice can go out in the language its readers prefer — targeted at exactly the classes it concerns.",
      },
    ],
    boards: [
      "BSE Telangana (SSC)", "Telangana Board of Intermediate Education", "CBSE",
      "CISCE (ICSE / ISC)", "IB", "Cambridge (IGCSE)",
    ],
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    areas: [
      "Hyderabad", "Secunderabad", "Warangal", "Karimnagar", "Nizamabad",
      "Khammam", "Mahbubnagar", "Nalgonda", "Siddipet", "Sangareddy",
      "Adilabad", "Suryapet",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support Telangana state-board (SSC) schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school during onboarding, so SSC schools use the same exam, report-card, attendance and fee modules as CBSE and ICSE schools.",
      },
      {
        q: "Can a school group with branches across Telangana use Aksharum?",
        a: "Yes. Aksharum scales from a single campus to multiple branches without changing software, and each branch's data stays isolated and secure.",
      },
      {
        q: "How long does implementation take?",
        a: "Setup, import of your existing data and staff onboarding are typically completed within a single working day, with no IT department required.",
      },
    ],
    related: ["karnataka", "maharashtra", "tamil-nadu", "odisha"],
    topics: ["multiple campuses", "CBSE", "exam"],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    kind: "city",
    parent: "telangana",
    region: "Telangana",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in Hyderabad | Aksharum",
    description:
      "School ERP for Hyderabad's SSC, CBSE, ICSE and IB schools: attendance, online fees, exams, report cards, bus tracking and parent alerts on one platform.",
    h1: "School ERP Software in",
    h1Em: "Hyderabad",
    lead: "Hyderabad's school landscape has grown with the city — from established schools in Secunderabad and Banjara Hills to new campuses along the IT corridor in Gachibowli, Kondapur and Kokapet. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Made for multi-branch school groups",
        body: "Many Hyderabad schools belong to groups that run several branches across the city. Aksharum scales from a single campus to multiple branches without changing software, keeps each school's data isolated in its own environment, and gives each principal a live dashboard of attendance, fee collection and results.",
      },
      {
        heading: "Testing culture, without the paperwork",
        body: "Many Hyderabad schools put a strong emphasis on regular testing. Aksharum's timed online MCQ exams log tab switches and window changes server-side, submit automatically when time runs out and show class performance and question-level analysis the moment the test ends — no manual marking.",
      },
      {
        heading: "Parents who expect digital updates",
        body: "With so many parents working in technology, Hyderabad families expect instant, digital communication. Aksharum alerts them the moment a child is marked absent, notifies them as soon as results are published and lets them message teachers directly — without adding work for staff.",
      },
      {
        heading: "Transport across a sprawling city",
        body: "Commutes from Miyapur, Kompally or LB Nagar to schools in the west of the city can be long. Live bus tracking shows parents where the bus is, and delays trigger automatic notifications.",
      },
    ],
    boards: ["BSE Telangana (SSC)", "CBSE", "CISCE (ICSE / ISC)", "IB", "Cambridge (IGCSE)"],
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    areas: [
      "Gachibowli", "Kondapur", "Madhapur", "HITEC City", "Kokapet",
      "Manikonda", "Kukatpally", "Miyapur", "Nizampet", "Bachupally",
      "Kompally", "Secunderabad", "Begumpet", "Banjara Hills", "Jubilee Hills",
      "Ameerpet", "Dilsukhnagar", "LB Nagar", "Uppal", "Shamshabad",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "What is the best school ERP software in Hyderabad?",
        a: "For most Hyderabad schools the best school ERP is one that manages several branches, runs regular online tests, collects fees online, tracks buses and keeps parents informed in real time. Aksharum does all of this on one platform — book a free demo to see it with your own school's workflows.",
      },
      {
        q: "Can a school group with many branches in Hyderabad use Aksharum?",
        a: "Yes. Aksharum grows from a single campus to multiple branches without changing software. Every branch's data stays isolated, and access is enforced by role on every request.",
      },
      {
        q: "Does Aksharum support online tests for regular practice?",
        a: "Yes. Teachers create timed MCQ tests; tab switches, window blur and focus loss are logged server-side, tests auto-submit when time runs out, and results with question-level analysis are ready the moment the test ends.",
      },
      {
        q: "Can parents in Hyderabad track the school bus?",
        a: "Yes. Parents see the bus's live position on its route, and delays trigger automatic notifications.",
      },
    ],
    related: ["bangalore", "chennai", "pune", "mumbai"],
    topics: ["exam", "multiple campuses", "transport"],
  },
  {
    slug: "karnataka",
    name: "Karnataka",
    kind: "state",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in Karnataka | Aksharum",
    description:
      "School ERP for Karnataka's SSLC, PUC, CBSE, ICSE and IB schools: attendance, online fees, exams, report cards and parent alerts on one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "Karnataka",
    lead: "Karnataka's schools span state-board SSLC schools, pre-university colleges, and CBSE, ICSE and international schools concentrated in Bengaluru. Aksharum gives every one of them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "SSLC, PUC and central boards",
        body: "State-board students in Karnataka sit the SSLC examination in Class 10 and the second-year PUC examination in Class 12, both conducted by the Karnataka School Examination and Assessment Board (KSEAB). CBSE, ICSE, IB and Cambridge schools are common in Bengaluru and growing in Mysuru, Mangaluru and Hubballi–Dharwad. Aksharum lets each school define its own classes, subjects, exam terms and grading.",
      },
      {
        heading: "Clean records for state reporting",
        body: "State-board schools in Karnataka keep student records on the state's Students Achievement Tracking System (SATS). Keeping one accurate, up-to-date record per student in Aksharum — admission details, attendance, results and documents — makes that reporting far less painful.",
      },
      {
        heading: "Kannada and English, side by side",
        body: "Kannada is taught in schools across the state, and families read Kannada, English, Hindi, Tamil or Telugu. Circulars and messages are written by your school, so each notice can go out in the language its readers prefer.",
      },
    ],
    boards: ["KSEAB (SSLC / II PUC)", "CBSE", "CISCE (ICSE / ISC)", "IB", "Cambridge (IGCSE)"],
    languages: ["Kannada", "English", "Hindi", "Tamil", "Telugu"],
    areas: [
      "Bengaluru", "Mysuru", "Mangaluru", "Hubballi–Dharwad", "Belagavi",
      "Kalaburagi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru",
      "Udupi", "Vijayapura",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support Karnataka state-board (SSLC) schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so SSLC schools run exams, report cards, attendance and fees on the same platform as CBSE and ICSE schools.",
      },
      {
        q: "Can we keep complete student records in Aksharum?",
        a: "Yes. Every student has one digital profile holding their admission details, attendance, results, achievements and documents.",
      },
      {
        q: "Is pricing the same for small and large schools?",
        a: "Pricing is modular and depends on school size and the modules you switch on, with no minimum seat count — the platform and its quality are the same for every school.",
      },
    ],
    related: ["telangana", "tamil-nadu", "maharashtra"],
    topics: ["student information", "document", "CBSE"],
  },
  {
    slug: "bangalore",
    name: "Bengaluru",
    alias: "Bangalore",
    kind: "city",
    parent: "karnataka",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in Bangalore (Bengaluru) | Aksharum",
    description:
      "School ERP for Bangalore's CBSE, ICSE, state-board and IB schools: attendance, online fees, exams, live bus tracking and parent alerts on one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "Bengaluru",
    lead: "Bengaluru — Bangalore to many — has one of India's most varied school landscapes: state-board and CBSE schools, a large number of ICSE schools and a fast-growing set of international campuses. Aksharum gives all of them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Traffic-proof transport",
        body: "Bengaluru's traffic makes the school bus one of a parent's biggest worries. Live route tracking shows exactly where the bus is, and delays trigger automatic notifications — so parents on Outer Ring Road or Sarjapur Road aren't left guessing, and the school office isn't flooded with calls.",
      },
      {
        heading: "Parents who live on their phones",
        body: "Many Bangalore parents work in technology and expect instant updates. Aksharum alerts them the moment a child is marked absent, notifies them as soon as results are published and sends fee reminders before every due date — and lets them message teachers directly.",
      },
      {
        heading: "Coding is part of the curriculum",
        body: "For schools that teach programming, Aksharum includes an in-browser coding environment where students write, run and submit code without installing anything, plus a video library for every subject with watch tracking — all under one login.",
      },
      {
        heading: "Kannada and beyond",
        body: "Kannada is taught in schools across Karnataka, and Bengaluru families also read English, Hindi, Tamil and Telugu. Circulars and messages are written by your school, so they can go out in whichever language your parents read.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "KSEAB (SSLC / II PUC)", "IB", "Cambridge (IGCSE)"],
    languages: ["Kannada", "English", "Hindi", "Tamil", "Telugu"],
    areas: [
      "Whitefield", "Electronic City", "Sarjapur Road", "HSR Layout",
      "Koramangala", "Indiranagar", "Marathahalli", "Bellandur", "JP Nagar",
      "Jayanagar", "Bannerghatta Road", "Kanakapura Road", "Rajajinagar",
      "Malleshwaram", "Hebbal", "Yelahanka", "Hennur", "RT Nagar",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "What is the best school ERP software in Bangalore?",
        a: "The best school ERP for a Bangalore school handles its board's exams and report cards, collects fees online, tracks buses through the city's traffic and keeps parents informed in real time. Aksharum covers all of this on one platform — book a free demo to see it with your own school's workflows.",
      },
      {
        q: "Does Aksharum work for ICSE and CBSE schools in Bengaluru?",
        a: "Yes. Each school sets up its own classes, subjects, exam terms and grading, teachers enter marks once, and every student gets a PDF report card when results are published.",
      },
      {
        q: "Can parents track the school bus in real time?",
        a: "Yes. Parents see the bus's live location, and delays trigger automatic notifications.",
      },
      {
        q: "How secure is student data?",
        a: "Every school runs in its own isolated environment; every request is checked server-side for the user's role and school; communication is encrypted; and data is backed up automatically every day with point-in-time recovery.",
      },
    ],
    related: ["hyderabad", "chennai", "pune", "mumbai"],
    topics: ["transport", "parent", "security"],
  },
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    kind: "state",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Tamil Nadu | Aksharum",
    description:
      "School ERP for Tamil Nadu's State Board, CBSE and ICSE schools: complete fee records, attendance, exams, report cards and instant parent alerts.",
    h1: "School ERP Software in",
    h1Em: "Tamil Nadu",
    lead: "Tamil Nadu's schools follow the state board's common syllabus, CBSE or CISCE — and almost all of them teach Tamil. Aksharum gives each of them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "One state syllabus, plus central boards",
        body: "Since Tamil Nadu brought its different streams of school education under a single state-board syllabus, most schools in the state — including former matriculation schools — follow the Tamil Nadu State Board, with CBSE and CISCE schools alongside. Each school in Aksharum sets up its own classes, subjects, exam terms and grading.",
      },
      {
        heading: "Fees set by a committee, recorded in full",
        body: "Fees at Tamil Nadu's private schools are fixed by a state fee committee under the Tamil Nadu Schools (Regulation of Collection of Fee) Act, 2009. Aksharum records every fee head, payment and receipt and exports collection reports to PDF or Excel, so it is easy to show parents exactly what was charged and paid.",
      },
      {
        heading: "Northeast monsoon closures",
        body: "Between October and December, heavy rain and cyclones can close schools across the state at a few hours' notice. One broadcast reaches every parent, teacher and student in seconds, and the holiday calendar keeps attendance and timetables accurate.",
      },
    ],
    boards: ["Tamil Nadu State Board", "CBSE", "CISCE (ICSE / ISC)", "IB", "Cambridge (IGCSE)"],
    languages: ["Tamil", "English", "Telugu", "Malayalam"],
    areas: [
      "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
      "Tirunelveli", "Erode", "Vellore", "Tiruppur", "Thanjavur", "Hosur",
      "Kanchipuram",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support Tamil Nadu State Board schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so State Board schools run exams and report cards on the same platform as CBSE and ICSE schools.",
      },
      {
        q: "Can Aksharum show parents a clear record of fees paid?",
        a: "Yes. Every payment generates a receipt automatically, parents can see their own fee status, and collection reports export to PDF or Excel.",
      },
      {
        q: "How do we inform parents about a rain holiday?",
        a: "Send a broadcast to all parents, specific classes or staff in seconds — delivered as in-app notifications and email — and mark the day on the holiday calendar so attendance stays accurate.",
      },
    ],
    related: ["karnataka", "telangana"],
    topics: ["fee", "financial", "communication"],
  },
  {
    slug: "chennai",
    name: "Chennai",
    kind: "city",
    parent: "tamil-nadu",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "Best School ERP Software in Chennai | Aksharum",
    description:
      "School ERP for Chennai's State Board, CBSE and ICSE schools: attendance, online fees, exams, report cards and instant rain-closure alerts. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Chennai",
    lead: "Chennai's schools combine deep academic traditions with a fast-growing IT corridor along OMR. Aksharum gives State Board, CBSE and ICSE schools one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "When the northeast monsoon arrives",
        body: "From October to December, heavy rain and cyclones can shut Chennai's schools with only a few hours' notice. One broadcast tells every parent, teacher and student instantly, and the holiday calendar keeps attendance and timetables in sync — so no one is marked absent on a closed day.",
      },
      {
        heading: "Academic rigour with less paperwork",
        body: "Teachers enter marks once, admins approve them, and results publish in one click with a PDF report card for every student. Timed online MCQ tests — with tab-switch logging and auto-submit — give students regular practice with instant results.",
      },
      {
        heading: "New schools along OMR",
        body: "The IT corridor's growth has brought new schools and new branches to Sholinganallur, Perungudi and beyond. Aksharum scales from one campus to many without changing software, with every school's data kept in its own isolated environment.",
      },
    ],
    boards: ["Tamil Nadu State Board", "CBSE", "CISCE (ICSE / ISC)", "IB", "Cambridge (IGCSE)"],
    languages: ["Tamil", "English", "Telugu", "Hindi"],
    areas: [
      "Anna Nagar", "Adyar", "Besant Nagar", "Mylapore", "T. Nagar",
      "Nungambakkam", "Velachery", "OMR", "Sholinganallur", "Perungudi",
      "Tambaram", "Chromepet", "Porur", "Valasaravakkam", "Ambattur", "Avadi",
      "Perambur", "Medavakkam",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "What is the best school ERP software in Chennai?",
        a: "Look for one that handles your board's exams and report cards, collects fees online, informs parents instantly when the weather closes schools and that teachers find easy to use. Aksharum does all of this on one platform — book a free demo to see it with your own workflows.",
      },
      {
        q: "Can we alert all parents when schools close for rain?",
        a: "Yes. A single broadcast reaches all parents, specific classes or staff in seconds, and the closure is marked on the holiday calendar so attendance stays accurate.",
      },
      {
        q: "Can a school with branches across Chennai use one system?",
        a: "Yes. Aksharum grows from a single campus to multiple branches without changing software, and every branch's data stays isolated and secure.",
      },
    ],
    related: ["tamil-nadu", "bangalore", "hyderabad"],
    topics: ["exam", "communication", "result"],
  },
];
