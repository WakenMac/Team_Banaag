// FOR NAVIGATION BAR DROPDOWN FUNCTIONS

// Function to toggle dropdown visibility on click and close others
document.querySelectorAll("nav ul > li.relative > button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    // Close all dropdowns
    document
      .querySelectorAll("nav ul > li.relative > button")
      .forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const menu = document.getElementById(btn.id.replace("Btn", "Menu"));
        menu.classList.add("opacity-0", "invisible");
        menu.classList.remove("opacity-100", "visible");
      });
    if (!expanded) {
      button.setAttribute("aria-expanded", "true");
      const menu = document.getElementById(button.id.replace("Btn", "Menu"));
      menu.classList.remove("opacity-0", "invisible");
      menu.classList.add("opacity-100", "visible");
    }
  });
});

// Close dropdowns if clicking outside
document.addEventListener("click", (e) => {
  const nav = document.querySelector("nav");
  if (!nav.contains(e.target)) {
    document
      .querySelectorAll("nav ul > li.relative > button")
      .forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const menu = document.getElementById(btn.id.replace("Btn", "Menu"));
        menu.classList.add("opacity-0", "invisible");
        menu.classList.remove("opacity-100", "visible");
      });
  }
});

// Helper function to show toast notification
function showToast(message) {
  const toastMessage = document.getElementById('toastMessage')
  toastMessage.textContent = message
  showModal(toastNotification)
  setTimeout(() => {
    hideModal(toastNotification)
  }, 3000)
}

document.addEventListener('DOMContentLoaded', () => {
  // Logout modal logic
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener('click', () => {
      logoutModal.classList.remove('hidden');
      logoutModal.classList.add('flex');
    });
  }
  if (cancelLogoutBtn && logoutModal) {
    cancelLogoutBtn.addEventListener('click', () => {
      logoutModal.classList.add('hidden');
      logoutModal.classList.remove('flex');
    });
  }
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
      window.location.href = "login.html";
    });
  }
  // Optional: close modal when clicking backdrop
  logoutModal?.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
      logoutModal.classList.add('hidden');
      logoutModal.classList.remove('flex');
    }
  });
});