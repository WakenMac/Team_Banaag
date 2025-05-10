/**
 * CARES - Centralized Resource and Equipment System
 * Consumables Items Management Module
 *
 *
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

/* Edit and Add Items Functionality */

// Get references to the Edit Modal and Add Modal
const editConsumableItemsModal = document.getElementById(
  "editConsumableItemsModal"
);
const editConsumableItemsForm = document.getElementById(
  "editConsumableItemsForm"
);
const cancelEditBtn = document.getElementById("cancelEditBtn");
const modalBackdropConsumableItems = document.getElementById(
  "modalBackdropConsumableItems"
);
const consumableItemsTablebody = document.getElementById(
  "consumableItemsTablebody"
);

/**
 * Opens the edit modal and populates it with chemical data
 * @param {HTMLElement} row - The table row containing chemical data
 */
function openEditModal() {
  editConsumableItemsModal.classList.remove("hidden");
  editConsumableItemsModal.classList.add("flex");
}

/**
 * Closes the edit modal and resets the form
 */
function closeEditModal() {
  editConsumableItemsModal.classList.add("hidden");
  editConsumableItemsModal.classList.remove("flex");
  editConsumableItemsForm.reset();
}

cancelEditBtn.addEventListener("click", closeEditModal);
modalBackdropConsumableItems.addEventListener("click", closeEditModal);

/**
 * Populates the edit form with data from the selected chemical
 * @param {HTMLElement} row - The table row containing chemical data
 */
function populateEditForm(row) {
  const cells = row.children;
  document.getElementById("editConsumableItemsId").value = cells[0].textContent;
  document.getElementById("editConsumableItemsName").value =
    cells[1].textContent;

  function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    console.log(
      "Setting",
      selectId,
      "to",
      value,
      "Options:",
      [...select.options].map((o) => o.value)
    );
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

  setSelectValue("editConsumableItemsUnit", cells[2].textContent.trim());
  setSelectValue("editConsumableItemsLocation", cells[3].textContent.trim());
  document.getElementById("editConsumableItemsBrand").value =
    cells[4].textContent;
  document.getElementById("editConsumableItemsQuantity").value =
    cells[5].textContent;
}

// Handle Edit Form Submission
editConsumableItemsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editConsumableItemsId = document
    .getElementById("editConsumableItemsId")
    .value.trim();
  const editConsumableItemsName = document
    .getElementById("editConsumableItemsName")
    .value.trim();
  const editConsumableItemsUnit = document
    .getElementById("editConsumableItemsUnit")
    .value.trim();
  const editConsumableItemsLocation = document
    .getElementById("editConsumableItemsLocation")
    .value.trim();
  const editConsumableItemsBrand = document
    .getElementById("editConsumableItemsBrand")
    .value.trim();
  const editConsumableItemsQuantity = document
    .getElementById("editConsumableItemsQuantity")
    .value.trim();

  const rows = consumableItemsTablebody.querySelectorAll("tr");
  rows.forEach((row) => {
    if (row.children[0].textContent === editConsumableItemsId) {
      row.children[1].textContent = editConsumableItemsName;
      row.children[2].textContent = editConsumableItemsUnit;
      row.children[3].textContent = editConsumableItemsLocation;
      row.children[4].textContent = editConsumableItemsBrand;
      row.children[5].textContent = editConsumableItemsQuantity;
    }
  });

  closeEditModal();
});

// Add Event Listener for Edit Buttons
consumableItemsTablebody.addEventListener("click", (e) => {
  console.log("Clicked:", e.target);
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") ===
      "Edit consumable item"
  ) {
    const row = e.target.closest("tr");
    populateEditForm(row);
  }
});

/* Add Chemicals Functionality */
const addConsumableItemsBtn = document.getElementById("addConsumableItemsBtn");
const addConsumableItemsModal = document.getElementById(
  "addConsumableItemsModal"
);
const addConsumableItemsForm = document.getElementById(
  "addConsumableItemsForm"
);
const cancelBtn = document.getElementById("cancelBtn");
const modalBackdropAddConsumableItems = document.getElementById(
  "modalBackdropAddConsumableItems"
);
const closeAddConsumableItemsModalBtn = document.getElementById(
  "closeAddConsumableItemsModalBtn"
);

/**
 * Opens the add chemicals modal
 */
function openAddModal() {
  addConsumableItemsModal.classList.remove("hidden");
  addConsumableItemsModal.classList.add("flex");
}

/**
 * Closes the add chemicals modal and resets the form
 */
function closeAddModal() {
  addConsumableItemsModal.classList.add("hidden");
  addConsumableItemsModal.classList.remove("flex");
  addConsumableItemsForm.reset();
}

addConsumableItemsBtn.addEventListener("click", openAddModal);
cancelBtn.addEventListener("click", closeAddModal);
modalBackdropAddConsumableItems.addEventListener("click", closeAddModal);
if (closeAddConsumableItemsModalBtn)
  closeAddConsumableItemsModalBtn.addEventListener("click", closeAddModal);

/**
 * Handles the submission of new chemical data
 * Creates a new row in the table with the chemical information
 * Includes functionality for remarks and additional chemical details
 */
addConsumableItemsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const consumableItemsId =
    addConsumableItemsForm.consumableItemsId.value.trim();
  const consumableItemsName =
    addConsumableItemsForm.consumableItemsName.value.trim();
  const consumableItemsUnit =
    addConsumableItemsForm.consumableItemsUnit.value.trim();
  const consumableItemsLocation =
    addConsumableItemsForm.consumableItemsLocation.value.trim();
  const consumableItemsBrand =
    addConsumableItemsForm.consumableItemsBrand.value.trim();
  const consumableItemsQuantity =
    addConsumableItemsForm.consumableItemsQuantity.value.trim();

  if (
    !consumableItemsId ||
    !consumableItemsName ||
    !consumableItemsUnit ||
    !consumableItemsLocation ||
    !consumableItemsBrand ||
    !consumableItemsQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsQuantity}</td>
    <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
      <button aria-label="Add remarks" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" data-chemical-id="${consumableItemsId}">
        <i class="fas fa-comment-alt text-[14px]"></i>
      </button>
      <button aria-label="Edit consumable item" class="text-yellow-400 hover:text-yellow-500">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button aria-label="Delete consumable item" class="text-red-600 hover:text-red-700">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
    `;
  consumableItemsTablebody.appendChild(tr);
  closeAddModal();
});

// Handle Delete Buttons
consumableItemsTablebody.addEventListener("click", (e) => {
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
consumableItemsTablebody.addEventListener("mouseover", function (e) {
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
 * @param {string} consumableItemsId - The ID of the chemical to add/edit remarks for
 */
function openRemarksModal(consumableItemsId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksconsumableItemsId").value = consumableItemsId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${consumableItemsId}"]`
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
consumableItemsTablebody.addEventListener("click", (e) => {
  const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    const consumableItemsId = remarksBtn.getAttribute("data-chemical-id");
    openRemarksModal(consumableItemsId);
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
  const consumableItemsId = document.getElementById(
    "remarksconsumableItemsId"
  ).value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${consumableItemsId}"]`
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
