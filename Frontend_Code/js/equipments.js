/*
 * This part of the code is for equipment html. most specifically, the modal form.
 */

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
const addEquipmentBtn = document.getElementById("addEquipmentBtn");
const addEquipmentModal = document.getElementById("addEquipmentModal");
const addEquipmentForm = document.getElementById("addEquipmentForm");
const modalBackdropEquipment = document.getElementById(
  "modalBackdropEquipment"
);
const cancelEquipmentBtn = document.getElementById("cancelEquipmentBtn");
const tbody = document.querySelector("tbody");

function openEquipmentModal() {
  addEquipmentModal.classList.remove("hidden");
  addEquipmentModal.classList.add("flex");
}

function closeEquipmentModal() {
  addEquipmentModal.classList.add("hidden");
  addEquipmentModal.classList.remove("flex");
  addEquipmentForm.reset();
}

addEquipmentBtn.addEventListener("click", openEquipmentModal);
cancelEquipmentBtn.addEventListener("click", closeEquipmentModal);
modalBackdropEquipment.addEventListener("click", closeEquipmentModal);

addEquipmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equipmentId = addEquipmentForm.equipmentId.value.trim();
  const equipmentName = addEquipmentForm.equipmentName.value.trim();
  const equipmentUnit = addEquipmentForm.equipmentUnit.value.trim();
  const equipmentLocation = addEquipmentForm.equipmentLocation.value.trim();
  const equipmentBrand = addEquipmentForm.equipmentBrand.value.trim();
  const equipmentQuantity = addEquipmentForm.equipmentQuantity.value.trim();

  if (
    !equipmentId ||
    !equipmentName ||
    !equipmentUnit ||
    !equipmentLocation ||
    !equipmentBrand ||
    !equipmentQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentUnit}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentLocation}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentBrand}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentQuantity}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
            <button aria-label="Edit equipment" class="text-yellow-400 hover:text-yellow-500">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button aria-label="Delete equipment" class="text-red-600 hover:text-red-700">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;

  tbody.appendChild(tr);
  closeEquipmentModal();
});

// Optional: Add delete functionality for dynamically added rows
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete equipment"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
