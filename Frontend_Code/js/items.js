// Consumable - Items Management JS

//

import * as dbhandler from "../../Backend_Code/mainHandler.js";
import { generateInventoryPdfReport } from '/Frontend_Code/js/pdfReport.js';
import '/Frontend_Code/js/font/Old London-normal.js';

let tbody = null;
let consumableItemRowToDelete = null;
let consumableItemRowToEdit = null;
let itemsData = [];

// DOM Elements
const editConsumableItemsLocation = document.getElementById(
  "editConsumableItemsLocation"
);
const editConsumableItemsUnit = document.getElementById(
  "editConsumableItemsUnit"
);
const modalBackdropEditConsumableItems = document.getElementById(
  "modalBackdropEditConsumableItems"
);

// Add Consumable Items Elements
const addConsumableItemsBtn = document.getElementById("addConsumableItemsBtn");
const addConsumableItemsModal = document.getElementById(
  "addConsumableItemsModal"
);
const addConsumableItemsForm = document.getElementById(
  "addConsumableItemsForm"
);
const cancelConsumableItemsBtn = document.getElementById(
  "cancelConsumableItemsBtn"
);
const modalBackdropAddConsumableItems = document.getElementById(
  "modalBackdropConsumableItems"
);
const addConsumableItemsLocation = document.getElementById(
  "consumableItemsLocation"
);
const addConsumableItemsUnit = document.getElementById("consumableItemsUnit");

// Edit Consumable Items Elements
const editConsumableItemsModal = document.getElementById(
  "editConsumableItemsModal"
);
const editConsumableItemsForm = document.getElementById(
  "editConsumableItemsForm"
);
const cancelEditBtn = document.getElementById("cancelEditBtn");

let consumableItemsQuantity = 0;

// Delete Consumable Items Elements
const deleteConsumableItemsModal = document.getElementById(
  "deleteConsumableItemsModal"
);
const deleteConsumableItemsForm = document.getElementById(
  "deleteConsumableItemsForm"
);
const deleteConsumableItemsBtn = document.getElementById(
  "deleteConsumableItemsBtn"
);
const cancelDeleteConsumableItemsBtn = document.getElementById(
  "cancelDeleteConsumableItemsBtn"
);
const confirmDeleteConsumableItemsBtn = document.getElementById(
  "confirmDeleteConsumableItemsBtn"
);
const modalBackdropDeleteConsumableItems = document.getElementById(
  "modalBackdropDeleteConsumableItems"
);

// Remarks Elements
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

// Loading state management
function showPageLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'flex';
    spinner.style.opacity = '0';
    // Fade in animation
    setTimeout(() => {
      spinner.style.transition = 'opacity 0.3s ease-in-out';
      spinner.style.opacity = '1';
    }, 0);
  }
}

function hidePageLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    // Fade out animation
    spinner.style.transition = 'opacity 0.3s ease-in-out';
    spinner.style.opacity = '0';
    setTimeout(() => {
      spinner.style.display = 'none';
    }, 300);
  }
}

function showTableLoading() {
  const tableBody = document.getElementById('consumableItemsTableBody');
  const loadingState = document.getElementById('tableLoadingState');
  if (tableBody && loadingState) {
    tableBody.style.opacity = '0';
    tableBody.style.transition = 'opacity 0.3s ease-in-out';
    loadingState.classList.remove('hidden');
    loadingState.style.opacity = '0';
    // Fade in animation
    setTimeout(() => {
      loadingState.style.transition = 'opacity 0.3s ease-in-out';
      loadingState.style.opacity = '1';
    }, 0);
  }
}

function hideTableLoading() {
  const tableBody = document.getElementById('consumableItemsTableBody');
  const loadingState = document.getElementById('tableLoadingState');
  if (tableBody && loadingState) {
    // Fade out loading state
    loadingState.style.transition = 'opacity 0.3s ease-in-out';
    loadingState.style.opacity = '0';

    setTimeout(() => {
      loadingState.classList.add('hidden');
      // Fade in table body
      tableBody.style.transition = 'opacity 0.3s ease-in-out';
      tableBody.style.opacity = '1';
    }, 300);
  }
}

// -------------------- PREPARE LOCATION & UNIT TYPE FUNCTIONS --------------------
/**
 * Method to add a new unit to the addEquipmentUnit and editEquipmentUnit dropdown element
 * @param {string} unitTypeName Name of the unit type to be added
 */
function createNewUnitTypeRow(unitTypeName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");
  tr1.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  tr2.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  addConsumableItemsUnit.appendChild(tr1);
  editConsumableItemsUnit.appendChild(tr2);
}

/**
 * Method to add a new unit to the addEquipmentLocation and editEquipmentLocation dropdown element
 * @param {string} locationName Name of the location to be added to the dropdown
 */
function createNewLocationRow(locationName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");

  tr1.innerHTML = `<option value="${locationName}">${locationName}</option>`;
  tr2.innerHTML = `<option value="${locationName}">${locationName}</option>`;

  addConsumableItemsLocation.appendChild(tr1);
  editConsumableItemsLocation.appendChild(tr2);
}

// ------------------ ADD CONSUMABLE ITEMS ------------------
function openAddModal() {
  addConsumableItemsModal.classList.remove("hidden");
  addConsumableItemsModal.classList.add("flex");
}

function closeAddModal() {
  addConsumableItemsModal.classList.remove("flex");
  addConsumableItemsModal.classList.add("hidden");
  addConsumableItemsForm.reset();
}

addConsumableItemsBtn.addEventListener("click", openAddModal);
cancelConsumableItemsBtn.addEventListener("click", closeAddModal);
modalBackdropAddConsumableItems.addEventListener("click", closeAddModal);

function createNewConsumableItemsRow(
  consumableItemsId,
  consumableItemsName,
  consumableItemsUnit,
  consumableItemsLocation,
  consumableItemsBrand,
  consumableItemsQuantity
) {
  if (!tbody) {
    showToast("Could not create new row. Table body not found.", true);
    return;
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsQuantity} ${consumableItemsUnit}</td>
    <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
      <button 
        aria-label="Add remarks" 
        class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" 
        data-item-id="${consumableItemsId}"
      >
        <i class="fas fa-comment-alt text-[14px]"></i>
      </button>
      <button aria-label="Edit item" class="text-yellow-400 hover:text-yellow-500">
        <i class="fas fa-pencil-alt"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

// -------------------- EDIT CONSUMABLE ITEM FUNCTIONS --------------------
function openEditModal() {
  editConsumableItemsModal.classList.remove("hidden");
  editConsumableItemsModal.classList.add("flex");
}

function closeEditModal() {
  editConsumableItemsModal.classList.add("hidden");
  editConsumableItemsModal.classList.remove("flex");
  editConsumableItemsForm.reset();
}

function populateEditForm(row) {
  const cells = row.children;
  const fieldMap = [
    { id: "editConsumableItemsId", idx: 0 },
    { id: "editConsumableItemsName", idx: 1 },
    { id: "editConsumableItemsUnit", idx: 2 },
    { id: "editConsumableItemsLocation", idx: 3 },
    { id: "editConsumableItemsBrand", idx: 4 },
  ];

  for (const { id, idx } of fieldMap) {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Element with id '${id}' not found in modal!`);
      continue;
    }
    if (!cells[idx]) {
      console.error(`Table cell index ${idx} not found in row!`);
      continue;
    }

    el.value = cells[idx].textContent.trim();
  }

  // Get remarks if any
  const remarksBtn = row.querySelector('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    populateRemarksField(remarksBtn);
  }

  // Store row index for updating
  editConsumableItemsForm.dataset.editingRow = Array.from(
    tbody.children
  ).indexOf(row);

  // Open modal after populating
  openEditModal();
}

function updateConsumableItemTable(
  consumableItemsName,
  consumableItemsUnit,
  consumableItemsLocation,
  consumableItemsBrand
) {
  const cells = consumableItemRowToEdit.children;
  const originalUnit = cells[2].textContent;

  cells[1].textContent = consumableItemsName;
  cells[2].textContent = consumableItemsUnit;
  cells[3].textContent = consumableItemsLocation;
  cells[4].textContent = consumableItemsBrand;
  cells[5].textContent =
    cells[5].textContent.replace(" " + originalUnit, "") +
    " " +
    consumableItemsUnit;
}

// -------------------- DELETE CONSUMABLE ITEM FUNCTIONS --------------------
function openDeleteModal(row) {
  consumableItemRowToDelete = row;
  deleteConsumableItemsModal.classList.remove("hidden");
  deleteConsumableItemsModal.classList.add("flex");
}

function closeDeleteModal() {
  deleteConsumableItemsModal.classList.add("hidden");
  deleteConsumableItemsModal.classList.remove("flex");
  consumableItemRowToDelete = null;
}

async function handleDeleteConsumableItems() {
  if (consumableItemRowToDelete) {
    let result = await dbhandler.deleteConsumableItemsRecordByItemId(
      consumableItemRowToDelete.children[0].textContent
    );
    if (result && result.includes("ERROR")) {
      showToast(result, true, 4000);
      return;
    }

    consumableItemRowToDelete.remove();
    closeDeleteModal();
    showToast("Consumable item deleted successfully");
  }
}

// -------------------- REMARKS FUNCTIONS --------------------
function openRemarksModal(consumableItemsId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksConsumableItemsId").value = consumableItemsId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-item-id="${consumableItemsId}"]`
  );
  const existingRemarks = remarksBtn.getAttribute("data-remarks");
  if (existingRemarks) {
    document.getElementById("remarksText").value = existingRemarks;
  } else {
    document.getElementById("remarksText").value = "";
  }
}

function closeRemarksModal() {
  remarksModal.classList.add("hidden");
  remarksModal.classList.remove("flex");
  remarksForm.reset();
}

function populateRemarksField(remarksBtn) {
  const remarks = remarksBtn.getAttribute("data-remarks") || "";
  const remarksField = document.getElementById("editConsumableItemsRemarks");
  if (remarksField) {
    remarksField.value = remarks;
  }
}

// -------------------- REMARKS FUNCTIONS --------------------

/**
 * Method to add an existing remarks to the remarksText element
 * @param {string} remarks The remarks of the chemical
 * @param {int} apparatusId The primary key of the Chemical table.
 */
async function createNewRemarks(remarks, equipmentId) {
  document.getElementById("remarksText").value = remarks;

  const remarksBtn = document.querySelector(
    `button[data-item-id="${equipmentId}"]`
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
}

// Initialize remarks event listeners
async function initializeRemarksListeners() {
  // Add remarks form submission
  tbody.addEventListener("click", (e) => {
    const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
    if (remarksBtn) {
      const equipmentId = remarksBtn.getAttribute("data-item-id");
      console.log(equipmentId);
      openRemarksModal(equipmentId);
    }
  });

  if (remarksForm) {
    remarksForm.addEventListener("submit", handleRemarksItemSubmit);
  }

  if (cancelRemarksBtn) {
    cancelRemarksBtn.addEventListener("click", closeRemarksModal);
  }

  if (modalBackdropRemarks) {
    modalBackdropRemarks.addEventListener("click", closeRemarksModal);
  }
}

// -------------------- EVENT HANDLERS --------------------

// ADD ITEM
async function handleAddConsumableItemSubmit(e) {
  e.preventDefault();

  // Get form values
  const consumableItemsName =
    addConsumableItemsForm.consumableItemsName.value.trim();
  const consumableItemsUnit =
    addConsumableItemsForm.consumableItemsUnit.value.trim();
  const consumableItemsLocation =
    addConsumableItemsForm.consumableItemsLocation.value.trim();
  const consumableItemsBrand =
    addConsumableItemsForm.consumableItemsBrand.value.trim();

  // Validation
  if (
    !consumableItemsName ||
    !consumableItemsUnit ||
    !consumableItemsLocation ||
    !consumableItemsBrand
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  let result = await dbhandler.addConsumableItemsRecord(
    consumableItemsName,
    consumableItemsLocation,
    consumableItemsUnit,
    consumableItemsBrand,
    ""
  );

  if (result == null) {
    showToast(
      `The mainHandler.addConsumableItemsRecord() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    let consumableItemId = result.slice(53, result.length - 1);

    // For debugging purposes
    console.log(result);
    console.log(result.slice(53, result.length - 1));

    createNewConsumableItemsRow(
      consumableItemId,
      consumableItemsName,
      consumableItemsUnit,
      consumableItemsLocation,
      consumableItemsBrand,
      0
    );

    closeAddModal();
    showToast("Consumable item added successfully");
  }
}

// EDIT ITEMS
async function handleEditConsumableItemSubmit(e) {
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
  const remarks = document
    .querySelector(`button[data-item-id="${editConsumableItemsId}"]`)
    .getAttribute("data-remarks");

  if (
    !editConsumableItemsId ||
    !editConsumableItemsName ||
    !editConsumableItemsUnit ||
    !editConsumableItemsLocation ||
    !editConsumableItemsBrand
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  console.log(editConsumableItemsName);

  let result = await dbhandler.updateConsumableItemsRecordByAll(
    editConsumableItemsId,
    editConsumableItemsName,
    editConsumableItemsLocation,
    editConsumableItemsUnit,
    editConsumableItemsBrand,
    remarks
  );

  if (result == null) {
    showToast(
      `The mainHandler.updateLabEquipmentsRecordByAll() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    console.log(result);

    // Update the table row
    updateConsumableItemTable(
      editConsumableItemsId,
      editConsumableItemsName,
      editConsumableItemsUnit,
      editConsumableItemsLocation,
      editConsumableItemsBrand
    );

    closeEditModal();
    showToast("Consumable item updated successfully", false, 3000);
  }
}

// TBODY LISTENER

function handleTableButtonClicks(e) {
  const button = e.target.closest("button");
  if (!button) return;

  const row = button.closest("tr");
  if (!row) return;

  const action = button.getAttribute("aria-label");

  switch (action) {
    case "Edit item":
      consumableItemRowToEdit = row;
      populateEditForm(row);
      break;
    case "Delete item":
      consumableItemRowToDelete = row;
      openDeleteModal(row);
      break;
    case "Add remarks":
      const consumableItemsId = button.getAttribute("data-item-id");
      openRemarksModal(consumableItemsId);
      break;
  }
}

// -------------------- INITIALIZATION --------------------
async function initializePage() {
  try {
    showPageLoading();

    // Initialize basic UI elements
    tbody = document.querySelector("#consumableItemsTableBody");
    setupDropdownElements();

    if (!initializeConsumableItems()) {
      throw new Error("Could not initialize consumable items table");
    }

    // Show table loading state while fetching data
    showTableLoading();

    // Initialize all data-dependent components
    await Promise.all([
      initializeConsumableItemsTable(),
      initializeUnitTypeDropdown(),
      initializeLocationDropdown(),
    ]);

    // Setup event listeners after data is loaded
    setupEventListeners();
    initializeRemarksListeners();

    // Hide all loading states
    hideTableLoading();
    hidePageLoading();

    showToast('Page loaded successfully!');
  } catch (error) {
    console.error('Error initializing page:', error);
    hideTableLoading();
    hidePageLoading();
    showToast('Error loading page. Please refresh.', true);
  }
}

// Call initialize when the page loads
document.addEventListener("DOMContentLoaded", initializePage);

function initializeConsumableItems() {
  if (!tbody) {
    console.error(
      "Could not find table body with ID 'consumableItemsTableBody'"
    );
    return false;
  }
  return true;
}

function setupEventListeners() {
  // Add ConsumableItem
  addConsumableItemsBtn.addEventListener("click", openAddModal);
  cancelConsumableItemsBtn.addEventListener("click", closeAddModal);
  modalBackdropAddConsumableItems.addEventListener("click", closeAddModal);
  addConsumableItemsForm.addEventListener(
    "submit",
    handleAddConsumableItemSubmit
  );

  // Edit ConsumableItem
  cancelEditBtn.addEventListener("click", closeEditModal);
  modalBackdropEditConsumableItems.addEventListener("click", closeEditModal);
  editConsumableItemsForm.addEventListener(
    "submit",
    handleEditConsumableItemSubmit
  );

  // Delete ConsumableItem
  cancelDeleteConsumableItemsBtn.addEventListener("click", closeDeleteModal);
  modalBackdropDeleteConsumableItems.addEventListener(
    "click",
    closeDeleteModal
  );
  confirmDeleteConsumableItemsBtn.addEventListener(
    "click",
    handleDeleteConsumableItems
  );

  // Table Buttons
  tbody.addEventListener("click", handleTableButtonClicks);

  // Remarks
  initializeRemarksListeners();
}

function setupDropdownElements() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");
}

// EDIT REMARKS
async function handleRemarksItemSubmit(e) {
  e.preventDefault();

  const consumableItemsId = document.getElementById(
    "remarksConsumableItemsId"
  ).value;
  const remarks = document.getElementById("remarksText").value.trim();

  const remarksBtn = document.querySelector(
    `button[data-item-id="${consumableItemsId}"]`
  );

  let result = await dbhandler.updateConsumableItemsRemarkByItemId(
    consumableItemsId,
    remarks
  );
  if (result && result.includes("ERROR")) {
    showToast(result, true, 4000);
    return;
  }

  if (remarksBtn) {
    if (remarks) {
      remarksBtn.classList.remove("text-gray-700", "border-gray-700");
      remarksBtn.classList.add("text-blue-600", "border-blue-600");
      remarksBtn.setAttribute("data-remarks", remarks);
    } else {
      remarksBtn.classList.remove("text-blue-600", "border-blue-600");
      remarksBtn.classList.add("text-gray-700", "border-gray-700");
      remarksBtn.removeAttribute("data-remarks");
    }
  }

  closeRemarksModal();
  showToast("Remarks updated successfully", false, 3000);
}

// -------------------- TOAST NOTIFICATION --------------------
function showToast(message, isError = false, time = 3000) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "32px";
    toast.style.right = "32px";
    toast.style.background = isError
      ? "rgba(220, 38, 38, 0.95)"
      : "rgba(44, 161, 74, 0.95)";
    toast.style.color = "white";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "16px";
    toast.style.fontWeight = "500";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease-in-out";
    toast.style.zIndex = "9999";

    // Add icon container
    const iconContainer = document.createElement("div");
    iconContainer.style.display = "flex";
    iconContainer.style.alignItems = "center";
    iconContainer.style.gap = "12px";

    // Add icon
    const icon = document.createElement("i");
    icon.className = isError ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    icon.style.fontSize = "20px";

    iconContainer.appendChild(icon);
    iconContainer.appendChild(document.createTextNode(message));
    toast.appendChild(iconContainer);

    document.body.appendChild(toast);
  } else {
    const icon = toast.querySelector("i");
    if (icon) {
      icon.className = isError ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    }
    toast.textContent = message;
  }

  toast.style.background = isError
    ? "rgba(220, 38, 38, 0.95)"
    : "rgba(44, 161, 74, 0.95)";

  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 0);

  // Animate out
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, time);
}

// ========================== Set Dropdown Logic ==========================

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

// SEARCH BAR METHODS - finds by brand and name - please adjust if necessary
function searchConsumableItem() {
  const searchValue = searchInput.value.toLowerCase();
  const rows = tbody.querySelectorAll("tr:not(.no-result-row)");
  let hasResult = false;

  const existingNoResults = tbody.querySelector(".no-result-row");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  rows.forEach((row) => {
    const itemName = row.children[1].textContent.toLowerCase();
    const itemBrand = row.children[4].textContent.toLowerCase();
    const itemUnit = row.children[2].textContent.toLowerCase();
    const itemLocation = row.children[3].textContent.toLowerCase();
    const showRow =
      !searchValue ||
      itemName.includes(searchValue) ||
      itemName.startsWith(searchValue) ||
      itemBrand.includes(searchValue) || 
      itemUnit.includes(searchValue) ||
      itemLocation.includes(searchValue);
    row.style.display = showRow ? "" : "none";
    if (showRow) hasResult = true;
  });

  if (!hasResult && searchValue) {
    const noResultRow = document.createElement("tr");
    noResultRow.className = "no-result-row";
    noResultRow.innerHTML = `
      <td colspan="7" class="px-6 py-16 text-center w-full">
        <div class="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-gray-500 text-lg font-medium">No items found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
    `;
    tbody.appendChild(noResultRow);
  }
}
// Add event listener to the search input
// const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchConsumableItem);
// -------------------- DATABASE CONNECTION LOGIC (Database Handler) --------------------

async function initializeConsumableItemsTable() {
  try {
    let data = await dbhandler.getAllConsumableItemsRecords();
    itemsData = data;
    if (data.length == 0) return;
    for (let i = 0; i < data.length; i++) {
      await createNewConsumableItemsRow(
        data[i]["Item ID"],
        data[i]["Name"],
        data[i]["Unit"],
        data[i]["Location"],
        data[i]["Brand"],
        data[i]["Quantity"]
      );
      await createNewRemarks(data[i]["Remarks"], data[i]["Item ID"]);
    }
  } catch (e) { console.error(e); }
}

/**
 * Gets all of the unit type records from the database then proceeds to populate them (using the unit_type_name)
 *  to the addEquipmentUnit html dropdown element
 * @void Returns nothing.
 */
async function initializeUnitTypeDropdown() {
  try {
    let data = await dbhandler.getAllUnitTypeRecordsOrderByName();

    if (data.length == 0) {
      console.error("Unit type table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      createNewUnitTypeRow(data[i]["Name"]);
    }
  } catch (generalError) {
    console.error(generalError);
  }
}

/**
 * Gets all of the location records from the database then proceeds to populate them (using the location_name)
 *  to the addEquipmentLocation html dropdown element
 * @void Returns nothing.
 */
async function initializeLocationDropdown() {
  try {
    let data = await dbhandler.getAllLocationRecordsOrderByName();

    if (data.length == 0) {
      console.error("Unit type table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      createNewLocationRow(data[i]["Name"]);
    }
  } catch (generalError) {
    console.error(generalError);
  }
}

async function prepareItemsTable() {
  try {
    let data = await dbhandler.getAllItemsRecords();
    itemsData = data;
    if (data.length == 0) return;
    for (let i = 0; i < data.length; i++) {
      await createNewItemsRow(
        data[i]["Item ID"],
        data[i]["Name"],
        data[i]["Unit"],
        data[i]["Location"],
        data[i]["Brand"],
        data[i]["Quantity"]
      );
      await createNewRemarks(data[i]["Remarks"], data[i]["Item ID"]);
    }
  } catch (e) { console.error(e); }
}

// ===================== PDF REPORT GENERATION =====================

const dateModal = document.getElementById('dateInputModal');
const dateForm = document.getElementById('dateInputForm');
const dateFields = document.getElementById('dateFields');
const addDateBtn = document.getElementById('addDateField');
const removeDateBtn = document.getElementById('removeDateField');
const cancelDateBtn = document.getElementById('cancelDateInput');

// Always open the modal when Download PDF is clicked
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', () => {
    dateModal.classList.remove('hidden');
    dateModal.classList.add('flex');
  });
}
// Add date field
addDateBtn.addEventListener('click', () => {
  const idx = dateFields.children.length;
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-center gap-2';
  const label = document.createElement('label');
  label.className = 'block font-medium text-gray-700';
  label.textContent = `Date ${idx + 1}:`;
  label.setAttribute('for', `dateField${idx}`);
  const input = document.createElement('input');
  input.type = 'date';
  input.id = `dateField${idx}`;
  input.className = 'flex-1 px-3 py-2 border rounded date-input';
  input.required = true;
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  dateFields.appendChild(wrapper);
});
// Remove date field
removeDateBtn.addEventListener('click', () => {
  if (dateFields.children.length > 1) {
    dateFields.removeChild(dateFields.lastElementChild);
  }
});
// Cancel modal
cancelDateBtn.addEventListener('click', () => {
  dateModal.classList.add('hidden');
  dateModal.classList.remove('flex');
});
// Format date as 'Month DD, YYYY'
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
}
// Handle form submit
dateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dates = Array.from(dateFields.querySelectorAll('input')).map(input => formatDate(input.value)).filter(Boolean);
  dateModal.classList.add('hidden');
  dateModal.classList.remove('flex');
  const pdfRows = itemsData.map(item => {
    const base = [
      item["Item ID"],
      item["Name"],
      item["Location"],
      item["Brand"],
      // item["Quantity"],
      item["Remarks"] || ''
    ];
    if (dates && dates.length > 0) {
      dates.forEach(() => base.push(item["Quantity"]));
    }
    return base;
  });
  const columns = [
    { header: 'ITEM ID', dataKey: 'id' },
    { header: 'NAME', dataKey: 'name' },
    { header: 'LOCATION', dataKey: 'location' },
    { header: 'BRAND', dataKey: 'brand' },
    // { header: 'QUANTITY', dataKey: 'qty' },
    // { header: 'REMARKS', dataKey: 'remarks' }
  ];
  await generateInventoryPdfReport({
    title: 'LABORATORY ITEMS',
    columns,
    filename: 'items_inventory_report.pdf',
    dateColumns: dates,
    data: pdfRows
  });
});

