/**
 * Sri Muthukumaran Medical College - Public Website Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initDepartmentsExplorer();
  initLoginModal();
  initContactForm();
  initMobileNav();
  initThemeToggle();
});

// Render & Filter Medical Departments
function initDepartmentsExplorer() {
  const container = document.getElementById('departmentsGrid');
  const filterBtns = document.querySelectorAll('.dept-filter-btn');
  if (!container || !window.SMMC_DATA) return;

  const depts = window.SMMC_DATA.departments;

  function render(category = 'all') {
    container.innerHTML = '';
    const filtered = category === 'all' 
      ? depts 
      : depts.filter(d => d.category === category);

    filtered.forEach(dept => {
      const card = document.createElement('div');
      card.className = 'dept-card animate-fade-in';
      card.innerHTML = `
        <div class="dept-card-top">
          <div class="dept-icon-box">${dept.icon || '🩺'}</div>
          <span class="badge badge-primary">${dept.category.toUpperCase()}</span>
        </div>
        <h4 class="dept-name">${dept.name}</h4>
        <p class="dept-desc">${dept.description}</p>
        <div class="dept-meta-row">
          <span><strong>HOD:</strong> ${dept.hod}</span>
          <span>${dept.intake || dept.beds || dept.facilities || 'Accredited Unit'}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Initial render
  render('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      render(cat);
    });
  });
}

// Login Modal & Quick 1-Click Role Access
function initLoginModal() {
  const modal = document.getElementById('loginModal');
  const openBtns = document.querySelectorAll('[data-open-login]');
  const closeBtn = document.getElementById('closeLoginModal');
  const roleCards = document.querySelectorAll('[data-login-role]');
  const loginForm = document.getElementById('portalLoginForm');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // 1-Click Demo Role selection
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const role = card.getAttribute('data-login-role');
      localStorage.setItem('smmcri_current_role', role);
      window.location.href = `portal.html?role=${role}`;
    });
  });

  // Regular form submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleSelect = document.getElementById('loginRoleSelect');
      const role = roleSelect ? roleSelect.value : 'student';
      localStorage.setItem('smmcri_current_role', role);
      window.location.href = `portal.html?role=${role}`;
    });
  }
}

// Contact & Inquiry Form
function initContactForm() {
  const form = document.getElementById('admissionInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = 'Submitting Application...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '✓ Submitted Successfully!';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');

      alert('Thank you for contacting Sri Muthukumaran Medical College & Research Institute. An admissions counselor will reach out to you within 24 hours with prospectus and eligibility guidelines.');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      }, 4000);
    }, 1000);
  });
}

// Mobile Nav Menu
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '78px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'var(--bg-surface)';
      links.style.padding = '1.5rem';
      links.style.boxShadow = 'var(--shadow-lg)';
    });
  }
}

// Theme Toggle
function initThemeToggle() {
  const toggleBtn = document.getElementById('publicThemeToggle');
  if (toggleBtn && window.themeManager) {
    toggleBtn.addEventListener('click', () => {
      const current = window.themeManager.toggleDarkMode();
      toggleBtn.innerHTML = current === 'dark' ? '☀️' : '🌙';
    });
  }
}
