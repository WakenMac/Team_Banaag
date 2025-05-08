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
const addLocationBtn = document.getElementById("addLocationBtn");
const addLocationModal = document.getElementById("addLocationModal");
const modalBackdropLocation = document.getElementById("modalBackdropLocation");
const cancelBtn = document.getElementById("cancelBtn");
const addLocationForm = document.getElementById("addLocationForm");
const tbody = document.querySelector("tbody");

function openModal() {
  addLocationModal.classList.remove("hidden");
  addLocationModal.classList.add("flex");
}

function closeModal() {
  addLocationModal.classList.add("hidden");
  addLocationModal.classList.remove("flex");
  addLocationForm.reset();
}

addLocationBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdropLocation.addEventListener("click", closeModal);

addLocationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const locationId = addLocationForm.locationId.value.trim();
  const locationName = addLocationForm.locationName.value.trim();

  if (!locationId || !locationName) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${locationId}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${locationName}</td>

              <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                <button aria-label="Edit location" class="text-yellow-400 hover:text-yellow-500">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button aria-label="Delete location" class="text-red-600 hover:text-red-700">
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
    e.target.closest("button").getAttribute("aria-label") === "Delete location"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
