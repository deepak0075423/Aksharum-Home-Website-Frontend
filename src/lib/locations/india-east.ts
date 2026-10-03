import type { Place } from "./types";

// East India — West Bengal first (the launch market), then its neighbours.

export const EAST: Place[] = [
  {
    slug: "west-bengal",
    name: "West Bengal",
    kind: "state",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in West Bengal | Aksharum",
    description:
      "School ERP for West Bengal schools on WBBSE, WBCHSE, CBSE and ICSE: attendance, online fees, exams, report cards and parent alerts in one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "West Bengal",
    lead: "From Kolkata's ICSE schools to state-board schools in North Bengal, schools in West Bengal juggle more than one board, more than one language and more than one academic calendar. Aksharum brings admissions, attendance, fees, exams and parent communication into one cloud platform that works the way your school already does.",
    sections: [
      {
        heading: "Built for West Bengal's mix of boards",
        body: "Secondary schools in the state prepare students for the Madhyamik examination of the West Bengal Board of Secondary Education (WBBSE), and higher-secondary sections follow the West Bengal Council of Higher Secondary Education (WBCHSE). Alongside them sit a large number of CBSE schools and a long tradition of CISCE (ICSE and ISC) schools, especially in and around Kolkata.\n\nIn Aksharum, classes, sections, subjects and exams are defined by your school rather than hard-coded for one board, so a school group with campuses on different boards still runs everything from one platform.",
      },
      {
        heading: "Not every school starts its year in April",
        body: "State-board schools in West Bengal have traditionally followed the calendar year, while CBSE and CISCE schools usually run from April to March. Every school in Aksharum lives in its own isolated environment with its own academic calendar, so a calendar-year campus and an April-session campus never get in each other's way — and attendance, fees and exam schedules follow the right year for each.",
      },
      {
        heading: "Notices in the language parents read",
        body: "Many families in West Bengal prefer notices in Bengali; others read Hindi, English, Nepali or Urdu. Circulars and messages in Aksharum are written by your school, so they can go out in whichever language your parents actually read — and role-targeted broadcasts make sure each notice reaches only the classes it is meant for.",
      },
    ],
    boards: ["WBBSE (Madhyamik)", "WBCHSE (Higher Secondary)", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Bengali", "English", "Hindi", "Nepali", "Urdu"],
    areas: [
      "Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol", "Bardhaman",
      "Kharagpur", "Haldia", "Barasat", "Barrackpore", "Krishnanagar", "Malda",
      "Bolpur–Santiniketan", "Darjeeling", "Jalpaiguri", "Cooch Behar",
      "Bankura", "Medinipur",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support WBBSE and WBCHSE schools?",
        a: "Yes. Classes, subjects, exam terms and grading are set up for your school during onboarding, so WBBSE and WBCHSE schools use the same attendance, exam, report-card and fee modules as CBSE and ICSE schools — arranged the way their board works.",
      },
      {
        q: "Can a school group in West Bengal run several campuses on Aksharum?",
        a: "Yes. Aksharum scales from a single campus to multiple branches without changing software, and each school's data stays isolated in its own environment, protected by role checks on every request.",
      },
      {
        q: "Do we need our own servers or an IT team?",
        a: "No. Aksharum is cloud-based, so there is nothing to install. Staff, parents and students sign in from any device with a browser, and setup, data import and staff onboarding are typically done within a single working day.",
      },
      {
        q: "How is pricing decided for schools in West Bengal?",
        a: "Pricing is modular and based on school size: you pay only for the modules you switch on, with no minimum seat count. Book a free demo and we'll share a quote for your school.",
      },
    ],
    related: ["bihar", "odisha", "jharkhand", "assam"],
    topics: ["ICSE", "CBSE", "admission"],
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    kind: "city",
    parent: "west-bengal",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 1,
    title: "Best School ERP Software in Kolkata | Aksharum",
    description:
      "School ERP for Kolkata's ICSE, CBSE and WBBSE schools: attendance, online fees, exams, report cards and instant parent alerts in one cloud platform. Free demo.",
    h1: "School ERP Software in",
    h1Em: "Kolkata",
    lead: "Kolkata's schools range from century-old ICSE institutions to new CBSE campuses in New Town and state-board schools across the suburbs. Aksharum gives every one of them a single cloud platform for admissions, attendance, fees, exams and parent communication — without servers, installations or a dedicated IT team.",
    sections: [
      {
        heading: "One platform for ICSE, CBSE and state-board schools",
        body: "Kolkata has a long tradition of ICSE and ISC schools, a fast-growing number of CBSE schools, and WBBSE and WBCHSE schools across the city and its suburbs. Each board has its own exam pattern and report-card expectations.\n\nIn Aksharum your school defines its own classes, subjects and exam terms. Teachers enter marks once, an admin reviews and approves them, and every student gets a PDF report card with marks, grades, attendance and remarks the moment results are published — whichever board you follow.",
      },
      {
        heading: "Built around the Kolkata school year",
        body: "The long Durga Puja break, Poila Baisakh, summer vacation and the occasional rain-day closure all reshape a Kolkata school's calendar. Aksharum keeps one school-wide holiday calendar that syncs with attendance and timetables, so nobody is marked absent on a day the school was shut. When plans change at short notice, a single broadcast reaches every parent, teacher and student in the affected classes.",
      },
      {
        heading: "Fee collection parents can trust",
        body: "Many Kolkata schools still reconcile fees from bank deposit slips, cash registers and handwritten receipts. With Aksharum, parents pay online from any device, receipts are generated and sent automatically, and the accounts office sees collected and pending amounts in real time — with automatic reminders before and after every due date.",
      },
      {
        heading: "Smoother school commutes",
        body: "From Salt Lake and New Town to Behala and Garia, a school bus in Kolkata can spend a long time in traffic. Live route tracking shows parents where the bus is, and delays trigger automatic notifications — so the school office isn't fielding a flood of calls every morning.",
      },
    ],
    boards: ["CISCE (ICSE / ISC)", "CBSE", "WBBSE", "WBCHSE"],
    languages: ["Bengali", "English", "Hindi"],
    areas: [
      "Salt Lake (Bidhannagar)", "New Town (Rajarhat)", "Ballygunge", "Alipore",
      "Park Street", "Behala", "Tollygunge", "Jadavpur", "Garia", "Kasba",
      "Dum Dum", "Baguiati", "Barasat", "Barrackpore", "Sodepur",
      "Rajpur–Sonarpur", "Joka", "Howrah",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "What is the best school ERP software in Kolkata?",
        a: "The best school ERP for a Kolkata school is one that handles your board's exams and report cards, collects fees online, keeps parents informed in real time and that teachers will actually use. Aksharum covers all of these on one platform, runs in any browser and can be set up in a single working day — book a free demo to see it with your own school's workflows.",
      },
      {
        q: "Does Aksharum work for ICSE schools in Kolkata?",
        a: "Yes. ICSE and ISC schools set up their own classes, subjects, exam terms and grading in Aksharum. Teachers enter marks once, and report cards are generated as PDFs and shared with parents the moment results are published.",
      },
      {
        q: "Can parents in Kolkata pay school fees online?",
        a: "Yes. Parents pay from any device, receipts are generated and sent automatically, and fee reminders go out before and after each due date. The accounts team sees live collection figures and defaulter lists without manual reconciliation.",
      },
      {
        q: "How does onboarding work for a Kolkata school?",
        a: "Our team configures your school, imports your existing data and gets your staff started — typically within a single working day, with no IT department required.",
      },
      {
        q: "How do we see a demo?",
        a: "Book a free 30-minute live demo on Google Meet. We tailor it to your school's board, size and the modules you care about most.",
      },
    ],
    related: ["howrah", "siliguri", "durgapur", "asansol"],
    topics: ["ICSE", "fee", "transport"],
  },
  {
    slug: "howrah",
    name: "Howrah",
    kind: "city",
    parent: "west-bengal",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Howrah | Aksharum",
    description:
      "Cloud school ERP for Howrah's WBBSE, CBSE and ICSE schools: attendance, fees, exams, report cards and parent communication on one platform. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Howrah",
    lead: "Howrah's schools serve families on both banks of the Hooghly — many with parents who commute into Kolkata every day. Aksharum keeps those parents connected to school life in real time and gives the school office one platform for admissions, attendance, fees and exams.",
    sections: [
      {
        heading: "Keeping commuting parents in the loop",
        body: "When parents spend hours on trains, ferries and buses, a phone call from school is hard to take and a paper notice rarely makes it home. Aksharum sends an alert the moment a child is marked absent, reminds parents before fees fall due, notifies them when results are published and lets teachers message them directly — wherever their day takes them.",
      },
      {
        heading: "From registers to one dashboard",
        body: "Many Howrah schools still run on attendance registers, spreadsheets and fee ledgers. Aksharum replaces them with one-tap attendance, online fee collection with automatic receipts and one-click result publishing, and gives the principal a live view of the whole school from a single dashboard.",
      },
      {
        heading: "State-board and central-board schools alike",
        body: "Howrah has a broad mix of WBBSE and WBCHSE schools along with CBSE and ICSE schools in areas such as Shibpur, Salkia and Bally. Because exams and grading are set up for each school, every board's results and report cards come from the same platform.",
      },
    ],
    boards: ["WBBSE", "WBCHSE", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Bengali", "Hindi", "English"],
    areas: [
      "Shibpur", "Salkia", "Bally", "Liluah", "Belur", "Santragachhi",
      "Dasnagar", "Kadamtala", "Domjur", "Andul", "Uluberia", "Bagnan",
    ],
    areasLabel: "Neighbourhoods and towns",
    faqs: [
      {
        q: "Is Aksharum suitable for smaller schools in Howrah?",
        a: "Yes. Aksharum is built for schools of every size, from a few dozen students to thousands, and pricing is modular — a smaller school pays only for the modules it switches on.",
      },
      {
        q: "Can we start with attendance and fees and add exams later?",
        a: "Yes. Every module can be switched on or off at any time with zero downtime. Many schools start with attendance and fees, then add exams, report cards and transport when they are ready.",
      },
      {
        q: "Will our teachers need training?",
        a: "No formal training programme is needed: attendance is one tap and results publish in one click. Our team walks your staff through the platform during onboarding.",
      },
    ],
    related: ["kolkata", "durgapur", "asansol"],
    topics: ["attendance", "Excel", "manual"],
  },
  {
    slug: "siliguri",
    name: "Siliguri",
    kind: "city",
    parent: "west-bengal",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Siliguri | Aksharum",
    description:
      "Cloud school ERP for Siliguri and North Bengal schools on WBBSE, CBSE and ICSE: attendance, fees, exams and instant parent alerts. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Siliguri",
    lead: "Siliguri is the gateway to North Bengal, Sikkim and the Northeast, and its schools often serve families spread across the plains, the tea gardens and the hills. Aksharum gives them one cloud platform that parents, teachers and the school office can reach from anywhere.",
    sections: [
      {
        heading: "Schools that serve a wide region",
        body: "Students in Siliguri may travel in from Jalpaiguri, Bagdogra, Matigara or the hills, and many families live far from the school gate. Instant attendance alerts, online fee payment and direct messaging with teachers mean parents don't have to travel to school to stay informed or to pay.",
      },
      {
        heading: "Communication that survives the monsoon",
        body: "Monsoon rain and landslides on the hill roads can disrupt the school day with little warning. When plans change, one role-targeted broadcast reaches every affected parent, student and teacher immediately — no phone trees and no missed notices — and the holiday calendar keeps attendance accurate.",
      },
      {
        heading: "Many languages, one notice board",
        body: "Families in and around Siliguri speak Bengali, Hindi and Nepali, among other languages. Circulars and messages in Aksharum are written by your school, so each notice can go out in the language its readers prefer.",
      },
    ],
    boards: ["WBBSE", "WBCHSE", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Bengali", "Hindi", "Nepali", "English"],
    areas: [
      "Pradhan Nagar", "Sevoke Road", "Hakimpara", "Ashrampara", "Matigara",
      "Bagdogra", "Champasari", "Siliguri Junction", "Jalpaiguri",
      "Darjeeling", "Kurseong", "Kalimpong",
    ],
    areasLabel: "Areas and nearby towns",
    faqs: [
      {
        q: "Can parents in the hills use Aksharum on their phones?",
        a: "Yes. Aksharum runs in any modern browser, so parents can check attendance, results and fee status and pay fees from a phone without installing anything.",
      },
      {
        q: "Does Aksharum support CBSE and ICSE schools in North Bengal?",
        a: "Yes. Each school sets up its own classes, subjects, exam terms and grading, so CBSE, ICSE and state-board schools all run their exams and report cards on the same platform.",
      },
      {
        q: "How quickly can a Siliguri school go live?",
        a: "Setup, data import and staff onboarding are typically completed within a single working day, with no IT department needed.",
      },
    ],
    related: ["kolkata", "guwahati", "nepal"],
    topics: ["parent", "communication", "transport"],
  },
  {
    slug: "durgapur",
    name: "Durgapur",
    kind: "city",
    parent: "west-bengal",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 3,
    title: "School ERP Software in Durgapur | Aksharum",
    description:
      "Cloud school ERP for Durgapur's CBSE, ICSE and WBBSE schools: attendance, online fees, exams, report cards and parent communication. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Durgapur",
    lead: "Durgapur's steel-city townships have long been home to well-run schools, and today's parents expect the same digital convenience they get everywhere else. Aksharum gives Durgapur schools one platform for attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Township schools, modern expectations",
        body: "Many of Durgapur's schools grew up around its industrial townships and serve families who expect instant updates. Real-time attendance alerts, online fee payment and results that reach parents the moment they are published meet that expectation without adding work for teachers.",
      },
      {
        heading: "Exams without the spreadsheets",
        body: "Teachers enter marks once, admins review and approve, and results publish to the whole class in one click with a PDF report card for every student. For regular practice, timed online MCQ tests log tab switches and window changes server-side and submit automatically when time runs out.",
      },
      {
        heading: "Staff records and payroll in one place",
        body: "Leave requests and approvals, the school holiday calendar and monthly salary slips all live in Aksharum, so there are no paper forms to chase and no separate HR software to maintain.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "WBBSE", "WBCHSE"],
    languages: ["Bengali", "Hindi", "English"],
    areas: [
      "City Centre", "Bidhannagar", "Benachity", "A-Zone", "B-Zone",
      "Steel Township", "Muchipara", "Andal", "Panagarh", "Raniganj",
      "Bardhaman", "Bankura",
    ],
    areasLabel: "Areas and nearby towns",
    faqs: [
      {
        q: "Can Aksharum run online tests for our students?",
        a: "Yes. Teachers create timed MCQ tests; tab switches, window blur and focus loss are logged server-side, tests auto-submit when time runs out, and results with question-level analysis are ready as soon as the test ends.",
      },
      {
        q: "Does Aksharum include HR and payroll for school staff?",
        a: "It covers leave requests with approval workflows, a shared holiday calendar and automatically generated monthly salary slips that staff can download from their own portal.",
      },
      {
        q: "What does a demo involve?",
        a: "A free 30-minute live walkthrough on Google Meet, tailored to your school's board, size and the modules you are most interested in.",
      },
    ],
    related: ["asansol", "kolkata", "howrah"],
    topics: ["exam", "leave", "teacher"],
  },
  {
    slug: "asansol",
    name: "Asansol",
    kind: "city",
    parent: "west-bengal",
    region: "West Bengal",
    country: "India",
    countryCode: "IN",
    tier: 3,
    title: "School ERP Software in Asansol | Aksharum",
    description:
      "Cloud school ERP for Asansol's WBBSE, CBSE and ICSE schools: attendance, online fees, exams and parent notices in Bengali, Hindi or English. Free demo.",
    h1: "School ERP Software in",
    h1Em: "Asansol",
    lead: "Asansol's schools serve a coal-and-railway city where Bengali- and Hindi-speaking families live side by side. Aksharum helps them run admissions, attendance, fees and exams on one platform and keep every parent informed in the language they read.",
    sections: [
      {
        heading: "Two languages, one notice board",
        body: "With large Bengali- and Hindi-speaking communities, Asansol schools often need the same message in more than one language. Role-targeted broadcasts let you address the whole school or specific classes, and because notices are written by your school, each can be published in the language its audience reads.",
      },
      {
        heading: "Fees, receipts and reminders on autopilot",
        body: "Online payments with automatic receipts, a live collection dashboard and scheduled reminders replace the cash register and the receipt book — and give the accounts office an accurate defaulter list at any moment.",
      },
      {
        heading: "A clear view for the management",
        body: "Live dashboards show attendance, fee collection and results across the school, and reports export to PDF or Excel whenever the management committee or an inspection needs them.",
      },
    ],
    boards: ["WBBSE", "WBCHSE", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Bengali", "Hindi", "English", "Urdu"],
    areas: [
      "Burnpur", "Kalyanpur", "Apcar Garden", "Hirapur", "Ushagram",
      "Searsole", "Kulti", "Barakar", "Raniganj", "Jamuria", "Chittaranjan",
      "Durgapur",
    ],
    areasLabel: "Areas and nearby towns",
    faqs: [
      {
        q: "Can we send notices in both Bengali and Hindi?",
        a: "Yes. Notices and messages are written by your school, so you can publish them in Bengali, Hindi or English and target them at the whole school, specific classes, teachers or parents.",
      },
      {
        q: "Can the management see fee collection without asking the office?",
        a: "Yes. The collection dashboard shows collected and pending amounts and defaulter lists live, and reports export to PDF or Excel in seconds.",
      },
      {
        q: "Is our school's data kept separate from other schools?",
        a: "Yes. Every school runs in its own isolated environment, and every request is checked server-side for the user's role and school before any data is returned.",
      },
    ],
    related: ["durgapur", "kolkata", "ranchi"],
    topics: ["fee", "communication", "financial"],
  },
  {
    slug: "bihar",
    name: "Bihar",
    kind: "state",
    region: "Bihar",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Bihar | Aksharum",
    description:
      "School ERP for Bihar's BSEB, CBSE and ICSE schools: online fees with full records, attendance, exams, report cards and parent alerts on one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "Bihar",
    lead: "Bihar's private schools are growing fast — in Patna and across the state's district towns — and parents increasingly expect digital fee payment and instant updates. Aksharum gives Bihar schools one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "BSEB, CBSE and ICSE on one platform",
        body: "State-board schools in Bihar prepare students for the matriculation and intermediate examinations of the Bihar School Examination Board (BSEB), while CBSE and ICSE schools are common in Patna and the larger towns. In Aksharum each school defines its own classes, subjects and exam terms, so every board's results come from the same system.",
      },
      {
        heading: "Fee records that stand up to questions",
        body: "Bihar regulates how much private schools can raise their fees each year, and parents ask hard questions about every increase. Aksharum records every fee head, payment and receipt, sends reminders automatically and exports collection reports to PDF or Excel — so your figures are complete and ready whenever they're needed.",
      },
      {
        heading: "Built for district-town schools too",
        body: "Aksharum runs in a browser with nothing to install and no IT team required. Pricing is modular, so a growing school in Gaya, Muzaffarpur or Bhagalpur pays only for the modules it switches on.",
      },
    ],
    boards: ["BSEB (Matric / Intermediate)", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Hindi", "English", "Maithili", "Bhojpuri", "Urdu"],
    areas: [
      "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia",
      "Begusarai", "Arrah", "Bihar Sharif", "Hajipur", "Chapra", "Sasaram",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support BSEB schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so BSEB schools run attendance, exams, report cards and fees on the same platform as CBSE and ICSE schools.",
      },
      {
        q: "Can Aksharum help us show parents how fees are used?",
        a: "Aksharum keeps a complete record of your fee structure, payments and receipts and exports collection reports in seconds, which makes it far easier to answer parents' and authorities' questions with accurate figures.",
      },
      {
        q: "Do we need fast internet to use Aksharum?",
        a: "Aksharum is a web application that runs in any modern browser on a phone or computer, so staff and parents can use it on an ordinary mobile data connection.",
      },
    ],
    related: ["west-bengal", "jharkhand", "uttar-pradesh"],
    topics: ["fee", "financial", "small school"],
  },
  {
    slug: "patna",
    name: "Patna",
    kind: "city",
    parent: "bihar",
    region: "Bihar",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "Best School ERP Software in Patna | Aksharum",
    description:
      "School ERP for Patna's CBSE, ICSE and BSEB schools: online admissions, fees, attendance, exams, report cards and instant parent alerts. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Patna",
    lead: "Patna's schools serve a city where education is taken extremely seriously — and where parents want to know, today, how their child is doing. Aksharum gives CBSE, ICSE and BSEB schools one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Results parents can see the moment they're ready",
        body: "In a city of ambitious students and attentive parents, waiting for a parent-teacher meeting to see marks no longer works. In Aksharum, teachers enter marks once, admins approve them, and results publish to the class in one click — with a PDF report card for every student and an instant notification to every parent.",
      },
      {
        heading: "Admission season without the queues",
        body: "Admission season brings long queues and piles of forms to Patna's popular schools. Aksharum's digital admission journey captures applications online and turns them into enrolments without paperwork, with every new student's documents stored in one digital profile.",
      },
      {
        heading: "Ganga floods and sudden closures",
        body: "Heavy rain and high water in the Ganga can disrupt Patna's school routines during the monsoon. One broadcast tells every parent, teacher and student about a closure or changed timings in seconds, and the holiday calendar keeps attendance accurate.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "BSEB"],
    languages: ["Hindi", "English", "Bhojpuri", "Maithili"],
    areas: [
      "Boring Road", "Bailey Road", "Kankarbagh", "Rajendra Nagar",
      "Patliputra Colony", "Ashiana Nagar", "Danapur", "Saguna More", "Kurji",
      "Anisabad", "Phulwari Sharif", "Khagaul", "Digha", "Rajeev Nagar",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "What is the best school ERP software in Patna?",
        a: "Look for one that publishes results and report cards quickly, collects fees online with automatic receipts, handles admissions without paper and keeps parents informed in real time. Aksharum does all of this on one platform — book a free demo to see it with your school's workflows.",
      },
      {
        q: "Can parents see results online?",
        a: "Yes. Once results are approved and published, parents are notified instantly and can view and download the PDF report card from their own account.",
      },
      {
        q: "Can we take admission applications online?",
        a: "Yes. Applications are captured digitally and accepted students move straight into enrolment, with their documents attached to their student profile.",
      },
    ],
    related: ["bihar", "ranchi", "kolkata", "varanasi"],
    topics: ["result", "admission", "parent"],
  },
  {
    slug: "odisha",
    name: "Odisha",
    kind: "state",
    region: "Odisha",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Odisha | Aksharum",
    description:
      "School ERP for Odisha's BSE, CHSE, CBSE and ICSE schools: attendance, online fees, exams, report cards and instant alerts when cyclones close schools.",
    h1: "School ERP Software in",
    h1Em: "Odisha",
    lead: "Odisha's schools — state-board, CBSE and ICSE — increasingly want digital tools for fees, exams and parent communication, and a reliable way to reach families when the weather turns. Aksharum gives them one cloud platform for all of it.",
    sections: [
      {
        heading: "State and central boards together",
        body: "Class 10 students in Odisha's state-board schools take the examination of the Board of Secondary Education, Odisha, and higher-secondary students follow the Council of Higher Secondary Education (CHSE). CBSE and ICSE schools are common in Bhubaneswar, Cuttack and Rourkela. Each school in Aksharum sets up its own classes, subjects and exams.",
      },
      {
        heading: "When a cyclone is forecast",
        body: "Cyclones regularly force schools along Odisha's coast to close at short notice. A single broadcast reaches every parent, teacher and student in seconds, the holiday calendar keeps attendance and timetables accurate, and the video library and online tests keep learning going while classrooms are shut.",
      },
      {
        heading: "Odia, Hindi and English notices",
        body: "Circulars and messages are written by your school, so they can go out in Odia, Hindi or English and be targeted at exactly the classes they concern.",
      },
    ],
    boards: ["BSE Odisha", "CHSE Odisha", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Odia", "Hindi", "English"],
    areas: [
      "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri",
      "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Angul", "Jeypore",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "How does Aksharum help when schools close for a cyclone?",
        a: "Admins can send an instant broadcast to all parents, specific classes or staff, delivered as in-app notifications and email, and mark the closure on the holiday calendar so attendance stays accurate.",
      },
      {
        q: "Does Aksharum support BSE Odisha and CHSE schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so state-board schools use the same exam, report-card and fee modules as CBSE and ICSE schools.",
      },
      {
        q: "Is our data backed up?",
        a: "Yes. Data is backed up automatically every day with point-in-time recovery, and every school runs in its own isolated environment.",
      },
    ],
    related: ["west-bengal", "jharkhand", "telangana"],
    topics: ["communication", "parent", "digital"],
  },
  {
    slug: "bhubaneswar",
    name: "Bhubaneswar",
    kind: "city",
    parent: "odisha",
    region: "Odisha",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Bhubaneswar | Aksharum",
    description:
      "School ERP for Bhubaneswar and Cuttack schools on CBSE, ICSE and BSE Odisha: attendance, online fees, exams, report cards and parent alerts. Free demo.",
    h1: "School ERP Software in",
    h1Em: "Bhubaneswar",
    lead: "Bhubaneswar has grown into one of eastern India's leading education and IT centres, and its schools now serve parents who expect digital-first communication. Aksharum gives them one platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "A planned city with a fast-growing school map",
        body: "New schools have opened across Patia, Chandrasekharpur and the city's expanding edges, and many established schools have added branches. Aksharum scales from a single campus to multiple branches without changing software, keeping each school's data isolated in its own environment.",
      },
      {
        heading: "Parents who work in the city's tech parks",
        body: "Families working in Infocity and the city's offices want updates as they happen. Aksharum alerts parents the moment a child is marked absent, notifies them when results are published and lets them message teachers directly.",
      },
      {
        heading: "Twin-city transport",
        body: "Many students travel between Bhubaneswar and Cuttack every day. Live bus tracking shows parents exactly where the bus is, and delays trigger automatic notifications.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "BSE Odisha", "CHSE Odisha"],
    languages: ["Odia", "Hindi", "English"],
    areas: [
      "Patia", "Chandrasekharpur", "Nayapalli", "Saheed Nagar",
      "Jaydev Vihar", "Khandagiri", "Old Town", "Rasulgarh", "Infocity",
      "Bapuji Nagar", "Kalinga Nagar", "Cuttack",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "Can a school with branches in Bhubaneswar and Cuttack use one system?",
        a: "Yes. Aksharum grows from a single campus to multiple branches without changing software, and every branch's data stays isolated and secure.",
      },
      {
        q: "Can parents track the school bus?",
        a: "Yes. Parents see the bus's live location on its route, and delays trigger automatic notifications.",
      },
      {
        q: "How long does it take to go live?",
        a: "Setup, data import and staff onboarding are typically completed within a single working day.",
      },
    ],
    related: ["odisha", "kolkata", "hyderabad"],
    topics: ["multiple campuses", "transport", "parent"],
  },
  {
    slug: "assam",
    name: "Assam",
    kind: "state",
    region: "Assam",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Assam | Aksharum",
    description:
      "School ERP for Assam's state-board, CBSE and ICSE schools: attendance, online fees, exams, report cards and instant parent alerts during flood season.",
    h1: "School ERP Software in",
    h1Em: "Assam",
    lead: "Assam's schools serve communities spread across the Brahmaputra valley, the Barak valley and the hills — where floods, distance and many languages make communication hard. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "State board and central boards",
        body: "State-board students in Assam take the HSLC examination in Class 10 and the Higher Secondary examination in Class 12, while CBSE and ICSE schools are common in Guwahati and the larger towns. Each school in Aksharum sets up its own classes, subjects and exam terms.",
      },
      {
        heading: "Flood season, handled",
        body: "During the monsoon, floods can cut roads and close schools across large parts of the state. One broadcast reaches every parent, teacher and student in seconds, the holiday calendar keeps attendance accurate, and the video library keeps lessons available while students stay home.",
      },
      {
        heading: "A state of many languages",
        body: "Families in Assam may read Assamese, Bengali, Bodo, Hindi or English. Circulars and messages are written by your school, so each notice can go out in the language its readers prefer.",
      },
    ],
    boards: ["Assam State Board (HSLC / HS)", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Assamese", "Bengali", "Bodo", "Hindi", "English"],
    areas: [
      "Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur", "Nagaon",
      "Tinsukia", "Bongaigaon", "Sivasagar", "Golaghat", "Karimganj", "Dhubri",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "How does Aksharum help when floods close schools?",
        a: "Admins can notify every parent, class or staff member instantly, mark the closure on the holiday calendar so attendance stays accurate, and keep lessons available through the video library.",
      },
      {
        q: "Does Aksharum support Assam state-board schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so state-board schools run exams and report cards on the same platform as CBSE and ICSE schools.",
      },
      {
        q: "Can small schools in Assam afford Aksharum?",
        a: "Pricing is modular and based on school size, with no minimum seat count — a small school pays only for the modules it switches on.",
      },
    ],
    related: ["west-bengal", "bihar", "odisha"],
    topics: ["communication", "parent", "small school"],
  },
  {
    slug: "guwahati",
    name: "Guwahati",
    kind: "city",
    parent: "assam",
    region: "Assam",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Guwahati | Aksharum",
    description:
      "School ERP for Guwahati's CBSE, ICSE and state-board schools: attendance, online fees, exams, report cards and instant parent alerts. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Guwahati",
    lead: "Guwahati is the gateway to the Northeast, and its schools welcome students from across the region. Aksharum gives CBSE, ICSE and state-board schools in the city one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Students from across the Northeast",
        body: "Many of Guwahati's students come from other districts and states, with families who can't simply drop in at school. Online fee payment, instant attendance alerts and direct messaging with teachers keep distant parents informed and involved.",
      },
      {
        heading: "Waterlogged roads and changed plans",
        body: "Heavy rain can waterlog Guwahati's roads within hours, disrupting school buses and timings. Live bus tracking shows parents where the bus is, delays trigger automatic notifications, and one broadcast informs everyone when the school changes its plans.",
      },
      {
        heading: "Records that follow the student",
        body: "Every student's admission details, attendance, results and documents live in one digital profile, so transfers, certificates and inspections never mean digging through registers.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "Assam State Board (HSLC / HS)"],
    languages: ["Assamese", "Bengali", "Hindi", "English"],
    areas: [
      "Dispur", "Beltola", "Ganeshguri", "Six Mile", "Zoo Road", "Chandmari",
      "Maligaon", "Jalukbari", "Khanapara", "Basistha", "Bhangagarh",
      "Uzan Bazar", "Paltan Bazaar", "Lokhra", "North Guwahati",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "Can parents who live outside Guwahati pay fees online?",
        a: "Yes. Parents pay from any device, receipts are generated and sent automatically, and reminders go out before and after each due date.",
      },
      {
        q: "Can parents track the school bus during heavy rain?",
        a: "Yes. Parents see the bus's live location, and delays trigger automatic notifications so they know when to expect it.",
      },
      {
        q: "Does Aksharum keep student documents?",
        a: "Yes. Each student has a digital profile holding their records, achievements and documents, and the school can share circulars and forms with the right roles.",
      },
    ],
    related: ["assam", "siliguri", "kolkata"],
    topics: ["document", "transport", "parent"],
  },
  {
    slug: "jharkhand",
    name: "Jharkhand",
    kind: "state",
    region: "Jharkhand",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Jharkhand | Aksharum",
    description:
      "School ERP for Jharkhand's JAC, CBSE and ICSE schools: attendance, online fees, exams, report cards and parent communication on one cloud platform.",
    h1: "School ERP Software in",
    h1Em: "Jharkhand",
    lead: "Jharkhand's schools range from company-township schools in Jamshedpur and Bokaro to fast-growing private schools in Ranchi and Dhanbad. Aksharum gives them one cloud platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "JAC, CBSE and ICSE together",
        body: "State-board schools in Jharkhand prepare students for the matriculation and intermediate examinations of the Jharkhand Academic Council (JAC), while CBSE and ICSE schools are common in its cities and industrial townships. Each school in Aksharum defines its own classes, subjects and exam terms.",
      },
      {
        heading: "Industrial-township schools",
        body: "Schools in steel and mining townships often serve shift-working families. Instant alerts for attendance, fees and results, plus direct messaging with teachers, keep parents informed whatever hours they work.",
      },
      {
        heading: "Nothing to install",
        body: "Aksharum runs in any browser with no servers and no IT team, and setup, data import and staff onboarding are typically finished within a single working day.",
      },
    ],
    boards: ["JAC (Matric / Intermediate)", "CBSE", "CISCE (ICSE / ISC)"],
    languages: ["Hindi", "English", "Bengali", "Santali", "Urdu"],
    areas: [
      "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh",
      "Deoghar", "Giridih", "Ramgarh", "Dumka", "Chaibasa", "Phusro", "Medininagar",
    ],
    areasLabel: "Cities and districts",
    faqs: [
      {
        q: "Does Aksharum support JAC schools?",
        a: "Yes. Classes, subjects, exam terms and grading are configured for each school, so JAC schools run exams, report cards, attendance and fees on the same platform as CBSE and ICSE schools.",
      },
      {
        q: "Can parents who work shifts stay informed?",
        a: "Yes. Attendance alerts, fee reminders and result notifications arrive in real time, and parents can message teachers whenever it suits them.",
      },
      {
        q: "How is Aksharum priced?",
        a: "Pricing is modular and based on school size — you pay for the modules you switch on, with no minimum seat count.",
      },
    ],
    related: ["west-bengal", "bihar", "odisha"],
    topics: ["parent", "fee", "digital"],
  },
  {
    slug: "ranchi",
    name: "Ranchi",
    kind: "city",
    parent: "jharkhand",
    region: "Jharkhand",
    country: "India",
    countryCode: "IN",
    tier: 2,
    title: "School ERP Software in Ranchi | Aksharum",
    description:
      "School ERP for Ranchi's CBSE, ICSE and JAC schools: online admissions, fees, attendance, exams, report cards and instant parent alerts. Book a free demo.",
    h1: "School ERP Software in",
    h1Em: "Ranchi",
    lead: "Ranchi has become one of eastern India's busiest school towns, with large CBSE and ICSE schools and many boarding and day schools drawing students from across Jharkhand. Aksharum gives them one platform for admissions, attendance, fees, exams and parent communication.",
    sections: [
      {
        heading: "Students from all over Jharkhand",
        body: "Many Ranchi students come from other districts, and their parents rely on the school to keep them informed. Instant attendance alerts, result notifications, online fee payment and direct messaging with teachers close that distance.",
      },
      {
        heading: "Admissions without the paperwork",
        body: "Popular schools in Ranchi handle a heavy admission season. Aksharum's digital admission journey turns applications into enrolments without paper, and each student's documents land in one digital profile.",
      },
      {
        heading: "Results in one click",
        body: "Teachers enter marks once, admins approve them, and results publish to the whole class in one click with a PDF report card for every student — no Excel and no manual formatting.",
      },
    ],
    boards: ["CBSE", "CISCE (ICSE / ISC)", "JAC"],
    languages: ["Hindi", "English", "Nagpuri", "Bengali"],
    areas: [
      "Lalpur", "Doranda", "Bariatu", "Kanke Road", "Harmu", "Hinoo",
      "Morabadi", "Ratu Road", "Booty More", "Namkum", "Hatia", "Argora", "Kokar",
    ],
    areasLabel: "Neighbourhoods",
    faqs: [
      {
        q: "Can parents in other districts follow their child's progress?",
        a: "Yes. Parents see attendance, results and fee status from their own account and are notified the moment anything changes.",
      },
      {
        q: "Can we publish report cards online?",
        a: "Yes. Once results are approved, every student gets a PDF report card with marks, grades, attendance and remarks, and parents are notified instantly.",
      },
      {
        q: "Do you offer a free demo?",
        a: "Yes — a free 30-minute live demo on Google Meet, tailored to your school's board, size and priorities.",
      },
    ],
    related: ["jharkhand", "patna", "kolkata"],
    topics: ["admission", "result", "parent"],
  },
];
