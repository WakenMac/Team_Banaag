/**
 * CARES - Centralized Resource and Equipment System
 * Chemicals Management JS
 * ----------------------------------------------------------
 * This script controls the add, edit, delete, and remarks features for the Chemicals table.
 * This is already connected to the database.
 *
 * Features:
 * - Add new chemicals using a form and modal
 * - Edit existing chemicals by clicking the edit button
 * - Delete chemicals with confirmation modal
 * - Add/view remarks for chemicals
 * - Info button to show extra info when hovering over the info button
 * - Show a toast notification for all actions (add, edit, delete, remarks, errors)
 * - All user feedback is shown as a toast at the bottom right (no more alert popups)
 */
import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Initialize Compoenents
const addChemicalLocation = document.getElementById("chemicalLocation");
const addChemicalUnit = document.getElementById("chemicalUnit");

const editChemicalLocation = document.getElementById("editChemicalLocation");
const editChemicalUnit = document.getElementById("editChemicalUnit");
const chemicalsTableBody = document.getElementById("chemicalsTableBody");

let chemicalRowToDelete = null;
let initialQuantity = 0; // Variable used to change the initial quantity of Chemical records (For updates)

await initialize();

async function initialize() {
  cancelEditBtn.addEventListener("click", closeEditModal);
  modalBackdropEditChemical.addEventListener("click", closeEditModal);

  // Initialize dropdown menus
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  // Test chemical label
  createNewChemicalRow(
    -1,
    "Corola",
    "Box(es)",
    "General Santos",
    "Toyota",
    "30",
    "1000",
    "1000"
  );

  // Test q hehe - dave
  createNewChemicalRow(
    0,
    "ChemName",
    "ChemUnit",
    "General Santos",
    "Well",
    "49",
    "5000",
    "N/A",
    "N/A",
    "N/A"
  );

  await dbhandler.testPresence();
  await prepareChemicalsTable();

  await prepareUnitTypeDropdown();
  await prepareLocationDropdown();
}

//=======================================================================================================================================
// FRONT END-RELATED METHODS (LOGIC &  REACTIVITY)

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

// ===================== Add Chemical Modal Logic =====================

// Add Chemicals Functionality
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
addChemicalsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // const chemicalId = addChemicalsForm.chemicalId.value.trim();
  const chemicalName = addChemicalsForm.chemicalName.value.trim();
  const chemicalUnit = addChemicalsForm.chemicalUnit.value.trim();
  const chemicalLocation = addChemicalsForm.chemicalLocation.value.trim();
  const chemicalBrand = addChemicalsForm.chemicalBrand.value.trim();
  const chemicalContainerSize =
    addChemicalsForm.chemicalContainerSize.value.trim();
  const chemicalCASNo = addChemicalsForm.chemicalCASNo.value.trim();
  const chemicalMSDS = addChemicalsForm.chemicalMSDS.value.trim();
  const chemicalBarCode = addChemicalsForm.chemicalBarCode.value.trim();

  // Conditions that are commented are to be removed~
  // Hindi ko lang muna tinanggal just in case may changes na gagawin - Waks
  if (
    !chemicalName ||
    !chemicalUnit ||
    !chemicalLocation ||
    !chemicalBrand ||
    !chemicalContainerSize
  ) {
    showToast("Please fill in all required fields.", true, 4000);
    return;
  }

  let result = await dbhandler.addChemicalsRecord(
    chemicalName,
    chemicalLocation,
    chemicalUnit,
    chemicalBrand,
    chemicalContainerSize,
    chemicalBarCode,
    chemicalCASNo,
    chemicalMSDS
  );

  if (result == null) {
    showToast(
      `The mainHandler.addChemicalsRecord() DOESN'T return a status statement.`,
      true, 
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    console.log(result);
    let newItemId = result.slice(46, result.length - 1);
    createNewChemicalRow(
      newItemId,
      chemicalName,
      chemicalUnit,
      chemicalLocation,
      chemicalBrand,
      "0 " + chemicalUnit,
      chemicalContainerSize + " " + chemicalUnit,
      "0 " + chemicalUnit,
      chemicalCASNo,
      chemicalMSDS,
      chemicalBarCode
    );
    closeAddModal();
    showToast("Chemical added successfully", false, 3000);
  }
});



// ===================== Edit Chemical Modal Logic =====================

// Edit Chemicals Functionality
const editChemicalModal = document.getElementById("editChemicalModal");
const editChemicalForm = document.getElementById("editChemicalForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const modalBackdropEditChemical = document.getElementById(
  "modalBackdropEditChemical"
);

/**
 * Opens the edit modal and populates it with chemical data
 * @param {HTMLElement} row - The table row containing chemical data
 */
function openEditModal() {
  editChemicalModal.classList.remove("hidden");
  editChemicalModal.classList.add("flex");
}

/** Closes the edit modal and resets the form */
function closeEditModal() {
  editChemicalModal.classList.add("hidden");
  editChemicalModal.classList.remove("flex");
  editChemicalForm.reset();
}

/**
 * Populates the edit form with data from the selected chemical
 * @param {HTMLElement} row - The table row containing chemical data
 */

function populateEditForm(row) {
  const cells = row.children;
  console.log("Row cells:", cells);

  /** SLIGHTTT DOCUMENTATION FOR fieldMap:
   * Maps table cell values to corresponding input fields in the edit modal.
   *
   * The `fieldMap` array defines which table column (by index) should populate which
   * input field (by its DOM id) in the edit modal. This allows for a concise and
   * maintainable way to assign values from a table row to the modal's form fields.
   *
   * For each mapping:
   *   - `id`: The id of the input element in the edit modal.
   *   - `idx`: The index of the cell in the table row whose value should be assigned.
   *
   * The loop iterates over each mapping, finds the input element and the corresponding
   * table cell, and assigns the cell's text content to the input's value.
   * If an input or cell is missing, it logs an error for easier debugging.
   *
   * Example:
   *   If the table row is:
   *     <tr>
   *       <td>CHEM001</td>   // idx: 0
   *       <td>Acetone</td>   // idx: 1
   *       <td>Litre</td>     // idx: 2
   *       ...
   *     </tr>
   *   Then:
   *     document.getElementById('editChemicalId').value = cells[0].textContent;
   *     document.getElementById('editChemicalName').value = cells[1].textContent;
   *     ...
   *
   * NOTE: Walay 5, since I removed the input field to edit the Chemical Quantity in the edit modal
   */

  const fieldMap = [
    { id: "editChemicalId", idx: 0 },
    { id: "editChemicalName", idx: 1 },
    { id: "editChemicalUnit", idx: 2 },
    { id: "editChemicalLocation", idx: 3 },
    { id: "editChemicalBrand", idx: 4 },
    { id: "editChemicalContainerSize", idx: 6 },
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

    if (idx == 6)
      el.value = cells[idx].textContent.replace(
        " " + cells[2].textContent.trim(),
        ""
      );
    else el.value = cells[idx].textContent;
  }

  initialQuantity = cells[5].textContent.replace(
    " " + cells[2].textContent.trim(),
    ""
  );

  const infoBtn = row.querySelector('button[aria-label="Info"]');
  let cas = "",
    msd = "",
    barcode = "";
  if (infoBtn) {
    cas = infoBtn.getAttribute("data-cas") || "";
    msd = infoBtn.getAttribute("data-msd") || "";
    barcode = infoBtn.getAttribute("data-barcode") || "";
  }

  const casField = document.getElementById("editChemicalCASNo");
  const msdsField = document.getElementById("editChemicalMSDS");
  const barcodeField = document.getElementById("editChemicalBarCode");
  if (!casField) console.error("editChemicalCASNo input not found!");
  if (!msdsField) console.error("editChemicalMSDS input not found!");
  if (!barcodeField) console.error("editChemicalBarCode input not found!");
  if (casField) casField.value = cas;
  if (msdsField) msdsField.value = msd;
  if (barcodeField) barcodeField.value = barcode;
  openEditModal();
}

// TODO: Implement the edit portion for the database

// Handle Edit Form Submission
editChemicalForm.addEventListener("submit", async (e) => {
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
  const editChemicalContainerSize = document
    .getElementById("editChemicalContainerSize")
    .value.trim();
  const editChemicalCASNo = document
    .getElementById("editChemicalCASNo")
    .value.trim();
  const editChemicalMSDS = document
    .getElementById("editChemicalMSDS")
    .value.trim();
  const editChemicalBarCode = document
    .getElementById("editChemicalBarCode")
    .value.trim();
  const remarks = document
    .querySelector(`button[data-chemical-id="${editChemicalId}"]`)
    .getAttribute("data-remarks");

  let result = await dbhandler.updateChemicalsRecordByAll(
    editChemicalId,
    editChemicalName,
    editChemicalLocation,
    editChemicalUnit,
    editChemicalBrand,
    editChemicalContainerSize,
    editChemicalBarCode,
    editChemicalCASNo,
    editChemicalMSDS,
    remarks
  );

  if (result == null)
    showToast(
      `The mainHandler.updateChemicalsRecordByAll() DOESN'T return a status statement.`,
      true, 
      4000
    );
  else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    updateChemicalTable(
      editChemicalId,
      editChemicalName,
      editChemicalUnit,
      editChemicalLocation,
      editChemicalBrand,
      initialQuantity,
      editChemicalCASNo,
      editChemicalMSDS,
      editChemicalBarCode
    );
    console.log(result);
    closeEditModal();
    showToast("Chemical updated successfully", false, 3000);
  }
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

// ===================== Delete Chemicals Modal Logic =====================

// Delete Chemical Functionality
const deleteChemicalModal = document.getElementById("deleteChemicalModal");
const modalBackdropDeleteChemical = document.getElementById(
  "modalBackdropDeleteChemical"
);
const cancelDeleteChemicalBtn = document.getElementById(
  "cancelDeleteChemicalBtn"
);
const confirmDeleteChemicalBtn = document.getElementById(
  "confirmDeleteChemicalBtn"
);


chemicalsTableBody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete chemical"
  ) {
    const row = e.target.closest("tr");
    openDeleteChemicalModal(row);
  }
});

function openDeleteChemicalModal(row) {
  chemicalRowToDelete = row;
  deleteChemicalModal.classList.remove("hidden");
  deleteChemicalModal.classList.add("flex");
}

function closeDeleteChemicalModal() {
  deleteChemicalModal.classList.add("hidden");
  deleteChemicalModal.classList.remove("flex");
  chemicalRowToDelete = null;
}

// Delete confirm
confirmDeleteChemicalBtn.addEventListener("click", async () => {
  if (chemicalRowToDelete) {
    const chemicalId = chemicalRowToDelete.children[0].textContent;

    let result = await dbhandler.deleteChemicalsRecordByItemId(chemicalId);
    if (result && result.includes("ERROR")) {
      showToast(result, true, 4000);
      return;
    }
    console.log(result);
    chemicalRowToDelete.remove();
    closeDeleteChemicalModal();
    showToast("Chemical deleted successfully", false, 3000);
  }
});

// Add event listeners for closing the delete modal
cancelDeleteChemicalBtn.addEventListener("click", closeDeleteChemicalModal);
modalBackdropDeleteChemical.addEventListener("click", closeDeleteChemicalModal);

// ===================== Set Tooltip Functionality Logic =====================

/**
 * Tooltip Functionality for Info buttons
 * Displays additional chemical information when hovering over the info button
 * Shows CAS No., MSDS, and Barcode information
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

  const tooltip = document.createElement("div"); // div ang butngan sa information
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


// ===================== Update Remarks Modal Logic =====================

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

/** Closes the remarks modal and resets the form */
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
remarksForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const chemicalId = document.getElementById("remarksChemicalId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${chemicalId}"]`
  );

  // Updates the remarks in the database
  let result = await dbhandler.updateChemicalRemarkByItemId(
    chemicalId,
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
  showToast("Remarks updated successfully", false, 3000);
});

// ===================== Front-End Related Logic =====================

// TODO: Add documentation
async function createNewChemicalRow(
  chemicalId,
  chemicalName,
  chemicalUnit,
  chemicalLocation,
  chemicalBrand,
  chemicalInitialQuantity,
  chemicalContainerSize,
  chemicalRemainingQuantity,
  chemicalCASNo = "N/A",
  chemicalMSDS = "N/A",
  chemicalBarCode = "N/A"
) {
  // Create new row
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalInitialQuantity}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalContainerSize}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${chemicalRemainingQuantity}</td>
    <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
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
}

/**
 * Method to add a new unit to the addChemicalUnit and editChemicalUnit dropdown element
 * @param {string} unitTypeName Name of the unit type to be added
 */
function createNewUnitTypeRow(unitTypeName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");
  tr1.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  tr2.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  addChemicalUnit.appendChild(tr1);
  editChemicalUnit.appendChild(tr2);
}

/**
 * Method to add a new unit to the addChemicalLocation and editChemicalLocation dropdown element
 * @param {string} locationName Name of the location to be added to the dropdown
 */
function createNewLocationRow(locationName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");

  tr1.innerHTML = `<option value="${locationName}">${locationName}</option>`;
  tr2.innerHTML = `<option value="${locationName}">${locationName}</option>`;

  addChemicalLocation.appendChild(tr1);
  editChemicalLocation.appendChild(tr2);
}

/**
 * Method to add an existing remarks to the remarksText element
 * @param {string} remarks The remarks of the chemical
 * @param {int} chemicalId The primary key of the Chemical table.
 */
async function createNewRemarks(remarks, chemicalId) {
  document.getElementById("remarksText").value = remarks;

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
}


function updateChemicalTable(
  editChemicalId,
  editChemicalName,
  editChemicalUnit,
  editChemicalLocation,
  editChemicalBrand,
  editChemicalQuantity,
  editChemicalCASNo,
  editChemicalMSDS,
  editChemicalBarCode
) {
  const rows = chemicalsTableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    if (row.children[0].textContent === editChemicalId) {
      let originalUnit = row.children[2].textContent;

      row.children[1].textContent = editChemicalName;
      row.children[2].textContent = editChemicalUnit;
      row.children[3].textContent = editChemicalLocation;
      row.children[4].textContent = editChemicalBrand;
      row.children[5].textContent =
        editChemicalQuantity + " " + editChemicalUnit;
      row.children[6].textContent =
        row.children[6].textContent.replace(" " + originalUnit, "") +
        " " +
        editChemicalUnit;
      row.children[7].textContent =
        row.children[7].textContent.replace(" " + originalUnit, "") +
        " " +
        editChemicalUnit;
      const infoBtn = row.querySelector('button[aria-label="Info"]');
      if (infoBtn) {
        infoBtn.setAttribute("data-cas", editChemicalCASNo);
        infoBtn.setAttribute("data-msd", editChemicalMSDS);
        infoBtn.setAttribute("data-barcode", editChemicalBarCode);
      }
    }
  });
}

// ===================== Database Related Logic =====================

/**
 * Gets all of the chemical records from the database then proceeds to populate them to the table
 * @void Returns nothing.
 */
async function prepareChemicalsTable() {
  try {
    let data = await dbhandler.getAllChemicalRecords();

    console.log('Number of records: ', data.length);

    if (data.length == 0) {
      console.error("Chemical table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      await createNewChemicalRow(
        data[i]["Item ID"],
        data[i]["Name"],
        data[i]["Unit"],
        data[i]["Location"],
        data[i]["Brand"],
        data[i]["Initial Qty."],
        data[i]["Container Size"],
        data[i]["Remaining Qty."],
        data[i]["CAS No"] || "N/A",
        data[i]["MSDS"] || "N/A",
        data[i]["Barcode"] || "N/A"
      );

      await createNewRemarks(data[i]["Remarks"], data[i]["Item ID"]);
    }
  } catch (generalError) {
    console.error(generalError);
  }
}

/**
 * Gets all of the unit type records from the database then proceeds to populate them (using the unit_type_name)
 *  to the addChemicalUnit html dropdown element
 * @void Returns nothing.
 */
async function prepareUnitTypeDropdown() {
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
 *  to the addChemicalLocation html dropdown element
 * @void Returns nothing.
 */
async function prepareLocationDropdown() {
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

// ===================== Set Toast Notification Logic =====================

// --- Toast Notification ---
// Shows a small message at the bottom right when something is added, edited, deleted, or an error occurs
function showToast(message, isError = false, time = 1800) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "32px";
    toast.style.right = "32px";
    toast.style.background = isError
      ? "rgba(220, 38, 38, 0.95)"
      : "rgba(44, 161, 74, 0.95)"; // Red for error, green for success
    toast.style.color = "white";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "16px";
    toast.style.fontWeight = "bold";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    toast.style.zIndex = "9999";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = isError
    ? "rgba(220, 38, 38, 0.95)"
    : "rgba(44, 161, 74, 0.95)";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, time);
}
