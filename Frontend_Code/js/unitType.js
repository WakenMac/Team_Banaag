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
const modalBackdropDeleteUnitType = document.getElementById(
  "modalBackdropDeleteUnitType"
);
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

  // Prepares the contents of the admin table
  await dbhandler.testPresence();
  await prepareUnitTypeTable();

  showToast("Loaded page successfully!");
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

// ===================== Add Glassware Modal Logic =====================

function openModal() {
  addUnitTypeModal.classList.remove("hidden");
  addUnitTypeModal.classList.add("flex");
}

function closeModal() {
  addUnitTypeModal.classList.add("hidden");
  addUnitTypeModal.classList.remove("flex");
  addUnitTypeForm.reset();
}

addUnitTypeBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", () => {
  // Once clicked, clears the error message in the modal and closes (hides) the Add Location Modal
  addUnitTypeError.classList.add("hidden");
  addUnitTypeError.textContent = "";
  closeModal();
});
modalBackdropUnitType.addEventListener("click", closeModal);

// Connects the Create functionality to the Database Handler
addUnitTypeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const unitTypeName = document.getElementById("unitTypeName").value.trim();

  addUnitTypeError.classList.add("hidden");
  addUnitTypeError.textContent = "";

  if (!unitTypeName) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  let result = await dbhandler.addUnitTypeRecord(unitTypeName);

  if (result == null) {
    showToast(`Something went wrong. Please try again.`, true);
    return;
  } else if (result.includes("ERROR")) {
    showToast(result.replace(/^ERROR:\s*/i, ""), true); // Removes the ERROR sign
    return;
  } else {
    let newUnitTypeId = result.slice(47, result.length - 1);
    createNewUnitTypeRow(newUnitTypeId, unitTypeName);
    closeModal();
    showToast("Unit Type added successfully");
  }
});

// Hide error message when user starts typing in the name input
document.getElementById("unitTypeName").addEventListener("input", () => {
  addUnitTypeError.classList.add("hidden");
  addUnitTypeError.textContent = "";
});

// ===================== Edit Glassware Modal Logic =====================

cancelBtnEditUnitType.addEventListener("click", () => {
  editUnitTypeError.classList.add("hidden");
  editUnitTypeError.textContent = "";
  closeEditModal();
});

modalBackdropEditUnitType.addEventListener("click", () => {
  editUnitTypeError.classList.add("hidden");
  editUnitTypeError.textContent = "";
  closeEditModal();
});

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
  const editUnitTypeName = document
    .getElementById("editUnitTypeName")
    .value.trim();

  if (!editUnitTypeName) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  let result = await dbhandler.updateUnitTypeRecordName(
    editUnitTypeId,
    editUnitTypeName
  );

  if (result == null) {
    showToast(`Something went wrong. Please try again.`, true);
    return;
  } else if (result.includes("ERROR")) {
    showToast(result.replace(/^ERROR:\s*/i, ""), true); // Removes the ERROR sign
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
    showToast("Unit Type updated successfully");
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

// ===================== Delete Glassware Modal Logic =====================

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
    let result = await dbhandler.removeUnitTypeRecordByUnitTypeId(
      unitTypeToDelete
    );
    if (result == null) {
      showToast(
        `The mainHandler.removeUnitTypeRecordByUnitTypeId() DOESN'T return a status statement.`,
        true
      );
    } else if (result.includes("ERROR")) {
      showToast(result.replace(/^ERROR:\s*/i, ""), true);
    } else {
      rowToDelete.remove();
      showToast("Unit type deleted successfully");
    }
    closeDeleteModal();
  }
});

// ===================== Front-end Related Logic =====================

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
                </td>
              `;

  tbody.appendChild(tr);
}

function showToast(message, isError = false) {
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
    toast.style.fontWeight = "regular";
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
  setTimeout(
    () => {
      toast.style.opacity = "0";
    },
    isError ? 4000 : 3000
  );
}

// ===================== Search Bar Function =====================

function searchUnitType() {
  const searchValue = searchInput.value.toLowerCase();
  const rows = tbody.querySelectorAll("tr:not(.no-result-row)");
  let hasResult = false;

  const existingNoResults = tbody.querySelector(".no-result-row");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  rows.forEach((row) => {
    const unitName = row.children[1].textContent.toLowerCase();
    const showRow = !searchValue || unitName.includes(searchValue);
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
          <p class="text-gray-500 text-lg font-medium">No unit type found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
    `;
    tbody.appendChild(noResultRow);
  }
}
// Add event listener to the search input
searchInput.addEventListener("input", searchUnitType);

// ===================== Database Related Logic =====================

async function prepareUnitTypeTable() {
  try {
    let data = await dbhandler.getAllUnitTypeRecordsOrderById();

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
