/* ============================================
   MHD GARDENING – MAIN JAVASCRIPT
   ============================================ */

/* ---- NAV SCROLL ---- */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
  }
});

/* ---- HERO BOOKING WIDGET ---- */
function heroBook() {
  const address = document.getElementById('heroAddress')?.value.trim();
  const suburb  = document.getElementById('heroSuburb')?.value.trim();
  const service = document.getElementById('heroService')?.value;
  if (!address || !suburb || !service) {
    alert('Please fill in your address, suburb, and select a service.');
    return;
  }
  const svcMap = { mow: 'Simple Mow', hedges: 'Hedges & Lawn', full: 'Full Service' };
  const params = new URLSearchParams({
    address, suburb, service: svcMap[service] || service
  });
  window.location.href = `booking.html?${params.toString()}`;
}

/* ---- PRE-FILL BOOKING FROM URL PARAMS ---- */
(function prefillBooking() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('address')) {
    const el = document.getElementById('bAddress');
    if (el) el.value = params.get('address');
  }
  if (params.get('suburb')) {
    const el = document.getElementById('bSuburb');
    if (el) el.value = params.get('suburb');
  }
  if (params.get('service')) {
    const svcEl = document.getElementById('bService');
    if (svcEl) {
      for (let opt of svcEl.options) {
        if (opt.value === params.get('service') || opt.text.includes(params.get('service'))) {
          opt.selected = true;
        }
      }
    }
  }
})();

/* ---- CALENDAR ---- */
(function initCalendar() {
  const grid       = document.getElementById('calGrid');
  const monthYear  = document.getElementById('calMonthYear');
  const hiddenDate = document.getElementById('bDate');
  const calLabel   = document.getElementById('calSelected');
  const prevBtn    = document.getElementById('calPrev');
  const nextBtn    = document.getElementById('calNext');
  if (!grid) return;

  let current = new Date();
  current.setDate(1);

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  function render() {
    grid.innerHTML = '';
    const year  = current.getFullYear();
    const month = current.getMonth();
    monthYear.textContent = `${MONTHS[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day cal-day--empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;

      const isPast = date < today;
      const isToday = date.toDateString() === today.toDateString();
      const isSunday = date.getDay() === 0;
      const isSelected = hiddenDate?.value === formatDate(date);

      if (isPast || isSunday) {
        cell.classList.add('cal-day--past');
      } else {
        cell.addEventListener('click', () => selectDate(date));
      }
      if (isToday) cell.classList.add('cal-day--today');
      if (isSelected) cell.classList.add('cal-day--selected');

      grid.appendChild(cell);
    }
  }

  function selectDate(date) {
    if (hiddenDate) hiddenDate.value = formatDate(date);
    if (calLabel) calLabel.textContent = `Selected: ${date.toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}`;
    render();
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  prevBtn?.addEventListener('click', () => {
    const today = new Date(); today.setDate(1); today.setHours(0,0,0,0);
    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    if (prev >= today) { current = prev; render(); }
  });
  nextBtn?.addEventListener('click', () => {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    render();
  });

  render();
})();

/* ---- BOOKING FORM SUBMIT ---- */
function submitBooking() {
  const name    = document.getElementById('bName')?.value.trim();
  const phone   = document.getElementById('bPhone')?.value.trim();
  const email   = document.getElementById('bEmail')?.value.trim();
  const address = document.getElementById('bAddress')?.value.trim();
  const suburb  = document.getElementById('bSuburb')?.value.trim();
  const service = document.getElementById('bService')?.value;
  const date    = document.getElementById('bDate')?.value;

  if (!name || !phone || !email || !address || !suburb || !service || !date) {
    alert('Please fill in all required fields, including selecting a date on the calendar.');
    return;
  }

  const time  = document.getElementById('bTime')?.value || '';
  const notes = document.getElementById('bNotes')?.value.trim() || 'None';

  // Build mailto
  const subject = encodeURIComponent(`New Booking Request – ${service}`);
  const body = encodeURIComponent(
`New Booking Request – MHD Gardening

Name:    ${name}
Phone:   ${phone}
Email:   ${email}
Address: ${address}, ${suburb}
Service: ${service}
Date:    ${date}
Time:    ${time}
Notes:   ${notes}
`);

  window.location.href = `mailto:mhdgardening@gmail.com?subject=${subject}&body=${body}`;

  // Show success
  setTimeout(() => {
    document.getElementById('bookingForm').style.display = 'none';
    const success = document.getElementById('bookingSuccess');
    if (success) {
      success.style.display = 'block';
      const summary = document.getElementById('successSummary');
      if (summary) summary.textContent = `Thank you, ${name}! Your ${service} request for ${new Date(date+'T12:00:00').toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'long'})} in ${suburb} has been submitted.`;
    }
  }, 1000);
}

/* ---- CONTACT FORM SUBMIT ---- */
function submitContact() {
  const name    = document.getElementById('cName')?.value.trim();
  const email   = document.getElementById('cEmail')?.value.trim();
  const message = document.getElementById('cMessage')?.value.trim();

  if (!name || !email || !message) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  const phone   = document.getElementById('cPhone')?.value.trim() || 'Not provided';
  const suburb  = document.getElementById('cSuburb')?.value.trim() || 'Not provided';
  const subject_sel = document.getElementById('cSubject')?.value || 'General Enquiry';

  const subject = encodeURIComponent(`Enquiry: ${subject_sel} – ${name}`);
  const body = encodeURIComponent(
`New Enquiry – MHD Gardening Website

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Suburb:  ${suburb}
Subject: ${subject_sel}

Message:
${message}
`);

  window.location.href = `mailto:mhdgardening@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    const s = document.getElementById('contactSuccess');
    if (s) s.style.display = 'block';
  }, 800);
}

/* ---- SIGN UP ---- */
function submitSignup() {
  const first   = document.getElementById('sFirst')?.value.trim();
  const last    = document.getElementById('sLast')?.value.trim();
  const email   = document.getElementById('sEmail')?.value.trim();
  const phone   = document.getElementById('sPhone')?.value.trim();
  const suburb  = document.getElementById('sSuburb')?.value.trim();
  const pass    = document.getElementById('sPass')?.value;
  const passC   = document.getElementById('sPassConfirm')?.value;
  const terms   = document.getElementById('sTerms')?.checked;

  if (!first || !last || !email || !phone || !suburb || !pass || !passC) {
    alert('Please fill in all required fields.');
    return;
  }
  if (pass !== passC) {
    alert('Passwords do not match. Please try again.');
    return;
  }
  if (pass.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }
  if (!terms) {
    alert('Please agree to the Terms & Conditions to continue.');
    return;
  }

  document.getElementById('signupForm').style.display = 'none';
  const s = document.getElementById('signupSuccess');
  if (s) s.style.display = 'block';
}

function submitLogin() {
  const email = document.getElementById('lEmail')?.value.trim();
  const pass  = document.getElementById('lPass')?.value;
  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }
  // Placeholder – backend integration point
  alert('Sign-in functionality coming soon! For now, please call or email us to manage your bookings.');
}

function showLogin() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}
function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}

/* ---- FADE IN ANIMATION ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.why-card, .service-card, .svc-row, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
