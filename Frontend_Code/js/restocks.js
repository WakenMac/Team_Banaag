/**
 * CARES - CAS Automated Resource and Equipment System
 * Restocks Management Module
 *
 * This module handles the management of restocks in the inventory system.
 * It includes functionality for:
 * - Adding new restocks
 * - Editing existing restocks
 * - Deleting restocks
 * - Viewing restock history
 */

// DOM Elements
let tbody = null;
let restockRowToDelete = null;

// Add Restock Elements
const addRestockBtn = document.getElementById("addRestockBtn");
const addRestockModal = document.getElementById("addRestockModal");
const addRestockForm = document.getElementById("addRestockForm");
const cancelRestockBtn = document.getElementById("cancelRestockBtn");
const modalBackdropAddRestock = document.getElementById(
  "modalBackdropAddRestock"
);

// Edit Restock Elements
const editRestockModal = document.getElementById("editRestockModal");
const editRestockForm = document.getElementById("editRestockForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const modalBackdropEditRestock = document.getElementById(
  "modalBackdropEditRestock"
);

// Delete Restock Elements
const deleteRestockModal = document.getElementById("deleteRestockModal");
const cancelDeleteRestockBtn = document.getElementById(
  "cancelDeleteRestockBtn"
);
const confirmDeleteRestockBtn = document.getElementById(
  "confirmDeleteRestockBtn"
);
const modalBackdropDeleteRestock = document.getElementById(
  "modalBackdropDeleteRestock"
);

// Remarks Elements
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

// Initialize table components
initialize();

function initialize() {
  tbody = document.querySelector("#restocksTableBody");
  if (!initializeRestocks()) {
    showToast("Could not initialize restocks table", true);
    return;
  }
  setupEventListeners();
  setupDateValidation();
}

function initializeRestocks() {
  if (!tbody) {
    console.error("Could not find table body with ID 'restocksTableBody'");
    return false;
  }
  return true;
}

function setupEventListeners() {
  // Add Restock
  addRestockBtn.addEventListener("click", openAddModal);
  cancelRestockBtn.addEventListener("click", closeAddModal);
  modalBackdropAddRestock.addEventListener("click", closeAddModal);
  addRestockForm.addEventListener("submit", handleAddRestockSubmit);

  // Edit Restock
  cancelEditBtn.addEventListener("click", closeEditModal);
  modalBackdropEditRestock.addEventListener("click", closeEditModal);
  editRestockForm.addEventListener("submit", handleEditRestockSubmit);

  // Delete Restock
  cancelDeleteRestockBtn.addEventListener("click", closeDeleteModal);
  modalBackdropDeleteRestock.addEventListener("click", closeDeleteModal);
  confirmDeleteRestockBtn.addEventListener("click", handleDeleteRestock);

  // Table Buttons
  tbody.addEventListener("click", handleTableButtonClicks);
}

// ===============================================================================================
// FRONT END-RELATED METHODS

function createNewRestockRow(
  restockId,
  restockItemName,
  restockQuantity,
  restockBrand,
  restockDate,
  restockExpirationDate
) {
  if (!tbody) {
    showToast("Could not create new row. Table body not found.", true);
    return;
  }

  // Generate random used quantity that's less than initial quantity, for testing purposes
  // Note: Please remove this when the actual used quantity is implemented
  const usedQuantity = Math.floor(Math.random() * restockQuantity);

  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockId}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockItemName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockQuantity}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${usedQuantity}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockBrand}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockDate}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">${restockExpirationDate}</td>
        <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
            <button 
                aria-label="Add remarks" 
                class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" 
                data-restock-id="${restockId}"
            >
                <i class="fas fa-comment-alt text-[14px]"></i>
            </button>
            <button aria-label="Edit restock" class="text-yellow-400 hover:text-yellow-500">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button aria-label="Delete restock" class="text-red-600 hover:text-red-700">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;

  tbody.appendChild(tr);
}

// ------------------ ADD RESTOCK ------------------
function openAddModal() {
  addRestockModal.classList.remove("hidden");
  addRestockModal.classList.add("flex");
}

function closeAddModal() {
  addRestockModal.classList.remove("flex");
  addRestockModal.classList.add("hidden");
  addRestockForm.reset();
}

// ------------------ EDIT RESTOCK ------------------
function openEditModal() {
  editRestockModal.classList.remove("hidden");
  editRestockModal.classList.add("flex");
}

function closeEditModal() {
  editRestockModal.classList.add("hidden");
  editRestockModal.classList.remove("flex");
  editRestockForm.reset();
}

function updateRestockTable(
  restockId,
  restockItemName,
  restockQuantity,
  restockBrand,
  restockDate,
  restockExpirationDate
) {
  const rows = tbody.getElementsByTagName("tr");
  for (let row of rows) {
    if (row.cells[0].textContent === restockId) {
      updateRowContent(row, {
        restockItemName,
        restockQuantity,
        restockBrand,
        restockDate,
        restockExpirationDate
      });
      break;
    }
  }
}

function updateRowContent(row, data) {
  const {
    restockItemName,
    restockQuantity,
    restockBrand,
    restockDate,
    restockExpirationDate
  } = data;
  row.cells[1].textContent = restockItemName;
  row.cells[2].textContent = restockQuantity;
  row.cells[3].textContent = row.cells[3].textContent;
  row.cells[4].textContent = restockBrand;
  row.cells[5].textContent = restockDate;
  row.cells[6].textContent = restockExpirationDate;
}

// ------------------ DELETE RESTOCK ------------------
function openDeleteModal(row) {
  restockRowToDelete = row;
  deleteRestockModal.classList.remove("hidden");
  deleteRestockModal.classList.add("flex");
}

function closeDeleteModal() {
  deleteRestockModal.classList.add("hidden");
  deleteRestockModal.classList.remove("flex");
  restockRowToDelete = null;
}

// ===============================================================================================
// EVENT HANDLERS

function handleAddRestockSubmit(e) {
  e.preventDefault();

  // Get form values
  const restockItemName = addRestockForm.restockItemName.value.trim();
  const restockQuantity = addRestockForm.restockQuantity.value.trim();
  const restockBrand = addRestockForm.restockBrand.value.trim();
  const restockDate = addRestockForm.restockDate.value.trim();
  const restockExpirationDate =
    addRestockForm.restockExpirationDate.value.trim();

  // Validation
  if (
    !restockItemName ||
    !restockQuantity ||
    !restockBrand ||
    !restockDate ||
    !restockExpirationDate
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  // Date validation
  const restockDateObj = new Date(restockDate);
  const expirationDateObj = new Date(restockExpirationDate);

  if (expirationDateObj < restockDateObj) {
    showToast("Expiration date cannot be before restock date.", true);
    return;
  }

  // Generate random ID
  const restockId =
    "RST" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

  createNewRestockRow(
    restockId,
    restockItemName,
    restockQuantity,
    restockBrand,
    restockDate,
    restockExpirationDate
  );

  closeAddModal();
  showToast("Restock added successfully");
}

function handleEditRestockSubmit(e) {
  e.preventDefault();

  const restockId = document.getElementById("editRestockId").value.trim();
  const restockItemName = document
    .getElementById("editRestockItemName")
    .value.trim();
  const restockDate = document.getElementById("editRestockDate").value;
  const restockExpirationDate = document.getElementById(
    "editRestockExpirationDate"
  ).value;

  if (!restockId || !restockItemName) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  // Date validation
  const restockDateObj = new Date(restockDate);
  const expirationDateObj = new Date(restockExpirationDate);

  if (expirationDateObj < restockDateObj) {
    showToast("Expiration date cannot be before restock date.", true);
    return;
  }

  updateRestockTable(
    restockId,
    restockItemName,
    document.getElementById("editRestockQuantity").value,
    document.getElementById("editRestockBrand").value,
    restockDate,
    restockExpirationDate
  );

  closeEditModal();
  showToast("Restock updated successfully");
}

function handleTableButtonClicks(e) {
  const button = e.target.closest("button");
  if (!button) return;

  const row = button.closest("tr");
  if (!row) return;

  const action = button.getAttribute("aria-label");

  switch (action) {
    case "Edit restock":
      populateEditForm(row);
      break;
    case "Delete restock":
      openDeleteModal(row);
      break;
  }
}

function handleDeleteRestock() {
  if (restockRowToDelete) {
    restockRowToDelete.remove();
    closeDeleteModal();
    showToast("Restock deleted successfully");
  }
}

function populateEditForm(row) {
  const cells = row.children;
  const fieldMap = [
    { id: "editRestockId", idx: 0 },
    { id: "editRestockItemName", idx: 1 },
    { id: "editRestockQuantity", idx: 2 },
    { id: "editRestockBrand", idx: 4 },
    { id: "editRestockDate", idx: 5 },
    { id: "editRestockExpirationDate", idx: 6 },
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

  // Store row index for updating
  editRestockForm.dataset.editingRow = Array.from(tbody.children).indexOf(row);

  openEditModal();
}

// ------------------ TOAST FUNCTIONS ------------------
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

setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

// Add date validation to form inputs
function setupDateValidation() {
  const restockDateInput = document.getElementById("restockDate");
  const expirationDateInput = document.getElementById("restockExpirationDate");

  // Set minimum date for restock date to today
  const today = new Date().toISOString().split("T")[0];
  restockDateInput.min = today;

  // Update expiration date minimum when restock date changes
  restockDateInput.addEventListener("change", function () {
    expirationDateInput.min = this.value;
    if (expirationDateInput.value && expirationDateInput.value < this.value) {
      expirationDateInput.value = this.value;
    }
  });
}
