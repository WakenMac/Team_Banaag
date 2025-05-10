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

setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

// Modal logic
const addGlasswareBtn = document.getElementById("addGlasswareBtn");
const addGlasswareModal = document.getElementById("addGlasswareModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const cancelBtn = document.getElementById("cancelBtn");
const addGlasswareForm = document.getElementById("addGlasswareForm");
const tbody = document.getElementById("glasswareTableBody");

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

addGlasswareForm.addEventListener("submit", (e) => {
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

  const glasswareQuantity = 0; // Default quantity

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareId}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareName}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareUnit}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareLocation}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareBrand}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">${glasswareQuantity}</td>
    <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
      <button aria-label="Edit glassware" class="text-yellow-400 hover:text-yellow-500">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button aria-label="Delete glassware" class="text-red-600 hover:text-red-700">
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  `;
  tbody.appendChild(tr);
  closeModal();
});

// ===================== Edit and Delete Glassware Modal Logic =====================

// Edit Modal Elements
const editGlasswareModal = document.getElementById("editGlasswareModal");
const editGlasswareForm = document.getElementById("editGlasswareForm");
const cancelEditGlasswareBtn = document.getElementById(
  "cancelEditGlasswareBtn"
);

// Delete Modal Elements
const deleteGlasswareModal = document.getElementById("deleteGlasswareModal");
const cancelDeleteGlasswareBtn = document.getElementById(
  "cancelDeleteGlasswareBtn"
);
const confirmDeleteGlasswareBtn = document.getElementById(
  "confirmDeleteGlasswareBtn"
);

let glasswareRowToEdit = null;
let glasswareRowToDelete = null;

// Field mapping for edit modal and table columns
const glasswareFieldMap = [
  { id: "editGlasswareName", idx: 1 },
  { id: "editGlasswareUnit", idx: 2 },
  { id: "editGlasswareLocation", idx: 3 },
  { id: "editGlasswareBrand", idx: 4 },
  { id: "editGlasswareQuantity", idx: 5 }, // quantity is readonly
];

// Open Edit Modal and populate fields
function openEditGlasswareModal(row) {
  glasswareRowToEdit = row;
  const cells = row.children;
  for (const { id, idx } of glasswareFieldMap) {
    const el = document.getElementById(id);
    if (el && cells[idx]) {
      el.value = cells[idx].textContent;
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

// Save changes on Edit
editGlasswareForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!glasswareRowToEdit) return;
  const cells = glasswareRowToEdit.children;
  // Only update editable fields (not quantity)
  for (const { id, idx } of glasswareFieldMap) {
    if (id === "editGlasswareQuantity") continue; // skip quantity
    const el = document.getElementById(id);
    if (el && cells[idx]) {
      cells[idx].textContent = el.value.trim();
    }
  }
  closeEditGlasswareModal();
});

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

// Confirm Delete
confirmDeleteGlasswareBtn.addEventListener("click", function () {
  if (glasswareRowToDelete) {
    glasswareRowToDelete.remove();
    closeDeleteGlasswareModal();
  }
});

// Table row actions: Edit and Delete
tbody.addEventListener("click", (e) => {
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
