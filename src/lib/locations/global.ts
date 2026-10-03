import type { Place } from "./types";

// International markets. Aksharum is built in India for Indian schools, so
// these pages lead with what genuinely carries over (Indian-curriculum schools
// abroad, cloud delivery) and are explicit that country-specific needs —
// currency, payment methods, regulator reporting — are confirmed in the demo.

export const GLOBAL: Place[] = [
  {
    slug: "uae",
    name: "the UAE",
    shortName: "UAE",
    kind: "country",
    region: "United Arab Emirates",
    country: "United Arab Emirates",
    countryCode: "AE",
    tier: 3,
    title: "School ERP Software in the UAE — Dubai & Abu Dhabi | Aksharum",
    description:
      "Cloud school ERP for CBSE, ICSE and international schools in Dubai, Abu Dhabi and Sharjah: attendance, fees, exams, report cards and parent communication.",
    h1: "School ERP Software in",
    h1Em: "the UAE",
    lead: "The UAE has one of the largest communities of Indian-curriculum schools outside India, alongside British, American and IB schools. Aksharum gives schools across the Emirates one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Built around the Indian academic structure",
        body: "Most Indian-curriculum schools in the UAE follow CBSE, with some on ICSE or the Kerala syllabus, and they run an April-to-March academic year while most other curricula start in late August or September. Aksharum is built in India for Indian schools, and each school defines its own classes, subjects, exam terms and academic calendar.",
      },
      {
        heading: "Communication for multinational parent communities",
        body: "Parents in the UAE come from dozens of countries and read English, Arabic, Hindi, Malayalam, Urdu and more. Circulars and messages are written by your school, so notices can go out in the language each group reads, targeted at exactly the classes they concern.",
      },
      {
        heading: "Requirements we'll confirm with you",
        body: "Each emirate's education authority — KHDA in Dubai, ADEK in Abu Dhabi, SPEA in Sharjah and the Ministry of Education elsewhere — sets its own rules on fees, reporting and data. Aksharum runs in any browser with nothing to install; in the demo we'll walk through how your school's fee structure, currency and reporting needs would be handled.",
      },
    ],
    boards: [
      "CBSE", "CISCE (ICSE / ISC)", "Kerala State Syllabus",
      "British (Cambridge / Edexcel)", "IB", "American",
    ],
    languages: ["English", "Arabic", "Hindi", "Malayalam", "Urdu"],
    areas: [
      "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah",
      "Umm Al Quwain", "Al Ain",
    ],
    areasLabel: "Emirates and cities",
    faqs: [
      {
        q: "Can schools outside India use Aksharum?",
        a: "Yes. Aksharum is cloud-based and runs in any browser, so schools anywhere can use it. Because currency, payment methods and regulatory reporting differ by country, we confirm exactly how your school's needs are met during a free demo.",
      },
      {
        q: "Does Aksharum suit CBSE schools in the UAE?",
        a: "Yes. Aksharum is built for Indian-curriculum schools: classes, subjects, exam terms, grading and the academic calendar are set up for your school, and every student gets a PDF report card when results are published.",
      },
      {
        q: "How do we book a demo from the UAE?",
        a: "Book a free 30-minute live demo on Google Meet from our demo page and choose a slot that suits you.",
      },
    ],
    related: ["saudi-arabia", "qatar", "kolkata", "mumbai"],
    topics: ["CBSE", "parent", "communication"],
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    kind: "country",
    region: "Saudi Arabia",
    country: "Saudi Arabia",
    countryCode: "SA",
    tier: 3,
    title: "School ERP Software in Saudi Arabia | Aksharum",
    description:
      "Cloud school ERP for Indian and international schools in Riyadh, Jeddah and Dammam: attendance, fees, exams, report cards and parent communication.",
    h1: "School ERP Software in",
    h1Em: "Saudi Arabia",
    lead: "Indian and international schools in Saudi Arabia — in Riyadh, Jeddah and the Eastern Province — serve large expatriate communities whose parents expect clear, timely communication. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "The CBSE structure, abroad",
        body: "Indian schools in the Kingdom largely follow CBSE and its April-to-March academic year. Aksharum is built in India for Indian-curriculum schools: each school defines its own classes, sections, subjects, exam terms and grading, and every student gets a PDF report card when results are published.",
      },
      {
        heading: "Large schools, large parent communities",
        body: "Many of these schools are big, with thousands of families to keep informed. Role-targeted broadcasts reach exactly the classes a notice concerns, parents are alerted the moment a child is marked absent, and teachers can message parents privately with every conversation logged.",
      },
      {
        heading: "Requirements we'll confirm with you",
        body: "Schools in Saudi Arabia are licensed and regulated by the Ministry of Education, and fee, reporting and data requirements vary. Aksharum runs in any browser with nothing to install; in the demo we'll walk through how your school's fee structure, currency and reporting needs would be handled.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "British (Cambridge / Edexcel)", "American", "IB"],
    languages: ["English", "Arabic", "Hindi", "Urdu", "Malayalam"],
    areas: [
      "Riyadh", "Jeddah", "Dammam", "Al Khobar", "Dhahran", "Jubail",
      "Makkah", "Madinah", "Yanbu", "Taif", "Abha", "Tabuk",
    ],
    areasLabel: "Cities",
    faqs: [
      {
        q: "Can Indian schools in Saudi Arabia use Aksharum?",
        a: "Yes. Aksharum is cloud-based and built for Indian-curriculum schools. Because currency, payment methods and regulatory reporting differ by country, we confirm exactly how your school's needs are met during a free demo.",
      },
      {
        q: "Can we send notices to specific sections only?",
        a: "Yes. Broadcasts can target the whole school, teachers only, parents only or a specific class, and relevance is enforced server-side.",
      },
      {
        q: "Is our data isolated from other schools?",
        a: "Yes. Every school runs in its own isolated environment, and every request is checked server-side for the user's role and school.",
      },
    ],
    related: ["uae", "qatar"],
    topics: ["CBSE", "communication", "security"],
  },
  {
    slug: "qatar",
    name: "Qatar",
    kind: "country",
    region: "Qatar",
    country: "Qatar",
    countryCode: "QA",
    tier: 3,
    title: "School ERP Software in Qatar (Doha) | Aksharum",
    description:
      "Cloud school ERP for Indian and international schools in Doha and across Qatar: attendance, fees, exams, report cards and parent communication.",
    h1: "School ERP Software in",
    h1Em: "Qatar",
    lead: "Qatar's Indian and international schools serve one of the most diverse expatriate populations in the world. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Indian curriculum in Doha",
        body: "Doha's Indian schools largely follow CBSE and run an April-to-March year. In Aksharum each school defines its own classes, subjects, exam terms and grading; teachers enter marks once, admins approve, and every student gets a PDF report card the moment results are published.",
      },
      {
        heading: "Keeping families informed through the long summer",
        body: "Qatar's long summer break scatters families across the world. Notices, results and the next term's timetable are available from any browser, so parents stay informed wherever they are.",
      },
      {
        heading: "Requirements we'll confirm with you",
        body: "Private schools in Qatar are regulated by the Ministry of Education and Higher Education, and fee, reporting and data requirements vary. In the demo we'll walk through how your school's fee structure, currency and reporting needs would be handled.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "British (Cambridge / Edexcel)", "American", "IB"],
    languages: ["English", "Arabic", "Hindi", "Malayalam", "Urdu"],
    areas: [
      "Doha", "Al Wakrah", "Al Rayyan", "Al Khor", "Lusail", "Umm Salal",
      "Al Wukair", "Mesaieed",
    ],
    areasLabel: "Cities",
    faqs: [
      {
        q: "Can schools in Qatar use Aksharum?",
        a: "Yes. Aksharum is cloud-based and runs in any browser. Because currency, payment methods and regulatory reporting differ by country, we confirm exactly how your school's needs are met during a free demo.",
      },
      {
        q: "Can parents see results while travelling?",
        a: "Yes. Parents see results, attendance and notices from any browser and are notified the moment results are published.",
      },
      {
        q: "How long does setup take?",
        a: "Setup, data import and staff onboarding are typically completed within a single working day.",
      },
    ],
    related: ["uae", "saudi-arabia"],
    topics: ["CBSE", "result", "parent"],
  },
  {
    slug: "nepal",
    name: "Nepal",
    kind: "country",
    region: "Nepal",
    country: "Nepal",
    countryCode: "NP",
    tier: 3,
    title: "School ERP Software in Nepal (Kathmandu, Pokhara) | Aksharum",
    description:
      "Cloud school ERP for private schools in Kathmandu, Pokhara and across Nepal: attendance, fees, terminal exams, report cards and parent communication.",
    h1: "School ERP Software in",
    h1Em: "Nepal",
    lead: "Nepal's private schools — from the Kathmandu Valley to Pokhara and the Terai — are going digital fast, and parents increasingly expect fees, results and notices on their phones. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Terminal exams and report cards",
        body: "Students sit the Secondary Education Examination (SEE) after Class 10 and national examinations after Class 12, with terminal exams through the year. In Aksharum each school defines its own classes, subjects, exam terms and grading; teachers enter marks once, and every student gets a PDF report card when results are published.",
      },
      {
        heading: "Parents near and far",
        body: "Many Nepali families have a parent working away from home, sometimes abroad. Attendance, results and notices can be followed from any browser, and parents are notified the moment anything changes.",
      },
      {
        heading: "Monsoon and mountain roads",
        body: "Monsoon rain and landslides can disrupt school days with little warning. One broadcast reaches every parent, teacher and student in seconds, and the holiday calendar keeps attendance accurate. Currency, payment methods and local reporting are confirmed with you during the demo.",
      },
    ],
    boards: ["SEE (Class 10)", "NEB (Class 11–12)", "Cambridge (A Levels)"],
    languages: ["Nepali", "English", "Maithili", "Hindi"],
    areas: [
      "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar",
      "Birgunj", "Butwal", "Bharatpur", "Dharan", "Hetauda", "Janakpur",
      "Nepalgunj",
    ],
    areasLabel: "Cities",
    faqs: [
      {
        q: "Can schools in Nepal use Aksharum?",
        a: "Yes. Aksharum is cloud-based and runs in any browser. Because currency, payment methods and reporting differ by country, we confirm exactly how your school's needs are met during a free demo.",
      },
      {
        q: "Can parents working abroad follow their child's progress?",
        a: "Yes. Parents see attendance, results and notices from any browser and are notified the moment results are published.",
      },
      {
        q: "Can notices be sent in Nepali?",
        a: "Circulars and messages are written by your school, so they can go out in Nepali or English and be targeted at specific classes.",
      },
    ],
    related: ["siliguri", "kolkata", "bangladesh"],
    topics: ["parent", "result", "communication"],
  },
  {
    slug: "bangladesh",
    name: "Bangladesh",
    kind: "country",
    region: "Bangladesh",
    country: "Bangladesh",
    countryCode: "BD",
    tier: 3,
    title: "School ERP Software in Bangladesh (Dhaka) | Aksharum",
    description:
      "Cloud school ERP for national-curriculum and English-medium schools in Dhaka and across Bangladesh: attendance, fees, exams, report cards and bus tracking.",
    h1: "School ERP Software in",
    h1Em: "Bangladesh",
    lead: "Bangladesh's private and English-medium schools serve a fast-growing urban middle class in Dhaka, Chattogram and beyond. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "National curriculum and English-medium schools",
        body: "Schools following the national curriculum prepare students for the SSC and HSC examinations run by the education boards, while many English-medium schools follow Cambridge or Pearson Edexcel O and A Levels. In Aksharum each school defines its own classes, subjects, exam terms and grading.",
      },
      {
        heading: "Dhaka traffic and the school run",
        body: "Dhaka's traffic can turn a short school run into a long one. Live route tracking shows parents where the bus is, and delays trigger automatic notifications.",
      },
      {
        heading: "Bangla and English notices",
        body: "Circulars and messages are written by your school, so they can go out in Bangla or English and be targeted at exactly the classes they concern. Currency, payment methods and local reporting are confirmed with you during the demo.",
      },
    ],
    boards: ["SSC / HSC (Education Boards)", "Cambridge (O / A Levels)", "Pearson Edexcel", "IB"],
    languages: ["Bangla", "English"],
    areas: [
      "Dhaka", "Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur",
      "Bashundhara", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Gazipur",
      "Narayanganj", "Cumilla",
    ],
    areasLabel: "Cities and areas",
    faqs: [
      {
        q: "Can schools in Bangladesh use Aksharum?",
        a: "Yes. Aksharum is cloud-based and runs in any browser. Because currency, payment methods and reporting differ by country, we confirm exactly how your school's needs are met during a free demo.",
      },
      {
        q: "Does Aksharum support O and A Level schools?",
        a: "Classes, subjects and exam terms are defined by each school, so English-medium schools can run attendance, fees, communication, timetables and transport on Aksharum. Book a demo to walk through how your grading and report cards would be set up.",
      },
      {
        q: "Can parents track the school bus in Dhaka?",
        a: "Yes. Parents see the bus's live location, and delays trigger automatic notifications.",
      },
    ],
    related: ["kolkata", "west-bengal", "nepal"],
    topics: ["transport", "parent", "communication"],
  },
];
