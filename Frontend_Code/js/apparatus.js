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

import * as dbhandler from '../../Backend_Code/mainHandler.js';

// ===================== Initialize Components =====================

// Select options
const addApparatusLocation = document.getElementById('apparatusLocation');
const addApparatusUnit = document.getElementById('apparatusUnit');
const editApparatusLocation = document.getElementById('editApparatusLocation');
const editApparatusUnit = document.getElementById('editApparatusUnit');

const tbody = document.querySelector("tbody");
await initialize();

async function initialize(){
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  await dbhandler.testPresence();
  await prepareLabApparatusTable();

  await prepareLocationDropdown();
  await prepareUnitTypeDropdown();
}

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

addApparatusForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const apparatusName = addApparatusForm.apparatusName.value.trim();
  const apparatusUnit = addApparatusForm.apparatusUnit.value.trim();
  const apparatusLocation = addApparatusForm.apparatusLocation.value.trim();
  const apparatusBrand = addApparatusForm.apparatusBrand.value.trim();
  const apparatusQuantity = addApparatusForm.apparatusQuantity.value.trim();

  if (
    !apparatusName ||
    !apparatusUnit ||
    !apparatusLocation ||
    !apparatusBrand ||
    !apparatusQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }



  closeAddModal();
});

// Edit modal logic
const editApparatusModal = document.getElementById("editApparatusModal");
const modalBackdropEditApparatus = document.getElementById(
  "modalBackdropEditApparatus"
);
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editApparatusForm = document.getElementById("editApparatusForm");
let rowBeingEdited = null;

function openEditModal() {
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

// --- Delete Apparatus Modal Logic ---
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
confirmDeleteApparatusBtn.addEventListener("click", () => {
  if (rowToDelete) {
    rowToDelete.remove();
    showToast("Apparatus deleted successfully");
  }
  closeDeleteModal();
});

// Update tbody event listener to use the modal for deletion
// Handles clicking edit/delete buttons in the table
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const row = btn.closest("tr");
  // Delete apparatus
  if (btn.getAttribute("aria-label") === "Delete apparatus") {
    if (row) openDeleteModal(row);
  }
  // Edit apparatus
  else if (btn.getAttribute("aria-label") === "Edit apparatus") {
    rowBeingEdited = row;
    document.getElementById("editApparatusId").value =
      row.children[0].textContent;
    document.getElementById("editApparatusName").value =
      row.children[1].textContent;
    document.getElementById("editApparatusUnit").value =
      row.children[2].textContent;
    document.getElementById("editApparatusLocation").value =
      row.children[3].textContent;
    document.getElementById("editApparatusBrand").value =
      row.children[4].textContent;
    openEditModal();
  }
});

// --- Toast Notification --- The notification that appears when an apparatus is updated.
//Hello u can adjust the toast notification style by changing and naa sa baba hihi added some comments for you - Dave
function showToast(message) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div"); // Creates a new div element
    toast.id = "custom-toast"; // div id
    toast.style.position = "fixed"; // div position (fixed means it will stay in the same place even if the page is scrolled)
    toast.style.bottom = "32px"; // div position from the bottom (32px from the bottom of the page)
    toast.style.right = "32px"; // div position from the right (32px from the right of the page)
    toast.style.background = "rgba(44, 161, 74, 0.95)"; // div background color
    toast.style.color = "white"; // text color
    toast.style.padding = "16px 28px"; // div padding (16px from the top & bottom, 28px from the left & right)
    toast.style.borderRadius = "8px"; // div border radius (rounded corners, pag gusto mo mas round make it higher)
    toast.style.fontSize = "16px"; // div font size
    toast.style.fontWeight = "regular"; // div font weight
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; // div box shadow
    toast.style.opacity = "0"; // div opacity
    toast.style.transition = "opacity 0.4s"; // div transition
    toast.style.zIndex = "9999"; // div z index
    document.body.appendChild(toast); // add the div to the body (body means the entire page)
  }
  toast.textContent = message; // set the text content of the div to the message
  toast.style.opacity = "1"; // set the opacity of the div to 1
  setTimeout(() => {
    toast.style.opacity = "0"; // set the opacity of the div to 0 after 1800ms
  }, 1800);
}

// Edit form submit: update the row in the table
editApparatusForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!rowBeingEdited) return;
  // Get new values
  rowBeingEdited.children[1].textContent =
    document.getElementById("editApparatusName").value;
  rowBeingEdited.children[2].textContent =
    document.getElementById("editApparatusUnit").value;
  rowBeingEdited.children[3].textContent = document.getElementById(
    "editApparatusLocation"
  ).value;
  rowBeingEdited.children[4].textContent =
    document.getElementById("editApparatusBrand").value;
  closeEditModal();
  showToast("Apparatus updated successfully");
});

// Remarks Modal Functionality
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
remarksForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const apparatusId = document.getElementById("remarksApparatusId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
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

  closeRemarksModal();
  showToast("Remarks updated successfully");
});

// Close remarks modal
cancelRemarksBtn.addEventListener("click", closeRemarksModal);
modalBackdropRemarks.addEventListener("click", closeRemarksModal);


// ===================== Front-End Related Logic =====================

async function createNewLabApparatusRow(
  apparatusId, apparatusName, apparatusUnit, apparatusLocation, apparatusBrand, 
  apparatusQuantity
){
  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusId}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusUnit}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusLocation}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusBrand}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusQuantity}</td>
      <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
        <button aria-label="Add remarks"
          class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100"
          data-apparatus-id="${apparatusId}">
          <i class="fas fa-comment-alt text-[14px]"></i>
        </button>
        <button aria-label="Edit apparatus" class="text-yellow-400 hover:text-yellow-500">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button aria-label="Delete apparatus" class="text-red-600 hover:text-red-700">
          <i class="fas fa-trash-alt"></i>
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
function updateLabApparatussTable(
  cells,
) {
  for (const { id, idx } of apparatusFieldMap) {
    const el = document.getElementById(id);
    if (!el && !cells[idx]) 
      continue;

    if (id === "editLabApparatusQuantity") // skip quantity
      cells[idx].textContent = el.value.trim() + ' ' + cells[2].textContent;
    else
      cells[idx].textContent = el.value.trim();
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

// ===================== Database Related Logic =====================

/**
 * Gets all of the chemical records from the database then proceeds to populate them to the table
 * @void Returns nothing.
 */
async function prepareLabApparatusTable() {
  try {
    let data = await dbhandler.getAllLabApparatusRecords();

    if (data.length == 0) {
      console.error("Lab Apparatus table has no records.");
      return;
    }

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
  } catch (generalError) {
    console.error(generalError);
  }
}

/**
 * Gets all of the unit type records from the database then proceeds to populate them (using the unit_type_name)
 *  to the addApparatusUnit html dropdown element
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
 *  to the addApparatusLocation html dropdown element
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