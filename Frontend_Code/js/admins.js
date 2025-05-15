import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Modal logic
const addAdminBtn = document.getElementById("addAdminBtn");
const addAdminModal = document.getElementById("addAdminModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const cancelBtn = document.getElementById("cancelBtn");
const addAdminForm = document.getElementById("addAdminForm");
const tbody = document.querySelector("tbody");
const addAdminError = document.getElementById("addAdminError"); // for error message

// Edit and Delete Admin Modal logic
const editAdminModal = document.getElementById("editAdminModal");
const editAdminForm = document.getElementById("editAdminForm");
const cancelEditAdminBtn = document.getElementById("cancelEditAdminBtn");
const modalBackdropEditAdmin = document.getElementById(
  "modalBackdropEditAdmin"
);
const deleteAdminModal = document.getElementById("deleteAdminModal");
const modalBackdropDeleteAdmin = document.getElementById(
  "modalBackdropDeleteAdmin"
);
const cancelDeleteAdminBtn = document.getElementById("cancelDeleteAdminBtn");
const confirmDeleteAdminBtn = document.getElementById("confirmDeleteAdminBtn");
let adminRowToEdit = null;
let adminRowToDelete = null;

// Initialize the tables
initialize();

async function initialize() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  // Prepares the contents of the admin table
  await dbhandler.testPresence();
  await prepareAdminTable();

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

async function openModal() {
  addAdminModal.classList.remove("hidden");
  addAdminModal.classList.add("flex");
}

function closeModal() {
  addAdminModal.classList.add("hidden");
  addAdminModal.classList.remove("flex");
  addAdminForm.reset();
}

addAdminBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

addAdminForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const adminId = addAdminForm.adminId.value.trim();
  const firstName = addAdminForm.firstName.value.trim();
  const middleName = addAdminForm.middleName.value.trim();
  const lastName = addAdminForm.lastName.value.trim();

  // TODO: Add error handling here.
  // Add a global boolean to check if the new addition is valid

  // TODO: Remove the additional listener and turn it into its own event listener
  document
    .getElementById("addAdminForm")
    .addEventListener("submit", async function (e) {
      const password = document.getElementById("adminPassword").value;
      const errorDiv = document.getElementById("addAdminError");

      // TODO: Place this on its own event listener.
      // Password validation
      if (password.length < 8) {
        e.preventDefault();
        errorDiv.textContent = "Password must be at least 8 characters long";
        errorDiv.classList.remove("hidden");
        return;
      }

      errorDiv.classList.add("hidden");

      addAdminError.classList.add("hidden");
      addAdminError.textContent = "";
      if (!adminId || !firstName || !lastName) {
        addAdminError.textContent = "Please fill in all required fields.";
        addAdminError.classList.remove("hidden");
        return;
      }

      let result = await dbhandler.addAdminRecord(
        adminId,
        firstName,
        middleName,
        lastName,
        "randomPassword" // Dili ko manghilabot sa backend code waks hehe
        // password
      );

      if (result.includes("ERROR")) {
        addAdminError.textContent = result.replace(/^ERROR:\s*/i, "");
        addAdminError.classList.remove("hidden");
        return;
      } else {
        createNewAdminRow(
          adminId,
          firstName,
          middleName,
          lastName,
          // "randomPassword"
        );
        console.log(result);
        addAdminError.classList.add("hidden");
        addAdminError.textContent = "";
      }

      dbhandler.testPresence();
      closeModal();
      showToast("Admin added successfully");
    });

  // Hide error message when user starts typing in any input
  [...addAdminForm.querySelectorAll("input")].forEach((input) => {
    input.addEventListener("input", () => {
      addAdminError.classList.add("hidden");
      addAdminError.textContent = "";
    });
  });
}); // End of add admin form event listener

tbody.addEventListener("click", async (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete admin"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      openDeleteAdminModal(row);
    }
  }
});

// =====================================================================================================
// FRONT-END RELATED METHODS

/**
 * Method to create a new admin row to the front end table.
 *
 * @param {*} adminId New ID of the admin (User Defined)
 * @param {*} firstName First name of the admin
 * @param {*} middleName Middle name of the admin
 * @param {*} lastName Last name of the admin
 */
async function createNewAdminRow(adminId, firstName, middleName, lastName) {
  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${adminId}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${firstName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${middleName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-900">${lastName}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
        <button aria-label="Edit admin" class="text-yellow-400 hover:text-yellow-500">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button aria-label="Delete admin" class="text-red-600 hover:text-red-700">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

  tbody.appendChild(tr);
}

// =====================================================================================================
// BACKEND-RELATED METHODS

function openEditAdminModal(row) {
  adminRowToEdit = row;
  const cells = row.children;
  document.getElementById("editAdminId").value = cells[0].textContent;
  document.getElementById("editFirstName").value = cells[1].textContent;
  document.getElementById("editMiddleName").value = cells[2].textContent;
  document.getElementById("editLastName").value = cells[3].textContent;
  editAdminModal.classList.remove("hidden");
  editAdminModal.classList.add("flex");
}

function closeEditAdminModal() {
  editAdminModal.classList.add("hidden");
  editAdminModal.classList.remove("flex");
  editAdminForm.reset();
  adminRowToEdit = null;
}

function openDeleteAdminModal(row) {
  adminRowToDelete = row;
  deleteAdminModal.classList.remove("hidden");
  deleteAdminModal.classList.add("flex");
}

function closeDeleteAdminModal() {
  deleteAdminModal.classList.add("hidden");
  deleteAdminModal.classList.remove("flex");
  adminRowToDelete = null;
}

// Edit button click
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit admin"
  ) {
    const row = e.target.closest("tr");
    openEditAdminModal(row);
  }
});

// Edit modal close
cancelEditAdminBtn.addEventListener("click", closeEditAdminModal);
modalBackdropEditAdmin.addEventListener("click", closeEditAdminModal);

// Delete modal close
cancelDeleteAdminBtn.addEventListener("click", closeDeleteAdminModal);
modalBackdropDeleteAdmin.addEventListener("click", closeDeleteAdminModal);

// Edit form submit
editAdminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const adminId = document.getElementById("editAdminId").value.trim();
  const firstName = document.getElementById("editFirstName").value.trim();
  const middleName = document.getElementById("editMiddleName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  let editAdminError = document.getElementById("editAdminError");
  if (!editAdminError) {
    editAdminError = document.createElement("div");
    editAdminError.id = "editAdminError";
    editAdminError.className =
      "mb-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-3 py-2";
    editAdminForm.prepend(editAdminError);
  }
  editAdminError.classList.add("hidden");
  editAdminError.textContent = "";
  if (!adminId || !firstName || !lastName) {
    editAdminError.textContent = "Please fill in all required fields.";
    editAdminError.classList.remove("hidden");
    return;
  }
  // Check for duplicate Admin ID (except for the current row)
  const rows = tbody.querySelectorAll("tr");
  for (const row of rows) {
    if (row !== adminRowToEdit && row.children[0].textContent === adminId) {
      editAdminError.textContent = "Admin ID is already in use.";
      editAdminError.classList.remove("hidden");
      return;
    }
  }
  let result = await dbhandler.updateAdminRecord(
    adminId,
    firstName,
    middleName,
    lastName,
    ""
  );
  if (result && result.includes("ERROR")) {
    editAdminError.textContent = result.replace(/^ERROR:\s*/i, "");
    editAdminError.classList.remove("hidden");
    return;
  }
  // Update the row in the table
  if (adminRowToEdit) {
    adminRowToEdit.children[0].textContent = adminId;
    adminRowToEdit.children[1].textContent = firstName;
    adminRowToEdit.children[2].textContent = middleName;
    adminRowToEdit.children[3].textContent = lastName;
  }
  editAdminError.classList.add("hidden");
  editAdminError.textContent = "";
  closeEditAdminModal();
  showToast("Admin updated successfully");
});

// Delete confirm
confirmDeleteAdminBtn.addEventListener("click", async () => {
  if (adminRowToDelete) {
    const adminId = adminRowToDelete.children[0].textContent;
    let result = await dbhandler.removeAdminRecordByAdminId(adminId);
    if (result && result.includes("ERROR")) {
      showToast(result.replace(/^ERROR:\s*/i, ""), true);
      return;
    }
    adminRowToDelete.remove();
    closeDeleteAdminModal();
    showToast("Admin deleted successfully");
  }
});

// --- Toast Notification ---
// Shows a small message at the bottom right when something is added, edited, deleted, or an error occurs
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

// SEARCH BAR-RELATED METHODS
function searchAdminTable() {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput.value.toLowerCase();
  const rows = tbody.querySelectorAll("tr:not(.no-result-row)");
  let hasResult = false;

  const existingNoResults = tbody.querySelector(".no-result-row");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  rows.forEach((row) => {
    const adminId = row.children[0].textContent.toLowerCase();
    const firstName = row.children[1].textContent.toLowerCase();
    const middleName = row.children[2].textContent.toLowerCase();
    const lastName = row.children[3].textContent.toLowerCase();
    const showRow =
      !searchValue ||
      adminId.includes(searchValue) ||
      firstName.includes(searchValue) ||
      middleName.includes(searchValue) ||
      lastName.includes(searchValue);

    if (showRow) {
      row.classList.remove("hidden");
      hasResult = true;
    } else {
      row.classList.add("hidden");
    }
  });

  if (!hasResult) {
    const noResultRow = document.createElement("tr");
    noResultRow.classList.add("no-result-row");
    noResultRow.innerHTML = `
    <td colspan="4" class="px-6 py-8 text-center">
      <div class="flex flex-col items-center justify-center space-y-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <p class="text-gray-500 text-lg">No admin found matching "${searchValue}"</p>
      </div>
    </td>
    `;
    tbody.appendChild(noResultRow);
  }
  if (searchValue === "") {
    const noResultRow = tbody.querySelector(".no-result-row");
    if (noResultRow) {
      noResultRow.remove();
    }
  }
}

searchInput.addEventListener("input", searchAdminTable);

// ===== FOR PASSWORD VALIDATION ======
document
  .getElementById("adminPassword")
  .addEventListener("input", function (e) {
    const password = e.target.value;
    const errorDiv = document.getElementById("addAdminError");

    if (password.length > 0 && password.length < 8) {
      errorDiv.textContent = "Password must be at least 8 characters long";
      errorDiv.classList.remove("hidden");
      e.target.classList.add("border-red-500");
    } else {
      errorDiv.classList.add("hidden");
      e.target.classList.remove("border-red-500");
    }
  });

// =====================================================================================================
// BACKEND-RELATED METHODS

// =====================================================================================================
// BACKEND-RELATED METHODS

async function prepareAdminTable(){
  try {
    let data = await dbhandler.getAllAdmins();

    if (data.length == 0){
      console.log("Admins table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++){
      createNewAdminRow(
        data[i]['Admin ID'],
        data[i]['First Name'],
        data[i]['Middle Name'],
        data[i]['Last Name']
      );
    }

  } catch (error){
      console.error(error);
  }
}