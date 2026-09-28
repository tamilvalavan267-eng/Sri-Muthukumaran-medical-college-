/**
 * Sri Muthukumaran Medical College & Research Institute
 * Central Demo Data Store (Fictionalized sample data for demonstration)
 */

window.SMMC_DATA = {
  institution: {
    name: "Sri Muthukumaran Medical College & Research Institute",
    shortName: "SMMCRI",
    tagline: "Excellence in Medical Education & Compassionate Healthcare",
    established: 2010,
    dean: {
      name: "Prof. Dr. K. Rajasekaran",
      degrees: "MS (Gen Surg), M.Ch (Surg Onco), FICS",
      title: "Dean & Chief Administrator",
      message: "At Sri Muthukumaran Medical College, our mission is to groom clinically astute, compassionate doctors committed to patient-first medical ethics and community health excellence."
    },
    medSuperintendent: "Prof. Dr. R. Ramanathan, MD (Gen Med)",
    affiliation: "The Tamil Nadu Dr. M.G.R. Medical University",
    approvals: ["National Medical Commission (NMC)", "NAAC 'A++' Accredited", "NABH Certified Teaching Hospital", "ISO 9001:2015"],
    address: "Chikkarayapuram, Near Mangadu, Kundrathur Road, Chennai, Tamil Nadu 600069",
    phone: "+91 44 2478 0055 / 2478 0056",
    emergency: "1066 / +91 44 2478 9999 (24x7 Casualty)",
    email: "info@smmcri.edu.in",
    admissionsEmail: "admissions@smmcri.edu.in",
    stats: {
      mbbsSeats: 150,
      hospitalBeds: "750+ Bedded Super-Speciality",
      departmentsCount: 22,
      facultyCount: "185+ Doctors & Specialists",
      dailyOpd: "1,800+ Patients Daily",
      passPercentage: "98.8% University Distinction"
    }
  },

  // 4 Main Demo Users for 1-Click Role Login
  demoUsers: {
    admin: {
      role: "admin",
      id: "ADM-001",
      name: "Dr. K. Rajasekaran",
      title: "Dean & Chief Administrator",
      email: "dean@smmcri.edu.in",
      avatar: "👨‍⚕️",
      dept: "Executive Administration"
    },
    teacher: {
      role: "teacher",
      id: "FAC-104",
      name: "Prof. Dr. S. Meenakshi",
      title: "HOD & Professor of General Medicine",
      email: "dr.meenakshi@smmcri.edu.in",
      avatar: "👩‍⚕️",
      dept: "General Medicine",
      assignedClass: "Final Year MBBS (Batch 2022-26) - Clinical Unit II"
    },
    student: {
      role: "student",
      id: "STU-2022-042",
      rollNo: "2022-MBBS-042",
      name: "Aarav Sundaram",
      gender: "Male",
      dob: "2003-05-14",
      bloodGroup: "O+ve",
      program: "MBBS (Bachelor of Medicine & Bachelor of Surgery)",
      year: "Final Year (Phase III, Part 1)",
      batch: "2022 - 2027",
      email: "aarav.sundaram@student.smmcri.edu.in",
      phone: "+91 98401 23456",
      avatar: "🩺",
      parentName: "Mr. R. Sundaram",
      parentPhone: "+91 98400 98765",
      hostelRoom: "Block A (Charaka) - Room 304",
      overallAttendance: 88.5,
      gpa: "3.84 / 4.0 (Distinction Track)"
    },
    parent: {
      role: "parent",
      id: "PAR-2022-042",
      name: "Mr. R. Sundaram",
      childName: "Aarav Sundaram",
      childRoll: "2022-MBBS-042",
      childProgram: "MBBS - Final Year Phase III",
      phone: "+91 98400 98765",
      email: "sundaram.r@gmail.com",
      avatar: "👨‍💼",
      relation: "Father"
    }
  },

  // 21+ Medical Departments
  departments: [
    {
      id: "mbbs",
      name: "MBBS (Undergraduate Medicine)",
      category: "core",
      hod: "Prof. Dr. K. Rajasekaran",
      intake: "150 Seats/Year",
      duration: "4.5 Years + 1 Year CRMI",
      description: "CBME curriculum regulated by NMC. Integrated clinical training across 750-bed hospital.",
      icon: "🩺",
      tags: ["NMC Approved", "High Priority", "Undergraduate"]
    },
    {
      id: "bds",
      name: "BDS (Dental Surgery)",
      category: "allied",
      hod: "Dr. Premalatha B., MDS",
      intake: "100 Seats/Year",
      duration: "4 Years + 1 Year Internship",
      description: "Comprehensive oral medicine, maxillofacial surgery, and dental restorative sciences.",
      icon: "🦷",
      tags: ["DCI Recognized", "Allied Science"]
    },
    {
      id: "nursing",
      name: "College of Nursing (B.Sc & M.Sc)",
      category: "allied",
      hod: "Prof. Mary Josephine, M.Sc (N)",
      intake: "100 Seats/Year",
      duration: "4 Years",
      description: "Critical care nursing, pediatric nursing, obstetric care, and community healthcare practice.",
      icon: "💉",
      tags: ["INC Approved", "Hospital Integrated"]
    },
    {
      id: "pharmacy",
      name: "College of Pharmacy (B.Pharm & Pharm.D)",
      category: "allied",
      hod: "Dr. G. Ravichandran, M.Pharm, Ph.D",
      intake: "60 Seats/Year",
      duration: "4 to 6 Years",
      description: "Pharmacology, industrial formulation, clinical drug toxicology and pharmacovigilance.",
      icon: "💊",
      tags: ["PCI Approved", "Clinical Pharmacy"]
    },
    {
      id: "physiotherapy",
      name: "Physiotherapy (BPT & MPT)",
      category: "allied",
      hod: "Dr. S. K. Vignesh, MPT (Neuro)",
      intake: "50 Seats/Year",
      duration: "4.5 Years",
      description: "Neuro-rehabilitation, sports sports injury recovery, orthopedic manual therapy and cardiopulmonary care.",
      icon: "🏃‍♂️",
      tags: ["Rehabilitation", "Allied Health"]
    },
    {
      id: "gen-med",
      name: "General Medicine",
      category: "clinical",
      hod: "Prof. Dr. S. Meenakshi, MD",
      beds: "180 Dedicated Beds",
      description: "Adult intensive care, endocrinology, nephrology, cardiology consultations and internal diagnostics.",
      icon: "🏥",
      tags: ["Clinical", "ICU / CCU", "OPD Unit"]
    },
    {
      id: "gen-surg",
      name: "General Surgery",
      category: "clinical",
      hod: "Prof. Dr. V. Arunkumar, MS, FRCS",
      beds: "150 Beds, 6 Modular OTs",
      description: "Advanced laparoscopic, trauma, gastrointestinal, oncology and vascular surgery units.",
      icon: "🔬",
      tags: ["Clinical", "Major OTs", "Trauma"]
    },
    {
      id: "pediatrics",
      name: "Pediatrics & Neonatology",
      category: "clinical",
      hod: "Dr. P. Shalini, MD (PGI)",
      beds: "90 Beds + 24 NICU/PICU",
      description: "Neonatal intensive care, pediatric cardiology, child immunization and developmental clinics.",
      icon: "👶",
      tags: ["Clinical", "NICU", "Child Health"]
    },
    {
      id: "ortho",
      name: "Orthopedics & Joint Replacement",
      category: "clinical",
      hod: "Prof. Dr. M. Rajesh, MS (Ortho)",
      beds: "90 Beds, 2 Laminar OTs",
      description: "Robotic joint arthroplasty, complex polytrauma, spine surgery and sports arthroscopy.",
      icon: "🦴",
      tags: ["Clinical", "Joint Replacement", "Trauma"]
    },
    {
      id: "dermatology",
      name: "Dermatology, Venereology & Leprosy",
      category: "clinical",
      hod: "Dr. Revathi Chandran, MD (DVL)",
      beds: "30 Beds",
      description: "Cosmetology, laser therapeutics, dermatosurgery, allergy testing and phototherapy.",
      icon: "✨",
      tags: ["Clinical", "Aesthetics", "OPD"]
    },
    {
      id: "psychiatry",
      name: "Psychiatry & Behavioral Sciences",
      category: "clinical",
      hod: "Dr. Arvind Swaminathan, MD",
      beds: "30 Beds + De-addiction",
      description: "Child guidance, neuro-psychiatry, mood disorder clinic, de-addiction and counselling therapy.",
      icon: "🧠",
      tags: ["Clinical", "Mental Health", "Counseling"]
    },
    {
      id: "ophthalmology",
      name: "Ophthalmology (Eye Institute)",
      category: "clinical",
      hod: "Dr. Geetha Mohan, MS, DO",
      beds: "40 Beds + Eye Bank",
      description: "Phacoemulsification cataract surgery, cornea transplants, diabetic retinopathy lasers and glaucoma care.",
      icon: "👁️",
      tags: ["Clinical", "Microsurgery", "Eye Care"]
    },
    {
      id: "ent",
      name: "ENT (Otorhinolaryngology)",
      category: "clinical",
      hod: "Dr. T. Senthil Nathan, MS (ENT)",
      beds: "40 Beds",
      description: "Micro-ear surgery, endoscopic sinus surgery, cochlear implantation and voice clinic.",
      icon: "👂",
      tags: ["Clinical", "Head & Neck", "Audiology"]
    },
    {
      id: "anesthesiology",
      name: "Anesthesiology & Critical Care",
      category: "clinical",
      hod: "Prof. Dr. N. Karthikeyan, MD",
      beds: "Covering 14 OTs + 40 ICU Beds",
      description: "Neuro-anesthesia, pediatric anesthesia, difficult airway management and acute pain service.",
      icon: "💨",
      tags: ["Critical Care", "OT Support", "Pain Clinic"]
    },
    {
      id: "pathology",
      name: "Pathology",
      category: "para-clinical",
      hod: "Prof. Dr. K. Anand, MD",
      facilities: "NABL Accredited Automated Lab",
      description: "Histopathology, immunohistochemistry (IHC), flow cytometry, cytopathology, and blood banking.",
      icon: "🔬",
      tags: ["Para-Clinical", "Diagnostic", "Blood Bank"]
    },
    {
      id: "microbiology",
      name: "Microbiology & Virology",
      category: "para-clinical",
      hod: "Dr. Shanthi Parthasarathy, MD",
      facilities: "BSL-2 Lab & RT-PCR Center",
      description: "Bacteriology, molecular diagnosis, hospital infection control, serology and parasitology.",
      icon: "🧫",
      tags: ["Para-Clinical", "Infection Control", "BSL-2"]
    },
    {
      id: "pharmacology",
      name: "Pharmacology & Therapeutics",
      category: "para-clinical",
      hod: "Dr. Divya R., MD",
      facilities: "Computer Assisted Learning (CAL) Lab",
      description: "Clinical trials unit, pharmacokinetics, prescription auditing and rational therapeutics.",
      icon: "💊",
      tags: ["Para-Clinical", "Research", "Drug Safety"]
    },
    {
      id: "anatomy",
      name: "Anatomy & Embryology",
      category: "pre-clinical",
      hod: "Prof. Dr. Lakshmi Narayanan, MS",
      facilities: "3D Virtual Dissection & Museum",
      description: "Gross anatomy, neuroanatomy, genetics lab, histology microscopy, embalming, body donation.",
      icon: "🫀",
      tags: ["Pre-Clinical", "Dissection Hall", "3D Tech"]
    },
    {
      id: "physiology",
      name: "Physiology & Neurophysiology",
      category: "pre-clinical",
      hod: "Dr. V. Deepa, MD",
      facilities: "Amphibian & Human Physiology Labs",
      description: "Cardio-respiratory lab, nerve conduction study, autonomic function testing, hematology lab.",
      icon: "⚡",
      tags: ["Pre-Clinical", "Diagnostics", "First Year"]
    },
    {
      id: "biochemistry",
      name: "Biochemistry & Clinical Chemistry",
      category: "pre-clinical",
      hod: "Dr. Suresh Babu, MD",
      facilities: "Fully Automated Clinical Chemistry",
      description: "Clinical enzymology, molecular biology, metabolic disease markers and electrophoresis.",
      icon: "🧬",
      tags: ["Pre-Clinical", "Automated Lab", "Biomarkers"]
    },
    {
      id: "community-med",
      name: "Community Medicine (PSM)",
      category: "para-clinical",
      hod: "Prof. Dr. T. Balaji, MD",
      facilities: "RHTC (Kundrathur) & UHTC (Mangadu)",
      description: "Epidemiological research, national health programmes, primary health center postings, immunization.",
      icon: "🏘️",
      tags: ["Field Postings", "Public Health", "Rural Health"]
    },
    {
      id: "obg",
      name: "Obstetrics & Gynaecology (OBG)",
      category: "clinical",
      hod: "Prof. Dr. Vijaya Selvam, MD, DGO",
      beds: "120 Beds + Labour Suites",
      description: "High-risk pregnancy clinic, feto-maternal medicine, laparoscopic gynecologic surgeries and infertility.",
      icon: "🌸",
      tags: ["Clinical", "Maternity", "Labour Suites"]
    }
  ],

  // Student Cohort for Class Management & Attendance
  studentsList: [
    {
      id: "STU-2022-042",
      rollNo: "2022-MBBS-042",
      name: "Aarav Sundaram",
      gender: "Male",
      attendance: 88.5,
      status: "Present",
      marksGenMed: 88,
      marksSurg: 84,
      marksPeds: 92,
      feeTotal: 485000,
      feePaid: 325000,
      feePending: 160000,
      room: "Charaka-304"
    },
    {
      id: "STU-2022-089",
      rollNo: "2022-MBBS-089",
      name: "Priya Ramachandran",
      gender: "Female",
      attendance: 94.2,
      status: "Present",
      marksGenMed: 95,
      marksSurg: 91,
      marksPeds: 94,
      feeTotal: 485000,
      feePaid: 485000,
      feePending: 0,
      room: "Sushruta-210"
    },
    {
      id: "STU-2022-112",
      rollNo: "2022-MBBS-112",
      name: "Rohan K. Varma",
      gender: "Male",
      attendance: 74.0,
      status: "Absent",
      marksGenMed: 68,
      marksSurg: 70,
      marksPeds: 72,
      feeTotal: 485000,
      feePaid: 405000,
      feePending: 80000,
      room: "Charaka-108"
    },
    {
      id: "STU-2022-015",
      rollNo: "2022-MBBS-015",
      name: "Ananya Iyer",
      gender: "Female",
      attendance: 91.8,
      status: "Present",
      marksGenMed: 92,
      marksSurg: 89,
      marksPeds: 90,
      feeTotal: 485000,
      feePaid: 485000,
      feePending: 0,
      room: "Sushruta-305"
    },
    {
      id: "STU-2022-064",
      rollNo: "2022-MBBS-064",
      name: "Mohammed Farhan",
      gender: "Male",
      attendance: 86.4,
      status: "Present",
      marksGenMed: 80,
      marksSurg: 82,
      marksPeds: 85,
      feeTotal: 485000,
      feePaid: 440000,
      feePending: 45000,
      room: "Charaka-402"
    },
    {
      id: "STU-2022-138",
      rollNo: "2022-MBBS-138",
      name: "Sneha M. Patel",
      gender: "Female",
      attendance: 82.1,
      status: "Present",
      marksGenMed: 78,
      marksSurg: 76,
      marksPeds: 81,
      feeTotal: 485000,
      feePaid: 485000,
      feePending: 0,
      room: "Sushruta-112"
    },
    {
      id: "STU-2022-055",
      rollNo: "2022-MBBS-055",
      name: "Karthik Sivasankar",
      gender: "Male",
      attendance: 89.0,
      status: "Present",
      marksGenMed: 85,
      marksSurg: 83,
      marksPeds: 88,
      feeTotal: 485000,
      feePaid: 365000,
      feePending: 120000,
      room: "Charaka-215"
    },
    {
      id: "STU-2022-033",
      rollNo: "2022-MBBS-033",
      name: "Harini Venkatesh",
      gender: "Female",
      attendance: 96.5,
      status: "Present",
      marksGenMed: 96,
      marksSurg: 94,
      marksPeds: 95,
      feeTotal: 485000,
      feePaid: 485000,
      feePending: 0,
      room: "Sushruta-104"
    }
  ],

  // Subject-wise attendance details for Aarav Sundaram
  subjectAttendance: [
    { subject: "General Medicine & Allied", code: "GM-401", attended: 82, total: 90, pct: 91.1, minRequired: 75, faculty: "Prof. Dr. S. Meenakshi" },
    { subject: "General Surgery & Trauma", code: "GS-402", attended: 70, total: 80, pct: 87.5, minRequired: 75, faculty: "Prof. Dr. V. Arunkumar" },
    { subject: "Pediatrics & Neonatology", code: "PD-403", attended: 55, total: 60, pct: 91.6, minRequired: 75, faculty: "Dr. P. Shalini" },
    { subject: "Orthopedics & Sports Medicine", code: "OR-404", attended: 43, total: 50, pct: 86.0, minRequired: 75, faculty: "Prof. Dr. M. Rajesh" },
    { subject: "Obstetrics & Gynaecology", code: "OG-405", attended: 72, total: 82, pct: 87.8, minRequired: 75, faculty: "Prof. Dr. Vijaya Selvam" },
    { subject: "Community Medicine Clinical Postings", code: "CM-406", attended: 38, total: 40, pct: 95.0, minRequired: 75, faculty: "Prof. Dr. T. Balaji" }
  ],

  // Academic Marks & Report Card for Demo Student
  studentMarks: [
    { exam: "Internal Assessment 1", date: "July 2026", genMed: 85, genSurg: 82, pediatrics: 90, ortho: 84, obg: 88, status: "Cleared with Honors" },
    { exam: "Internal Assessment 2", date: "August 2026", genMed: 88, genSurg: 84, pediatrics: 92, ortho: 86, obg: 89, status: "Cleared with Honors" },
    { exam: "Pre-University Model Exam", date: "September 2026", genMed: 90, genSurg: 86, pediatrics: 94, ortho: 88, obg: 91, status: "First Class with Distinction" }
  ],

  // Upcoming University Examinations
  upcomingExams: [
    { subject: "General Medicine - Paper I (Systemic Diseases)", date: "2026-10-15", time: "09:30 AM - 12:30 PM", venue: "Exam Hall A (Academic Block, 3rd Floor)", code: "MBBS-GM-301" },
    { subject: "General Medicine - Paper II (Emergency & Therapeutics)", date: "2026-10-17", time: "09:30 AM - 12:30 PM", venue: "Exam Hall A (Academic Block, 3rd Floor)", code: "MBBS-GM-302" },
    { subject: "General Surgery - Paper I (Principles & General Surgery)", date: "2026-10-20", time: "09:30 AM - 12:30 PM", venue: "Exam Hall B (Academic Block, 3rd Floor)", code: "MBBS-GS-303" },
    { subject: "Pediatrics & Child Health", date: "2026-10-24", time: "09:30 AM - 12:30 PM", venue: "Exam Hall A (Academic Block, 3rd Floor)", code: "MBBS-PD-305" },
    { subject: "Clinical Ward Viva & Patient Case Long Examination", date: "2026-10-28", time: "08:30 AM - 04:00 PM", venue: "Hospital Teaching Ward 4B", code: "MBBS-CLIN-306" }
  ],

  // Fee Details for Demo Student
  feeStructure: {
    totalFee: 485000,
    paidAmount: 325000,
    pendingAmount: 160000,
    dueDate: "2026-10-15",
    academicYear: "2026 - 2027",
    breakdown: [
      { item: "Tuition & Clinical Academic Fee", total: 350000, paid: 250000, pending: 100000 },
      { item: "Hospital Bedside & Skill Lab Training", total: 60000, paid: 40000, pending: 20000 },
      { item: "Hostel Accommodation (Double Occupancy AC)", total: 45000, paid: 25000, pending: 20000 },
      { item: "Mess Catering & Dietary Charges", total: 20000, paid: 10000, pending: 10000 },
      { item: "M.G.R. Medical University Exam & Reg Fee", total: 10000, paid: 0, pending: 10000 }
    ],
    transactions: [
      { receiptNo: "SMMC-REC-2026-1049", date: "2026-06-12", amount: 200000, method: "Net Banking (SBI)", status: "Success", ref: "TXN748921094" },
      { receiptNo: "SMMC-REC-2026-2184", date: "2026-08-04", amount: 125000, method: "UPI (Google Pay)", status: "Success", ref: "UPI982314561" }
    ]
  },

  // Hostel Information for Demo Student
  hostelInfo: {
    blockName: "Charaka Boys Hostel (Block A)",
    roomNo: "Room 304 (3rd Floor)",
    type: "Air Conditioned - Double Occupancy",
    roommate: "Karthik Sivasankar (Roll: 2022-MBBS-055)",
    warden: "Prof. Dr. G. Natarajan, MD",
    wardenPhone: "+91 94440 12345",
    curfew: "09:30 PM (Biometric Punch)",
    facilities: ["High-speed 5G WiFi", "Study Lounge", "24/7 Power Backup", "Gymnasium", "Laundromat", "RO Water Station"],
    messMenuToday: {
      breakfast: "Idli, Medu Vada, Sambar, Coconut Chutney, Boiled Eggs / Banana, Tea / Coffee",
      lunch: "Steamed Rice, South Indian Veg Meals, Chicken Curry / Paneer Butter Masala, Rasam, Curd",
      snacks: "Samosa, Onion Pakoda, Filter Coffee / Green Tea",
      dinner: "Chapati, Dal Tadka, Mixed Vegetable Kurma, Pulao, Seasonal Fruit"
    }
  },

  // Weekly Medical College Timetable (Final Year MBBS)
  timetable: [
    { day: "Monday", slots: [
      { time: "08:00 - 09:00 AM", type: "Lecture", subject: "General Medicine", topic: "Cardiomyopathy & Heart Failure", hall: "Lecture Hall 1", teacher: "Prof. Dr. S. Meenakshi" },
      { time: "09:00 - 12:00 PM", type: "Clinical", subject: "Hospital Clinical Ward", topic: "Bedside Cardiology Case Examination", hall: "Ward 4A", teacher: "Clinical Unit Doctors" },
      { time: "12:00 - 01:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "01:00 - 02:30 PM", type: "Lecture", subject: "General Surgery", topic: "Obstructive Jaundice & Bile Ducts", hall: "Lecture Hall 1", teacher: "Prof. Dr. V. Arunkumar" },
      { time: "02:30 - 04:00 PM", type: "Practical", subject: "Surgical Skills Lab", topic: "Suturing & Laparoscopic Simulator", hall: "Sim Lab 2", teacher: "Dr. Rajesh" }
    ]},
    { day: "Tuesday", slots: [
      { time: "08:00 - 09:00 AM", type: "Lecture", subject: "Pediatrics", topic: "Neonatal Sepsis & Management", hall: "Lecture Hall 1", teacher: "Dr. P. Shalini" },
      { time: "09:00 - 12:00 PM", type: "Clinical", subject: "Pediatric ICU Postings", topic: "NICU Rounds & Lumbar Puncture Demo", hall: "NICU Block", teacher: "Dr. Shalini & Staff" },
      { time: "12:00 - 01:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "01:00 - 02:30 PM", type: "Seminar", subject: "Orthopedics", topic: "Management of Pelvic Fractures", hall: "Seminar Room 3", teacher: "Prof. Dr. M. Rajesh" },
      { time: "02:30 - 04:00 PM", type: "Practical", subject: "Radiology & Imaging", topic: "CT / MRI Interpretation of Trauma", hall: "Radiology Dept", teacher: "Dr. Senthil" }
    ]},
    { day: "Wednesday", slots: [
      { time: "08:00 - 09:00 AM", type: "Lecture", subject: "Obstetrics & Gyn", topic: "High Risk Pregnancy & Eclampsia", hall: "Lecture Hall 1", teacher: "Prof. Dr. Vijaya Selvam" },
      { time: "09:00 - 12:00 PM", type: "Clinical", subject: "Labour Room & OT", topic: "Caesarean Section & Normal Delivery", hall: "Maternity OT", teacher: "OBG Registrar" },
      { time: "12:00 - 01:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "01:00 - 02:30 PM", type: "Lecture", subject: "Community Medicine", topic: "Vector Borne Disease Outbreaks", hall: "Lecture Hall 2", teacher: "Prof. Dr. T. Balaji" },
      { time: "02:30 - 04:00 PM", type: "Field", subject: "Community Field Visit", topic: "Rural Primary Health Center Visit", hall: "RHTC Kundrathur", teacher: "Dr. Anand" }
    ]},
    { day: "Thursday", slots: [
      { time: "08:00 - 09:00 AM", type: "Lecture", subject: "General Medicine", topic: "Acute Kidney Injury & Dialysis", hall: "Lecture Hall 1", teacher: "Dr. Meenakshi" },
      { time: "09:00 - 12:00 PM", type: "Clinical", subject: "Emergency & Casualty", topic: "Acute Medical Emergencies Triage", hall: "Trauma Ward", teacher: "Emergency Team" },
      { time: "12:00 - 01:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "01:00 - 02:30 PM", type: "Lecture", subject: "Ophthalmology", topic: "Diabetic Retinopathy & Glaucoma", hall: "Lecture Hall 1", teacher: "Dr. Geetha Mohan" },
      { time: "02:30 - 04:00 PM", type: "Lab", subject: "Clinical Pathology", topic: "Peripheral Smear & CSF Analysis", hall: "Central Lab", teacher: "Dr. K. Anand" }
    ]},
    { day: "Friday", slots: [
      { time: "08:00 - 09:00 AM", type: "Lecture", subject: "General Surgery", topic: "Head Injuries & GCS Scoring", hall: "Lecture Hall 1", teacher: "Prof. Dr. V. Arunkumar" },
      { time: "09:00 - 12:00 PM", type: "Clinical", subject: "General Surgery OTs", topic: "Laparoscopic Cholecystectomy Postings", hall: "Modular OT 4", teacher: "Surgical Team" },
      { time: "12:00 - 01:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "01:00 - 02:30 PM", type: "Lecture", subject: "ENT", topic: "CSOM & Mastoiditis", hall: "Lecture Hall 1", teacher: "Dr. Senthil Nathan" },
      { time: "02:30 - 04:00 PM", type: "Seminar", subject: "Clinico-Pathological CPC", topic: "Multi-Disciplinary Mortality Audit", hall: "College Auditorium", teacher: "Faculty Panel" }
    ]},
    { day: "Saturday", slots: [
      { time: "08:00 - 10:00 AM", type: "Seminar", subject: "Journal Club", topic: "Recent Advances in Sepsis Biomarkers", hall: "Conference Hall", teacher: "PGs & Interns" },
      { time: "10:00 - 01:00 PM", type: "Clinical", subject: "Speciality Outpatient Clinics", topic: "Geriatric & Diabetic Foot Clinic", hall: "OPD Complex", teacher: "Prof. Meenakshi" },
      { time: "01:00 - 02:00 PM", type: "Break", subject: "Lunch Break", topic: "College Dining Hall", hall: "Cafeteria", teacher: "-" },
      { time: "02:00 - 04:00 PM", type: "Sports", subject: "Sports & Physical Wellness", topic: "Inter-batch Football & Badminton", hall: "Sports Ground", teacher: "Sports Director" }
    ]}
  ],

  // Announcements & Circulars
  announcements: [
    {
      id: "ANN-101",
      title: "University Model Examination Dates - October 2026",
      date: "2026-09-25",
      category: "Academic",
      priority: "high",
      summary: "Theory and Clinical Practical schedules for Final Year MBBS Phase III Part 1 have been released. 75% attendance mandatory for hall ticket issuance.",
      author: "Office of the Controller of Examinations"
    },
    {
      id: "ANN-102",
      title: "CME on Artificial Intelligence in Medical Diagnostics",
      date: "2026-09-22",
      category: "Conference",
      priority: "medium",
      summary: "National CME credit hours approved by TN Medical Council. 3 credit hours awarded for all faculty, postgraduates, and final year students.",
      author: "Dept. of General Medicine & Radiology"
    },
    {
      id: "ANN-103",
      title: "Tuition Fee Due Reminder for Academic Year 2026-27",
      date: "2026-09-20",
      category: "Finance",
      priority: "high",
      summary: "All undergraduate and postgraduate students are requested to clear term fees on or before 15th October 2026 to avoid late fees.",
      author: "Finance & Accounts Branch"
    },
    {
      id: "ANN-104",
      title: "Free Mega Multi-Speciality Health Camp at Kundrathur",
      date: "2026-09-18",
      category: "Community",
      priority: "normal",
      summary: "Sri Muthukumaran Hospital is conducting a community health camp covering free cardiology ECG, diabetes screening, and eye checkups.",
      author: "Hospital Outreach Department"
    }
  ],

  // Notifications
  notifications: [
    { id: "NOTIF-1", text: "Your internal marks for General Medicine have been updated (88/100).", time: "2 hours ago", unread: true, icon: "📝" },
    { id: "NOTIF-2", text: "Fee balance reminder: ₹1,60,000 pending before 15 Oct 2026.", time: "1 day ago", unread: true, icon: "💳" },
    { id: "NOTIF-3", text: "Dr. Meenakshi posted clinical case notes on Heart Failure.", time: "2 days ago", unread: false, icon: "📚" },
    { id: "NOTIF-4", text: "Hostel Warden inspection scheduled for Saturday evening 6:00 PM.", time: "3 days ago", unread: false, icon: "🏢" }
  ],

  // College Facilities
  facilities: [
    {
      title: "750-Bed Super-Speciality Hospital",
      description: "Round-the-clock emergency trauma care, 14 advanced modular laminar flow operation theatres, cath lab, dialysis unit, and dedicated intensive care units.",
      icon: "🏥",
      highlights: ["24x7 Casualty & Blood Bank", "NABH Accredited", "14 Modern Modular OTs", "Free Outpatient Care for Underprivileged"]
    },
    {
      title: "Advanced Medical Simulation Center",
      description: "High-fidelity mannequins, surgical virtual reality simulators, laparoscopy training stations, and code-blue cardiac life support simulation suites.",
      icon: "🩺",
      highlights: ["High-Fidelity Adult & Child Mannequins", "Laparoscopic Virtual Reality", "AHA Certified BLS / ACLS Center"]
    },
    {
      title: "Air-Conditioned Central Library",
      description: "Over 25,000 national and international medical textbooks, 150+ subscribed journals, digital e-library with DELNET, PubMed access, and 24x7 quiet reading halls.",
      icon: "📚",
      highlights: ["25,000+ Textbooks", "E-Library with 100+ Systems", "Open 24 Hours during Exams", "Audio-Visual Repositories"]
    },
    {
      title: "Residential Campus & Hostels",
      description: "Separate, secure air-conditioned hostel towers for boys and girls with biometric entry, 24x7 security surveillance, hygienic multi-cuisine dining, and recreational lounges.",
      icon: "🏢",
      highlights: ["Boys & Girls Separate Blocks", "RO Drinking Water Stations", "High-Speed WiFi", "Indoor Games & Gym"]
    },
    {
      title: "3D Virtual Anatomy & Dissection Suites",
      description: "State-of-the-art Anatomage 3D digital dissection tables alongside traditional cadaveric dissection halls, embryology models, and pathology specimen museum.",
      icon: "🫀",
      highlights: ["Anatomage 3D Virtual Table", "150 Specimen Dissection Hall", "Teratological Pathology Museum"]
    },
    {
      title: "Sports & Recreational Arena",
      description: "Expansive green grounds featuring international standard cricket ground, football turf, floodlit basketball and badminton courts, and modern fitness center.",
      icon: "⚽",
      highlights: ["Cricket & Football Grounds", "Synthetic Badminton Courts", "Modern Fitness Center", "Annual Intra-College Sports Meet"]
    }
  ]
};
