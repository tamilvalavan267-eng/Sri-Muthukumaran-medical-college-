# Sri Muthukumaran Medical College & Research Institute
## Management Portal & Public Website Prototype

A professional, modern, and fully responsive medical college website and role-based management portal designed for client demonstrations.

---

## 🚀 Live Localhost Links

The application is actively running on your local machine:

- **🌐 Public Website:** [http://localhost:3000](http://localhost:3000)
- **🏥 Management Portal:** [http://localhost:3000/portal.html](http://localhost:3000/portal.html)

### ⚡ 1-Click Role Direct Links (For Client Demos):
- **👨‍💼 Administrator (Dean Dr. K. Rajasekaran):** [http://localhost:3000/portal.html?role=admin](http://localhost:3000/portal.html?role=admin)
- **👩‍⚕️ Faculty / Teacher (Prof. Dr. S. Meenakshi):** [http://localhost:3000/portal.html?role=teacher](http://localhost:3000/portal.html?role=teacher)
- **🩺 Medical Student (Aarav Sundaram - Final MBBS):** [http://localhost:3000/portal.html?role=student](http://localhost:3000/portal.html?role=student)
- **👨‍👦 Parent / Guardian (Mr. R. Sundaram):** [http://localhost:3000/portal.html?role=parent](http://localhost:3000/portal.html?role=parent)

---

## 🛠️ How to Start the Server Anytime

Open a terminal or command prompt in this directory (`c:\Users\tamil\Desktop\College Website`) and run:

```bash
npm start
```
or
```bash
node server.js
```

Then open `http://localhost:3000` in your web browser.

---

## 🌟 Key Features Included

### 1. Public Medical College Website (`index.html`)
- **Emergency Casualty Bar:** 24/7 Trauma line, Blood Bank, and NMC Accreditation badge.
- **Hero Showcase:** Campus banner with high-resolution medical imagery and live statistics.
- **Quick Demo Switcher Bar:** 1-click buttons allowing the client to test any user role immediately.
- **Dean's Desk & Accreditations:** Message from Dean Prof. Dr. K. Rajasekaran (NMC, NAAC A++, NABH, ISO 9001).
- **21+ Medical Departments Explorer:** Interactive category filters (Core MBBS, Clinical Specialities, Pre-Clinical, Para-Clinical, Allied Sciences).
- **World-Class Campus Facilities:** 750-Bed Teaching Hospital, High-Fidelity Simulation Lab, AC Central Library, Separate Hostels, 3D Virtual Anatomy Lab, Sports Complex.
- **Admission Inquiry Form:** Fully functional interactive contact form with instant validation.
- **Login Modal:** 1-click instant login credentials for all 4 roles.

### 2. Role-Based Management Portal (`portal.html`)
- **Top Role Switcher:** Toggle between Admin, Teacher, Student, and Parent dynamically on any page.
- **Student Dashboard:**
  - Overall & subject-wise attendance percentages with NMC compliance indicators (>75%).
  - Internal assessment marks and academic progression line chart.
  - Daily clinical ward postings and lecture schedule.
  - Upcoming university examinations and printable official **Hall Ticket**.
- **Teacher Dashboard:**
  - Assigned class roster (Final Year MBBS Clinical Unit II).
  - **Interactive Attendance Marker:** Click 'Present' / 'Absent' to toggle individual students with real-time percentage counters and 'Save Attendance' feedback.
  - **Marks Management:** View and edit student scores across theory and clinical practicals.
- **Parent Dashboard:**
  - Dedicated view strictly for the parent's ward (Aarav Sundaram).
  - Live attendance monitoring, internal grades, hostel status, and direct callback request to the academic mentor.
- **Admin Dashboard:**
  - High-level executive KPIs (1,450 students, 185+ doctors, 92.4% attendance, ₹14.2 Cr collected).
  - Fee realization donut chart and hospital bed occupancy analytics.
  - Student, teacher, department, and hostel directories.

### 3. Electronic Fee Payment Flow & Official Receipt
- Displays complete breakdown (Tuition, Clinical Skill Lab, Hostel & Mess, University Exam).
- Click **"Pay Fees"** to open a simulated payment gateway:
  - **UPI:** Instant QR code scanner and VPA ID.
  - **Cards:** Debit and Credit card entry.
  - **Net Banking:** Popular bank selection (SBI, HDFC, ICICI).
- Completing payment generates an **Official SMMCRI Payment Receipt** with unique Receipt Number, Transaction Reference, Date, Student Roll No, Digital Stamp, and Print/Download PDF option.
- Automatically deducts the payment and updates the student's pending balance in real-time!

### 4. Centralized Design & Theme System (`css/theme.css` & `js/theme.js`)
- All styling is governed by CSS custom properties in `:root`.
- The **Settings** page provides a **Live Theme Customizer**:
  - One-click color presets: *Medical Sapphire (Default)*, *Royal Navy*, *Surgical Emerald*, *Cardiology Crimson*, and *Academic Purple*.
  - Custom color pickers for primary and secondary hues.
  - Dark Mode and Light Mode toggle.
  - Font family switcher (Plus Jakarta Sans, Outfit, Inter).
  - Changes take effect across the entire website instantly and persist in `localStorage`.

---

## 📁 File Structure

```
College Website/
├── index.html            # Public Medical College Website
├── portal.html           # College Management Portal
├── server.js             # Zero-dependency local Node.js web server
├── package.json          # Node configuration (npm start)
├── README.md             # Documentation & Guide
├── css/
│   ├── theme.css         # Centralized design tokens, CSS variables, typography
│   ├── public.css        # Public website styling
│   └── portal.css        # Portal sidebar, cards, tables, modals, receipts
├── js/
│   ├── demo-data.js      # Fictional demo dataset for 22 departments, students, faculty, fees
│   ├── theme.js          # Live theme controller & persistence
│   ├── charts.js         # Canvas charting engine for attendance & performance
│   ├── public.js         # Public website interaction & inquiry logic
│   └── portal.js         # Portal application engine, role switching, attendance & payment
└── assets/
    └── images/           # High-resolution generated medical campus & lab photography
```
