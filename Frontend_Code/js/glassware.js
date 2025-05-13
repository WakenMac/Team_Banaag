/**
 * CARES - Centralized Resource and Equipment System
 * Glasswares Management JS
 * ----------------------------------------------------------
 * This script controls the add, edit, delete, and remarks features for the Glasswares table.
 * This is already connected to the database.
 *
 * Features:
 * - Add new glasswares using a form and modal
 * - Edit existing glasswares by clicking the edit button
 * - Delete glasswares with confirmation modal
 * - Show a toast notification for all actions (add, edit, delete, remarks, errors)
 * - All user feedback is shown as a toast at the bottom right (no more alert popups)
 */

import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Initialize Components
const addGlasswareLocation = document.getElementById("glasswareLocation");
const addGlasswareUnit = document.getElementById("glasswareUnit");
const editGlasswareLocation = document.getElementById("editGlasswareLocation");
const editGlasswareUnit = document.getElementById("editGlasswareUnit");

await initialize();

async function initialize() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  await dbhandler.testPresence();
  await prepareGlasswaresTable();

  await prepareLocationDropdown();
  await prepareUnitTypeDropdown();
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

// ===================== Add Glassware Modal Logic =====================

// Modal logic (Adding)
const addGlasswareBtn = document.getElementById("addGlasswareBtn");
const addGlasswareModal = document.getElementById("addGlasswareModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const cancelBtn = document.getElementById("cancelBtn");
const addGlasswareForm = document.getElementById("addGlasswareForm");
const glasswareTableBody = document.getElementById("glasswareTableBody");

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

addGlasswareForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const glasswareName = addGlasswareForm.glasswareName.value.trim();
  const glasswareUnit = addGlasswareForm.glasswareUnit.value.trim();
  const glasswareLocation = addGlasswareForm.glasswareLocation.value.trim();
  const glasswareBrand = addGlasswareForm.glasswareBrand.value.trim();

  if (
    !glasswareName ||
    !glasswareUnit ||
    !glasswareLocation ||
    !glasswareBrand
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  let result = await dbhandler.addGlasswaresRecord(
    glasswareName,
    glasswareLocation,
    glasswareUnit,
    glasswareBrand
  );

  if (result == null) {
    showToast(
      `The mainHandler.addGlasswaresRecord() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    console.log(result);
    let newItemId = result.slice(46, result.length - 1);
    createNewGlasswareRow(
      newItemId,
      glasswareName,
      glasswareUnit,
      glasswareLocation,
      glasswareBrand,
      0
    );
    closeModal();
    showToast("Glassware added successfully", false, 3000);
  }
});

// ===================== Edit Glassware Modal Logic =====================

// Edit Modal Elements
const editGlasswareModal = document.getElementById("editGlasswareModal");
const editGlasswareForm = document.getElementById("editGlasswareForm");
const cancelEditGlasswareBtn = document.getElementById(
  "cancelEditGlasswareBtn"
);
const modalBackdropEdit = document.getElementById("modalEditBackdrop");
var glasswareRowToEdit = null;

// Open Edit Modal and populate fields
function openEditGlasswareModal(row) {
  glasswareRowToEdit = row;
  const cells = row.children;
  for (const { id, idx } of glasswareFieldMap) {
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
  editGlasswareModal.classList.remove("hidden");
  editGlasswareModal.classList.add("flex");
}

function closeEditGlasswareModal() {
  editGlasswareModal.classList.add("hidden");
  editGlasswareModal.classList.remove("flex");
  glasswareRowToEdit = null;
  editGlasswareForm.reset();
}

cancelEditGlasswareBtn.addEventListener("click", closeEditGlasswareModal);
modalBackdropEdit.addEventListener("click", closeEditGlasswareModal);

// Save changes on Edit
editGlasswareForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const editGlasswareId = glasswareRowToEdit.children[0].textContent.trim();
  const editGlasswareName = document
    .getElementById("editGlasswareName")
    .value.trim();
  const editGlasswareUnit = document
    .getElementById("editGlasswareUnit")
    .value.trim();
  const editGlasswareLocation = document
    .getElementById("editGlasswareLocation")
    .value.trim();
  const editGlasswareBrand = document
    .getElementById("editGlasswareBrand")
    .value.trim();

  const remarks = document
    .querySelector(`button[data-glassware-id="${editGlasswareId}"]`)
    .getAttribute("data-remarks");

  if (!glasswareRowToEdit) return;

  let result = await dbhandler.updateGlasswaresRecordByAll(
    editGlasswareId,
    editGlasswareName,
    editGlasswareLocation,
    editGlasswareUnit,
    editGlasswareBrand,
    remarks
  );

  if (result == null) {
    showToast(
      `The mainHandler.updateGlasswaresRecordByAll() DOESN'T return a status statement.`,
      true,
      4000
    );
  } else if (result.includes("ERROR")) {
    showToast(result, true, 4000);
  } else {
    console.log(result);
    const cells = glasswareRowToEdit.children;

    // Only update editable fields (not quantity)
    updateGlasswaresTable(cells);
    showToast("Glassware updated successfully", false, 3000);
    closeEditGlasswareModal();
  }
});

// ===================== Delete Glassware Modal Logic =====================

// Delete Modal Elements
const deleteGlasswareModal = document.getElementById("deleteGlasswareModal");
const cancelDeleteGlasswareBtn = document.getElementById(
  "cancelDeleteGlasswareBtn"
);
const confirmDeleteGlasswareBtn = document.getElementById(
  "confirmDeleteGlasswareBtn"
);
const modalBackdropDelete = document.getElementById("modalDeleteBackdrop");
var glasswareRowToDelete = null;

// Field mapping for edit modal and table columns
const glasswareFieldMap = [
  { id: "editGlasswareName", idx: 1 },
  { id: "editGlasswareUnit", idx: 2 },
  { id: "editGlasswareLocation", idx: 3 },
  { id: "editGlasswareBrand", idx: 4 },
  { id: "editGlasswareQuantity", idx: 5 },
];

// Open Delete Modal
function openDeleteGlasswareModal(row) {
  glasswareRowToDelete = row;
  deleteGlasswareModal.classList.remove("hidden");
  deleteGlasswareModal.classList.add("flex");
}

function closeDeleteGlasswareModal() {
  deleteGlasswareModal.classList.add("hidden");
  deleteGlasswareModal.classList.remove("flex");
  glasswareRowToDelete = null;
}

cancelDeleteGlasswareBtn.addEventListener("click", closeDeleteGlasswareModal);
modalBackdropDelete.addEventListener("click", closeDeleteGlasswareModal);

// Confirm Delete
confirmDeleteGlasswareBtn.addEventListener("click", async () => {
  if (glasswareRowToDelete) {
    const glassawareId = glasswareRowToDelete.children[0].textContent.trim();

    let result = await dbhandler.deleteChemicalsRecordByItemId(glassawareId);
    if (result && result.includes("ERROR")) {
      showToast(result, true, 4000);
      return;
    }

    console.log(result);
    chemicalRowToDelete.remove();
    closeDeleteChemicalModal();
    showToast("Chemical deleted successfully", false, 3000);
  }

  showToast(
    "ERROR: Unable to find row to delete (Glassware-Delete-Row)",
    true,
    4000
  );
  closeDeleteChemicalModal();
});

// Table row actions: Edit and Delete
glasswareTableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest("button[aria-label='Edit glassware']");
  const deleteBtn = e.target.closest("button[aria-label='Delete glassware']");

  if (editBtn) {
    const row = e.target.closest("tr");
    openEditGlasswareModal(row);
  } else if (deleteBtn) {
    const row = e.target.closest("tr");
    openDeleteGlasswareModal(row);
  }
});

// ===================== Edit Remarks Modal Logic =====================

// Remarks Modal Functionality
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

/**
 * Opens the remarks modal and populates it with existing remarks if any
 * @param {string} itemId - The ID of the chemical to add/edit remarks for
 */
function openRemarksModal(itemId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksGlasswareId").value = itemId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-glassware-id="${itemId}"]`
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
glasswareTableBody.addEventListener("click", (e) => {
  const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    const glasswareId = remarksBtn.getAttribute("data-glassware-id");
    openRemarksModal(glasswareId);
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
  const glasswareId = document.getElementById("remarksGlasswareId").value;
  const remarks = document.getElementById("remarksText").value.trim();

  // Update the remarks button color and store remarks
  const remarksBtn = document.querySelector(
    `button[data-chemical-id="${glasswareId}"]`
  );

  // Updates the remarks in the database
  let result = await dbhandler.updateGlasswaresRemarkByItemId(
    glasswareId,
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

async function createNewGlasswareRow(
  glasswareId,
  glasswareName,
  glasswareUnit,
  glasswareLocation,
  glasswareBrand,
  glasswareQuantity
) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareQuantity}</td>
    <td class="px-6 py-4 whitespace-nowrap flex items-center justify-end gap-3">
    <button aria-label="Add remarks" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" data-glassware-id="${glasswareId}">
        <i class="fas fa-comment-alt text-[14px]"></i>
      </button>  
    <button aria-label="Edit glassware" class="text-yellow-400 hover:text-yellow-500">
        <i class="fas fa-pencil-alt"></i>
      </button>
    <button aria-label="Delete glassware" class="text-red-600 hover:text-red-700">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  `;
  glasswareTableBody.appendChild(tr);
}

/**
 * Method to add a new unit to the addGlasswareUnit and editGlasswareUnit dropdown element
 * @param {string} unitTypeName Name of the unit type to be added
 */
function createNewUnitTypeRow(unitTypeName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");
  tr1.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  tr2.innerHTML = `<option value="${unitTypeName}">${unitTypeName}</option>`;
  addGlasswareUnit.appendChild(tr1);
  editGlasswareUnit.appendChild(tr2);
}

/**
 * Method to add a new unit to the addGlasswareLocation and editGlasswareLocation dropdown element
 * @param {string} locationName Name of the location to be added to the dropdown
 */
function createNewLocationRow(locationName) {
  const tr1 = document.createElement("tr");
  const tr2 = document.createElement("tr");

  tr1.innerHTML = `<option value="${locationName}">${locationName}</option>`;
  tr2.innerHTML = `<option value="${locationName}">${locationName}</option>`;

  addGlasswareLocation.appendChild(tr1);
  editGlasswareLocation.appendChild(tr2);
}

/**
 * Method to add a update a record from the Glasswares Table (Front End)
 * @param {string} editGlasswareName          Name of the glassware to be added
 * @param {string} editGlasswareUnit          Location where the glassware will be stored
 * @param {string} editGlasswareLocation      Unit Type of the glassware (e.g. Unit, Piece)
 * @param {string} editGlasswareBrand         Brand of the glassware to be added
 * @param {int} editGlasswareQuantity         Quantity of the glassware
 */
function updateGlasswaresTable(cells) {
  for (const { id, idx } of glasswareFieldMap) {
    const el = document.getElementById(id);
    if (!el && !cells[idx]) continue;

    if (id === "editGlasswareQuantity")
      // skip quantity
      cells[idx].textContent = el.value.trim() + " " + cells[2].textContent;
    else cells[idx].textContent = el.value.trim();
  }
}

/**
 * Method to add an existing remarks to the remarksText element
 * @param {string} remarks The remarks of the chemical
 * @param {int} glasswareId The primary key of the Chemical table.
 */
async function createNewRemarks(remarks, glasswareId) {
  document.getElementById("remarksText").value = remarks;

  const remarksBtn = document.querySelector(
    `button[data-glassware-id="${glasswareId}"]`
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

// ===================== Database Related Logic =====================

/**
 * Gets all of the chemical records from the database then proceeds to populate them to the table
 * @void Returns nothing.
 */
async function prepareGlasswaresTable() {
  try {
    let data = await dbhandler.getAllGlasswaresRecords();

    if (data.length == 0) {
      console.error("Glassware table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      await createNewGlasswareRow(
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
 *  to the addGlasswareUnit html dropdown element
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
 *  to the addGlasswareLocation html dropdown element
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
