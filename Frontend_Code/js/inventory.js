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

import * as dbhandler from '../../Backend_Code/mainHandler.js';

// Place the DOM accessing here please, thankies -Waks
const tbody = document.getElementById('itemMasterListTableBody');

// Initialize table components
await initialize();

async function initialize(){
  // Initialize dropdown menus
  setupDropdown("masterlistBtn", "masterlistMenu");
  setupDropdown("consumablesBtn", "consumablesMenu");
  setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
  setupDropdown("propertiesBtn", "propertiesMenu");

  await dbhandler.testPresence();
  await prepareItemMasterListTable();
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
  let pressedRow = e.target.closest('tr');
  let pressedId = pressedRow.children[0].textContent.trim();
  console.log('Clicked row with the item id of:', pressedId);
});

// ===============================================================================================
// FRONT END-RELATED METHODS

/**
 * Method to add a new row to the table
 * @param {int} itemId Primary key of the itemType table
 * @param {string} itemName Name of the item 
 * @param {string} quantity Amount or quantity of said item (Combination of quantity + unit) 
 */
function createNewItemMasterListRow(itemId, itemName, quantity){
  // Create new row
  const tr = document.createElement("tr");
  tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${itemName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900">${quantity}</td>
  
                <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                  <button aria-label="Edit unit type" class="text-yellow-400 hover:text-yellow-500">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button aria-label="Delete unit type" class="text-red-600 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              `;

  tbody.appendChild(tr);
}

// ===============================================================================================
// BACK END-RELATED METHODS

async function prepareItemMasterListTable(){
  try{
    let data = await dbhandler.getAllItemMasterListRecords();

    if (data.length == 0){
      console.error('Unit type table has no records.')
      return;
    }

    for (let i = 0; i < data.length; i++){
      createNewItemMasterListRow(
        data[i]['Item ID'],
        data[i]['Name'],
        data[i]['Quantity'] 
      )
    }

  } catch (generalError){
      console.error(generalError);
  }
}