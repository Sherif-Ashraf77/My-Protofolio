/* =========================
   1. Mobile Navigation
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* =========================
   2. Typing Animation
========================= */

const typingText = document.getElementById("typing-text");

const words = [
  "Web Developer",
  "Backend Developer",
  "Laravel Developer"
];

let wordIndex = 0;
let charIndex = words[0].length;
let deleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingText.textContent = currentWord.substring(0, charIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && charIndex === currentWord.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  }

  setTimeout(typeEffect, delay);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(typeEffect, 1000);
}

/* =========================
   3. Reveal On Scroll
========================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* =========================
   4. Active Navigation Link
========================= */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isActive);
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================
   5. Contact Form (Direct Email via FormSubmit - No Key Required)
========================= */

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const senderName = formData.get("name") ? formData.get("name").trim() : "";
    const senderEmail = formData.get("email") ? formData.get("email").trim() : "";
    const subject = formData.get("subject") ? formData.get("subject").trim() : "Portfolio Contact";
    const message = formData.get("message") ? formData.get("message").trim() : "";

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Send Message ↗";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <span>⏳</span>`;
    }
    // If the file is opened directly in browser via file:// (double-click on HTML file)
    if (window.location.protocol === "file:") {
      const emailSubject = encodeURIComponent(`${subject} - Portfolio Contact (${senderName})`);
      const emailBody = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sherifashraf112005@gmail.com&su=${emailSubject}&body=${emailBody}`;

      showFormStatus("✓ Opened Gmail with your message pre-filled. Click 'Send' in Gmail to complete sending.", "success");
      window.open(gmailUrl, "_blank");

      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
      return;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/sherifashraf112005@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          _subject: `${subject} - Portfolio Contact (${senderName})`,
          message: message,
          _captcha: "false",
          _template: "table"
        })
      });

      const result = await response.json();

      if (response.ok && (result.success === "true" || result.success === true)) {
        showFormStatus("✓ Thank you! Your message has been sent successfully. I will get back to you soon.", "success");
        contactForm.reset();
      } else {
        showFormStatus(result.message || "Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      showFormStatus("Network error. Please try again or reach out directly via WhatsApp or email.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function showFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = "block";
}

function hideFormStatus() {
  if (!formStatus) return;
  formStatus.textContent = "";
  formStatus.className = "form-status";
  formStatus.style.display = "none";
}