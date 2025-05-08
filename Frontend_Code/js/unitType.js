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
const addUnitTypeBtn = document.getElementById("addUnitTypeBtn");
const addUnitTypeModal = document.getElementById("addUnitTypeModal");
const modalBackdropUnitType = document.getElementById("modalBackdropUnitType");
const cancelBtn = document.getElementById("cancelBtn");
const addUnitTypeForm = document.getElementById("addUnitTypeForm");
const tbody = document.querySelector("tbody");

function openModal() {
  addUnitTypeModal.classList.remove("hidden");
  addUnitTypeModal.classList.add("flex");
}

function closeModal() {
  addUnitTypeModal.classList.add("hidden");
  addUnitTypeModal.classList.remove("flex");
  addUnitTypeForm.reset();
}

addUnitTypeBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdropUnitType.addEventListener("click", closeModal);

addUnitTypeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const unitTypeId = addUnitTypeForm.unitTypeId.value.trim();
  const unitTypeName = addUnitTypeForm.unitTypeName.value.trim();

  if (!unitTypeId || !unitTypeName) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${unitTypeId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${unitTypeName}</td>
  
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                  <button aria-label="Edit unit type" class="text-yellow-400 hover:text-yellow-500">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button aria-label="Delete unit type" class="text-red-600 hover:text-red-700">
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
    e.target.closest("button").getAttribute("aria-label") === "Delete unit type"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
