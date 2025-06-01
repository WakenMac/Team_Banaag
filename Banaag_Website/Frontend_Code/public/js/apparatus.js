// ----------------------------------------------------------
// Apparatus Management JS
// ----------------------------------------------------------
// This script controls the add, edit, and delete features for the Apparatus table.
// //** ADD ADDITIONAL DOCUMENTATION HERE WHEN DATABASE IS CONNECTED HEHE @WAKS -Dave */
//
// Main Features:
// - Add new apparatus using a form and modal
// - Edit existing apparatus by clicking the edit button
// - Delete apparatus by clicking the delete button
// - Show a notification when an apparatus is updated
//
// All changes are temporary and will reset if you reload the page since it's not connected to a database yet.
// ----------------------------------------------------------

import { generateInventoryPdfReport } from '/js/pdfReport.js';
import '/js/font/Old London-normal.js';

// ===================== Initialize Components =====================

// Select options
const addApparatusLocation = document.getElementById("apparatusLocation");
const addApparatusUnit = document.getElementById("apparatusUnit");
const editApparatusLocation = document.getElementById("editApparatusLocation");
const editApparatusUnit = document.getElementById("editApparatusUnit");

const tbody = document.querySelector("tbody");
let apparatusData = [];
await initialize();

async function initialize() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  await prepareLabApparatusTable();

  await prepareLocationDropdown();
  await prepareUnitTypeDropdown();

  showToast("Loaded page successfully!");
}

// ===================== Set Toast Messages Logic =====================
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

// ===================== Set Dropdown Toggle Logic =====================
/* This is the code for the dropdown menus. */

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

/* 
-----------------------------------------------------------

* This code is for the modal form that allows the user to add a new apparatus.
* It includes the logic for opening and closing the modal, as well as handling the form submission.
* It also includes the logic for adding a new row to the table and deleting a row from the table.
* The modal is opened when the "Add Apparatus" button is clicked, and closed when the cancel button or backdrop is clicked.
* When the form is submitted, a new row is added to the table with the values from the form.
* The new row includes the apparatus ID, name, unit, location, brand, and quantity.
* The row also includes edit and delete buttons.
* When the delete button is clicked, the row is removed from the table.
* The form includes validation to ensure that all required fields are filled in before submission.
* The form is reset when the modal is closed.

TODO: The edit button is not yet implemented, but it will be added later.

------------------------------------------------------------
*/

// ===================== Add Lab Apparatus Modal Logic =====================

const addApparatusBtn = document.getElementById("addApparatusBtn");
const addApparatusModal = document.getElementById("addApparatusModal");
const modalBackdropApparatus = document.getElementById(
  "modalBackdropApparatus"
);
const cancelApparatusBtn = document.getElementById("cancelApparatusBtn");
const addApparatusForm = document.getElementById("addApparatusForm");

function openAddModal() {
  addApparatusModal.classList.remove("hidden");
  addApparatusModal.classList.add("flex");
}

function closeAddModal() {
  addApparatusModal.classList.add("hidden");
  addApparatusModal.classList.remove("flex");
  addApparatusForm.reset();
}

addApparatusBtn.addEventListener("click", openAddModal);
cancelApparatusBtn.addEventListener("click", closeAddModal);
modalBackdropApparatus.addEventListener("click", closeAddModal);

addApparatusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const apparatusName = document.getElementById("apparatusName").value.trim();
  const apparatusUnit = document.getElementById("apparatusUnit").value.trim();
  const apparatusLocation = document
    .getElementById("apparatusLocation")
    .value.trim();
  const apparatusBrand = document.getElementById("apparatusBrand").value.trim();

  if (
    !apparatusName ||
    !apparatusUnit ||
    !apparatusLocation ||
    !apparatusBrand
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  let result = await addLabApparatusRecord(
    apparatusName,
    apparatusLocation,
    apparatusUnit,
    apparatusBrand,
    ""
  );
  result = (result != null)? result.data : null;
  if (result == null) {
    showToast(
      `The mainHandler.addLabApparatusRecord() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    let newItemId = result.slice(51, result.length - 1);
    createNewLabApparatusRow(
      newItemId,
      apparatusName,
      apparatusUnit,
      apparatusLocation,
      apparatusBrand,
      0
    );
    closeAddModal();
    showToast("Lab Apparatus added successfully", false, 3000);
  }
});

// ===================== Edit Lab Apparatus Modal Logic =====================

const editApparatusModal = document.getElementById("editApparatusModal");
const modalBackdropEditApparatus = document.getElementById(
  "modalBackdropEditApparatus"
);
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editApparatusForm = document.getElementById("editApparatusForm");
var rowBeingEdited = null;

const apparatusFieldMap = [
  { id: "editApparatusId", idx: 0 },
  { id: "editApparatusName", idx: 1 },
  { id: "editApparatusUnit", idx: 2 },
  { id: "editApparatusLocation", idx: 3 },
  { id: "editApparatusBrand", idx: 4 },
  { id: "editApparatusQuantity", idx: 5 },
];

function openEditModal(row) {
  rowBeingEdited = row;
  const cells = row.children;

  for (const { id, idx } of apparatusFieldMap) {
    const el = document.getElementById(id);
    if (el && cells[idx]) {
      if (idx != 5) el.value = cells[idx].textContent.trim();
      else
        el.value = cells[idx].textContent.replace(
          " " + cells[2].textContent.trim(),
          ""
        ); // Removes the unit type portion on quantity
    }
  }

  editApparatusModal.classList.remove("hidden");
  editApparatusModal.classList.add("flex");
}
function closeEditModal() {
  editApparatusModal.classList.add("hidden");
  editApparatusModal.classList.remove("flex");
  editApparatusForm.reset();
  rowBeingEdited = null;
}
cancelEditBtn.addEventListener("click", closeEditModal);
modalBackdropEditApparatus.addEventListener("click", closeEditModal);

// Edit form submit: update the row in the table
editApparatusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!rowBeingEdited) return;

  // Get new values
  const editApparatusId = document.getElementById("editApparatusId").value;
  const editApparatusName = document.getElementById("editApparatusName").value;
  const editApparatusUnit = document.getElementById("editApparatusUnit").value;
  const editApparatusLocation = document.getElementById(
    "editApparatusLocation"
  ).value;
  const editApparatusBrand =
    document.getElementById("editApparatusBrand").value;
  const remarks = document
    .querySelector(`button[data-apparatus-id="${editApparatusId}"]`)
    .getAttribute("data-remarks");

  let result = await updateLabApparatusRecordByAll(
    editApparatusId,
    editApparatusName,
    editApparatusLocation,
    editApparatusUnit,
    editApparatusBrand,
    remarks
  );
  result = (result != null)? result.data : null;
  if (result == null) {
    showToast(
      `The mainHandler.updateLabApparatusRecordByAll() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    console.log(result);

    // Only update editable fields (not quantity)
    updateLabApparatusTable(rowBeingEdited.children);
    showToast("Lab Apparatus updated successfully", false, 3000);
    closeEditModal();
  }
});

// ===================== Delete Lab Apparatus Modal Logic =====================

// Handles the confirmation modal for deleting apparatus
const deleteApparatusModal = document.getElementById("deleteApparatusModal");
const modalBackdropDeleteApparatus = document.getElementById(
  "modalBackdropDeleteApparatus"
);
const cancelDeleteApparatusBtn = document.getElementById(
  "cancelDeleteApparatusBtn"
);
const confirmDeleteApparatusBtn = document.getElementById(
  "confirmDeleteApparatusBtn"
);
let rowToDelete = null;

// Show the delete modal
function openDeleteModal(row) {
  deleteApparatusModal.classList.remove("hidden");
  deleteApparatusModal.classList.add("flex");
  rowToDelete = row;
}
// Close the delete modal
function closeDeleteModal() {
  deleteApparatusModal.classList.add("hidden");
  deleteApparatusModal.classList.remove("flex");
  rowToDelete = null;
}
cancelDeleteApparatusBtn.addEventListener("click", closeDeleteModal);
modalBackdropDeleteApparatus.addEventListener("click", closeDeleteModal);

// Confirm deletion
confirmDeleteApparatusBtn.addEventListener("click", async () => {
  if (rowToDelete) {
    let result = await deleteLabApparatusRecordByItemId(
      rowToDelete.children[0].textContent
    );
    result = (result != null)? result.data : null;
    if (result && result.includes("ERROR")) {
      showToast(result, true, 4000);
      return;
    }

    console.log(result);
    rowToDelete.remove();
    closeDeleteModal();
    showToast("Lab Apparatus deleted successfully");
  }

  closeDeleteModal();
});

// Update tbody event listener to use the modal for deletion
// Handles clicking edit/delete buttons in the table
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const row = btn.closest("tr");
  if (!row) return;

  // Delete apparatus
  if (btn.getAttribute("aria-label") === "Delete apparatus")
    openDeleteModal(row);
  // Edit apparatus
  else if (btn.getAttribute("aria-label") === "Edit apparatus") {
    openEditModal(row);
  }
});

// ===================== Remarks Modal Functionality Logic =====================

const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

/**
 * Opens the remarks modal and populates it with existing remarks if any
 * @param {string} apparatusId - The ID of the apparatus to add/edit remarks for
 */
function openRemarksModal(apparatusId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksApparatusId").value = apparatusId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-apparatus-id="${apparatusId}"]`
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

// Handle remarks button clicks
tbody.addEventListener("click", (e) => {
  const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    const apparatusId = remarksBtn.getAttribute("data-apparatus-id");
    openRemarksModal(apparatusId);
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

  const apparatusId = document.getElementById("remarksApparatusId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-apparatus-id="${apparatusId}"]`
  );

  let result = await updateLabApparatusRemarkByItemId(
    apparatusId,
    remarks
  );
  result = (result != null)? result.data : null;
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

// Close remarks modal
cancelRemarksBtn.addEventListener("click", closeRemarksModal);
modalBackdropRemarks.addEventListener("click", closeRemarksModal);

// ===================== Front-End Related Logic =====================

async function createNewLabApparatusRow(
  apparatusId,
  apparatusName,
  apparatusUnit,
  apparatusLocation,
  apparatusBrand,
  apparatusQuantity
) {
  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusId}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusUnit}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusLocation}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusBrand}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusQuantity} ${apparatusUnit}</td>
      <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
        <button aria-label="Add remarks"
          class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100"
          data-apparatus-id="${apparatusId}">
          <i class="fas fa-comment-alt text-[14px]"></i>
        </button>
        <button aria-label="Edit apparatus" class="text-yellow-400 hover:text-yellow-500">
          <i class="fas fa-pencil-alt"></i>
        </button>
        
      </td>
    `;
  tbody.appendChild(tr);
}

/**
 * Method to add a update a record from the LabApparatus Table (Front End)
 * @param {string} editLabApparatusName          Name of the Lab Apparatus to be added
 * @param {string} editLabApparatusUnit          Location where the Lab Apparatus will be stored
 * @param {string} editLabApparatusLocation      Unit Type of the Lab Apparatus (e.g. Unit, Piece)
 * @param {string} editLabApparatusBrand         Brand of the Lab Apparatus to be added
 * @param {int} editLabApparatusQuantity         Quantity of the Lab Apparatus
 */
function updateLabApparatusTable(cells) {
  let originalUnit = cells[2].textContent;

  for (const { id, idx } of apparatusFieldMap) {
    const el = document.getElementById(id);

    if (!el && !cells[idx]) continue;
    if (id === "editApparatusQuantity")
      // skip quantity
      cells[idx].textContent =
        cells[idx].textContent.replace(" " + originalUnit, "") +
        " " +
        cells[2].textContent;
    else {
      cells[idx].textContent = el.value.trim();
    }
  }
}

/**
 * Method to add an existing remarks to the remarksText element
 * @param {string} remarks The remarks of the chemical
 * @param {int} apparatusId The primary key of the Chemical table.
 */
async function createNewRemarks(remarks, apparatusId) {
  document.getElementById("remarksText").value = remarks;

  const remarksBtn = document.querySelector(
    `button[data-apparatus-id="${apparatusId}"]`
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

/**
 * Method to add a new unit to the addLabApparatusUnit and editLabApparatusUnit dropdown element
 * @param {string} unitTypeName Name of the unit type to be added
 */
function createNewUnitTypeRow(unitTypeName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");
  tr1.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  tr2.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  addApparatusUnit.appendChild(tr1);
  editApparatusUnit.appendChild(tr2);
}

/**
 * Method to add a new unit to the addLabApparatusLocation and editLabApparatusLocation dropdown element
 * @param {string} locationName Name of the location to be added to the dropdown
 */
function createNewLocationRow(locationName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");

  tr1.innerHTML = `<option value="${locationName}">${locationName}</option>`;
  tr2.innerHTML = `<option value="${locationName}">${locationName}</option>`;

  addApparatusLocation.appendChild(tr1);
  editApparatusLocation.appendChild(tr2);
}

// SEARCH BAR METHODS - finds by brand and name - please adjust if necessary
function searchApparatus() {
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
          <p class="text-gray-500 text-lg font-medium">No apparatus found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
    `;
    tbody.appendChild(noResultRow);
  }
}
// Add event listener to the search input
searchInput.addEventListener("input", searchApparatus);
// ===================== Database Related Logic =====================

/**
 * Gets all of the chemical records from the database then proceeds to populate them to the table
 * @void Returns nothing.
 */
async function prepareLabApparatusTable() {
  try {
    let data = await getAllLabApparatusRecords();
    apparatusData = data = data.data;
    if (data.length == 0) return;
    for (let i = 0; i < data.length; i++) {
      await createNewLabApparatusRow(
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
 *  to the addApparatusUnit html dropdown element
 * @void Returns nothing.
 */
async function prepareUnitTypeDropdown() {
  try {
    let data = await getAllUnitTypeRecordsOrderByName();
    data = data.data;
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
 *  to the addApparatusLocation html dropdown element
 * @void Returns nothing.
 */
async function prepareLocationDropdown() {
  try {
    let data = await getAllLocationRecordsOrderByName();
    data = data.data;
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
  // Build rows for PDF from apparatusData
  const pdfRows = apparatusData.map(item => {
    const base = [
      item["Item ID"],
      item["Name"],
      // item["Unit"],
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
  await generateInventoryPdfReport({
    title: 'LABORATORY APPARATUS',
    columns: [
      { header: 'ITEM ID', dataKey: 'id' },
      { header: 'NAME', dataKey: 'name' },
      // { header: 'UNIT', dataKey: 'unit' },
      { header: 'LOCATION', dataKey: 'location' },
      { header: 'BRAND', dataKey: 'brand' },
      // { header: 'QUANTITY', dataKey: 'qty' }
    ],
    filename: 'apparatus_inventory_report.pdf',
    dateColumns: dates,
    data: pdfRows
  });
});

// =======================================================
// Backend related code
async function getAllLabApparatusRecords(){
  try {
    let response = await fetch('/lab-apparatus/get-all-lab-apparatus-records', {
      method: 'GET'
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function getAllUnitTypeRecordsOrderByName(){
  try {
    let response = await fetch('/unit-type/get-all-unit-type-order-by-name', {
      method: 'GET'
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function getAllLocationRecordsOrderByName(){
  try {
    let response = await fetch('/location/get-all-location-order-by-name', {
      method: 'GET'
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function addLabApparatusRecord(
  apparatusName,
  apparatusLocation,
  apparatusUnit,
  apparatusBrand,
  remarks
){
  try {
    let response = await fetch('/lab-apparatus/add-lab-apparatus-records', {
      method: 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        itemName : apparatusName, 
        locationName : apparatusLocation, 
        unitTypeName : apparatusUnit, 
        brandModel : apparatusBrand, 
        remarks : remarks
      })
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function updateLabApparatusRecordByAll(
  editApparatusId,
  editApparatusName,
  editApparatusLocation,
  editApparatusUnit,
  editApparatusBrand,
  remarks
) {
  try {
    let response = await fetch('/lab-apparatus/update-lab-apparatus-records', {
      method: 'PATCH',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        itemId : editApparatusId, 
        itemName : editApparatusName, 
        locationName : editApparatusLocation, 
        unitTypeName : editApparatusUnit, 
        brandModel : editApparatusBrand, 
        remarks : remarks
      })
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function updateLabApparatusRemarkByItemId(apparatusId, remarks ){
  try {
    let response = await fetch('/lab-apparatus/update-lab-apparatus-remarks', {
      method: 'PATCH',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        itemId : apparatusId,
        remarks : remarks
      })
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function deleteLabApparatusRecordByItemId(itemid){
  try {
    let response = await fetch('/lab-apparatus/delete-all-lab-apparatus-records', {
      method: 'DELETE',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        itemId : itemId
      })
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}