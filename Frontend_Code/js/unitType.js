// import modules
import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Initialize components & Modal logic
const addUnitTypeBtn = document.getElementById("addUnitTypeBtn");
const addUnitTypeModal = document.getElementById("addUnitTypeModal");
const modalBackdropUnitType = document.getElementById("modalBackdropUnitType");
const cancelBtn = document.getElementById("cancelBtn");
const addUnitTypeForm = document.getElementById("addUnitTypeForm");
const addUnitTypeError = document.getElementById("addUnitTypeError"); // for error message (adding)
const editUnitTypeError = document.getElementById("editUnitTypeError"); // for error message (editing)
const tbody = document.querySelector("tbody");

// Initialize modals for editing
const editUnitTypeModal = document.getElementById("editUnitTypeModal");
const editUnitTypeForm = document.getElementById("editUnitTypeForm");
const cancelBtnEditUnitType = document.getElementById("cancelBtnEditUnitType");
const modalBackdropEditUnitType = document.getElementById(
  "modalBackdropEditUnitType"
);

// Delete Confirmation Modal
const deleteUnitTypeModal = document.getElementById("deleteUnitTypeModal");
const modalBackdropDeleteUnitType = document.getElementById("modalBackdropDeleteUnitType");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
let unitTypeToDelete = null;
let rowToDelete = null;

// Initialize table components
await initialize();

async function initialize() {
  // Prepares the dropdown elements
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  // Prepares the modals

  addUnitTypeBtn.addEventListener("click", openModal);
  cancelBtn.addEventListener("click", () => {
    // Once clicked, clears the error message in the modal and closes (hides) the Add Location Modal
    addUnitTypeError.classList.add("hidden");
    addUnitTypeError.textContent = '';
    closeModal();
  });
  modalBackdropUnitType.addEventListener("click", closeModal);

  cancelBtnEditUnitType.addEventListener("click", () => {
    editUnitTypeError.classList.add("hidden");
    editUnitTypeError.textContent = '';
    closeEditModal();
  });
  modalBackdropEditUnitType.addEventListener("click", () => {
    editUnitTypeError.classList.add("hidden");
    editUnitTypeError.textContent = '';
    closeEditModal();
  });

  // Prepares the contents of the admin table
  await dbhandler.testPresence();
  await prepareUnitTypeTable();
}

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

/**
 * Opens the edit modal for the selected unit type
 * @param {int} unitTypeId Primary key of the unitType table
 * @param {string} unitTypeName Name of the unitType to be edited
 */
function openEditModal() {
  editUnitTypeModal.classList.remove("hidden");
  editUnitTypeModal.classList.add("flex");
}

/**
 * Closes the edit modal for the selected unit type
 */
function closeEditModal() {
  editUnitTypeModal.classList.add("hidden");
  editUnitTypeModal.classList.remove("flex");
  editUnitTypeForm.reset();
}

function openModal() {
  addUnitTypeModal.classList.remove("hidden");
  addUnitTypeModal.classList.add("flex");
}

function closeModal() {
  addUnitTypeModal.classList.add("hidden");
  addUnitTypeModal.classList.remove("flex");
  addUnitTypeForm.reset();
}

/**
 * Populates the edit modal with the selected unit type's data
 */
function populateEditForm(row) {
  const cells = row.children;
  document.getElementById("editUnitTypeId").value = cells[0].textContent;
  document.getElementById("editUnitTypeName").value = cells[1].textContent;
  openEditModal();
}

// Move event listeners outside of populateEditForm
editUnitTypeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const editUnitTypeId = document.getElementById("editUnitTypeId").value.trim();
  const editUnitTypeName = document.getElementById("editUnitTypeName").value.trim();

  if (!editUnitTypeName) {
    alert("Please fill in all required fields.");
    return;
  }

  let result = await dbhandler.updateUnitTypeRecordName(editUnitTypeId, editUnitTypeName);

  if (result == null) {
    editUnitTypeError.textContent = `Something went wrong. Please try again.`;
    editUnitTypeError.classList.remove("hidden");
    return;
  } else if (result.includes("ERROR")) {
    editUnitTypeError.textContent = result.replace(/^ERROR:\s*/i, ''); // Removes the ERROR sign
    editUnitTypeError.classList.remove("hidden");
    return;
  } else {
    // Update the row in the table
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row) => {
      if (row.children[0].textContent === editUnitTypeId) {
        row.children[1].textContent = editUnitTypeName;
      }
    });
    closeEditModal();
  }
});

// Add click handler for edit buttons
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit unit type"
  ) {
    const row = e.target.closest("tr");
    populateEditForm(row);
  }
});

addUnitTypeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const unitTypeName = document.getElementById("unitTypeName").value.trim();

  addUnitTypeError.classList.add("hidden");
  addUnitTypeError.textContent = "";
  
  if (!unitTypeName) {
    addUnitTypeError.textContent = "Please fill in all required fields.";
    addUnitTypeError.classList.remove("hidden");
    return;
  }

  let result = await dbhandler.addUnitTypeRecord(unitTypeName);

  if (result == null) {
    addUnitTypeError.textContent = `Something went wrong. Please try again.`;
    addUnitTypeError.classList.remove("hidden");
    return;
  } else if (result.includes("ERROR")) {
    addUnitTypeError.textContent = result.replace(/^ERROR:\s*/i, ''); // Removes the ERROR sign
    addUnitTypeError.classList.remove("hidden");
    return;
  } else {
    console.log(result);
    let newUnitTypeId = result.slice(47, result.length - 1);
    createNewUnitTypeRow(newUnitTypeId, unitTypeName);
    addUnitTypeError.classList.add("hidden");
    addUnitTypeError.textContent = "";
    closeModal();
  }
});

// Hide error message when user starts typing in the name input
document.getElementById('unitTypeName').addEventListener('input', () => {
  addUnitTypeError.classList.add('hidden');
  addUnitTypeError.textContent = '';
});

// Add delete functionality for dynamically added rows
tbody.addEventListener("click", async (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete unit type"
  ) {
    const row = e.target.closest("tr");
    const unitTypeId = row.querySelectorAll("td")[0].textContent;
    openDeleteModal(unitTypeId, row);
  }
});

// ===============================================================================================
// FRONT END-RELATED METHODS

/**
 * Method to add a new row to the table
 * @param {int} unitTypeId Primary key of the unitType table
 * @param {string} unitTypeName Name of the unitType to be added
 */
function createNewUnitTypeRow(unitTypeId, unitTypeName) {
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
                </td>
              `;

  tbody.appendChild(tr);
}

// ===============================================================================================
// BACK END-RELATED METHODS

async function prepareUnitTypeTable() {
  try {
    let data = await dbhandler.getAllUnitTypeRecords();

    if (data.length == 0) {
      console.error("Unit type table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      createNewUnitTypeRow(data[i]["Unit Type ID"], data[i]["Name"]);
    }
  } catch (generalError) {
    console.error(generalError);
  }
}

function openDeleteModal(unitTypeId, row) {
  unitTypeToDelete = unitTypeId;
  rowToDelete = row;
  deleteUnitTypeModal.classList.remove("hidden");
  deleteUnitTypeModal.classList.add("flex");
}

function closeDeleteModal() {
  deleteUnitTypeModal.classList.add("hidden");
  deleteUnitTypeModal.classList.remove("flex");
  unitTypeToDelete = null;
  rowToDelete = null;
}

cancelDeleteBtn.addEventListener("click", closeDeleteModal);
modalBackdropDeleteUnitType.addEventListener("click", closeDeleteModal);

confirmDeleteBtn.addEventListener("click", async () => {
  if (unitTypeToDelete && rowToDelete) {
    let result = await dbhandler.removeUnitTypeRecordByUnitTypeId(unitTypeToDelete);
    if (result == null) {
      alert(`The mainHandler.removeUnitTypeRecordByUnitTypeId() DOESN'T return a status statement.`);
    } else if (result.includes("ERROR")) {
      alert(result);
    } else {
      console.log(result);
      rowToDelete.remove();
    }
    closeDeleteModal();
  }
});
