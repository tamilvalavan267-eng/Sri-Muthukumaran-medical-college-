/**
 * Sri Muthukumaran Medical College & Research Institute
 * Management Portal Application Engine
 * Handles Role Switching, Dynamic Views, Attendance Marking,
 * Marks Entry, Fee Payment Checkout & Printable Receipt, Timetable, Theme Engine
 */

class SMMC_Portal {
  constructor() {
    this.data = window.SMMC_DATA;
    this.currentRole = this.getInitialRole();
    this.currentView = 'dashboard';
    this.students = JSON.parse(JSON.stringify(this.data.studentsList));
    this.feeState = JSON.parse(JSON.stringify(this.data.feeStructure));
    this.notifications = JSON.parse(JSON.stringify(this.data.notifications));

    this.init();
  }

  getInitialRole() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get('role');
    if (paramRole && ['admin', 'teacher', 'student', 'parent'].includes(paramRole)) {
      return paramRole;
    }
    return localStorage.getItem('smmcri_current_role') || 'student';
  }

  init() {
    this.bindGlobalEvents();
    this.setRole(this.currentRole, false);
    this.navigateTo(this.currentView);
  }

  bindGlobalEvents() {
    // Topbar role selector buttons
    document.querySelectorAll('[data-switch-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = btn.getAttribute('data-switch-role');
        this.setRole(role);
      });
    });

    // Sidebar navigation clicks
    document.querySelectorAll('[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.navigateTo(view);
      });
    });

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('portalSidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Topbar notifications bell
    const bellBtn = document.getElementById('notificationBellBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    if (bellBtn && notifDropdown) {
      bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('show');
        this.markNotificationsAsRead();
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== bellBtn) {
          notifDropdown.classList.remove('show');
        }
      });
    }

    // Topbar search filter
    const searchInput = document.getElementById('portalGlobalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleGlobalSearch(e.target.value);
      });
    }
  }

  setRole(role, reRender = true) {
    this.currentRole = role;
    localStorage.setItem('smmcri_current_role', role);

    // Update active state in topbar buttons
    document.querySelectorAll('[data-switch-role]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-switch-role') === role);
    });

    // Update sidebar profile card
    const user = this.data.demoUsers[role];
    const roleAvatar = document.getElementById('sidebarRoleAvatar');
    const roleName = document.getElementById('sidebarRoleName');
    const roleBadge = document.getElementById('sidebarRoleBadge');
    const topbarAvatar = document.getElementById('topbarAvatar');
    const topbarName = document.getElementById('topbarUserName');
    const topbarRole = document.getElementById('topbarUserRole');

    if (roleAvatar) roleAvatar.textContent = user.avatar;
    if (roleName) roleName.textContent = user.name;
    if (roleBadge) roleBadge.textContent = user.role.toUpperCase();
    if (topbarAvatar) topbarAvatar.textContent = user.avatar;
    if (topbarName) topbarName.textContent = user.name;
    if (topbarRole) topbarRole.textContent = user.title || user.childProgram || 'Medical College Portal';

    // Show/hide menu items based on role
    this.updateSidebarVisibility(role);

    if (reRender) {
      this.showToast(`Switched view to ${role.toUpperCase()} mode (${user.name})`, 'info');
      this.navigateTo(this.currentView);
    }
  }

  updateSidebarVisibility(role) {
    const studentOnly = document.querySelectorAll('.role-req-student');
    const teacherOnly = document.querySelectorAll('.role-req-teacher');
    const adminOnly = document.querySelectorAll('.role-req-admin');
    const parentOnly = document.querySelectorAll('.role-req-parent');

    studentOnly.forEach(el => el.style.display = (role === 'student') ? 'flex' : 'none');
    teacherOnly.forEach(el => el.style.display = (role === 'teacher') ? 'flex' : 'none');
    adminOnly.forEach(el => el.style.display = (role === 'admin') ? 'flex' : 'none');
    parentOnly.forEach(el => el.style.display = (role === 'parent') ? 'flex' : 'none');
  }

  navigateTo(viewName) {
    this.currentView = viewName;

    // Update sidebar active link
    document.querySelectorAll('[data-view]').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Close mobile drawer if open
    const sidebar = document.getElementById('portalSidebar');
    if (sidebar) sidebar.classList.remove('open');

    const contentContainer = document.getElementById('portalContentArea');
    if (!contentContainer) return;

    // Render corresponding view template
    contentContainer.innerHTML = '';
    const viewRenderer = this[`renderView_${viewName}`] || this.renderView_dashboard;
    viewRenderer.call(this, contentContainer);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger chart rendering if chart canvas exists
    setTimeout(() => {
      this.initViewCharts();
    }, 50);
  }

  // ==========================================
  // DASHBOARD VIEW
  // ==========================================
  renderView_dashboard(container) {
    const role = this.currentRole;
    if (role === 'admin') {
      this.renderAdminDashboard(container);
    } else if (role === 'teacher') {
      this.renderTeacherDashboard(container);
    } else if (role === 'parent') {
      this.renderParentDashboard(container);
    } else {
      this.renderStudentDashboard(container);
    }
  }

  // --- Student Dashboard ---
  renderStudentDashboard(container) {
    const student = this.data.demoUsers.student;
    const fee = this.feeState;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Welcome back, ${student.name} 🩺</h2>
          <p>${student.program} | ${student.year} | Roll No: <strong>${student.rollNo}</strong></p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary btn-sm" onclick="portalApp.openHallTicketModal()">
            📑 Exam Hall Ticket
          </button>
          <button class="btn btn-primary btn-sm" onclick="portalApp.openFeePaymentModal()">
            💳 Pay Fee Online
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div>
            <div class="kpi-value">${student.overallAttendance}%</div>
            <div class="kpi-label">Overall Attendance</div>
            <div class="kpi-trend positive">✓ Eligible for University Exams (&gt;75%)</div>
          </div>
          <div class="kpi-icon-box">📊</div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-value">${student.gpa}</div>
            <div class="kpi-label">Cumulative Performance</div>
            <div class="kpi-trend positive">★ Distinction Track (Rank #4)</div>
          </div>
          <div class="kpi-icon-box">🏆</div>
        </div>

        <div class="kpi-card ${fee.pendingAmount > 0 ? 'kpi-warning' : 'kpi-success'}">
          <div>
            <div class="kpi-value">₹${fee.pendingAmount.toLocaleString('en-IN')}</div>
            <div class="kpi-label">Pending Term Fee</div>
            <div class="kpi-trend ${fee.pendingAmount > 0 ? 'warning' : 'positive'}">
              ${fee.pendingAmount > 0 ? `Due by ${fee.dueDate}` : '✓ Fully Cleared'}
            </div>
          </div>
          <div class="kpi-icon-box">💳</div>
        </div>

        <div class="kpi-card kpi-info">
          <div>
            <div class="kpi-value">Room 304</div>
            <div class="kpi-label">Hostel Residence</div>
            <div class="kpi-trend">Charaka Block A (Double AC)</div>
          </div>
          <div class="kpi-icon-box">🏢</div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Left: Academic Performance & Attendance -->
        <div>
          <!-- Academic Chart -->
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">📈 Internal Assessment Marks Progression</div>
              <span class="badge badge-primary">MBBS Phase III</span>
            </div>
            <p class="text-muted small mb-3">Performance across Internal Assessments and Pre-University Model Examinations.</p>
            <div style="height: 250px; position: relative;">
              <canvas id="studentPerfCanvas" style="width: 100%; height: 100%;"></canvas>
            </div>
          </div>

          <!-- Subject Attendance Progress -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">📅 Subject-Wise Attendance Status</div>
              <button class="btn btn-outline btn-sm" onclick="portalApp.navigateTo('attendance')">View Detailed Log</button>
            </div>
            <div class="attendance-list">
              ${this.data.subjectAttendance.map(sub => `
                <div class="attendance-item">
                  <div class="attendance-item-top">
                    <span class="attendance-subject-name">${sub.subject} (${sub.code})</span>
                    <span class="attendance-pct-tag ${sub.pct >= 75 ? 'text-success' : 'text-danger'}">
                      ${sub.attended}/${sub.total} classes (${sub.pct}%)
                    </span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${sub.pct}%; background-color: ${sub.pct >= 85 ? 'var(--success)' : sub.pct >= 75 ? 'var(--warning)' : 'var(--danger)'};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Today's Schedule & Upcoming Exams -->
        <div>
          <!-- Today's Schedule -->
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">⏰ Today's Clinical Schedule</div>
              <span class="badge badge-info">Monday</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">08:00 - 09:00 AM</div>
                <div style="font-weight: 700; color: var(--text-main);">General Medicine Lecture</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Lecture Hall 1 | Prof. Dr. S. Meenakshi</div>
              </div>

              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">09:00 - 12:00 PM</div>
                <div style="font-weight: 700; color: var(--text-main);">Hospital Clinical Ward Rounds</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Ward 4A (Cardiology Beds)</div>
              </div>

              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border-left: 3px solid var(--info);">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">01:00 - 02:30 PM</div>
                <div style="font-weight: 700; color: var(--text-main);">General Surgery Seminar</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">Seminar Room 2 | Prof. Dr. V. Arunkumar</div>
              </div>
            </div>
          </div>

          <!-- Upcoming Exams -->
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">📑 Upcoming Exams</div>
              <span class="badge badge-warning">October 2026</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${this.data.upcomingExams.slice(0, 3).map(exam => `
                <div style="padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${exam.subject}</div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                    <span>📅 ${exam.date}</span>
                    <span>⏰ ${exam.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Notice Board Ticker -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">📢 Latest Circular</div>
              <button class="btn btn-ghost btn-sm" onclick="portalApp.navigateTo('announcements')">All</button>
            </div>
            <h5 style="font-size: 0.9rem; margin-bottom: 0.35rem;">${this.data.announcements[0].title}</h5>
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${this.data.announcements[0].summary}</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- Teacher Dashboard ---
  renderTeacherDashboard(container) {
    const teacher = this.data.demoUsers.teacher;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Faculty Portal: ${teacher.name} 👩‍⚕️</h2>
          <p>${teacher.title} | ${teacher.assignedClass}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" onclick="portalApp.navigateTo('attendance')">
            📅 Mark Class Attendance
          </button>
          <button class="btn btn-secondary btn-sm" onclick="portalApp.navigateTo('marks')">
            📝 Enter Internal Marks
          </button>
        </div>
      </div>

      <!-- Teacher KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-info">
          <div>
            <div class="kpi-value">${this.students.length}</div>
            <div class="kpi-label">Enrolled Students (Unit II)</div>
            <div class="kpi-trend">MBBS Final Year Cohort</div>
          </div>
          <div class="kpi-icon-box">👨‍🎓</div>
        </div>

        <div class="kpi-card kpi-success">
          <div>
            <div class="kpi-value">88.2%</div>
            <div class="kpi-label">Class Avg. Attendance</div>
            <div class="kpi-trend positive">✓ High clinical attendance compliance</div>
          </div>
          <div class="kpi-icon-box">📊</div>
        </div>

        <div class="kpi-card kpi-warning">
          <div>
            <div class="kpi-value">1 Student</div>
            <div class="kpi-label">Attendance Warning</div>
            <div class="kpi-trend warning">Rohan K. Varma (&lt;75% Attendance)</div>
          </div>
          <div class="kpi-icon-box">⚠️</div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-value">IA-2 Pending</div>
            <div class="kpi-label">Next Grade Submission</div>
            <div class="kpi-trend">Due by Friday 5:00 PM</div>
          </div>
          <div class="kpi-icon-box">📝</div>
        </div>
      </div>

      <!-- Quick Action: Interactive Attendance Marking Banner -->
      <div class="attendance-marker-bar">
        <div>
          <h4 style="color: var(--text-main); margin-bottom: 0.25rem;">⚡ Quick Attendance Marker for Today</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Topic: Bedside Cardiology & Systemic Examination | Date: <strong>Today</strong>
          </p>
        </div>
        <button class="btn btn-primary" onclick="portalApp.navigateTo('attendance')">
          Launch Attendance Marker Tool →
        </button>
      </div>

      <!-- Student Cohort Roster with Live Status -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">👨‍⚕️ Clinical Unit II Student Roster</div>
          <span class="badge badge-primary">8 Students Active</span>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Attendance %</th>
                <th>Status Today</th>
                <th>Gen. Medicine Marks</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.students.map(s => `
                <tr>
                  <td><strong>${s.rollNo}</strong></td>
                  <td>${s.name}</td>
                  <td>
                    <span class="badge ${s.attendance >= 75 ? 'badge-success' : 'badge-danger'}">
                      ${s.attendance}%
                    </span>
                  </td>
                  <td>
                    <button class="attendance-toggle-btn ${s.status === 'Present' ? 'btn-present' : 'btn-absent'}"
                      onclick="portalApp.toggleStudentStatus('${s.id}')">
                      ${s.status}
                    </button>
                  </td>
                  <td><strong>${s.marksGenMed}/100</strong></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="portalApp.openStudentModal('${s.id}')">
                      Profile
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- Parent Dashboard ---
  renderParentDashboard(container) {
    const parent = this.data.demoUsers.parent;
    const student = this.data.demoUsers.student;
    const fee = this.feeState;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Parent Portal: Welcome, ${parent.name} 👨‍💼</h2>
          <p>Ward: <strong>${parent.childName}</strong> | Roll No: ${parent.childRoll} | ${parent.childProgram}</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="portalApp.openFeePaymentModal()">
            💳 Pay Ward's Fee Online
          </button>
        </div>
      </div>

      <!-- Child Overview Banner -->
      <div class="card mb-4" style="background: linear-gradient(135deg, rgba(15, 82, 186, 0.06), rgba(13, 148, 136, 0.06)); border-color: var(--primary);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
              🩺
            </div>
            <div>
              <h3 style="color: var(--text-main); margin-bottom: 0.2rem;">${student.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                Final Year MBBS | Mentor: <strong>Prof. Dr. S. Meenakshi</strong> (+91 94440 88776)
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 1rem;">
            <div class="text-center">
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--success);">${student.overallAttendance}%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Attendance</div>
            </div>
            <div class="text-center">
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">#4 Rank</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Academic Standing</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Parent KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div>
            <div class="kpi-value">${student.overallAttendance}%</div>
            <div class="kpi-label">Cumulative Attendance</div>
            <div class="kpi-trend positive">✓ Fully Satisfies NMC Mandate (&gt;75%)</div>
          </div>
          <div class="kpi-icon-box">📊</div>
        </div>

        <div class="kpi-card ${fee.pendingAmount > 0 ? 'kpi-warning' : 'kpi-success'}">
          <div>
            <div class="kpi-value">₹${fee.pendingAmount.toLocaleString('en-IN')}</div>
            <div class="kpi-label">Pending Term Fee</div>
            <div class="kpi-trend ${fee.pendingAmount > 0 ? 'warning' : 'positive'}">
              ${fee.pendingAmount > 0 ? `Due by ${fee.dueDate}` : '✓ Fully Paid'}
            </div>
          </div>
          <div class="kpi-icon-box">💳</div>
        </div>

        <div class="kpi-card kpi-info">
          <div>
            <div class="kpi-value">Charaka 304</div>
            <div class="kpi-label">Hostel Residence</div>
            <div class="kpi-trend">Biometric In-time: 09:15 PM</div>
          </div>
          <div class="kpi-icon-box">🏢</div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-value">15 Oct 2026</div>
            <div class="kpi-label">University Model Exam</div>
            <div class="kpi-trend">General Medicine Paper 1</div>
          </div>
          <div class="kpi-icon-box">📑</div>
        </div>
      </div>

      <!-- Child Report Card & Timetable Grid -->
      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📝 Ward's Examination Performance</div>
            <button class="btn btn-outline btn-sm" onclick="portalApp.openHallTicketModal()">View Hall Ticket</button>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Medicine</th>
                  <th>Surgery</th>
                  <th>Pediatrics</th>
                  <th>Overall Grade</th>
                </tr>
              </thead>
              <tbody>
                ${this.data.studentMarks.map(m => `
                  <tr>
                    <td><strong>${m.exam}</strong></td>
                    <td>${m.genMed}%</td>
                    <td>${m.genSurg}%</td>
                    <td>${m.pediatrics}%</td>
                    <td><span class="badge badge-success">${m.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🏢 Hostel & Dietary Notice</div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Warden: <strong>Prof. Dr. G. Natarajan</strong> | Hostel Block A
          </p>
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 1rem;">
            <strong>Today's Mess Menu (Dinner):</strong><br>
            ${this.data.hostelInfo.messMenuToday.dinner}
          </div>
          <button class="btn btn-outline-primary btn-sm w-100" onclick="alert('Message sent to Academic Mentor Dr. Meenakshi. She will call you back.')">
            💬 Request Mentor Callback
          </button>
        </div>
      </div>
    `;
  }

  // --- Admin Dashboard ---
  renderAdminDashboard(container) {
    const fee = this.feeState;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Institutional Executive Dashboard 🏛️</h2>
          <p>Dean's Control Console | Sri Muthukumaran Medical College & Research Institute</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="portalApp.navigateTo('reports')">
            📊 Institutional Reports
          </button>
          <button class="btn btn-primary btn-sm" onclick="portalApp.navigateTo('students')">
            👨‍🎓 Manage Students
          </button>
        </div>
      </div>

      <!-- Admin Top KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-info">
          <div>
            <div class="kpi-value">1,450</div>
            <div class="kpi-label">Total Medical Students</div>
            <div class="kpi-trend positive">150 MBBS seats/yr + Allied</div>
          </div>
          <div class="kpi-icon-box">👨‍🎓</div>
        </div>

        <div class="kpi-card">
          <div>
            <div class="kpi-value">185+</div>
            <div class="kpi-label">Faculty & Doctors</div>
            <div class="kpi-trend">22 Clinical & Pre-Clinical Depts</div>
          </div>
          <div class="kpi-icon-box">👨‍🏫</div>
        </div>

        <div class="kpi-card kpi-success">
          <div>
            <div class="kpi-value">92.4%</div>
            <div class="kpi-label">Campus-wide Attendance</div>
            <div class="kpi-trend positive">✓ Fully Compliant with NMC</div>
          </div>
          <div class="kpi-icon-box">📈</div>
        </div>

        <div class="kpi-card kpi-warning">
          <div>
            <div class="kpi-value">₹14.2 Cr</div>
            <div class="kpi-label">Fee Collection (87%)</div>
            <div class="kpi-trend warning">₹2.1 Cr Outstanding Balance</div>
          </div>
          <div class="kpi-icon-box">💰</div>
        </div>
      </div>

      <!-- Admin Analytics Charts Grid -->
      <div class="dashboard-grid-equal">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 Fee Collection Distribution</div>
            <span class="badge badge-success">87% Realized</span>
          </div>
          <div style="height: 220px; display: flex; align-items: center; justify-content: center;">
            <canvas id="adminFeeDonutCanvas" style="width: 220px; height: 220px;"></canvas>
          </div>
          <div style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 1rem; font-size: 0.8rem;">
            <span><span style="color: #10B981;">●</span> Collected (₹14.2 Cr)</span>
            <span><span style="color: #EF4444;">●</span> Pending (₹2.1 Cr)</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🏥 Hospital & Clinical Occupancy</div>
            <span class="badge badge-info">750 Beds</span>
          </div>
          <div style="height: 220px;">
            <canvas id="adminDeptBarCanvas" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      </div>

      <!-- Quick Management Directory -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚙️ College Management Modules</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div class="card card-interactive" onclick="portalApp.navigateTo('students')" style="cursor: pointer; text-align: center; padding: 1.25rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👨‍🎓</div>
            <h5 style="color: var(--text-main);">Student Registry</h5>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Enrollment, files & logs</p>
          </div>

          <div class="card card-interactive" onclick="portalApp.navigateTo('teachers')" style="cursor: pointer; text-align: center; padding: 1.25rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👨‍🏫</div>
            <h5 style="color: var(--text-main);">Faculty Directory</h5>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Professors & HODs</p>
          </div>

          <div class="card card-interactive" onclick="portalApp.navigateTo('fees')" style="cursor: pointer; text-align: center; padding: 1.25rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💳</div>
            <h5 style="color: var(--text-main);">Accounts & Fees</h5>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Ledger & Receipts</p>
          </div>

          <div class="card card-interactive" onclick="portalApp.navigateTo('hostel')" style="cursor: pointer; text-align: center; padding: 1.25rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
            <h5 style="color: var(--text-main);">Hostel Occupancy</h5>
            <p style="font-size: 0.75rem; color: var(--text-muted);">94% Rooms Allocated</p>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // STUDENT MANAGEMENT VIEW
  // ==========================================
  renderView_students(container) {
    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Student Management Directory 👨‍🎓</h2>
          <p>Undergraduate MBBS & Allied Health Science Student Records</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="alert('Student Registration Form - Demo Mode. Ready for backend API.')">
            + Add New Student
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
          <div class="card-title">Enrolled Students (Class Roster)</div>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="studentRosterFilter" class="form-control" placeholder="Search by name or roll..." style="width: 250px; padding: 0.4rem 0.85rem;" onkeyup="portalApp.filterStudentRoster(this.value)">
          </div>
        </div>
        <div class="data-table-container">
          <table class="data-table" id="studentsTable">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Candidate Name</th>
                <th>Gender</th>
                <th>Attendance</th>
                <th>Gen Medicine</th>
                <th>Fee Status</th>
                <th>Hostel Room</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.students.map(s => `
                <tr>
                  <td><strong>${s.rollNo}</strong></td>
                  <td>${s.name}</td>
                  <td>${s.gender}</td>
                  <td>
                    <span class="badge ${s.attendance >= 75 ? 'badge-success' : 'badge-danger'}">
                      ${s.attendance}%
                    </span>
                  </td>
                  <td>${s.marksGenMed}/100</td>
                  <td>
                    <span class="badge ${s.feePending === 0 ? 'badge-success' : 'badge-warning'}">
                      ${s.feePending === 0 ? 'Paid' : `Pending ₹${s.feePending.toLocaleString('en-IN')}`}
                    </span>
                  </td>
                  <td>${s.room}</td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="portalApp.openStudentModal('${s.id}')">
                      View File
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TEACHER MANAGEMENT VIEW
  // ==========================================
  renderView_teachers(container) {
    const faculty = [
      { name: "Prof. Dr. S. Meenakshi", qual: "MD (Gen Med)", dept: "General Medicine", role: "Professor & HOD", exp: "18 Yrs", email: "meenakshi@smmcri.edu.in", status: "Active" },
      { name: "Prof. Dr. V. Arunkumar", qual: "MS, FRCS", dept: "General Surgery", role: "Professor & HOD", exp: "22 Yrs", email: "arunkumar@smmcri.edu.in", status: "Active" },
      { name: "Dr. P. Shalini", qual: "MD (Pediatrics)", dept: "Pediatrics & Neonatology", role: "Associate Professor", exp: "12 Yrs", email: "shalini@smmcri.edu.in", status: "Active" },
      { name: "Prof. Dr. M. Rajesh", qual: "MS (Ortho)", dept: "Orthopedics", role: "Professor", exp: "16 Yrs", email: "rajesh.ortho@smmcri.edu.in", status: "Active" },
      { name: "Prof. Dr. K. Anand", qual: "MD (Pathology)", dept: "Pathology", role: "Professor & HOD", exp: "19 Yrs", email: "anand.path@smmcri.edu.in", status: "Active" },
      { name: "Dr. Divya R", qual: "MD (Pharm)", dept: "Pharmacology", role: "Assistant Professor", exp: "8 Yrs", email: "divya.pharm@smmcri.edu.in", status: "Active" },
      { name: "Prof. Dr. T. Balaji", qual: "MD (PSM)", dept: "Community Medicine", role: "Professor & HOD", exp: "15 Yrs", email: "balaji.psm@smmcri.edu.in", status: "Active" }
    ];

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Faculty & Department Chairs 👨‍🏫</h2>
          <p>Medical Professors, Clinicians, and Pre-Clinical Chairs</p>
        </div>
      </div>

      <div class="card">
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Qualifications</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>Official Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${faculty.map(f => `
                <tr>
                  <td><strong>${f.name}</strong></td>
                  <td>${f.qual}</td>
                  <td><span class="badge badge-primary">${f.dept}</span></td>
                  <td>${f.role}</td>
                  <td>${f.exp}</td>
                  <td>${f.email}</td>
                  <td><span class="badge badge-success">${f.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // ATTENDANCE MODULE & INTERACTIVE MARKER
  // ==========================================
  renderView_attendance(container) {
    const isTeacher = this.currentRole === 'teacher' || this.currentRole === 'admin';

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Attendance Registry & Clinical Compliance 📅</h2>
          <p>Mandatory NMC 75% Clinical & 80% Practical Minimum Verification</p>
        </div>
        ${isTeacher ? `
          <button class="btn btn-success btn-sm" onclick="portalApp.saveAttendanceBatch()">
            💾 Save & Submit Attendance
          </button>
        ` : ''}
      </div>

      ${isTeacher ? `
        <!-- Interactive Attendance Marking Controls for Teachers -->
        <div class="attendance-marker-bar mb-4">
          <div class="attendance-marker-controls">
            <div>
              <label class="form-label text-dark" style="font-size: 0.75rem;">SELECT BATCH</label>
              <select class="form-control" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                <option>Final Year MBBS (Batch 2022-26)</option>
                <option>3rd Year MBBS Clinical Unit</option>
              </select>
            </div>

            <div>
              <label class="form-label text-dark" style="font-size: 0.75rem;">SUBJECT / WARD</label>
              <select class="form-control" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                <option>General Medicine - Ward Clinicals</option>
                <option>Systemic Cardiology Lecture</option>
              </select>
            </div>

            <div>
              <label class="form-label text-dark" style="font-size: 0.75rem;">DATE</label>
              <input type="date" class="form-control" value="2026-09-28" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
            </div>
          </div>

          <div style="text-align: right;">
            <div id="attendanceLiveStats" style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">
              Present: 7 / 8 (87.5%)
            </div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">Click button below to toggle status</span>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header">
            <div class="card-title">⚡ Interactive Class Attendance Marker</div>
            <div>
              <button class="btn btn-outline btn-sm" onclick="portalApp.markAllAttendance('Present')">Mark All Present</button>
              <button class="btn btn-outline btn-sm" onclick="portalApp.markAllAttendance('Absent')">Mark All Absent</button>
            </div>
          </div>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Current Pct</th>
                  <th>Today's Attendance Status (Click to Toggle)</th>
                </tr>
              </thead>
              <tbody>
                ${this.students.map(s => `
                  <tr>
                    <td><strong>${s.rollNo}</strong></td>
                    <td>${s.name}</td>
                    <td>
                      <span class="badge ${s.attendance >= 75 ? 'badge-success' : 'badge-danger'}">
                        ${s.attendance}%
                      </span>
                    </td>
                    <td>
                      <button class="attendance-toggle-btn ${s.status === 'Present' ? 'btn-present' : 'btn-absent'}"
                        id="status-btn-${s.id}"
                        onclick="portalApp.toggleStudentStatus('${s.id}')">
                        ${s.status === 'Present' ? '✓ Present' : '✗ Absent'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Subject-Wise Attendance Breakdown for Student/Parent -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Subject-Wise Clinical & Theory Breakdown</div>
          <span class="badge badge-success">Overall: 88.5%</span>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Course Code</th>
                <th>Classes Attended</th>
                <th>Total Held</th>
                <th>Attendance %</th>
                <th>NMC Requirement</th>
                <th>Faculty In-Charge</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.subjectAttendance.map(sub => `
                <tr>
                  <td><strong>${sub.subject}</strong></td>
                  <td>${sub.code}</td>
                  <td>${sub.attended}</td>
                  <td>${sub.total}</td>
                  <td>
                    <span class="badge ${sub.pct >= 75 ? 'badge-success' : 'badge-danger'}">
                      ${sub.pct}%
                    </span>
                  </td>
                  <td>75% Min</td>
                  <td>${sub.faculty}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Toggle student status in interactive marker
  toggleStudentStatus(studentId) {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return;

    student.status = student.status === 'Present' ? 'Absent' : 'Present';
    
    // Update button directly
    const btn = document.getElementById(`status-btn-${studentId}`);
    if (btn) {
      btn.className = `attendance-toggle-btn ${student.status === 'Present' ? 'btn-present' : 'btn-absent'}`;
      btn.innerHTML = student.status === 'Present' ? '✓ Present' : '✗ Absent';
    }

    this.updateAttendanceStatsCounter();
    this.showToast(`${student.name} marked ${student.status}`, student.status === 'Present' ? 'success' : 'danger');
  }

  markAllAttendance(status) {
    this.students.forEach(s => {
      s.status = status;
      const btn = document.getElementById(`status-btn-${s.id}`);
      if (btn) {
        btn.className = `attendance-toggle-btn ${status === 'Present' ? 'btn-present' : 'btn-absent'}`;
        btn.innerHTML = status === 'Present' ? '✓ Present' : '✗ Absent';
      }
    });
    this.updateAttendanceStatsCounter();
    this.showToast(`Marked all students as ${status}`, 'info');
  }

  updateAttendanceStatsCounter() {
    const total = this.students.length;
    const present = this.students.filter(s => s.status === 'Present').length;
    const pct = ((present / total) * 100).toFixed(1);
    const counter = document.getElementById('attendanceLiveStats');
    if (counter) {
      counter.textContent = `Present: ${present} / ${total} (${pct}%)`;
    }
  }

  saveAttendanceBatch() {
    this.showToast('✓ Attendance saved and synced to University NMC Portal!', 'success');
  }

  // ==========================================
  // MARKS & EXAMINATIONS MODULE
  // ==========================================
  renderView_marks(container) {
    const isTeacher = this.currentRole === 'teacher' || this.currentRole === 'admin';

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Academic Marks & Examination Records 📝</h2>
          <p>Continuous Internal Assessments, Ward Vivas & Model Examinations</p>
        </div>
        ${isTeacher ? `
          <button class="btn btn-primary btn-sm" onclick="portalApp.openMarksEntryModal()">
            ⚡ Edit / Enter Student Marks
          </button>
        ` : ''}
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">🏆 Internal Assessment Report Card (Aarav Sundaram)</div>
          <span class="badge badge-success">Distinction Track</span>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Date</th>
                <th>Gen. Medicine (100)</th>
                <th>Gen. Surgery (100)</th>
                <th>Pediatrics (100)</th>
                <th>Orthopedics (100)</th>
                <th>OBG (100)</th>
                <th>Result Grade</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.studentMarks.map(m => `
                <tr>
                  <td><strong>${m.exam}</strong></td>
                  <td>${m.date}</td>
                  <td>${m.genMed}</td>
                  <td>${m.genSurg}</td>
                  <td>${m.pediatrics}</td>
                  <td>${m.ortho}</td>
                  <td>${m.obg}</td>
                  <td><span class="badge badge-success">${m.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cohort Class Marks Summary -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Final Year MBBS Class Marks Summary</div>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Gen. Medicine</th>
                <th>Gen. Surgery</th>
                <th>Pediatrics</th>
                <th>Average Pct</th>
              </tr>
            </thead>
            <tbody>
              ${this.students.map(s => {
                const avg = ((s.marksGenMed + s.marksSurg + s.marksPeds) / 3).toFixed(1);
                return `
                  <tr>
                    <td><strong>${s.rollNo}</strong></td>
                    <td>${s.name}</td>
                    <td>${s.marksGenMed}/100</td>
                    <td>${s.marksSurg}/100</td>
                    <td>${s.marksPeds}/100</td>
                    <td><strong>${avg}%</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // EXAMINATIONS VIEW & PRINTABLE HALL TICKET
  // ==========================================
  renderView_exams(container) {
    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>University Examinations & Hall Ticket 📑</h2>
          <p>The Tamil Nadu Dr. M.G.R. Medical University - October 2026 Session</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="portalApp.openHallTicketModal()">
            🖨️ Generate & Print Hall Ticket
          </button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">📅 Official Examination Schedule</div>
          <span class="badge badge-info">NMC Regulated</span>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject Paper</th>
                <th>Paper Code</th>
                <th>Exam Date</th>
                <th>Timing</th>
                <th>Examination Hall</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.upcomingExams.map(ex => `
                <tr>
                  <td><strong>${ex.subject}</strong></td>
                  <td><code>${ex.code}</code></td>
                  <td><strong>${ex.date}</strong></td>
                  <td>${ex.time}</td>
                  <td>${ex.venue}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // FEES MODULE & SIMULATED PAYMENT FLOW
  // ==========================================
  renderView_fees(container) {
    const fee = this.feeState;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Fee Ledger & Electronic Payments 💳</h2>
          <p>Academic Year 2026-27 | Sri Muthukumaran Medical College</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="portalApp.openFeePaymentModal()">
            💳 Pay Fees Online Now
          </button>
        </div>
      </div>

      <!-- Prominent Fee Status Banner -->
      <div class="fee-summary-banner">
        <div class="fee-stat-group">
          <div class="fee-stat-cell">
            <h5>Total Term Fee</h5>
            <span>₹${fee.totalFee.toLocaleString('en-IN')}</span>
          </div>
          <div class="fee-stat-cell">
            <h5>Amount Paid</h5>
            <span style="color: #4ade80;">₹${fee.paidAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="fee-stat-cell">
            <h5>Pending Balance</h5>
            <span style="color: #f87171;">₹${fee.pendingAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.5rem;">Due Date: <strong>${fee.dueDate}</strong></div>
          <button class="btn btn-secondary btn-lg" onclick="portalApp.openFeePaymentModal()">
            ⚡ Proceed to Pay
          </button>
        </div>
      </div>

      <!-- Detailed Breakdown Table -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">📑 Academic Fee Structure Breakdown</div>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fee Head / Particulars</th>
                <th>Total Allocated</th>
                <th>Paid Amount</th>
                <th>Pending Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${fee.breakdown.map(b => `
                <tr>
                  <td><strong>${b.item}</strong></td>
                  <td>₹${b.total.toLocaleString('en-IN')}</td>
                  <td>₹${b.paid.toLocaleString('en-IN')}</td>
                  <td>₹${b.pending.toLocaleString('en-IN')}</td>
                  <td>
                    <span class="badge ${b.pending === 0 ? 'badge-success' : 'badge-warning'}">
                      ${b.pending === 0 ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment History & Receipts -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🧾 Past Payment History & Official Receipts</div>
        </div>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Transaction Date</th>
                <th>Amount</th>
                <th>Payment Channel</th>
                <th>Bank Reference</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${fee.transactions.map(t => `
                <tr>
                  <td><strong>${t.receiptNo}</strong></td>
                  <td>${t.date}</td>
                  <td><strong>₹${t.amount.toLocaleString('en-IN')}</strong></td>
                  <td>${t.method}</td>
                  <td><code>${t.ref}</code></td>
                  <td><span class="badge badge-success">${t.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="portalApp.showReceiptModal('${t.receiptNo}', ${t.amount}, '${t.date}', '${t.method}', '${t.ref}')">
                      🖨️ View Receipt
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================
  // HOSTEL MANAGEMENT VIEW
  // ==========================================
  renderView_hostel(container) {
    const hostel = this.data.hostelInfo;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Hostel Accommodation & Campus Residence 🏢</h2>
          <p>Sri Muthukumaran Residential Campus | Charaka & Sushruta Blocks</p>
        </div>
      </div>

      <div class="dashboard-grid">
        <div>
          <!-- Room Details Card -->
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">🛏️ Room Allocation Details</div>
              <span class="badge badge-success">Active Residence</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; font-size: 0.9rem;">
              <div><strong>Block:</strong> ${hostel.blockName}</div>
              <div><strong>Room Number:</strong> ${hostel.roomNo}</div>
              <div><strong>Room Type:</strong> ${hostel.type}</div>
              <div><strong>Roommate:</strong> ${hostel.roommate}</div>
              <div><strong>Chief Warden:</strong> ${hostel.warden} (${hostel.wardenPhone})</div>
              <div><strong>Evening Curfew:</strong> ${hostel.curfew}</div>
            </div>
          </div>

          <!-- Weekly Mess Menu -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">🍽️ Today's Dietary Mess Menu</div>
              <span class="badge badge-primary">FSSAI Certified</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.875rem;">
              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
                <strong>🍳 Breakfast (07:30 - 09:00 AM):</strong><br>
                ${hostel.messMenuToday.breakfast}
              </div>
              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
                <strong>🍛 Lunch (12:30 - 02:30 PM):</strong><br>
                ${hostel.messMenuToday.lunch}
              </div>
              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
                <strong>☕ Evening Refreshment (05:00 - 06:00 PM):</strong><br>
                ${hostel.messMenuToday.snacks}
              </div>
              <div style="padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
                <strong>🍲 Dinner (07:30 - 09:30 PM):</strong><br>
                ${hostel.messMenuToday.dinner}
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- Maintenance Request Form -->
          <div class="card">
            <div class="card-header">
              <div class="card-title">🔧 Hostel Maintenance Request</div>
            </div>
            <form onsubmit="event.preventDefault(); portalApp.showToast('Maintenance ticket raised! Attendant assigned within 2 hours.', 'success'); this.reset();">
              <div class="form-group">
                <label class="form-label">Issue Category</label>
                <select class="form-control">
                  <option>Air Conditioning / Electrical</option>
                  <option>Plumbing & Water Supply</option>
                  <option>Carpentry / Furniture</option>
                  <option>Housekeeping & Cleaning</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Description of Issue</label>
                <textarea class="form-control" rows="3" placeholder="Please describe the repair needed..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100">Submit Request</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TIMETABLE VIEW
  // ==========================================
  renderView_timetable(container) {
    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Weekly Academic & Clinical Timetable ⏰</h2>
          <p>MBBS Phase III Part 1 | Academic Year 2026-27</p>
        </div>
      </div>

      <div class="card">
        <div class="timetable-grid">
          <div class="timetable-header-cell">Time Slot</div>
          <div class="timetable-header-cell">Monday</div>
          <div class="timetable-header-cell">Tuesday</div>
          <div class="timetable-header-cell">Wednesday</div>
          <div class="timetable-header-cell">Thursday</div>
          <div class="timetable-header-cell">Friday</div>

          <!-- Row 1: 08:00 - 09:00 AM -->
          <div class="timetable-header-cell" style="display: flex; align-items: center; justify-content: center;">
            08:00 - 09:00 AM
          </div>
          <div class="timetable-slot-cell">
            <strong>General Medicine</strong>
            <span>Cardiomyopathy (LH-1)</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>Pediatrics</strong>
            <span>Neonatal Sepsis (LH-1)</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>Obstetrics & Gyn</strong>
            <span>High Risk Pregnancy (LH-1)</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>General Medicine</strong>
            <span>Acute Kidney Injury (LH-1)</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>General Surgery</strong>
            <span>Head Injuries (LH-1)</span>
          </div>

          <!-- Row 2: 09:00 - 12:00 PM (Clinical Postings) -->
          <div class="timetable-header-cell" style="display: flex; align-items: center; justify-content: center;">
            09:00 - 12:00 PM<br>(Clinicals)
          </div>
          <div class="timetable-slot-cell" style="background: var(--primary-light);">
            <strong style="color: var(--primary);">Hospital Clinical Ward</strong>
            <span>Cardiology Bedside Rounds</span>
          </div>
          <div class="timetable-slot-cell" style="background: var(--primary-light);">
            <strong style="color: var(--primary);">Pediatric ICU</strong>
            <span>NICU Lumbar Puncture</span>
          </div>
          <div class="timetable-slot-cell" style="background: var(--primary-light);">
            <strong style="color: var(--primary);">Labour Room / OT</strong>
            <span>Caesarean Procedures</span>
          </div>
          <div class="timetable-slot-cell" style="background: var(--primary-light);">
            <strong style="color: var(--primary);">Casualty / Trauma</strong>
            <span>Emergency Triage Ward</span>
          </div>
          <div class="timetable-slot-cell" style="background: var(--primary-light);">
            <strong style="color: var(--primary);">Modular OTs</strong>
            <span>General Surgery Cases</span>
          </div>

          <!-- Row 3: 01:00 - 02:30 PM -->
          <div class="timetable-header-cell" style="display: flex; align-items: center; justify-content: center;">
            01:00 - 02:30 PM
          </div>
          <div class="timetable-slot-cell">
            <strong>General Surgery</strong>
            <span>Bile Ducts & Jaundice</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>Orthopedics</strong>
            <span>Pelvic Fractures Seminar</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>Community Med</strong>
            <span>Vector Borne Outbreaks</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>Ophthalmology</strong>
            <span>Diabetic Retinopathy</span>
          </div>
          <div class="timetable-slot-cell">
            <strong>ENT</strong>
            <span>CSOM & Mastoiditis</span>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // ANNOUNCEMENTS VIEW
  // ==========================================
  renderView_announcements(container) {
    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Official Circulars & Institutional Notices 📢</h2>
          <p>Dean's Office & Academic Directorate</p>
        </div>
      </div>

      <div class="notices-grid">
        ${this.data.announcements.map(ann => `
          <div class="notice-card ${ann.priority === 'high' ? 'priority-high' : ''}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge ${ann.priority === 'high' ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
              <span class="notice-date">📅 ${ann.date}</span>
            </div>
            <h4 class="notice-title">${ann.title}</h4>
            <p class="notice-summary">${ann.summary}</p>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
              Issued by: <strong>${ann.author}</strong>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // REPORTS VIEW
  // ==========================================
  renderView_reports(container) {
    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Institutional Analytics & Compliance Reports 📈</h2>
          <p>National Medical Commission (NMC) Auditing & Performance Reports</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="portalApp.showToast('Exporting consolidated dataset to Excel...', 'info')">
            📊 Export to Excel
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            🖨️ Print Report
          </button>
        </div>
      </div>

      <div class="dashboard-grid mb-4">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 University Exam Distinction & Pass Rate</div>
          </div>
          <div style="height: 250px;">
            <canvas id="studentPerfCanvas" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">💰 Fee Realization Audit</div>
          </div>
          <div style="height: 220px; display: flex; align-items: center; justify-content: center;">
            <canvas id="adminFeeDonutCanvas" style="width: 220px; height: 220px;"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // PROFILE VIEW
  // ==========================================
  renderView_profile(container) {
    const s = this.data.demoUsers.student;

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>Student Academic Profile 👤</h2>
          <p>Official Institutional Record | Sri Muthukumaran Medical College</p>
        </div>
        <button class="btn btn-outline-primary btn-sm" onclick="alert('Profile is synced with TN Medical Council database.')">
          ✏️ Edit Contact Info
        </button>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Personal & Medical Details</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; font-size: 0.9rem;">
            <div><strong>Full Name:</strong> ${s.name}</div>
            <div><strong>Roll Number:</strong> ${s.rollNo}</div>
            <div><strong>Date of Birth:</strong> ${s.dob}</div>
            <div><strong>Blood Group:</strong> <span class="badge badge-danger">${s.bloodGroup}</span></div>
            <div><strong>Program:</strong> ${s.program}</div>
            <div><strong>Academic Year:</strong> ${s.year}</div>
            <div><strong>Hostel Room:</strong> ${s.hostelRoom}</div>
            <div><strong>Institutional Email:</strong> ${s.email}</div>
            <div><strong>Student Phone:</strong> ${s.phone}</div>
            <div><strong>Parent Contact:</strong> ${s.parentName} (${s.parentPhone})</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">Accreditation Credentials</div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            Registered under the National Medical Commission (NMC) CBME Framework.<br><br>
            Affiliated to <strong>The Tamil Nadu Dr. M.G.R. Medical University</strong>, Guindy, Chennai.<br><br>
            Rotatory Internship Eligibility: Expected March 2027.
          </p>
        </div>
      </div>
    `;
  }

  // ==========================================
  // SETTINGS & CENTRALIZED THEME CUSTOMIZER
  // ==========================================
  renderView_settings(container) {
    const tm = window.themeManager;
    const cfg = tm ? tm.config : {};

    container.innerHTML = `
      <div class="portal-page-header">
        <div class="portal-page-title">
          <h2>System Settings & Design Theme Engine ⚙️</h2>
          <p>Centralized branding, colors, typography and layout controls</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.themeManager.resetToDefault(); portalApp.navigateTo('settings'); portalApp.showToast('Reset to default Medical Sapphire theme', 'info');">
          ↺ Reset to Default
        </button>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">🎨 Instant Color Theme Presets</div>
          <span class="badge badge-primary">One-Click Rebrand</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          Choose a tailored medical color palette. All buttons, cards, headers, charts, and accents update immediately across the entire site and portal!
        </p>
        <div class="theme-picker-grid">
          <div class="theme-preset-card ${cfg.colorPreset === 'sapphire' ? 'active' : ''}" onclick="window.themeManager.applyPreset('sapphire'); portalApp.navigateTo('settings');">
            <div class="theme-swatch" style="background: #0F52BA;"></div>
            <strong>Medical Sapphire</strong>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Default Clean Blue</p>
          </div>

          <div class="theme-preset-card ${cfg.colorPreset === 'navy' ? 'active' : ''}" onclick="window.themeManager.applyPreset('navy'); portalApp.navigateTo('settings');">
            <div class="theme-swatch" style="background: #1e3a8a;"></div>
            <strong>Royal Navy</strong>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Clinical Authority</p>
          </div>

          <div class="theme-preset-card ${cfg.colorPreset === 'emerald' ? 'active' : ''}" onclick="window.themeManager.applyPreset('emerald'); portalApp.navigateTo('settings');">
            <div class="theme-swatch" style="background: #059669;"></div>
            <strong>Surgical Emerald</strong>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Healthcare Green</p>
          </div>

          <div class="theme-preset-card ${cfg.colorPreset === 'crimson' ? 'active' : ''}" onclick="window.themeManager.applyPreset('crimson'); portalApp.navigateTo('settings');">
            <div class="theme-swatch" style="background: #be123c;"></div>
            <strong>Cardiology Crimson</strong>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Vibrant Medical Red</p>
          </div>

          <div class="theme-preset-card ${cfg.colorPreset === 'purple' ? 'active' : ''}" onclick="window.themeManager.applyPreset('purple'); portalApp.navigateTo('settings');">
            <div class="theme-swatch" style="background: #7c3aed;"></div>
            <strong>Academic Purple</strong>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Modern University</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-equal">
        <!-- Live Color Customizer -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">🖌️ Custom Brand Colors</div>
          </div>
          <div class="form-group">
            <label class="form-label">Primary Brand Color</label>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="color" value="${cfg.primaryColor || '#0F52BA'}" onchange="window.themeManager.setPrimaryColor(this.value);" style="width: 50px; height: 38px; border: none; cursor: pointer; border-radius: var(--radius-sm);">
              <span style="font-family: var(--font-mono); font-size: 0.9rem;">${cfg.primaryColor || '#0F52BA'}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Secondary Accent Color</label>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="color" value="${cfg.secondaryColor || '#0D9488'}" onchange="window.themeManager.setSecondaryColor(this.value);" style="width: 50px; height: 38px; border: none; cursor: pointer; border-radius: var(--radius-sm);">
              <span style="font-family: var(--font-mono); font-size: 0.9rem;">${cfg.secondaryColor || '#0D9488'}</span>
            </div>
          </div>
        </div>

        <!-- Typography & Dark Mode -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">🔤 Typography & Appearance</div>
          </div>
          <div class="form-group">
            <label class="form-label">Display Mode</label>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn ${cfg.theme === 'light' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="window.themeManager.setTheme('light'); portalApp.navigateTo('settings');">
                ☀️ Light Mode
              </button>
              <button class="btn ${cfg.theme === 'dark' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="window.themeManager.setTheme('dark'); portalApp.navigateTo('settings');">
                🌙 Dark Mode
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Primary Font Family</label>
            <select class="form-control" onchange="window.themeManager.setFontFamily(this.value);">
              <option value="'Plus Jakarta Sans', system-ui, sans-serif" ${cfg.fontFamily && cfg.fontFamily.includes('Jakarta') ? 'selected' : ''}>Plus Jakarta Sans (Default)</option>
              <option value="'Outfit', 'Plus Jakarta Sans', sans-serif" ${cfg.fontFamily && cfg.fontFamily.includes('Outfit') ? 'selected' : ''}>Outfit (Geometric Modern)</option>
              <option value="'Inter', system-ui, sans-serif" ${cfg.fontFamily && cfg.fontFamily.includes('Inter') ? 'selected' : ''}>Inter (Clean Minimalist)</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // CHART INITIALIZATION
  // ==========================================
  initViewCharts() {
    if (!window.SMMC_Charts) return;

    // Student performance line chart
    if (document.getElementById('studentPerfCanvas')) {
      window.SMMC_Charts.renderPerformanceChart('studentPerfCanvas', {
        labels: ["IA 1 (Jul)", "IA 2 (Aug)", "Model Exam (Sep)", "Final Pred (Oct)"],
        scores: [85, 88, 92, 95],
        scores2: [82, 84, 88, 91]
      });
    }

    // Admin fee donut chart
    if (document.getElementById('adminFeeDonutCanvas')) {
      window.SMMC_Charts.renderDonutChart('adminFeeDonutCanvas', [
        { label: 'Collected', value: 142000000, color: '#10B981' },
        { label: 'Pending', value: 21000000, color: '#EF4444' }
      ], { value: '87%', label: 'Realized' });
    }

    // Admin hospital occupancy bar chart
    if (document.getElementById('adminDeptBarCanvas')) {
      window.SMMC_Charts.renderBarChart('adminDeptBarCanvas', [
        { label: 'Medicine', value: 172, color: 'var(--primary)' },
        { label: 'Surgery', value: 138, color: 'var(--primary)' },
        { label: 'Pediatrics', value: 82, color: 'var(--secondary)' },
        { label: 'Orthopedics', value: 85, color: 'var(--secondary)' },
        { label: 'OBG', value: 110, color: 'var(--info)' }
      ]);
    }
  }

  // ==========================================
  // SIMULATED FEE PAYMENT CHECKOUT FLOW
  // ==========================================
  openFeePaymentModal() {
    const fee = this.feeState;
    const modal = document.getElementById('paymentModal');
    if (!modal) return;

    // Populate modal values
    const pendingSpan = document.getElementById('modalPendingBalance');
    const payAmountInput = document.getElementById('modalPayAmountInput');
    if (pendingSpan) pendingSpan.textContent = `₹${fee.pendingAmount.toLocaleString('en-IN')}`;
    if (payAmountInput) payAmountInput.value = fee.pendingAmount;

    modal.classList.add('active');
  }

  closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('active');
  }

  selectPaymentMethod(method, element) {
    document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');

    const upiFields = document.getElementById('upiFields');
    const cardFields = document.getElementById('cardFields');
    const netFields = document.getElementById('netBankingFields');

    if (upiFields) upiFields.style.display = (method === 'upi') ? 'block' : 'none';
    if (cardFields) cardFields.style.display = (method === 'card') ? 'block' : 'none';
    if (netFields) netFields.style.display = (method === 'net') ? 'block' : 'none';
  }

  processPayment() {
    const payBtn = document.getElementById('processPayBtn');
    const originalText = payBtn.innerHTML;
    const amount = parseInt(document.getElementById('modalPayAmountInput').value) || this.feeState.pendingAmount;

    payBtn.disabled = true;
    payBtn.innerHTML = `
      <span style="display: inline-block; animation: pulseGlow 0.8s infinite;">
        Connecting to Gateway... 💳
      </span>
    `;

    setTimeout(() => {
      // Deduct from pending balance
      this.feeState.paidAmount += amount;
      this.feeState.pendingAmount = Math.max(0, this.feeState.pendingAmount - amount);

      // Add to transactions
      const receiptNo = `SMMC-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const txnRef = `TXN${Date.now().toString().slice(-8)}`;
      const today = new Date().toISOString().split('T')[0];

      this.feeState.transactions.unshift({
        receiptNo: receiptNo,
        date: today,
        amount: amount,
        method: "UPI (Google Pay Instant)",
        status: "Success",
        ref: txnRef
      });

      payBtn.disabled = false;
      payBtn.innerHTML = originalText;
      this.closePaymentModal();

      // Show Official Printable Receipt
      this.showReceiptModal(receiptNo, amount, today, "UPI / Online Banking", txnRef);
      this.showToast('Payment successful! Official receipt generated.', 'success');

      // Update current view if on dashboard or fees
      if (['dashboard', 'fees'].includes(this.currentView)) {
        this.navigateTo(this.currentView);
      }
    }, 1200);
  }

  // ==========================================
  // OFFICIAL PAYMENT RECEIPT MODAL
  // ==========================================
  showReceiptModal(receiptNo, amount, date, method, ref) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    if (!modal || !content) return;

    const student = this.data.demoUsers.student;

    content.innerHTML = `
      <div class="receipt-wrapper">
        <div class="receipt-header">
          <div class="receipt-badge">✓ PAYMENT VERIFIED & CONFIRMED</div>
          <h3 style="color: var(--primary); font-size: 1.25rem;">Sri Muthukumaran Medical College & Research Institute</h3>
          <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.2rem;">
            Affiliated to The Tamil Nadu Dr. M.G.R. Medical University | Approved by NMC<br>
            Chikkarayapuram, Near Mangadu, Chennai - 600069
          </p>
        </div>

        <div class="receipt-meta-grid">
          <div class="receipt-meta-item">
            <strong>Receipt Number</strong>
            ${receiptNo}
          </div>
          <div class="receipt-meta-item">
            <strong>Transaction Ref</strong>
            <code>${ref}</code>
          </div>
          <div class="receipt-meta-item">
            <strong>Candidate Name</strong>
            ${student.name}
          </div>
          <div class="receipt-meta-item">
            <strong>Roll Number</strong>
            ${student.rollNo}
          </div>
          <div class="receipt-meta-item">
            <strong>Program & Year</strong>
            ${student.program} (${student.year})
          </div>
          <div class="receipt-meta-item">
            <strong>Date & Time</strong>
            ${date} (Electronic Stamp)
          </div>
          <div class="receipt-meta-item">
            <strong>Payment Channel</strong>
            ${method}
          </div>
          <div class="receipt-meta-item">
            <strong>Payment Status</strong>
            <span style="color: #16a34a; font-weight: 700;">CLEARED & CREDITED</span>
          </div>
        </div>

        <div style="border-top: 2px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; padding: 1rem 0; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.1rem; font-weight: 700;">Total Amount Received</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #0F52BA;">₹${amount.toLocaleString('en-IN')}</span>
        </div>

        <div class="receipt-stamp">
          OFFICIAL SMMCRI<br>
          ACCOUNTS VERIFIED<br>
          DIGITAL SEAL
        </div>

        <p style="font-size: 0.75rem; color: #94a3b8; text-align: center;">
          This is an electronically generated official fee receipt. No physical signature required.
        </p>
      </div>
    `;

    modal.classList.add('active');
  }

  closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    if (modal) modal.classList.remove('active');
  }

  // ==========================================
  // PRINTABLE HALL TICKET MODAL
  // ==========================================
  openHallTicketModal() {
    const modal = document.getElementById('hallTicketModal');
    const content = document.getElementById('hallTicketContent');
    if (!modal || !content) return;

    const s = this.data.demoUsers.student;

    content.innerHTML = `
      <div class="hall-ticket-card">
        <div class="hall-ticket-header">
          <div>
            <h3 style="color: #0F52BA; font-size: 1.15rem; margin-bottom: 0.2rem;">THE TAMIL NADU DR. M.G.R. MEDICAL UNIVERSITY</h3>
            <h4 style="font-size: 0.95rem; color: #334155;">SRI MUTHUKUMARAN MEDICAL COLLEGE & RESEARCH INSTITUTE</h4>
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">HALL TICKET - FINAL MBBS PHASE III UNIVERSITY EXAMINATIONS</span>
          </div>
          <div style="font-size: 2rem;">🏛️</div>
        </div>

        <div class="hall-ticket-grid">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
            <div><strong>Candidate Name:</strong> ${s.name}</div>
            <div><strong>Register No:</strong> ${s.rollNo}</div>
            <div><strong>Center:</strong> SMMCRI (Center Code: 412)</div>
            <div><strong>Exam Session:</strong> October 2026</div>
            <div><strong>Attendance Verified:</strong> <span style="color: green; font-weight: 700;">88.5% (Eligible)</span></div>
            <div><strong>Fees Clearance:</strong> Verified by Bursar</div>
          </div>
          <div class="student-photo-box">
            <span style="font-size: 2rem;">👨‍⚕️</span>
            <span>CANDIDATE PHOTO</span>
          </div>
        </div>

        <div class="data-table-container mb-3">
          <table class="data-table" style="font-size: 0.8rem;">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject Paper</th>
                <th>Time</th>
                <th>Candidate Sign</th>
                <th>Invigilator Sign</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.upcomingExams.map(ex => `
                <tr>
                  <td><strong>${ex.date}</strong></td>
                  <td>${ex.subject}</td>
                  <td>${ex.time}</td>
                  <td style="border-bottom: 1px dotted #ccc;"></td>
                  <td style="border-bottom: 1px dotted #ccc;"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2rem; font-size: 0.8rem;">
          <div>
            <strong>Dean & Chief Superintendent</strong><br>
            Sri Muthukumaran Medical College
          </div>
          <div>
            <strong>Controller of Examinations</strong><br>
            TN Dr. M.G.R. Medical University
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  closeHallTicketModal() {
    const modal = document.getElementById('hallTicketModal');
    if (modal) modal.classList.remove('active');
  }

  // ==========================================
  // STUDENT DETAIL MODAL
  // ==========================================
  openStudentModal(studentId) {
    const s = this.students.find(x => x.id === studentId);
    if (!s) return;

    alert(`Student File:\nName: ${s.name}\nRoll No: ${s.rollNo}\nAttendance: ${s.attendance}%\nGen Med Marks: ${s.marksGenMed}/100\nFee Status: Pending ₹${s.feePending.toLocaleString('en-IN')}\nHostel: ${s.room}`);
  }

  filterStudentRoster(query) {
    const term = query.toLowerCase();
    const rows = document.querySelectorAll('#studentsTable tbody tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(term) ? '' : 'none';
    });
  }

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : type === 'danger' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  markNotificationsAsRead() {
    const dot = document.querySelector('.notif-badge-dot');
    if (dot) dot.style.display = 'none';
  }
}

// Instantiate Global Portal Application
window.portalApp = new SMMC_Portal();
