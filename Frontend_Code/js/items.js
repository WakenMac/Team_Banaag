// Consumable - Items Management JS

//
let tbody = null;
let consumableItemRowToDelete = null;

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
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${consumableItemsQuantity}</td>
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
      <button aria-label="Delete item" class="text-red-600 hover:text-red-700">
        <i class="fas fa-trash-alt"></i>
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
  consumableItemsId,
  consumableItemsName,
  consumableItemsUnit,
  consumableItemsLocation,
  consumableItemsBrand
) {
  const rows = tbody.getElementsByTagName("tr");
  for (let row of rows) {
    if (row.cells[0].textContent === consumableItemsId) {
      const existingQuantity = row.cells[5].textContent.trim();
      updateRowContent(row, {
        consumableItemsName,
        consumableItemsUnit,
        consumableItemsLocation,
        consumableItemsBrand,
        itemQuantity: existingQuantity,
      });
      break;
    }
  }
}

function updateRowContent(row, data) {
  const {
    consumableItemsName,
    consumableItemsUnit,
    consumableItemsLocation,
    consumableItemsBrand,
    itemQuantity,
  } = data;

  // Update the basic fields
  row.cells[1].textContent = consumableItemsName;
  row.cells[2].textContent = consumableItemsUnit;
  row.cells[3].textContent = consumableItemsLocation;
  row.cells[4].textContent = consumableItemsBrand;
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

function handleDeleteConsumableItems() {
  if (consumableItemRowToDelete) {
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

// -------------------- EVENT HANDLERS --------------------
function handleAddConsumableItemSubmit(e) {
  e.preventDefault();

  // Generate temporary ID
  const consumableItemsId = Math.floor(Math.random() * 1000000).toString();
  const consumableItemsQuantity = Math.floor(Math.random() * 100).toString();

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

  createNewConsumableItemsRow(
    consumableItemsId,
    consumableItemsName,
    consumableItemsUnit,
    consumableItemsLocation,
    consumableItemsBrand,
    consumableItemsQuantity
  );

  closeAddModal();
  showToast("Consumable item added successfully");
}

function handleEditConsumableItemSubmit(e) {
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

  updateConsumableItemTable(
    editConsumableItemsId,
    editConsumableItemsName,
    editConsumableItemsUnit,
    editConsumableItemsLocation,
    editConsumableItemsBrand
  );

  closeEditModal();
  showToast("Consumable item updated successfully");
}

function handleTableButtonClicks(e) {
  const button = e.target.closest("button");
  if (!button) return;

  const row = button.closest("tr");
  if (!row) return;

  const action = button.getAttribute("aria-label");

  switch (action) {
    case "Edit item":
      populateEditForm(row);
      break;
    case "Delete item":
      openDeleteModal(row);
      break;
    case "Add remarks":
      const consumableItemsId = button.getAttribute("data-item-id");
      openRemarksModal(consumableItemsId);
      break;
  }
}

// -------------------- INITIALIZATION --------------------
document.addEventListener("DOMContentLoaded", () => {
  tbody = document.querySelector("#consumableItemsTableBody");

  if (!initializeConsumableItems()) {
    showToast("Could not initialize consumable items table", true);
    return;
  }

  setupEventListeners();
});

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
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
      if (remarksBtn) {
        const consumableItemsId = remarksBtn.getAttribute("data-item-id");
        openRemarksModal(consumableItemsId);
      }
    });
  }

  // Add remarks form submission
  if (remarksForm) {
    remarksForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const consumableItemsId = document.getElementById(
        "remarksConsumableItemsId"
      ).value;
      const remarks = document.getElementById("remarksText").value.trim();

      const remarksBtn = document.querySelector(
        `button[data-item-id="${consumableItemsId}"]`
      );
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
        closeRemarksModal();
        showToast("Remarks updated successfully", false, 3000);
      }

      cancelRemarksBtn.addEventListener("click", closeRemarksModal);
      modalBackdropRemarks.addEventListener("click", closeRemarksModal);
    });
  }
}

// -------------------- TOAST NOTIFICATION --------------------
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
