console.log("EBS JavaScript loaded");
/* ===================================
   HEADER MOBILE NAVIGATION
=================================== */

const headerToggle = document.querySelector(".header__toggle");
const headerNav = document.querySelector(".header__nav");
const headerLinks = document.querySelectorAll(".header__link");

if (headerToggle && headerNav) {
  headerToggle.addEventListener("click", () => {
    const isExpanded = headerToggle.getAttribute("aria-expanded") === "true";

    headerToggle.setAttribute("aria-expanded", String(!isExpanded));

    headerNav.classList.toggle("active");
  });

  headerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      headerNav.classList.remove("active");

      headerToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const isClickInsideHeader =
      headerNav.contains(event.target) || headerToggle.contains(event.target);

    if (!isClickInsideHeader) {
      headerNav.classList.remove("active");

      headerToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      headerNav.classList.remove("active");

      headerToggle.setAttribute("aria-expanded", "false");
    }
  });
}
// Scroll-triggered fade-in for services details
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".services-details__item");

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  items.forEach((item) => observer.observe(item));
});
/* ===================================
   FAQ ACCORDION
=================================== */

const faqButtons = document.querySelectorAll(".faq__button");

if (faqButtons.length) {
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.closest(".faq__item");

      if (!currentItem) return;

      const currentAnswer = currentItem.querySelector(".faq__answer");

      const currentIcon = currentItem.querySelector(".faq__icon");

      if (!currentAnswer || !currentIcon) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";

      /* ===================================
         CLOSE ALL ITEMS
      =================================== */

      faqButtons.forEach((btn) => {
        const item = btn.closest(".faq__item");

        if (!item) return;

        const answer = item.querySelector(".faq__answer");

        const icon = item.querySelector(".faq__icon");

        if (!answer || !icon) return;

        btn.setAttribute("aria-expanded", "false");

        answer.hidden = true;

        item.classList.remove("faq__item--active");

        icon.textContent = "add";
      });

      /* ===================================
         OPEN SELECTED ITEM
      =================================== */

      if (!isOpen) {
        button.setAttribute("aria-expanded", "true");

        currentAnswer.hidden = false;

        currentItem.classList.add("faq__item--active");

        currentIcon.textContent = "remove";
      }
    });
  });
}

/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop = document.querySelector("#bckToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
/*==================================================
  CONTACT FORM
==================================================*/

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const fullName = contactForm.querySelector("#full-name");
  const email = contactForm.querySelector("#email");
  const phone = contactForm.querySelector("#phone");
  const service = contactForm.querySelector("#service");
  const message = contactForm.querySelector("#message");
  const submitButton = contactForm.querySelector(".contact__button");

  const fields = [fullName, email, phone, service, message].filter(Boolean);

  /*==================================================
    VALIDATION
  ==================================================*/

  function getErrorElement(field) {
    return document.querySelector(`#${field.id}-error`);
  }

  function clearError(field) {
    const error = getErrorElement(field);

    field.classList.remove(
      "contact__input--error",
      "contact__select--error",
      "contact__textarea--error",
    );

    field.setAttribute("aria-invalid", "false");

    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
  }

  function showError(field, message) {
    const error = getErrorElement(field);

    if (field === service) {
      field.classList.add("contact__select--error");
    } else if (field === message) {
      field.classList.add("contact__textarea--error");
    } else {
      field.classList.add("contact__input--error");
    }

    field.setAttribute("aria-invalid", "true");

    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function validateField(field) {
    const value = field.value.trim();

    clearError(field);

    /* FULL NAME */

    if (field === fullName) {
      if (!value) {
        showError(field, "Please enter your full name.");

        return false;
      }

      if (value.length < 2) {
        showError(field, "Your name must be at least 2 characters.");

        return false;
      }
    }

    /* EMAIL */

    if (field === email) {
      if (!value) {
        showError(field, "Please enter your email address.");

        return false;
      }

      if (!field.validity.valid) {
        showError(field, "Please enter a valid email address.");

        return false;
      }
    }

    /* PHONE — OPTIONAL */

    if (field === phone) {
      if (value && !/^[+\d\s().-]{7,20}$/.test(value)) {
        showError(field, "Please enter a valid phone number.");

        return false;
      }
    }

    /* SERVICE */

    if (field === service) {
      if (!value) {
        showError(field, "Please select a service.");

        return false;
      }
    }

    /* MESSAGE */

    if (field === message) {
      if (!value) {
        showError(field, "Please tell us about your project.");

        return false;
      }

      if (value.length < 10) {
        showError(field, "Please provide at least 10 characters.");

        return false;
      }
    }

    return true;
  }

  /*==================================================
    LIVE VALIDATION
  ==================================================*/

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });

    field.addEventListener("change", () => {
      validateField(field);
    });
  });

  /*==================================================
  FORM SUBMISSION — NETLIFY FORMS
==================================================*/

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    /*-----------------------------------------------
    VALIDATE ALL FIELDS
  -----------------------------------------------*/

    let formIsValid = true;
    let firstInvalidField = null;

    fields.forEach((field) => {
      const valid = validateField(field);

      if (!valid) {
        formIsValid = false;

        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    /*-----------------------------------------------
    STOP IF INVALID
  -----------------------------------------------*/

    if (!formIsValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return;
    }

    /*-----------------------------------------------
    SUBMITTING STATE
  -----------------------------------------------*/

    const originalButtonContent = submitButton.innerHTML;

    submitButton.disabled = true;

    submitButton.innerHTML = `
    <span>Sending...</span>
  `;

    try {
      const formData = new FormData(contactForm);

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      /*---------------------------------------------
      SUCCESS
    ---------------------------------------------*/

      if (response.ok) {
        window.location.href = "thank-you.html";

        return;
      }

      /*---------------------------------------------
      NETLIFY ERROR
    ---------------------------------------------*/

      throw new Error("Form submission failed.");
    } catch (error) {
      console.error("Contact form error:", error);

      submitButton.disabled = false;

      submitButton.innerHTML = originalButtonContent;

      alert("Sorry, your message could not be sent. Please try again.");
    }
  });
}
