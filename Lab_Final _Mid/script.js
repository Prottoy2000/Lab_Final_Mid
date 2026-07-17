// ==========================================================
// AIUB University Club Membership Registration - Validation
// ==========================================================

// ---- Grab elements using getElementById / querySelector ----
const form = document.getElementById('registrationForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const categorySelect = document.getElementById('category');
const reasonInput = document.getElementById('reason');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');
const attemptMsg = document.getElementById('attemptMsg');

// All radio buttons and checkboxes via querySelectorAll
const genderRadios = document.querySelectorAll('input[name="gender"]');
const clubCheckboxes = document.querySelectorAll('input[name="clubs"]');

// ---- Regular Expressions ----
const nameRegex = /^[A-Za-z\s]+$/;                 // alphabets only
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    // basic valid email format
// Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,?_-])[A-Za-z\d!@#$%^&*.,?_-]{8,}$/;

// ---- Password attempt lockout state ----
let passwordAttempts = 0;
const MAX_ATTEMPTS = 3;
let formLocked = false;

// ==========================================================
// Helper functions for showing / clearing errors
// ==========================================================
function showError(inputEl, errorEl, message) {
  inputEl.classList.add('invalid');
  inputEl.classList.remove('valid');
  errorEl.textContent = message;
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove('invalid');
  inputEl.classList.add('valid');
  errorEl.textContent = '';
}

// ==========================================================
// Individual field validation functions
// ==========================================================
function validateName(inputEl, errorEl, label) {
  const value = inputEl.value.trim();
  if (value === '') {
    showError(inputEl, errorEl, `${label} is required.`);
    return false;
  } else if (!nameRegex.test(value)) {
    showError(inputEl, errorEl, `${label} must contain alphabets only.`);
    return false;
  } else {
    clearError(inputEl, errorEl);
    return true;
  }
}

function validateEmail() {
  const value = emailInput.value.trim();
  const errorEl = document.getElementById('emailError');
  if (value === '') {
    showError(emailInput, errorEl, 'Email address is required.');
    return false;
  } else if (!emailRegex.test(value)) {
    showError(emailInput, errorEl, 'Please enter a valid email address.');
    return false;
  } else {
    clearError(emailInput, errorEl);
    return true;
  }
}

function validatePassword() {
  const errorEl = document.getElementById('passwordError');
  const value = passwordInput.value;

  // If the form has already been locked, block everything
  if (formLocked) {
    showError(passwordInput, errorEl, 'Form locked due to too many failed attempts.');
    return false;
  }

  if (value === '') {
    showError(passwordInput, errorEl, 'Password is required.');
    return false;
  } else if (!passwordRegex.test(value)) {
    showError(
      passwordInput,
      errorEl,
      'Password must be 8+ chars with upper, lower, number & special character.'
    );
    return false;
  } else {
    clearError(passwordInput, errorEl);
    attemptMsg.textContent = '';
    return true;
  }
}

function validateGender() {
  const errorEl = document.getElementById('genderError');
  const selected = Array.from(genderRadios).some((radio) => radio.checked);
  if (!selected) {
    errorEl.textContent = 'Please select a gender.';
    return false;
  } else {
    errorEl.textContent = '';
    return true;
  }
}

function validateClubs() {
  const errorEl = document.getElementById('clubsError');
  const selected = Array.from(clubCheckboxes).some((cb) => cb.checked);
  if (!selected) {
    errorEl.textContent = 'Please select at least one club.';
    return false;
  } else {
    errorEl.textContent = '';
    return true;
  }
}

function validateCategory() {
  const errorEl = document.getElementById('categoryError');
  if (categorySelect.value === '') {
    showError(categorySelect, errorEl, 'Please choose a valid category.');
    return false;
  } else {
    clearError(categorySelect, errorEl);
    return true;
  }
}

function validateReason() {
  const errorEl = document.getElementById('reasonError');
  const value = reasonInput.value.trim();
  if (value === '') {
    showError(reasonInput, errorEl, 'This field is required.');
    return false;
  } else if (value.length < 20) {
    showError(reasonInput, errorEl, `Minimum 20 characters required (currently ${value.length}).`);
    return false;
  } else {
    clearError(reasonInput, errorEl);
    return true;
  }
}

// ==========================================================
// Handle password lockout after 3 failed attempts
// ==========================================================
function handlePasswordLockout(isValid) {
  if (isValid) return; // only count failed attempts

  passwordAttempts++;
  const remaining = MAX_ATTEMPTS - passwordAttempts;

  if (passwordAttempts >= MAX_ATTEMPTS) {
    formLocked = true;
    passwordInput.disabled = true;
    submitBtn.disabled = true;
    attemptMsg.textContent = 'Too many failed attempts. Form is now locked. Please refresh to try again.';
  } else {
    attemptMsg.textContent = `Invalid password. ${remaining} attempt(s) remaining before lockout.`;
  }
}

// ==========================================================
// Real-time (live) validation as the user types / interacts
// ==========================================================
firstNameInput.addEventListener('input', () =>
  validateName(firstNameInput, document.getElementById('firstNameError'), 'First name')
);

lastNameInput.addEventListener('input', () =>
  validateName(lastNameInput, document.getElementById('lastNameError'), 'Last name')
);

emailInput.addEventListener('input', validateEmail);

categorySelect.addEventListener('change', validateCategory);

reasonInput.addEventListener('input', validateReason);

genderRadios.forEach((radio) => radio.addEventListener('change', validateGender));
clubCheckboxes.forEach((cb) => cb.addEventListener('change', validateClubs));

// ==========================================================
// Form submission handler
// ==========================================================
form.addEventListener('submit', function (event) {
  event.preventDefault(); // stop default page reload

  if (formLocked) {
    attemptMsg.textContent = 'Form is locked. Please refresh the page to try again.';
    return;
  }

  // Run every validation function; use if-else / && to combine results
  const isFirstNameValid = validateName(firstNameInput, document.getElementById('firstNameError'), 'First name');
  const isLastNameValid = validateName(lastNameInput, document.getElementById('lastNameError'), 'Last name');
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isGenderValid = validateGender();
  const isClubsValid = validateClubs();
  const isCategoryValid = validateCategory();
  const isReasonValid = validateReason();

  // Track password attempts / lockout logic
  handlePasswordLockout(isPasswordValid);

  const allValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPasswordValid &&
    isGenderValid &&
    isClubsValid &&
    isCategoryValid &&
    isReasonValid;

  if (allValid) {
    successMsg.textContent = 'Registration submitted successfully! Welcome to the club.';
    passwordAttempts = 0; // reset attempts on success
    attemptMsg.textContent = '';
    form.reset();

    // Clear all valid/invalid styling after reset
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      el.classList.remove('valid', 'invalid');
    });
  } else {
    successMsg.textContent = '';
  }
});
