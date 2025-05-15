/*
 * Equipment Management System
 * Organized by: Adding, Editing, Deleting, Remarks, and Utilities
 * Gipaclean nako ug AI ang code :D hAHAHAHHAHA kay maski ako di na kasabot sakong gibuhat
 * I also set temporary values for the equipmentId and equipmentQuantity for testing purposes
 */

import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Global Variables and Element References
let tbody = null;
let equipmentRowToDelete = null;
let equipmentRowToEdit = null;

// DOM Elements
const editEquipmentLocation = document.getElementById("editEquipmentLocation");
const editEquipmentUnit = document.getElementById("editEquipmentUnit");
const modalBackdropEditEquipment = document.getElementById(
  "modalBackdropEditEquipment"
);

// Add Equipment Elements
const addEquipmentBtn = document.getElementById("addEquipmentBtn");
const addEquipmentModal = document.getElementById("addEquipmentModal");
const addEquipmentForm = document.getElementById("addEquipmentForm");
const cancelBtn = document.getElementById("cancelEquipmentBtn");
const modalBackdropAddEquipment = document.getElementById(
  "modalBackdropAddEquipment"
);
const addEquipmentLocation = document.getElementById("equipmentLocation");
const addEquipmentUnit = document.getElementById("equipmentUnit");

// Edit Equipment Elements
const editEquipmentModal = document.getElementById("editEquipmentModal");
const editEquipmentForm = document.getElementById("editEquipmentForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
let equipmentQuantity = 0;

// Delete Equipment Elements
const deleteEquipmentModal = document.getElementById("deleteEquipmentModal");
const modalBackdropDeleteEquipment = document.getElementById(
  "modalBackdropDeleteEquipment"
);
const cancelDeleteEquipmentBtn = document.getElementById(
  "cancelDeleteEquipmentBtn"
);
const confirmDeleteEquipmentBtn = document.getElementById(
  "confirmDeleteEquipmentBtn"
);

// Remarks Elements
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

const cancelEquipmentBtn = document.getElementById("cancelEquipmentBtn");

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
  addEquipmentUnit.appendChild(tr1);
  editEquipmentUnit.appendChild(tr2);
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

  addEquipmentLocation.appendChild(tr1);
  editEquipmentLocation.appendChild(tr2);
}

// -------------------- ADD EQUIPMENT FUNCTIONS --------------------
// Adding: Open and close modal
function openEquipmentModal() {
  addEquipmentModal.classList.remove("hidden");
  addEquipmentModal.classList.add("flex");
}

function closeEquipmentModal() {
  addEquipmentModal.classList.add("hidden");
  addEquipmentModal.classList.remove("flex");
  addEquipmentForm.reset();
}

function createNewEquipmentRow(
  equipmentId,
  equipmentName,
  equipmentUnit,
  equipmentLocation,
  equipmentBrand,
  equipmentQuantity,
  equipmentSerialNumber = "",
  equipmentCalibrationDate = "",
  equipmentFreqOfCalibration = ""
) {
  if (!tbody) {
    showToast("Could not create new row. Table body not found.", true);
    return;
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentQuantity} ${equipmentUnit}</td>
    <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
      <button 
        aria-label="Info" 
        class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100"
        data-csn="${equipmentSerialNumber || "N/A"}"
        data-cbd="${equipmentCalibrationDate || "N/A"}"
        data-fcb="${equipmentFreqOfCalibration || "N/A"}"
      >            
        <i class="fas fa-info text-[14px]"></i>
      </button>
      <button 
        aria-label="Add remarks" 
        class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" 
        data-equipment-id="${equipmentId}"
      >
        <i class="fas fa-comment-alt text-[14px]"></i>
      </button>
      <button aria-label="Edit equipment" class="text-yellow-400 hover:text-yellow-500">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button aria-label="Delete equipment" class="text-red-600 hover:text-red-700">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}
// --------------------- END OF ADDING FUNCTIONS --------------------

// -------------------- EDIT EQUIPMENT FUNCTIONS --------------------
function openEditModal() {
  editEquipmentModal.classList.remove("hidden");
  editEquipmentModal.classList.add("flex");
}

function closeEditModal() {
  editEquipmentModal.classList.add("hidden");
  editEquipmentModal.classList.remove("flex");
  editEquipmentForm.reset();
}

function populateEditForm(row) {
  const cells = row.children;
  const fieldMap = [
    { id: "editEquipmentId", idx: 0 },
    { id: "editEquipmentName", idx: 1 },
    { id: "editEquipmentUnit", idx: 2 },
    { id: "editEquipmentLocation", idx: 3 },
    { id: "editEquipmentBrand", idx: 4 },
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

  // Store initial quantity (read-only)
  const equipmentQuantity = cells[5].textContent.trim();

  // Get additional information from Info button
  const infoBtn = row.querySelector('button[aria-label="Info"]');
  if (infoBtn) {
    const equipmentSerialNumber = infoBtn.getAttribute("data-csn") || "";
    const equipmentCalibrationDate = infoBtn.getAttribute("data-cbd") || "";
    const equipmentFreqOfCalibration = infoBtn.getAttribute("data-fcb") || "";

    // Populate info fields in correct order
    document.getElementById("editEquipmentSerialNumber").value =
      equipmentSerialNumber;
    document.getElementById("editEquipmentCalibrationDate").value =
      equipmentCalibrationDate;
    document.getElementById("editEquipmentFreqOfCalibration").value =
      equipmentFreqOfCalibration;
  }

  // Get remarks if any
  const remarksBtn = row.querySelector('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    populateRemarksField(remarksBtn);
  }

  // Store row index for updating
  editEquipmentForm.dataset.editingRow = Array.from(tbody.children).indexOf(
    row
  );

  // Open modal after populating
  openEditModal();
}

function populateRemarksField(remarksBtn) {
  const remarks = remarksBtn.getAttribute("data-remarks") || "";
  const remarksField = document.getElementById("editEquipmentRemarks");
  if (remarksField) {
    remarksField.value = remarks;
  }
}

function updateEquipmentTable(
  equipmentName,
  equipmentUnit,
  equipmentLocation,
  equipmentBrand,
  equipmentSerialNumber,
  equipmentCalibrationDate,
  equipmentFreqOfCalibration
) {
  const cells = equipmentRowToEdit.children;
  const originalUnit = cells[2].textContent;

  cells[1].textContent = equipmentName;
  cells[2].textContent = equipmentUnit;
  cells[3].textContent = equipmentLocation;
  cells[4].textContent = equipmentBrand;
  cells[5].textContent =
    cells[5].textContent.replace(" " + originalUnit, "") + " " + equipmentUnit;

  // Update the info button data attributes
  const infoBtn = equipmentRowToEdit.querySelector('button[aria-label="Info"]');
  if (infoBtn) {
    infoBtn.setAttribute("data-csn", equipmentSerialNumber || "N/A");
    infoBtn.setAttribute("data-cbd", equipmentCalibrationDate || "N/A");
    infoBtn.setAttribute("data-fcb", equipmentFreqOfCalibration || "N/A");
  }
}
// -------------------- END OF EDITING FUNCTIONS --------------------Í

// -------------------- DELETE EQUIPMENT FUNCTIONS --------------------
function openDeleteModal(row) {
  equipmentRowToDelete = row;
  deleteEquipmentModal.classList.remove("hidden");
  deleteEquipmentModal.classList.add("flex");
}

function closeDeleteModal() {
  deleteEquipmentModal.classList.add("hidden");
  deleteEquipmentModal.classList.remove("flex");
  equipmentRowToDelete = null;
}

// -------------------- END OF DELETE FUNCTIONS --------------------

// -------------------- REMARKS FUNCTIONS --------------------

function openRemarksModal(equipmentId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksEquipmentId").value = equipmentId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-equipment-id="${equipmentId}"]`
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

/**
 * Method to add an existing remarks to the remarksText element
 * @param {string} remarks The remarks of the chemical
 * @param {int} apparatusId The primary key of the Chemical table.
 */
async function createNewRemarks(remarks, equipmentId) {
  document.getElementById("remarksText").value = remarks;

  const remarksBtn = document.querySelector(
    `button[data-equipment-id="${equipmentId}"]`
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

// Close remarks modal
cancelRemarksBtn.addEventListener("click", closeRemarksModal);
modalBackdropRemarks.addEventListener("click", closeRemarksModal);

async function handleRemarksEquipmentSubmit(e) {
  e.preventDefault();
  const equipmentId = document.getElementById("remarksEquipmentId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-equipment-id="${equipmentId}"][aria-label="Add remarks"]`
  );

  let result = await dbhandler.updateLabEquipmentsRemarkByItemId(
    equipmentId,
    remarks
  );

  if (result && result.includes("ERROR")) {
    showToast(result, true, 4000);
    return;
  }

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
  showToast("Remarks updated successfully");
}

// Initialize remarks event listeners
async function initializeRemarksListeners() {
  tbody.addEventListener("click", (e) => {
    const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
    if (remarksBtn) {
      const equipmentId = remarksBtn.getAttribute("data-equipment-id");
      console.log(equipmentId);
      openRemarksModal(equipmentId);
    }
  });

  if (remarksForm) {
    remarksForm.addEventListener("submit", handleRemarksEquipmentSubmit);
  }

  if (cancelRemarksBtn) {
    cancelRemarksBtn.addEventListener("click", closeRemarksModal);
  }

  if (modalBackdropRemarks) {
    modalBackdropRemarks.addEventListener("click", closeRemarksModal);
  }
}

// -------------------- UTILITY FUNCTIONS --------------------
function showToast(message, isError = false) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = createToastElement();
  }
  updateToast(toast, message, isError);
}

function createToastElement() {
  const toast = document.createElement("div");
  toast.id = "custom-toast";
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    padding: "16px 28px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    opacity: "0",
    transition: "opacity 0.4s",
    zIndex: "9999",
  });
  document.body.appendChild(toast);
  return toast;
}

function updateToast(toast, message, isError) {
  const time = isError ? 4000 : 3000;
  toast.textContent = message;
  toast.style.background = isError
    ? "rgba(220, 38, 38, 0.95)"
    : "rgba(44, 161, 74, 0.95)";
  toast.style.color = "white";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, time);
}

// -------------------- EVENT LISTENERS --------------------
document.addEventListener("DOMContentLoaded", () => {
  tbody = document.getElementById("equipmentsTableBody");

  setUpDropdownElements();
  if (!initializeEquipments()) {
    showToast("Could not initialize equipment table", true);
    return;
  }

  // Initializes Components that rely on the database's data
  initializeLabEquipmentsTable(); // Gets all of the content for the table, including remarks and others
  initializeUnitTypeDropdown();
  initializeLocationDropdown();
  initializeRemarksListeners();

  initializeEventListeners(tbody);
  setupEventListeners();

  showToast("Loaded page successfully!");
});

function setupEventListeners() {
  // Add Equipment
  addEquipmentBtn.addEventListener("click", openEquipmentModal);
  cancelBtn.addEventListener("click", closeEquipmentModal);
  modalBackdropAddEquipment.addEventListener("click", closeEquipmentModal);

  // Edit Equipment
  modalBackdropEditEquipment.addEventListener("click", closeEditModal);
  cancelEditBtn.addEventListener("click", closeEditModal);

  // Delete Equipment
  modalBackdropDeleteEquipment.addEventListener("click", closeDeleteModal);
  cancelDeleteEquipmentBtn.addEventListener("click", closeDeleteModal);

  // Add Equipment Form Submit
  addEquipmentForm.addEventListener("submit", handleAddEquipmentSubmit);

  // Edit Equipment Form Submit
  editEquipmentForm.addEventListener("submit", handleEditEquipmentSubmit);

  // Delete Equipment Confirmation
  confirmDeleteEquipmentBtn.addEventListener("click", handleDeleteEquipment);
}

// form handlers
// ADD EQUIPMENTS
async function handleAddEquipmentSubmit(e) {
  e.preventDefault();
  // Generate temporary values
  const equipmentId = Math.floor(Math.random() * 1000000).toString();
  const equipmentQuantity = Math.floor(Math.random() * 100).toString();

  // Get form values
  const equipmentName = addEquipmentForm.equipmentName.value.trim();
  const equipmentUnit = addEquipmentForm.equipmentUnit.value.trim();
  const equipmentLocation = addEquipmentForm.equipmentLocation.value.trim();
  const equipmentBrand = addEquipmentForm.equipmentBrand.value.trim();
  const equipmentSerialNumber =
    addEquipmentForm.equipmentSerialNumber.value.trim() || "";
  const equipmentCalibrationDate =
    addEquipmentForm.equipmentCalibrationDate.value.trim() || "";
  const equipmentFreqOfCalibration =
    addEquipmentForm.equipmentFreqOfCalibration.value.trim() || "";

  // Validation
  if (
    !equipmentName ||
    !equipmentUnit ||
    !equipmentLocation ||
    !equipmentBrand ||
    !equipmentSerialNumber
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  let result = await dbhandler.addLabEquipmentsRecord(
    equipmentName,
    equipmentLocation,
    equipmentUnit,
    equipmentBrand,
    equipmentSerialNumber,
    equipmentCalibrationDate,
    equipmentFreqOfCalibration,
    ""
  );

  if (result == null) {
    showToast(
      `The mainHandler.addLabApparatusRecord() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    let equipmentId = result.slice(52, result.length - 1);

    // For debugging purposes
    console.log(result);
    console.log(result.slice(52, result.length - 1));

    createNewEquipmentRow(
      equipmentId,
      equipmentName,
      equipmentUnit,
      equipmentLocation,
      equipmentBrand,
      0,
      equipmentSerialNumber,
      equipmentCalibrationDate,
      equipmentFreqOfCalibration
    );

    // Close modal and show success message
    closeEquipmentModal();
    showToast("Glassware added successfully", false, 3000);
  }
}

// EDIT EQUIPMENTS
async function handleEditEquipmentSubmit(e) {
  e.preventDefault();
  // Get form values
  const editEquipmentId = document
    .getElementById("editEquipmentId")
    .value.trim();
  const editEquipmentName = document
    .getElementById("editEquipmentName")
    .value.trim();
  const editEquipmentUnit = document
    .getElementById("editEquipmentUnit")
    .value.trim();
  const editEquipmentLocation = document
    .getElementById("editEquipmentLocation")
    .value.trim();
  const editEquipmentBrand = document
    .getElementById("editEquipmentBrand")
    .value.trim();
  const editEquipmentSerialNumber =
    document.getElementById("editEquipmentSerialNumber").value.trim() || "";
  const editEquipmentCalibrationDate =
    document.getElementById("editEquipmentCalibrationDate").value.trim() || "";
  const editEquipmentFreqOfCalibration =
    document.getElementById("editEquipmentFreqOfCalibration").value.trim() ||
    "";
  const remarks = document
    .querySelector(`button[data-equipment-id="${editEquipmentId}"]`)
    .getAttribute("data-remarks");

  // Validation
  if (
    !editEquipmentId ||
    !editEquipmentName ||
    !editEquipmentUnit ||
    !editEquipmentLocation ||
    !editEquipmentBrand ||
    !editEquipmentSerialNumber
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  let result = await dbhandler.updateLabEquipmentsRecordByAll(
    editEquipmentId,
    editEquipmentName,
    editEquipmentLocation,
    editEquipmentUnit,
    editEquipmentBrand,
    editEquipmentSerialNumber,
    editEquipmentCalibrationDate,
    editEquipmentFreqOfCalibration,
    remarks
  );

  if (result == null) {
    showToast(
      `The mainHandler.updateLabEquipmentsRecordByAll() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true);
  } else {
    // Update the table row
    updateEquipmentTable(
      editEquipmentName,
      editEquipmentUnit,
      editEquipmentLocation,
      editEquipmentBrand,
      editEquipmentSerialNumber,
      editEquipmentCalibrationDate,
      editEquipmentFreqOfCalibration
    );

    closeEditModal();
    showToast("Equipment updated successfully");
  }
}

// DELETE EQUIPMENTS
async function handleDeleteEquipment() {
  if (equipmentRowToDelete) {
    let result = await dbhandler.deleteLabEquipmentsRecordByItemId(
      equipmentRowToDelete.children[0].textContent
    );
    if (result && result.includes("ERROR")) {
      showToast(result, true, 4000);
      return;
    }

    equipmentRowToDelete.remove();
    closeDeleteModal();
    showToast("Equipment deleted successfully");
  }
}

function initializeEquipments() {
  if (!tbody) {
    console.error("Could not find table body with ID 'equipmentsTableBody'");
    return false;
  }
  return true;
}

function initializeEventListeners(tbody) {
  tbody.addEventListener("click", handleTableButtonClicks);
}

// Function that indicates the action of the tbody event listener under the initializeEventListeners() function
function handleTableButtonClicks(e) {
  const button = e.target.closest("button");
  if (!button) return;

  const row = e.target.closest("tr");
  if (!row) return;

  const action = button.getAttribute("aria-label");

  switch (action) {
    case "Edit equipment":
      equipmentRowToEdit = row;
      populateEditForm(row);
      openEditModal();
      break;
    case "Delete equipment":
      openDeleteModal(row);
      break;
    case "Info":
      initializeInfoHovers();
      break;
    case "Add remarks":
      const equipmentId = button.getAttribute("data-equipment-id");
      if (equipmentId) {
        openRemarksModal(equipmentId);
      }
      break;
  }
}

function setUpDropdownElements() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");
}

// -------------------- END OF UTILITY FUNCTIONS --------------------

// -------------------- INFO BUTTON LOGIC --------------------
function initializeInfoHovers() {
  tbody.addEventListener("mouseover", (e) => {
    const infoBtn = e.target.closest('button[aria-label="Info"]');
    if (!infoBtn) return;

    // Remove existing tooltip if any
    document.querySelectorAll(".tooltip").forEach((tooltip) => {
      tooltip.remove();
    });

    // Get info data from button attributes
    const equipmentSerialNumber = infoBtn.getAttribute("data-csn") || "N/A";
    const equipmentCalibrationDate = infoBtn.getAttribute("data-cbd") || "N/A";
    const equipmentFreqOfCalibration =
      infoBtn.getAttribute("data-fcb") || "N/A";

    // Create tooltip
    const tooltipContent = `
      <div class="p-2">
        <p class="text-xs font-bold">Equipment Information</p>
        <p class="text-xs">Compressed Serial No.: ${equipmentSerialNumber}</p>
        <p class="text-xs">Calibration Date: ${equipmentCalibrationDate}</p>
        <p class="text-xs">Frequency of Calibration: ${equipmentFreqOfCalibration}</p>    
      </div>
      `;

    const tooltip = document.createElement("div");
    tooltip.className =
      "custom-tooltip absolute z-50 bg-gray-800 text-white text-xs rounded shadow-lg";
    tooltip.style.position = "absolute";
    tooltip.style.pointerEvents = "none";
    tooltip.innerHTML = tooltipContent;

    document.body.appendChild(tooltip);

    const btnRect = infoBtn.getBoundingClientRect();
    tooltip.style.left = `${
      btnRect.left +
      window.scrollX +
      btnRect.width / 2 -
      tooltip.offsetWidth / 2
    }px`;
    tooltip.style.top = `${btnRect.bottom + window.scrollY + 8}px`;

    // Remove tooltip on mouseout
    const handleMouseout = () => {
      tooltip.remove();
      infoBtn.removeEventListener("mouseout", handleMouseout);
    };
    infoBtn.addEventListener("mouseout", handleMouseout);
  });
}

// -------------------- END OF INFO BUTTON LOGIC --------------------

// -------------------- DROPDOWN LOGIC (Navigation bar) --------------------
// Dropdown logic
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
function searchEquipment() {
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
    const showRow =
      !searchValue ||
      itemName.includes(searchValue) ||
      itemBrand.includes(searchValue);
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
          <p class="text-gray-500 text-lg font-medium">No equipment found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
    `;
    tbody.appendChild(noResultRow);
  }
}
// Add event listener to the search input
// const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchEquipment);
// END OF SEARCH BAR METHODS

// -------------------- DATABASE CONNECTION LOGIC (Database Handler) --------------------

async function initializeLabEquipmentsTable() {
  try {
    let data = await dbhandler.getAllLabEquipmentsRecords();

    if (data.length == 0) {
      console.error("Lab Equipments table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      await createNewEquipmentRow(
        data[i]["Item ID"],
        data[i]["Name"],
        data[i]["Unit"],
        data[i]["Location"],
        data[i]["Brand"],
        data[i]["Quantity"],
        data[i]["Serial No"],
        data[i]["Calibration Date"],
        data[i]["Frequency of Calibration"]
      );

      await createNewRemarks(data[i]["Remarks"], data[i]["Item ID"]);
    }
  } catch (generalError) {
    console.error(generalError);
  }
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
