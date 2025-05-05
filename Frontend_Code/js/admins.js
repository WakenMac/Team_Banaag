// Dropdown toggle logic
function setupDropdown(buttonId, menuId) {
  const btn = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !expanded);
    if (!expanded) {
      menu.classList.remove("opacity-0", "invisible");
      menu.classList.add("opacity-100", "visible");
    } else {
      menu.classList.add("opacity-0", "invisible");
      menu.classList.remove("opacity-100", "visible");
    }
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.add("opacity-0", "invisible");
      menu.classList.remove("opacity-100", "visible");
    }
  });
}

setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

// Modal logic
const addAdminBtn = document.getElementById("addAdminBtn");
const addAdminModal = document.getElementById("addAdminModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const cancelBtn = document.getElementById("cancelBtn");
const addAdminForm = document.getElementById("addAdminForm");
const tbody = document.querySelector("tbody");

function openModal() {
  addAdminModal.classList.remove("hidden");
  addAdminModal.classList.add("flex");
}

function closeModal() {
  addAdminModal.classList.add("hidden");
  addAdminModal.classList.remove("flex");
  addAdminForm.reset();
}

addAdminBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

addAdminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const adminId = addAdminForm.adminId.value.trim();
  const firstName = addAdminForm.firstName.value.trim();
  const middleName = addAdminForm.middleName.value.trim();
  const lastName = addAdminForm.lastName.value.trim();

  if (!adminId || !firstName || !lastName) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${adminId}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${firstName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${middleName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${lastName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
          <button aria-label="Edit admin" class="text-yellow-400 hover:text-yellow-500">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button aria-label="Delete admin" class="text-red-600 hover:text-red-700">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;

  tbody.appendChild(tr);
  closeModal();
});

// Optional: Add delete functionality for dynamically added rows
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete admin"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
