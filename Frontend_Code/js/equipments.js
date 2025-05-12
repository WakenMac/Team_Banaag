/*
 * This part of the code is for equipment html. most specifically, the modal form.
 */

// Modal logic
const addEquipmentLocation = document.getElementById("equipmentLocation");
const addEquipmentUnit = document.getElementById("equipmentUnit");

const editEquipmentLocation = document.getElementById("editEquipmentLocation");
const editEquipmentUnit = document.getElementById("editEquipmentUnit");

const modalBackdropEditEquipment = document.getElementById(
  "modalBackdropEditEquipment"
);
const equipmentTablesBody = document.getElementById("equipmentTablesBody");

// Remarks Modal
const remarksModal = document.getElementById("remarksModal");
const remarksForm = document.getElementById("remarksForm");
const cancelRemarksBtn = document.getElementById("cancelRemarksBtn");
const modalBackdropRemarks = document.getElementById("modalBackdropRemarks");

// Edit Equipment
const editEquipmentModal = document.getElementById("editEquipmentModal");
const editEquipmentForm = document.getElementById("editEquipmentForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Add Equipment
const addEquipmentBtn = document.getElementById("addEquipmentBtn");
const addEquipmentModal = document.getElementById("addEquipmentModal");
const addEquipmentForm = document.getElementById("addEquipmentForm");
const cancelBtn = document.getElementById("cancelBtn");
const modalBackdropAddEquipment = document.getElementById(
  "modalBackdropAddEquipment"
);

// Delete Equipment
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
let equipmentRowToDelete = null;

const cancelEquipmentBtn = document.getElementById("cancelEquipmentBtn");
const tbody = document.querySelector("tbody");

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

setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

// Editing: Open and close modal
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
  console.log("Row cells:", cells);

  const fieldMap = [
    { id: "editEquipmentId", idx: 0 },
    { id: "editEquipmentName", idx: 1 },
    { id: "editEquipmentUnit", idx: 2 },
    { id: "editEquipmentLocation", idx: 3 },
    { id: "editEquipmentBrand", idx: 4 },
  ];

  // Populate main fields
  for (const { id, idx } of fieldMap) {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Element with id ${id} not found`);
      continue;
    }
    if (!cells[idx]) {
      console.error(`Cell at index ${idx} not found`);
      continue;
    }
    el.value = cells[idx].textContent.trim();
  }

  // Get additional information from info button
  const infoBtn = row.querySelector('button[aria-label="Info"]');
  if (infoBtn) {
    const serialNumber = infoBtn.dataset.csn || "";
    const calibrationDate = infoBtn.dataset.cbd || "";
    const frequencyOfCalibration = infoBtn.dataset.fcb || "";

    const additionalFields = [
      { id: "editEquipmentSerialNumber", value: serialNumber },
      { id: "editEquipmentCalibrationDate", value: calibrationDate },
      { id: "editEquipmentFreqOfCalibration", value: frequencyOfCalibration },
    ];

    for (const { id, value } of additionalFields) {
      const field = document.getElementById(id);
      if (field) {
        field.value = value;
      }
    }
  }

  const remarksBtn = row.querySelector('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    const remarks = remarksBtn.dataset.remarks || "";
    const remarksField = document.getElementById("editEquipmentRemarks");
    if (remarksField) {
      remarksField.value = remarks;
    }
  }

  editEquipmentForm.dataset.editingRow = Array.from(tbody.children).indexOf(
    row
  );
}

tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit equipment"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      populateEditForm(row);
      openEditModal();
    }
  }
});

// Editing Function
// Handle Edit Form Submission
editEquipmentForm.addEventListener("submit", (e) => {
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
  const editEquipmentQuantity = document
    .getElementById("editEquipmentQuantity")
    .value.trim();
  const editEquipmentSerialNumber =
    document.getElementById("editEquipmentSerialNumber")?.value.trim() || "";
  const editEquipmentCalibrationDate =
    document.getElementById("editEquipmentCalibrationDate")?.value.trim() || "";
  const editEquipmentFreqOfCalibration =
    document.getElementById("editEquipmentFreqOfCalibration")?.value.trim() ||
    "";

  // Validation
  if (
    !editEquipmentId ||
    !editEquipmentName ||
    !editEquipmentUnit ||
    !editEquipmentLocation ||
    !editEquipmentBrand ||
    !editEquipmentQuantity
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  // Update the table row
  updateEquipmentTable(
    editEquipmentId,
    editEquipmentName,
    editEquipmentUnit,
    editEquipmentLocation,
    editEquipmentBrand,
    editEquipmentQuantity,
    editEquipmentSerialNumber,
    editEquipmentCalibrationDate,
    editEquipmentFreqOfCalibration
  );

  closeEditModal();
  showToast("Equipment updated successfully");
});

// Function to update the table
function updateEquipmentTable(
  equipmentId,
  equipmentName,
  equipmentUnit,
  equipmentLocation,
  equipmentBrand,
  equipmentQuantity,
  serialNumber,
  calibrationDate,
  frequencyOfCalibration
) {
  const rows = tbody.getElementsByTagName("tr");
  for (let row of rows) {
    if (row.cells[0].textContent === equipmentId) {
      row.cells[1].textContent = equipmentName;
      row.cells[2].textContent = equipmentUnit;
      row.cells[3].textContent = equipmentLocation;
      row.cells[4].textContent = equipmentBrand;
      row.cells[5].textContent = equipmentQuantity;

      // Update info button data attributes
      const infoBtn = row.querySelector('button[aria-label="Info"]');
      if (infoBtn) {
        infoBtn.dataset.csn = serialNumber;
        infoBtn.dataset.cbd = calibrationDate;
        infoBtn.dataset.fcb = frequencyOfCalibration;
      }
      break;
    }
  }
}

// Toast notification function
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
    isError ? "bg-red-500" : "bg-green-500"
  } text-white z-50`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Add click event listener for edit buttons
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit equipment"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      populateEditForm(row);
      openEditModal();
    }
  }
});

// Event listeners for modal actions
modalBackdropEditEquipment.addEventListener("click", closeEditModal);
cancelEditBtn.addEventListener("click", closeEditModal);

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

addEquipmentBtn.addEventListener("click", openEquipmentModal);
cancelEquipmentBtn.addEventListener("click", closeEquipmentModal);
modalBackdropEquipment.addEventListener("click", closeEquipmentModal);

addEquipmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equipmentId = addEquipmentForm.equipmentId.value.trim();
  const equipmentName = addEquipmentForm.equipmentName.value.trim();
  const equipmentUnit = addEquipmentForm.equipmentUnit.value.trim();
  const equipmentLocation = addEquipmentForm.equipmentLocation.value.trim();
  const equipmentBrand = addEquipmentForm.equipmentBrand.value.trim();
  const equipmentQuantity = addEquipmentForm.equipmentQuantity.value.trim();

  if (
    !equipmentId ||
    !equipmentName ||
    !equipmentUnit ||
    !equipmentLocation ||
    !equipmentBrand ||
    !equipmentQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentUnit}</td>
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentLocation}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentBrand}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${equipmentQuantity}</td>
          <td class="px-8 py-4 whitespace-nowrap flex items-center justify-end gap-3">
          <button aria-label="Info" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100"
            data-csn="${equipmentSerialNumber}"
            data-cbd="${equipmentCalibrationDate}"
            data-fcb="${equipmentFreqOfCalibration}">            
            <i class="fas fa-info text-[14px]"></i>
          </button>
          <button aria-label="Add remarks" class="text-gray-700 border border-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-100" data-chemical-id="${chemicalId}">
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
  closeEquipmentModal();
});

// Optional: Add delete functionality for dynamically added rows
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete equipment"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
