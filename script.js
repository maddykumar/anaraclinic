/* ============================================
   ANARA MEDICAL CENTER — script.js
   ============================================ */

// The clinic's WhatsApp number (international format, no + or spaces)
const ANARA_WHATSAPP = "919205314326";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Year in footer ---------- */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll(".nav-links a, .nav-cta").forEach(a => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    ".about-text, .about-pillars .pillar, .service, .doctor-card, .campaign-card, .booking-info, .booking-form-wrap"
  );
  revealEls.forEach(el => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Booking form → WhatsApp ----------
     Submitting the form composes a WhatsApp message with all the
     details and opens it in a new tab, so the patient just hits send.
     The clinic receives the request directly on their WhatsApp.
  ----------------------------------------------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation
      const data = new FormData(form);
      const name    = (data.get("name")    || "").toString().trim();
      const phone   = (data.get("phone")   || "").toString().trim();
      const service = (data.get("service") || "").toString().trim();
      const date    = (data.get("date")    || "").toString().trim();
      const time    = (data.get("time")    || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      if (!name || !phone || !service) {
        flashInvalid(form);
        return;
      }

      // Pretty-format the date
      let dateStr = date;
      if (date) {
        try {
          dateStr = new Date(date).toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
          });
        } catch (_) { /* fall back */ }
      }

      const lines = [
        "*New Appointment Request — ANARA Medical Center*",
        "",
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        `*Service:* ${service}`,
      ];
      if (dateStr) lines.push(`*Preferred Date:* ${dateStr}`);
      if (time)    lines.push(`*Preferred Time:* ${time}`);
      if (message) {
        lines.push("");
        lines.push(`*Concern / Note:*`);
        lines.push(message);
      }
      lines.push("");
      lines.push("_Sent via the ANARA website._");

      const text = encodeURIComponent(lines.join("\n"));
      const url  = `https://wa.me/${ANARA_WHATSAPP}?text=${text}`;

      // Visual confirmation, then open WhatsApp
      const btn = form.querySelector("button[type=submit]");
      const original = btn.innerHTML;
      btn.innerHTML = "<span>Opening WhatsApp…</span>";
      btn.disabled = true;

      window.open(url, "_blank", "noopener");

      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        form.reset();
      }, 1500);
    });
  }

  function flashInvalid(formEl) {
    const required = formEl.querySelectorAll("[required]");
    required.forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = "#e07a5f";
        el.addEventListener("input", function once() {
          el.style.borderColor = "";
          el.removeEventListener("input", once);
        });
      }
    });
    const firstEmpty = Array.from(required).find(el => !el.value.trim());
    if (firstEmpty) firstEmpty.focus();
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });
});
