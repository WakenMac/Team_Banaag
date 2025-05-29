
import * as dbhandler from '../../Backend_Code/mainHandler.js';

// Initializes Components
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('signIn') || document.getElementById('signInForm')){
    initializeTermsAndServices();
    initializeAdminVerifier();
    initializePasswordToggle();
  }
});

function initializeTermsAndServices(){
  // Terms Modal
  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');
  const openTermsModal = document.getElementById('openTermsModal');
  const openPrivacyModal = document.getElementById('openPrivacyModal');
  const closeTermsModal = document.getElementById('closeTermsModal');
  const closePrivacyModal = document.getElementById('closePrivacyModal');

  // Modal handling
  if (openTermsModal) {
    openTermsModal.addEventListener('click', function (e) {
      e.preventDefault();
      termsModal.classList.remove('hidden');
      termsModal.classList.add('flex');
    });
  }

  if (openPrivacyModal) {
    openPrivacyModal.addEventListener('click', function (e) {
      e.preventDefault();
      privacyModal.classList.remove('hidden');
      privacyModal.classList.add('flex');
    });
  }

  if (closeTermsModal) {
    closeTermsModal.addEventListener('click', function () {
      termsModal.classList.add('hidden');
      termsModal.classList.remove('flex');
    });
  }

  if (closePrivacyModal) {
    closePrivacyModal.addEventListener('click', function () {
      privacyModal.classList.add('hidden');
      privacyModal.classList.remove('flex');
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', function (e) {
    if (e.target === termsModal) {
      termsModal.classList.add('hidden');
      termsModal.classList.remove('flex');
    }
    if (e.target === privacyModal) {
      privacyModal.classList.add('hidden');
      privacyModal.classList.remove('flex');
    }
  });
}

function initializeAdminVerifier(){
  const loginForm = document.getElementById('signInForm')
  const registerForm = document.getElementById('signIn');
  const registerLink = document.querySelector('a[href*="register"]');
  const loginLink = document.querySelector('a[href*="login"]');
  const overlay = document.getElementById('pageLoadingOverlay');
  const MIN_LOADING = 1000; // 1 second

  // Helper for navigation with delay
  function delayedNavigate(href) {
    showOverlay();
    setTimeout(() => {
      window.location.href = href;
    }, MIN_LOADING);
  }

  // Register link (from login)
  if (registerLink) {
    registerLink.addEventListener('click', function (e) {
      e.preventDefault();
      delayedNavigate(registerLink.href);
    });
  }

  // Login link (from register)
  if (loginLink) {
    loginLink.addEventListener('click', function (e) {
      e.preventDefault();
      delayedNavigate(loginLink.href);
    });
  }  
  
  // Hide overlay on page load
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  if (loginForm) 
    document.getElementById('signInForm').addEventListener('submit', validateLogin);
  else if (registerForm)
    document.getElementById('signIn').addEventListener('submit', validateSignIn);
}

export function initializePasswordToggle(){
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // Toggle eye icon
      const eyeIcon = this.querySelector('svg');
      if (type === 'text') {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      } else {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    });
  }
}

// Validates button for sign in
async function validateSignIn(event) {
  event.preventDefault();

  const adminId = document.getElementById('adminId').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const middleName = document.getElementById('middleName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const password = document.getElementById('password').value;

  const adminIdField = document.getElementById('adminId');
  const passwordField = document.getElementById('password');
  const adminIdError = document.getElementById('adminIdError');
  const passwordError = document.getElementById('passwordError');

  // Reset previous error states
  adminIdField.classList.remove('border-red-500', 'focus:ring-red-500');
  passwordField.classList.remove('border-red-500', 'focus:ring-red-500');
  adminIdError.classList.add('hidden');
  passwordError.classList.add('hidden');

  // Basic validation
  if (!adminId || !firstName || !middleName || !lastName || !password) {
    showToast('Please fill in all required fields', true);
    console.log("Entry error")
    return;
  } else if (password.length < 8) {
    passwordField.classList.add('border-red-500', 'focus:ring-red-500');
    passwordError.textContent = 'Kindly use a longer password';
    passwordError.classList.remove('hidden');
    console.log("Password Length Error")
    return;
  }

  let result = await dbhandler.addAdminRecord(adminId, firstName, middleName, lastName, password)
  showOverlay();

  console.log(result);

  if (!result || result.includes("ERROR")) {
    adminIdField.classList.add('border-red-500', 'focus:ring-red-500');
    adminIdError.textContent = 'ID number is already used.';
    adminIdError.classList.remove('hidden');
    showOverlay(true);
  } else {
    // Show toast notification
    showNotification('Registration successful! Redirecting...', 'success');
    localStorage.setItem('loggedInAdmin', adminId)
    window.location.href = window.location.origin + '/Frontend_Code/html/dashboard.html';
  }
}

// Validates button for log in
async function validateLogin(event) {
  event.preventDefault();

  const adminId = document.getElementById('adminId').value;
  const password = document.getElementById('password').value;
  const adminIdField = document.getElementById('adminId');
  const passwordField = document.getElementById('password');
  const adminIdError = document.getElementById('adminIdError');
  const passwordError = document.getElementById('passwordError');

  // Reset previous error states
  adminIdField.classList.remove('border-red-500', 'focus:ring-red-500');
  passwordField.classList.remove('border-red-500', 'focus:ring-red-500');
  adminIdError.classList.add('hidden');
  passwordError.classList.add('hidden');

  let result = await dbhandler.adminExists(adminId, password);
  showOverlay();
  console.log(result);

  // Validate credentials
  if (result === true) {
    // Successful login
    showOverlay(true);
    showLoading();
    showNotification('Login successful! Redirecting...', 'success');
    localStorage.setItem("loggedInAdmin", adminId)
    window.location.href = window.location.origin + '/Frontend_Code/html/dashboard.html';
  } else {
    // Failed Login
    showNotification("Invalid User Credentials", 'palse')
  }
}

// ========================================
// Front end methods

// Function to show notifications
function showNotification(message, type) {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
  notification.textContent = message;

  // Add to document
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const tableLoadingState = document.getElementById('tableLoadingState');

  if (loadingSpinner) {
    loadingSpinner.style.display = 'flex';
  }

  if (tableLoadingState) {
    tableLoadingState.style.display = 'block';
  }
}

// Method to show or hide the overlay
function showOverlay(isHidden = false) {
  const overlay = document.getElementById('pageLoadingOverlay');

  if (!overlay){
    return;
  } else if (overlay && isHidden == false) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    overlay.style.opacity = '1';
  } else if (isHidden == true) {
    overlay.classList.add('hidden');
  }
}