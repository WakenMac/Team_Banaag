// import modules
import * as dbhandler from '../../Backend_Code/mainHandler.js';

const tbody = document.querySelector("tbody");

// ===================== Initialize Components =====================
await initialize();

async function initialize() {
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  // Prepares the contents of the admin table
  await dbhandler.testPresence();
  await prepareLocationTable();

  showToast('Loaded page successfully');
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

// Modal logic
const addLocationBtn = document.getElementById("addLocationBtn");
const addLocationModal = document.getElementById("addLocationModal");
const addLocationError = document.getElementById("addLocationError");
const modalBackdropLocation = document.getElementById("modalBackdropLocation");
const addLocationForm = document.getElementById('addLocationForm');
const cancelBtn = document.getElementById("cancelBtn");

addLocationBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", () => {
  addLocationError.classList.add('hidden');
  addLocationError.textContent = '';
  closeModal();
});

function openModal() {
  addLocationModal.classList.remove("hidden");
  addLocationModal.classList.add("flex");
}

function closeModal() {
  addLocationModal.classList.add("hidden");
  addLocationModal.classList.remove("flex");
  addLocationForm.reset();
}

modalBackdropLocation.addEventListener("click", closeModal);
addLocationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const locationName = addLocationForm.locationName.value.trim();

  addLocationError.classList.add("hidden");
  addLocationError.textContent = "";
  if (!locationName) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  // Performs the query in the database
  let result = await dbhandler.addLocationRecord(locationName);

  if (result == null) {
    showToast(`Something went wrong. Please try again.`, true);
    return;
  } else if (result.includes('ERROR')) {
    showToast(result.replace(/^ERROR:\s*/i, ''), true);
    return;
  } else {
    let correctLocationId = result.slice(46, result.length - 1)
    createNewLocationRow(correctLocationId, locationName)
    showToast(result, false);
    closeModal();
  }
});

// Hide error message when user starts typing in the name input
document.getElementById('locationName').addEventListener('input', () => {
  addLocationError.classList.add('hidden');
  addLocationError.textContent = '';
});

// ===================== Edit Glassware Modal Logic =====================

// Modals for editing
const editLocationModal = document.getElementById("editLocationModal");
const editLocationError = document.getElementById("editLocationError");
const editLocationForm = document.getElementById('editLocationForm');
const cancelEditLocationBtn = document.getElementById("cancelEditLocationBtn");
const modalBackdropEditLocation = document.getElementById(
  "modalBackdropEditLocation"
);

cancelEditLocationBtn.addEventListener("click", () => {
  editLocationError.classList.add("hidden");
  editLocationError.textContent = '';
  closeEditModal();
});

modalBackdropEditLocation.addEventListener("click", () => {
  editLocationError.classList.add("hidden");
  editLocationError.textContent = '';
  closeEditModal();
});

function openEditModal() {
  editLocationModal.classList.remove("hidden");
  editLocationModal.classList.add("flex");
}

function closeEditModal() {
  editLocationModal.classList.add("hidden");
  editLocationModal.classList.remove("flex");
  editLocationForm.reset();
}

// Adds edit portion
tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Edit location"
  ) {
    const row = e.target.closest("tr");
    populateEditForm(row);
  }
});

function populateEditForm(row){
  const cells = row.children;
  document.getElementById("editLocationId").value = cells[0].textContent.trim();
  document.getElementById("editLocationName").value = cells[1].textContent.trim();
  openEditModal();
}

editLocationForm.addEventListener('submit', async (e) =>{
  e.preventDefault();
    const editLocationId = document.getElementById("editLocationId").value.trim();
    const editLocationName = document.getElementById("editLocationName").value.trim();
  
    if (!editLocationName) {
      showToast("Please fill in all required fields.", true);
      return;
    }
  
    let result = await dbhandler.updateLocationRecordName(editLocationId, editLocationName);
  
    if (result == null) {
      showToast(`Something went wrong. Please try again.`, true);
      return;
    } else if (result.includes("ERROR")) {
      showToast(result.replace(/^ERROR:\s*/i, ''), true);
      return;
    } else {
      // Update the row in the table
      const rows = tbody.querySelectorAll("tr");
      rows.forEach((row) => {
        if (row.children[0].textContent === editLocationId) {
          row.children[1].textContent = editLocationName;
        }
      });
      closeEditModal();
      showToast('Location edited successfully', false);
    }
});

// ===================== Delete Glassware Modal Logic =====================

// Optional: Add delete functionality for dynamically added rows
tbody.addEventListener("click", async (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete location"
  ) {
    const row = e.target.closest("tr");
    const locationId = row.querySelectorAll('td')[0].textContent; // Selects the ID

    if (row) {
      let result = await dbhandler.removeLocationRecordByLocationId(locationId);

      if (result == null)
        showToast(`The mainHandler.removeLocationByLocationId() DOESN'T return a status statement.`, true)
      else if (result.includes('ERROR'))
        showToast(result.replace(/^ERROR:\s*/i, ''), true);
      else {
        showToast(result, false);
        row.remove();
      }
    }
  }
});

// ===============================================================================================
// FRONT END-RELATED METHODS

/**
 * Method to add a new row to the table
 * @param {int} locationId 
 * @param {string} locationName 
 */
function createNewLocationRow(locationId, locationName) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${locationId}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${locationName}</td>

              <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                <button aria-label="Edit location" class="text-yellow-400 hover:text-yellow-500">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button aria-label="Delete location" class="text-red-600 hover:text-red-700">
                  <i class="fas fa-trash-alt"></i>
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
  setTimeout(() => {
    toast.style.opacity = "0";
  }, (isError)? 4000 : 3000);
}

// ===============================================================================================
// BACK END-RELATED METHODS

async function prepareLocationTable() {
  try {
    let data = await dbhandler.getAllLocationRecordsOrderById();

    if (data.length == 0) {
      console.error('Location table has no records.')
      return;
    }

    for (let i = 0; i < data.length; i++) {
      createNewLocationRow(
        data[i]['Location ID'],
        data[i]['Name']
      )
    }

  } catch (generalError) {
    console.error(generalError);
  }
}