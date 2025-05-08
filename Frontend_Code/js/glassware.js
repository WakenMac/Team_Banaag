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
const addGlasswareBtn = document.getElementById("addGlasswareBtn");
const addGlasswareModal = document.getElementById("addGlasswareModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const cancelBtn = document.getElementById("cancelBtn");
const addGlasswareForm = document.getElementById("addGlasswareForm");
const tbody = document.querySelector("tbody");

function openModal() {
  addGlasswareModal.classList.remove("hidden");
  addGlasswareModal.classList.add("flex");
}

function closeModal() {
  addGlasswareModal.classList.add("hidden");
  addGlasswareModal.classList.remove("flex");
  addGlasswareForm.reset();
}

addGlasswareBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

addGlasswareForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const glasswareId = addGlasswareForm.glasswareId.value.trim();
  const glasswareName = addGlasswareForm.glasswareName.value.trim();
  const glasswareUnit = addGlasswareForm.glasswareUnit.value.trim();
  const glasswareLocation = addGlasswareForm.glasswareLocation.value.trim();
  const glasswareBrand = addGlasswareForm.glasswareBrand.value.trim();
  const glasswareQuantity = addGlasswareForm.glasswareQuantity.value.trim();

  if (
    !glasswareId ||
    !glasswareName ||
    !glasswareUnit ||
    !glasswareLocation ||
    !glasswareBrand ||
    !glasswareQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareUnit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareLocation}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareBrand}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareQuantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
              <button aria-label="Edit glassware" class="text-yellow-400 hover:text-yellow-500">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button aria-label="Delete glassware" class="text-red-600 hover:text-red-700">
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
    e.target.closest("button").getAttribute("aria-label") === "Delete glassware"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
