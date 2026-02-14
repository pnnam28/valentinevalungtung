// ================= Timer Setup =================
// Change to your real first meet date/time (local time)
const firstMeet = new Date("2025-06-01T16:00:00");

const yy = document.getElementById("yy");
const mo = document.getElementById("mo");
const dd1 = document.getElementById("dd1");
const hh1 = document.getElementById("hh1");

const dd2 = document.getElementById("dd2");
const hh2 = document.getElementById("hh2");
const mm2 = document.getElementById("mm2");
const ss2 = document.getElementById("ss2");

function pad2(n){ return String(n).padStart(2, "0"); }

// Calendar-style: Years/Months/Days/Hours since firstMeet
function calcYMDH(from, to){
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();

  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    const prevMonthLastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  if (years < 0) return { years:0, months:0, days:0, hours:0 };
  return { years, months, days, hours };
}

// Total elapsed: Days/Hours/Minutes/Seconds since firstMeet
function calcDHMS(from, to){
  let diffMs = to - from;
  if (diffMs < 0) diffMs = 0;

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function updateTimers(){
  const now = new Date();

  const a = calcYMDH(firstMeet, now);
  const b = calcDHMS(firstMeet, now);

  if (yy) yy.textContent = pad2(a.years);
  if (mo) mo.textContent = pad2(a.months);
  if (dd1) dd1.textContent = pad2(a.days);
  if (hh1) hh1.textContent = pad2(a.hours);

  if (dd2) dd2.textContent = b.days < 100 ? pad2(b.days) : String(b.days);
  if (hh2) hh2.textContent = pad2(b.hours);
  if (mm2) mm2.textContent = pad2(b.minutes);
  if (ss2) ss2.textContent = pad2(b.seconds);
}

updateTimers();
setInterval(updateTimers, 1000);

// ================= Reveal On Scroll (ONE observer) =================
const revealItems = document.querySelectorAll(".reveal, .reveal-on-scroll, .polaroid-row");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// stagger appearance nicely
revealItems.forEach((el, i) => {
  el.style.transitionDelay = `${i * 110}ms`;
  io.observe(el);
});

