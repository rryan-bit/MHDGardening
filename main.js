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
  const svcMap = {
    mow:     'Simple Mow',
    hedges:  'Hedges & Lawn',
    full:    'Full Service',
    gutters: 'Gutter Cleaning'
  };
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
      const target = params.get('service').toLowerCase();
      for (let opt of svcEl.options) {
        if (opt.value.toLowerCase() === target || opt.text.toLowerCase().includes(target)) {
          opt.selected = true;
          break;
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

  function getBookedDates() {
    try { return JSON.parse(localStorage.getItem('mhd_booked_dates') || '[]'); }
    catch { return []; }
  }

  function render() {
    grid.innerHTML = '';
    const year  = current.getFullYear();
    const month = current.getMonth();
    monthYear.textContent = `${MONTHS[month]} ${year}`;

    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date();
    today.setHours(0,0,0,0);
    const bookedDates = getBookedDates();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day cal-day--empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date    = new Date(year, month, d);
      const dateStr = formatDate(date);
      const cell    = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;

      const isPast    = date < today;
      const isToday   = date.toDateString() === today.toDateString();
      const isSunday  = date.getDay() === 0;
      const isBooked  = bookedDates.includes(dateStr);
      const isSelected = hiddenDate?.value === dateStr;

      if (isPast || isSunday) {
        cell.classList.add('cal-day--past');
      } else if (isBooked) {
        cell.classList.add('cal-day--booked');
        cell.title = 'This date is already booked';
      } else {
        cell.addEventListener('click', () => selectDate(date));
      }
      if (isToday)    cell.classList.add('cal-day--today');
      if (isSelected) cell.classList.add('cal-day--selected');

      grid.appendChild(cell);
    }
  }

  function selectDate(date) {
    if (hiddenDate) hiddenDate.value = formatDate(date);
    if (calLabel) calLabel.textContent = `Selected: ${date.toLocaleDateString('en-AU', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    })}`;
    render();
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  prevBtn?.addEventListener('click', () => {
    const today = new Date(); today.setDate(1); today.setHours(0,0,0,0);
    const prev  = new Date(current.getFullYear(), current.getMonth() - 1, 1);
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

  const btn = document.querySelector('#bookingForm .btn-primary');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

  // Send via EmailJS
  emailjs.send(
    window.EMAILJS_SERVICE_ID,
    window.EMAILJS_TEMPLATE_ID,
    {
      from_name:  name,
      from_email: email,
      phone:      phone,
      suburb:     suburb,
      address:    address,
      service:    service,
      date:       date,
      time:       time,
      notes:      notes,
      subject:    `New Booking Request – ${service}`,
      message:    `Booking Request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}, ${suburb}\nService: ${service}\nDate: ${date}\nTime: ${time}\nNotes: ${notes}`,
      reply_to:   email
    }
  ).then(() => {
    // Save booked date to localStorage so calendar blocks it
    const booked = JSON.parse(localStorage.getItem('mhd_booked_dates') || '[]');
    if (!booked.includes(date)) booked.push(date);
    localStorage.setItem('mhd_booked_dates', JSON.stringify(booked));

    const form = document.getElementById('bookingForm');
    if (form) form.style.display = 'none';
    const success = document.getElementById('bookingSuccess');
    if (success) {
      success.style.display = 'block';
      const summary = document.getElementById('successSummary');
      if (summary) {
        const d = new Date(date + 'T12:00:00');
        summary.textContent = `Thank you, ${name}! Your ${service} request for ${d.toLocaleDateString('en-AU', {
          weekday: 'long', day: 'numeric', month: 'long'
        })} in ${suburb} has been submitted.`;
      }
    }
  }).catch((err) => {
    console.error('EmailJS booking error:', err);
    // Fallback to mailto if EmailJS fails
    const subject = encodeURIComponent(`New Booking Request – ${service}`);
    const body    = encodeURIComponent(
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
    if (btn) { btn.textContent = 'Confirm Booking →'; btn.disabled = false; }
  });
}

/* ---- CONTACT FORM — EmailJS (on-page, no redirect) ---- */
function submitContact() {
  const name    = document.getElementById('cName')?.value.trim();
  const email   = document.getElementById('cEmail')?.value.trim();
  const message = document.getElementById('cMessage')?.value.trim();

  if (!name || !email || !message) {
    showFormStatus('error', 'Please fill in your name, email address, and message.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormStatus('error', 'Please enter a valid email address.');
    return;
  }

  const phone   = document.getElementById('cPhone')?.value.trim()   || 'Not provided';
  const suburb  = document.getElementById('cSuburb')?.value.trim()  || 'Not provided';
  const subject = document.getElementById('cSubject')?.value        || 'General Enquiry';

  const btn = document.getElementById('submitContactBtn');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  showFormStatus('info', 'Sending your message…');

  // Check if EmailJS keys have been configured
  const configured =
    window.EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'  &&
    window.EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    window.EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

  if (configured) {
    // ── Real EmailJS send ──────────────────────────────────────
    emailjs.send(
      window.EMAILJS_SERVICE_ID,
      window.EMAILJS_TEMPLATE_ID,
      {
        from_name:  name,
        from_email: email,
        phone:      phone,
        suburb:     suburb,
        subject:    subject,
        message:    message,
        reply_to:   email
      }
    ).then(() => {
      showSuccess();
    }).catch((err) => {
      console.error('EmailJS error:', err);
      showFormStatus('error', 'Oops — something went wrong. Please try again or call us on 0421 722 604.');
      if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
    });

  } else {
    // ── Fallback: open email client (until EmailJS is configured) ──
    const mailSubject = encodeURIComponent(`Enquiry: ${subject} – ${name}`);
    const mailBody    = encodeURIComponent(
`New Enquiry – MHD Gardening Website

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Suburb:  ${suburb}
Subject: ${subject}

Message:
${message}
`);
    window.location.href = `mailto:mhdgardening@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setTimeout(() => {
      showSuccess();
    }, 800);
  }
}

function showFormStatus(type, msg) {
  const el = document.getElementById('formStatus');
  if (!el) return;
  el.style.display = 'block';
  el.className = `form-status form-status--${type}`;
  el.textContent = msg;
}

function showSuccess() {
  const inner   = document.getElementById('contactFormInner');
  const success = document.getElementById('contactSuccess');
  if (inner)   inner.style.display   = 'none';
  if (success) success.style.display = 'block';
}

function resetContactForm() {
  const inner   = document.getElementById('contactFormInner');
  const success = document.getElementById('contactSuccess');
  const status  = document.getElementById('formStatus');
  const btn     = document.getElementById('submitContactBtn');
  if (inner)   { inner.style.display   = 'block'; }
  if (success) { success.style.display = 'none';  }
  if (status)  { status.style.display  = 'none';  }
  if (btn)     { btn.textContent = 'Send Message →'; btn.disabled = false; }
  ['cName','cPhone','cEmail','cSuburb','cMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ---- FADE IN ANIMATION ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.why-card, .service-card, .svc-row, .contact-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
