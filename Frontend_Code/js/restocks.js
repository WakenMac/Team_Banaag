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

  showToast("Loaded page successfully!");
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

  // Remarks
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const remarksBtn = e.target.closest('button[aria-label="Add remarks"]');
      if (remarksBtn) {
        const restockId = remarksBtn.getAttribute("data-restock-id");
        openRemarksModal(restockId);
      }
    });
  }

  // Add remarks form submission
  if (remarksForm) {
    remarksForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const restockId = document.getElementById("remarksRestockId").value;
      const remarks = document.getElementById("remarksText").value.trim();

      const remarksBtn = document.querySelector(
        `button[data-restock-id="${restockId}"]`
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
    });

    if (cancelRemarksBtn) {
      cancelRemarksBtn.addEventListener("click", closeRemarksModal);
    }
    modalBackdropRemarks.addEventListener("click", closeRemarksModal);
  }
}

// ------------------------ REMARKS FUNCTIONS ------------------------
function openRemarksModal(restockId) {
  remarksModal.classList.remove("hidden");
  remarksModal.classList.add("flex");
  document.getElementById("remarksRestockId").value = restockId;

  // Check if there are existing remarks
  const remarksBtn = document.querySelector(
    `button[data-restock-id="${restockId}"]`
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
  const remarksField = document.getElementById("editRemarksText");
  if (remarksField) {
    remarksField.value = remarks;
  }
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
        restockExpirationDate,
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
    restockExpirationDate,
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
  const restockId = Math.floor(Math.random() * 1000000)
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
    case "Add remarks":
      const restockId = button.getAttribute("data-restock-id");
      openRemarksModal(restockId);
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

  const remarksBtn = document.querySelector('button[aria-label="Add remarks"]');
  if (remarksBtn) {
    populateRemarksField(remarksBtn);
  }

  // Store row index for updating
  editRestockForm.dataset.editingRow = Array.from(tbody.children).indexOf(row);

  openEditModal();
}

// ------------------ TOAST FUNCTIONS ------------------
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
  setTimeout(
    () => {
      toast.style.opacity = "0";
    },
    isError ? 4000 : 3000
  );
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

// ========================== Filter Functionality ==========================

// function setupFilterFunctionality() {
//   const filterBySelect = document.getElementById("filterBySelect");
//   const timeFrameSelect = document.getElementById("timeFrameSelect");
//   const customDateRange = document.getElementById("customDateRange");
//   const startDate = document.getElementById("startDate");
//   const endDate = document.getElementById("endDate");
//   const searchInput = document.querySelector('input[type="search"]');
//   const clearFilterBtn = document.getElementById("clearFilterBtn");

//   function clearAllFilters() {
//     // Reset all filters
//     timeFrameSelect.classList.add("hidden");
//     customDateRange.classList.add("hidden");
//     searchInput.value = "";
//     startDate.value = "";
//     endDate.value = "";
//     timeFrameSelect.value = "";
//     filterBySelect.value = "";
//     clearFilterBtn.classList.add("hidden");
//     showAllRows();
//   }

//   // Show/hide time frame select based on filter type
//   filterBySelect.addEventListener("change", function () {
//     const selectedValue = this.value;

//     if (selectedValue === "restockDate" || selectedValue === "expirationDate") {
//       timeFrameSelect.classList.remove("hidden");
//       customDateRange.classList.add("hidden");
//       clearFilterBtn.classList.remove("hidden");
//     } else {
//       timeFrameSelect.classList.add("hidden");
//       customDateRange.classList.add("hidden");
//       clearFilterBtn.classList.add("hidden");
//     }
//   });

//   // Clear filter button click handler
//   clearFilterBtn.addEventListener("click", clearAllFilters);

//   // Handle time frame selection
//   timeFrameSelect.addEventListener("change", function () {
//     const selectedTimeFrame = this.value;
//     if (selectedTimeFrame === "custom") {
//       customDateRange.classList.remove("hidden");
//     } else {
//       customDateRange.classList.add("hidden");
//       applyFilter();
//     }
//   });

//   // Apply filter when custom date range is selected
//   startDate.addEventListener("change", applyFilter);
//   endDate.addEventListener("change", applyFilter);

//   function showAllRows() {
//     const rows = tbody.getElementsByTagName("tr");
//     for (let row of rows) {
//       row.style.display = "";
//     }
//   }

//   function applyFilter() {
//     const filterType = filterBySelect.value;
//     const timeFrame = timeFrameSelect.value;
//     const searchValue = searchInput.value.toLowerCase();
//     const rows = tbody.getElementsByTagName("tr");

//     for (let row of rows) {
//       let showRow = true;

//       // Apply date filter if a date filter type is selected
//       if (filterType === "restockDate" || filterType === "expirationDate") {
//         const dateCell =
//           filterType === "restockDate" ? row.cells[5] : row.cells[6];
//         const dateValue = new Date(dateCell.textContent);

//         if (timeFrame === "custom") {
//           const start = new Date(startDate.value);
//           const end = new Date(endDate.value);
//           showRow = dateValue >= start && dateValue <= end;
//         } else {
//           const today = new Date();
//           const startOfDay = new Date(
//             today.getFullYear(),
//             today.getMonth(),
//             today.getDate()
//           );
//           const endOfDay = new Date(
//             today.getFullYear(),
//             today.getMonth(),
//             today.getDate(),
//             23,
//             59,
//             59
//           );

//           switch (timeFrame) {
//             case "today":
//               showRow = dateValue >= startOfDay && dateValue <= endOfDay;
//               break;
//             case "thisWeek":
//               const startOfWeek = new Date(
//                 today.setDate(today.getDate() - today.getDay())
//               );
//               const endOfWeek = new Date(
//                 today.setDate(today.getDate() - today.getDay() + 6)
//               );
//               showRow = dateValue >= startOfWeek && dateValue <= endOfWeek;
//               break;
//             case "thisMonth":
//               const startOfMonth = new Date(
//                 today.getFullYear(),
//                 today.getMonth(),
//                 1
//               );
//               const endOfMonth = new Date(
//                 today.getFullYear(),
//                 today.getMonth() + 1,
//                 0
//               );
//               showRow = dateValue >= startOfMonth && dateValue <= endOfMonth;
//               break;
//             case "thisYear":
//               const startOfYear = new Date(today.getFullYear(), 0, 1);
//               const endOfYear = new Date(today.getFullYear(), 11, 31);
//               showRow = dateValue >= startOfYear && dateValue <= endOfYear;
//               break;
//           }
//         }
//       }

//       // Apply search filter if there's a search value
//       if (searchValue && showRow) {
//         const itemName = row.cells[1].textContent.toLowerCase();
//         const brand = row.cells[4].textContent.toLowerCase();
//         showRow = itemName.includes(searchValue) || brand.includes(searchValue);
//       }

//       row.style.display = showRow ? "" : "none";

//       const rows = tbody.getElementsByTagName("tr");
//       let hasResults = false;

//       // Remove existing no results message if present
//       const existingMessage = tbody.querySelector(".no-result-row");
//       if (existingMessage) {
//         existingMessage.remove();
//       }

//       for (let row of rows) {
//         let showRow = true;

//         row.style.display = showRow ? "" : "none";
//         if (showRow) hasResults = true;
//       }

//       // Show no results message if needed
//       if (!hasResults) {
//         const noResultRow = document.createElement("tr");
//         noResultRow.className = "no-result-row";
//         noResultRow.innerHTML = `
//           <td colspan="8" class="px-6 py-16 text-center w-full">
//             <div class="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
//               <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//               </svg>
//               <p class="text-gray-500 text-lg font-medium">No restocks found${
//                 searchValue ? ` matching "${searchValue}"` : ""
//               }</p>
//               <p class="text-gray-400 text-base">Try adjusting your filters</p>
//             </div>
//           </td>
//         `;
//         tbody.appendChild(noResultRow);
//       }
//     }
//   }

//   // Add search input event listener
//   searchInput.addEventListener("input", applyFilter);
// }

// // Initialize filter functionality
// setupFilterFunctionality();
function setupFilterFunctionality() {
  const elements = {
    filterBySelect: document.getElementById("filterBySelect"),
    timeFrameSelect: document.getElementById("timeFrameSelect"),
    customDateRange: document.getElementById("customDateRange"),
    startDate: document.getElementById("startDate"),
    endDate: document.getElementById("endDate"),
    searchInput: document.querySelector('input[type="search"]'),
    clearFilterBtn: document.getElementById("clearFilterBtn"),
    tbody: document.getElementById("restocksTableBody"),
  };

  function clearAllFilters() {
    elements.timeFrameSelect.classList.add("hidden");
    elements.customDateRange.classList.add("hidden");
    elements.searchInput.value = "";
    elements.startDate.value = "";
    elements.endDate.value = "";
    elements.timeFrameSelect.value = "";
    elements.filterBySelect.value = "";
    elements.clearFilterBtn.classList.add("hidden");
    showAllRows();
    removeNoResultsMessage();
  }

  function showAllRows() {
    const rows = elements.tbody.getElementsByTagName("tr");
    Array.from(rows).forEach((row) => (row.style.display = ""));
  }

  function applyFilter() {
    const filterType = elements.filterBySelect.value;
    const timeFrame = elements.timeFrameSelect.value;
    const searchValue = elements.searchInput.value.toLowerCase();
    const rows = elements.tbody.getElementsByTagName("tr");
    let hasResults = false;

    removeNoResultsMessage();

    Array.from(rows).forEach((row) => {
      let showRow = true;

      // Apply date filter
      if (filterType === "restockDate" || filterType === "expirationDate") {
        const dateCell =
          filterType === "restockDate" ? row.cells[5] : row.cells[6];
        const dateValue = new Date(dateCell.textContent);
        showRow = isDateInRange(dateValue, timeFrame);
      }

      // Apply search filter
      if (searchValue && showRow) {
        const itemName = row.cells[1].textContent.toLowerCase();
        const brand = row.cells[4].textContent.toLowerCase();
        showRow = itemName.includes(searchValue) || brand.includes(searchValue);
      }

      row.style.display = showRow ? "" : "none";
      if (showRow) hasResults = true;
    });

    if (!hasResults) {
      showNoResultsMessage(searchValue, filterType, timeFrame);
    }
  }

  function isDateInRange(date, timeFrame) {
    if (timeFrame === "custom") {
      const start = elements.startDate.value
        ? new Date(elements.startDate.value)
        : null;
      const end = elements.endDate.value
        ? new Date(elements.endDate.value)
        : null;
      return (!start || date >= start) && (!end || date <= end);
    }

    const today = new Date();
    const ranges = {
      today: {
        start: new Date(today.setHours(0, 0, 0, 0)),
        end: new Date(today.setHours(23, 59, 59, 999)),
      },
      thisWeek: {
        start: new Date(today.setDate(today.getDate() - today.getDay())),
        end: new Date(today.setDate(today.getDate() + 6)),
      },
      thisMonth: {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      },
      thisYear: {
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today.getFullYear(), 11, 31),
      },
    };

    const range = ranges[timeFrame];
    return range ? date >= range.start && date <= range.end : true;
  }

  function removeNoResultsMessage() {
    const existingMessage = elements.tbody.querySelector(".no-result-row");
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  function showNoResultsMessage(searchValue, filterType, timeFrame) {
    const noResultRow = document.createElement("tr");
    noResultRow.className = "no-result-row";
    noResultRow.innerHTML = `
      <td colspan="8" class="px-6 py-16 text-center w-full">
        <div class="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-gray-500 text-lg font-medium">No restocks found${
            searchValue ? ` matching "${searchValue}"` : ""
          }</p>
          <p class="text-gray-400 text-base">Try adjusting your filters</p>
        </div>
      </td>
    `;
    elements.tbody.appendChild(noResultRow);
  }

  // Event Listeners
  elements.filterBySelect.addEventListener("change", function () {
    const showTimeFrame =
      this.value === "restockDate" || this.value === "expirationDate";
    elements.timeFrameSelect.classList.toggle("hidden", !showTimeFrame);
    elements.customDateRange.classList.add("hidden");
    elements.clearFilterBtn.classList.toggle("hidden", !this.value);
    applyFilter();
  });

  elements.timeFrameSelect.addEventListener("change", function () {
    elements.customDateRange.classList.toggle(
      "hidden",
      this.value !== "custom"
    );
    if (this.value !== "custom") applyFilter();
  });

  elements.searchInput.addEventListener("input", applyFilter);
  elements.startDate.addEventListener("change", applyFilter);
  elements.endDate.addEventListener("change", applyFilter);
  elements.clearFilterBtn.addEventListener("click", clearAllFilters);
}

// Initialize filter functionality
setupFilterFunctionality();
