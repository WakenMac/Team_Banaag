/**
 * CARES - CAS Automated Resource and Equipment System
 * Chemicals Management Module
 *
 * This module handles the management of chemicals in the inventory system.
 * It includes functionality for:
 * - Adding new chemicals
 * - Editing existing chemicals
 * - Deleting chemicals
 * - Adding/viewing remarks
 * - Displaying chemical information in info (tooltip)
 */

import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Place the DOM accessing here please
const tbody = document.getElementById("itemMasterListTableBody");

// Initialize table components
await initialize();

async function initialize() {
  // Initialize dropdown menus
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  await dbhandler.testPresence();
  await prepareItemMasterListTable();

  showToast("Loaded page successfully!");
}

/**
 * Sets up dropdown menu functionality for navigation items
 * @param {string} buttonId - The ID of the dropdown button
 * @param {string} menuId - The ID of the dropdown menu
 */
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

tbody.addEventListener("click", (e) => {
  // This is an experimental code
  let pressedRow = e.target.closest("tr");
  let pressedId = pressedRow.children[0].textContent.trim();
  console.log("Clicked row with the item id of:", pressedId);
});

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

// ===============================================================================================
// FRONT END-RELATED METHODS

/**
 * Method to add a new row to the table
 * @param {int} itemId Primary key of the itemType table
 * @param {string} itemName Name of the item
 * @param {string} quantity Amount or quantity of said item (Combination of quantity + unit)
 */
function createNewItemMasterListRow(itemId, itemName, quantity) {
  // Create new row
  const tr = document.createElement("tr");
  tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${quantity}</td>
  
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                </td>
              `;

  tbody.appendChild(tr);
}

// ===============================================================================================
// SEARCH BAR-RELATED METHODS
function searchItemMasterList() {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput.value.toLowerCase();
  const rows = tbody.querySelectorAll("tr:not(.no-result-row)");
  let hasResult = false;

  const existingNoResults = tbody.querySelector(".no-result-row");
  if (existingNoResults) {
    existingNoResults.remove();
  }

  rows.forEach((row) => {
    const itemName = row.children[1].textContent.toLowerCase();
    const showRow =
      !searchValue ||
      itemName.includes(searchValue) ||
      itemName.startsWith(searchValue);
    row.style.display = showRow ? "" : "none";
    if (showRow) {
      hasResult = true;
    }
  });

  // for (let row of rows) {
  //   let showRow = true;

  //   if (searchValue && showRow) {
  //     const itemName = row.children[1].textContent.toLowerCase();
  //     showRow =
  //       itemName.includes(searchValue) || itemName.startsWith(searchValue);
  //   }

  //   row.style.display = showRow ? "" : "none";
  //   if (showRow) {
  //     hasResult = true;
  //   }

  if (!hasResult && searchValue) {
    const noResultRow = document.createElement("tr");
    noResultRow.className = "no-result-row";
    noResultRow.innerHTML = `
       <td colspan="4" class="px-6 py-9 text-center w-full">
        <div class="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-gray-500 text-lg font-medium">No items found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
      `;
    tbody.appendChild(noResultRow);
  }
}

// Add event listener to the search input
// const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchItemMasterList);

// ===============================================================================================
// BACK END-RELATED METHODS

async function prepareItemMasterListTable() {
  try {
    let data = await dbhandler.getAllItemMasterListRecords();

    if (data.length == 0) {
      console.error("Unit type table has no records.");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      createNewItemMasterListRow(
        data[i]["Item ID"],
        data[i]["Name"],
        data[i]["Quantity"]
      );
    }
  } catch (generalError) {
    console.error(generalError);
  }
}
