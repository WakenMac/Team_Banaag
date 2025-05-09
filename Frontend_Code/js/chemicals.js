/**
 * CARES - Centralized Resource and Equipment System
 * Chemicals Management Module
 *
 * This module handles the management of chemicals in the inventory system.
 * It includes functionality for:
 * - Adding new chemicals
 * - Editing existing chemicals
 * - Deleting chemicals
 * - Adding/viewing remarks
 * - Displaying chemical information in info (tooltip)
 */

/**
 * Sets up dropdown menu functionality for navigation items
 * @param {string} buttonId - The ID of the dropdown button
 * @param {string} menuId - The ID of the dropdown menu
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

// Initialize dropdown menus
setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

/* Edit and Add Chemicals Functionality */

// Get references to the Edit Modal and Add Modal
const editChemicalModal = document.getElementById("editChemicalModal");
const editChemicalForm = document.getElementById("editChemicalForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const modalBackdropEditChemical = document.getElementById(
  "modalBackdropEditChemical"
);
const chemicalsTableBody = document.getElementById("chemicalsTableBody");

/**
 * Opens the edit modal and populates it with chemical data
 * @param {HTMLElement} row - The table row containing chemical data
 */
function openEditModal() {
  editChemicalModal.classList.remove("hidden");
  editChemicalModal.classList.add("flex");
}

/**
 * Closes the edit modal and resets the form
 */
function closeEditModal() {
  editChemicalModal.classList.add("hidden");
  editChemicalModal.classList.remove("flex");
  editChemicalForm.reset();
}

cancelEditBtn.addEventListener("click", closeEditModal);
modalBackdropEditChemical.addEventListener("click", closeEditModal);

/**
 * Populates the edit form with data from the selected chemical
 * @param {HTMLElement} row - The table row containing chemical data
 */
function populateEditForm(row) {
  const cells = row.children;
  document.getElementById("editChemicalId").value = cells[0].textContent;
  document.getElementById("editChemicalName").value = cells[1].textContent;

  function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    if ([...select.options].some((opt) => opt.value === value)) {
      select.value = value;
    } else {
      const observer = new MutationObserver(() => {
        if ([...select.options].some((opt) => opt.value === value)) {
          select.value = value;
          observer.disconnect();
        }
      });
      observer.observe(select, { childList: true });
    }
  }

  setSelectValue("editChemicalUnit", cells[2].textContent);
  setSelectValue("editChemicalLocation", cells[3].textContent);
  document.getElementById("editChemicalBrand").value = cells[4].textContent;
  document.getElementById("editChemicalQuantity").value = cells[5].textContent;

  let cas = "",
    msd = "",
    barcode = "";
  if (cells.length > 8) {
    cas = cells[6]?.textContent || "";
    msd = cells[7]?.textContent || "";
    barcode = cells[8]?.textContent || "";
  } else {
    // Find the info button in the last cell
    const infoBtn = row.querySelector('button[aria-label="Info"]');
    if (infoBtn) {
      cas = infoBtn.getAttribute("data-cas") || "";
      msd = infoBtn.getAttribute("data-msd") || "";
      barcode = infoBtn.getAttribute("data-barcode") || "";
    }
  }
  document.getElementById("editChemicalCASNo").value = cas;
  document.getElementById("editChemicalMSDS").value = msd;
  document.getElementById("editChemicalBarCode").value = barcode;
  openEditModal();
}

// Handle Edit Form Submission
editChemicalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editChemicalId = document.getElementById("editChemicalId").value.trim();
  const editChemicalName = document
    .getElementById("editChemicalName")
    .value.trim();
  const editChemicalUnit = document
    .getElementById("editChemicalUnit")
    .value.trim();
  const editChemicalLocation = document
    .getElementById("editChemicalLocation")
    .value.trim();
  const editChemicalBrand = document
    .getElementById("editChemicalBrand")
    .value.trim();
  const editChemicalQuantity = document
    .getElementById("editChemicalQuantity")
    .value.trim();

  const rows = chemicalsTableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    if (row.children[0].textContent === editChemicalId) {
      row.children[1].textContent = editChemicalName;
      row.children[2].textContent = editChemicalUnit;
      row.children[3].textContent = editChemicalLocation;
      row.children[4].textContent = editChemicalBrand;
      row.children[5].textContent = editChemicalQuantity;
    }
  });

  closeEditModal();
});

// Add Event Listener for Edit Buttons
chemicalsTableBody.addEventListener("click", (e) => {
  console.log("Clicked:", e.target);
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit chemical"
  ) {
    const row = e.target.closest("tr");
    populateEditForm(row);
  }
});

/* Add Chemicals Functionality */
const addChemicalsBtn = document.getElementById("addChemicalsBtn");
const addChemicalsModal = document.getElementById("addChemicalsModal");
const addChemicalsForm = document.getElementById("addChemicalsForm");
const cancelBtn = document.getElementById("cancelBtn");
const modalBackdropAddChemical = document.getElementById(
  "modalBackdropAddChemical"
);

/**
 * Opens the add chemicals modal
 */
function openAddModal() {
  addChemicalsModal.classList.remove("hidden");
  addChemicalsModal.classList.add("flex");
}

/**
 * Closes the add chemicals modal and resets the form
 */
function closeAddModal() {
  addChemicalsModal.classList.add("hidden");
  addChemicalsModal.classList.remove("flex");
  addChemicalsForm.reset();
}

addChemicalsBtn.addEventListener("click", openAddModal);
cancelBtn.addEventListener("click", closeAddModal);
modalBackdropAddChemical.addEventListener("click", closeAddModal);

/**
 * Handles the submission of new chemical data
 * Creates a new row in the table with the chemical information
 * Includes functionality for remarks and additional chemical details
 */
addChemicalsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const chemicalId = addChemicalsForm.chemicalId.value.trim();
  const chemicalName = addChemicalsForm.chemicalName.value.trim();
  const chemicalUnit = addChemicalsForm.chemicalUnit.value.trim();
  const chemicalLocation = addChemicalsForm.chemicalLocation.value.trim();
  const chemicalBrand = addChemicalsForm.chemicalBrand.value.trim();
  const chemicalQuantity = addChemicalsForm.chemicalQuantity.value.trim();
  const chemicalCASNo = addChemicalsForm.chemicalCASNo.value.trim();
  const chemicalMSDS = addChemicalsForm.chemicalMSDS.value.trim();
  const chemicalBarCode = addChemicalsForm.chemicalBarCode.value.trim();

  if (
    !chemicalId ||
    !chemicalName ||
    !chemicalUnit ||
    !chemicalLocation ||
    !chemicalBrand ||
    !chemicalQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalId}</td>
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalName}</td>
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalUnit}</td>
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalLocation}</td>
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalBrand}</td>
  <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalQuantity}</td>
  <td class="px-6 py-4 whitespace-nowrap text-right space-x-3 flex items-center justify-end">
    <button aria-label="Info" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" 
      data-cas="${chemicalCASNo}"
      data-msd="${chemicalMSDS}"
      data-barcode="${chemicalBarCode}">
      <i class="fas fa-info text-[14px]"></i>
    </button>
    <button aria-label="Add remarks" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" data-chemical-id="${chemicalId}">
      <i class="fas fa-comment-alt text-[14px]"></i>
    </button>
    <button aria-label="Edit chemical" class="text-yellow-400 hover:text-yellow-500">
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button aria-label="Delete chemical" class="text-red-600 hover:text-red-700">
      <i class="fas fa-trash-alt"></i>
    </button>
  </td>
  `;
  chemicalsTableBody.appendChild(tr);
  closeAddModal();
});

// Handle Delete Buttons
chemicalsTableBody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete chemical"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});

/**
 * Tooltip Functionality for Info buttons
 * Displays additional chemical information when hovering over the info button
 * Shows CAS No., MSD, and Barcode information
 */
chemicalsTableBody.addEventListener("mouseover", function (e) {
  const btn = e.target.closest('button[aria-label="Info"]');
  if (!btn) return;

  // Remove any existing tooltip
  document.querySelectorAll(".custom-tooltip").forEach((tip) => tip.remove());

  // Get the additional data from data attributes
  const chemicalCASNo = btn.getAttribute("data-cas") || "N/A";
  const chemicalMSDS = btn.getAttribute("data-msd") || "N/A";
  const chemicalBarCode = btn.getAttribute("data-barcode") || "N/A";

  // Create tooltip content
  const tooltipContent = `
    <div class="p-2">
      <p class="text-xs font-bold">Chemical Information</p>
      <p class="text-xs">CAS No.: ${chemicalCASNo}</p>
      <p class="text-xs">MSDS: ${chemicalMSDS}</p>
      <p class="text-xs">Barcode: ${chemicalBarCode}</p>
    </div>
  `;

  const tooltip = document.createElement("div"); // div ang butngan sa informations
  tooltip.className =
    "custom-tooltip absolute z-50 bg-gray-800 text-white text-xs rounded shadow-lg";
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.innerHTML = tooltipContent;

  document.body.appendChild(tooltip);

  // Position the tooltip
  const rect = btn.getBoundingClientRect();
  tooltip.style.left = `${
    rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2
  }px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;

  // Remove tooltip on mouseout
  btn.addEventListener("mouseleave", function removeTip() {
    tooltip.remove();
    btn.removeEventListener("mouseleave", removeTip);
  });
});

// Remarks Modal Functionality
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

/**
 * Opens the remarks modal and populates it with existing remarks if any
 * @param {string} chemicalId - The ID of the chemical to add/edit remarks for
 */
function openRemarksModal(chemicalId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksChemicalId").value = chemicalId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${chemicalId}"]`
  );
  const existingRemarks = remarksBtn.getAttribute("data-remarks");
  if (existingRemarks) {
    document.getElementById("remarksText").value = existingRemarks;
  } else {
    document.getElementById("remarksText").value = "";
  }
}

/**
 * Closes the remarks modal and resets the form
 */
function closeRemarksModal() {
  remarksModal.classList.add("hidden");
  remarksModal.classList.remove("flex");
  remarksForm.reset();
}

cancelRemarksBtn.addEventListener("click", closeRemarksModal);
modalBackdropRemarks.addEventListener("click", closeRemarksModal);

// Handle remarks button clicks
chemicalsTableBody.addEventListener("click", (e) => {
  const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    const chemicalId = remarksBtn.getAttribute("data-chemical-id");
    openRemarksModal(chemicalId);
  }
});

/**
 * Handles the submission of remarks
 * Updates the remarks button color based on whether remarks exist
 * Blue: Has remarks
 * Gray: No remarks
 */
remarksForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const chemicalId = document.getElementById("remarksChemicalId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${chemicalId}"]`
  );
  if (remarks) {
    remarksBtn.classList.remove("text-gray-700", "border-gray-700");
    remarksBtn.classList.add("text-blue-600", "border-blue-600");
    remarksBtn.setAttribute("data-remarks", remarks);
  } else {
    remarksBtn.classList.remove("text-blue-600", "border-blue-600");
    remarksBtn.classList.add("text-gray-700", "border-gray-700");
    remarksBtn.removeAttribute("data-remarks");
  }

  closeRemarksModal();
});
