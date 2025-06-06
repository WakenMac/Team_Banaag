// Import the database handler
import * as login from "./login.js";


// Global data
var itemData;
let currentAdminId = null;
let currentAdminName = null;
let selectedItems = [];
var nextTransactionId;
var mod;


// Loads the entire document
document.addEventListener('DOMContentLoaded', () => {
  mod = false;
  if (mod === true)
    currentAdminId = '2023-00570';

  showLoading();
  initializeNewRequest();
  initializeNextTransactionId();
  login.initializePasswordToggle();

  // Get all modal elements (Transactions)
  const returnItemsModal = document.getElementById('returnItemsModal');

  // Transaction history
  const returnBtn = document.getElementById('returnBtn');
  const cancelReturnBtn = document.getElementById('cancelReturnBtn');
  const confirmReturnBtn = document.getElementById('confirmReturnBtn');
  const selectAllItems = document.getElementById('selectAllItems');
  const returnSearchInput = document.getElementById('returnSearchInput');

  returnBtn?.addEventListener('click', () => {
    hideModal('transactionTypeModal');
    loadBorrowedItems();
    showModal('returnItemsModal');
  });

  // Return functionality event listeners
  cancelReturnBtn?.addEventListener('click', () => hideModal('returnItemsModal'));
  confirmReturnBtn?.addEventListener('click', handleReturnItems);

  returnItemsModal?.addEventListener('click', (e) => {
    if (e.target === returnItemsModal) hideModal('returnItemsModal');
  });

  selectAllItems?.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.return-item-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
  });

  returnSearchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#borrowedItemsTable tr:not(.loading-row)');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });

  // Add event listeners for closing the transaction details modal
  const closeBtn = document.getElementById('closeDetailsBtn');
  const closeModalBtn = document.getElementById('closeDetailsModalBtn');

  if (closeBtn) {
    closeBtn.onclick = () => hideModal('transactionDetailsModal');
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => hideModal('transactionDetailsModal');
  }

  hideLoading();
});

//================================================================
// Methods for the borrow requests

// Update item quantity in the selectedItems array
function updateItemQuantity(itemName, newQuantity) {
  const index = selectedItems.findIndex(item => item.itemName === itemName);
  console.log(index)
  if (index !== -1) {
    const inventoryItem = itemData.find(item => itemName.includes(item["Name"]) && itemName.includes(item["Brand"]));
    const maxQuantity = inventoryItem ? inventoryItem["Remaining Quantity"] : 1;

    newQuantity = Math.min(Math.max(1, parseFloat(newQuantity) || 1), maxQuantity);
    selectedItems[index].quantity = newQuantity;

    const input = document.querySelector(`input[data-input="inputQuantity_${itemName}"]`);
    if (input) 
      input.value = newQuantity;
  }
}

// Add item to the selected items table
function addItemToTable(itemName) {
  const selectedItemsTable = document.getElementById('selectedItemsTable');
  const noItemsRow = document.getElementById('noItemsRow');

  if (!selectedItemsTable) return;

  if (selectedItems.some(item => item.itemName.includes(itemName))) {
    showToast('Item already added to the list');
    return;
  }

  const inventoryItem = itemData.find(item => itemName.includes(item["Name"]) && itemName.includes(item["Brand"]));
  if (!inventoryItem) {
    showToast('Item not found in inventory');
    return;
  }

  if (noItemsRow) {
    noItemsRow.style.display = 'none';
  }

  let isConsumable = (inventoryItem["Item Type"].includes('Chemicals') || inventoryItem["Item Type"].includes('Consumable Items')) ? true : false;
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">
      ${isConsumable ? '<span class="text-[#2ca14a] font-medium">*</span>' : ''}${itemName}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900 text-center">${inventoryItem["Remaining Quantity"]}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">
      <div class="flex items-center justify-center w-full space-x-2">
        <button type="button" data-item-button="decrementButton_${itemName}"
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]">
          <i class="fas fa-minus text-gray-600"></i>
        </button>
        <input 
          type="number" 
          value="1"
          min="1"
          max="${inventoryItem["Remaining Quantity"]}"
          name="inputQuantity_${itemName}"
          data-input="inputQuantity_${itemName}"
          class="w-16 text-center rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2ca14a] focus:border-transparent text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        >
        <button type="button" data-item-button="incrementButton_${itemName}"
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]">
          <i class="fas fa-plus text-gray-600"></i>
        </button>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-center">
      <div class="flex justify-center">
        <button type="button" data-item-button="removeButton_${itemName}"
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]" 
          title="Remove item"
        >
          <i class="fas fa-trash-alt text-red-600"></i>
        </button>
      </div>
    </td>
  `;

  let input = row.querySelector(`input[data-input="inputQuantity_${itemName}"]`)
  let incrementButton = row.querySelector(`button[data-item-button="incrementButton_${itemName}"]`)
  let decrementButton = row.querySelector(`button[data-item-button="decrementButton_${itemName}"]`)
  let removeButton = row.querySelector(`button[data-item-button="removeButton_${itemName}"]`)

  input.addEventListener('keyup', async function handleIncrement(e) {
    e.preventDefault();
    let value = row.querySelector(`input[data-input="inputQuantity_${itemName}"]`).value
    updateItemQuantity(itemName, Number(value))
  })

  incrementButton.addEventListener('click', async function handleIncrement(e) {
    e.preventDefault();
    let value = row.querySelector(`input[data-input="inputQuantity_${itemName}"]`).value
    updateItemQuantity(itemName, Number(value) + 1)
  })

  decrementButton.addEventListener('click', async function handleDecrement(e) {
    e.preventDefault();
    let value = row.querySelector(`input[data-input="inputQuantity_${itemName}"]`).value
    updateItemQuantity(itemName, value - 1)
  })

  removeButton.addEventListener('click', async function handleRemove(e) {
    e.preventDefault();
    removeItem(itemName)
  })

  selectedItemsTable.appendChild(row);
  selectedItems.push({ itemName, quantity: 1 });
}

// Remove item from the selected items table
function removeItem(itemName) {
  selectedItems = selectedItems.filter(item => item.itemName === itemName);

  const selectedItemsTable = document.getElementById('selectedItemsTable');
  if (!selectedItemsTable) return;

  const rows = selectedItemsTable.getElementsByTagName('tr');

  for (let row of rows) {
    const cellText = row.cells[0].textContent.trim().replace('*', '');
    if (cellText === itemName) {
      row.remove();
      break;
    }
  }

  const noItemsRow = document.getElementById('noItemsRow');
  if (selectedItems.length === 0 && noItemsRow) {
    noItemsRow.style.display = '';
  }
}

// Clear the items table and reset state
function clearItemsTable() {
  selectedItems = [];
  const selectedItemsTable = document.getElementById('selectedItemsTable');
  if (!selectedItemsTable) return;

  while (selectedItemsTable.children.length > 1) {
    selectedItemsTable.removeChild(selectedItemsTable.lastChild);
  }

  const noItemsRow = document.getElementById('noItemsRow');
  if (noItemsRow) {
    noItemsRow.style.display = '';
  }
}

// ===============================================================================
// Frontend Manipulating Methods

// TODO: Dave there is an error regarding the tableLoadingState lines that are commented. 

// Helper Functions
function showLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const tableLoadingState = document.getElementById('tableLoadingState');

  if (loadingSpinner) {
    loadingSpinner.style.display = 'flex';
  }

  if (tableLoadingState) {
    tableLoadingState.style.display = 'block';
  }
}

function hideLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const tableLoadingState = document.getElementById('tableLoadingState');

  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }

  if (tableLoadingState) {
    tableLoadingState.style.display = 'none';
  }
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMessage || !toastIcon) return;

  toastMessage.textContent = message;

  // Set icon and color
  if (isError) {
    toastIcon.innerHTML = `
      <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8l8 8M16 8l-8 8" />
      </svg>
    `;
    toastIcon.className = "flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-100";
  } else {
    toastIcon.innerHTML = `
      <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    `;
    toastIcon.className = "flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-100";
  }

  toast.classList.remove('hidden');
  toast.classList.add('flex');

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, isError ? 4000 : 3000);
}

// Function to show notifications
function showNotification(message, type) {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
  notification.textContent = message;

  // Add to document
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showModal(modalId) {
  console.log(modalId)
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal with ID ${modalId} not found`);
    return;
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal with ID ${modalId} not found`);
    return;
  }
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ====================================================================
// Backend Methods

// Verify admin credentials using mock data for testing
async function verifyAdmin(adminId, password) {
  try {
    let adminExists = await login.adminExists(adminId, password);

    if (adminExists) {
      currentAdminId = adminId;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
}

async function initializeNewRequest() {
  // Get all form elements (Dashboard)
  const verifyAdminForm = document.getElementById('verifyAdminForm');
  const borrowItemsForm = document.getElementById('borrowItemsForm');

  // Get all button elements
  const addTransactionBtn = document.getElementById('addTransactionBtn');
  const cancelVerifyBtn = document.getElementById('cancelVerifyBtn');
  const addItemBtn = document.getElementById('addItemBtn');
  const borrowBtn = document.getElementById('borrowBtn');
  const cancelBorrowBtn = document.getElementById('cancelBorrowBtn');
  const confirmTransactionBtn = document.getElementById('confirmTransactionBtn');
  const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');

  // Event listeners for transaction type
  if (addTransactionBtn) {
    if (mod == false)
      addTransactionBtn.addEventListener('click', () => showModal('verifyAdminModal'));
    else 
      addTransactionBtn.addEventListener('click', async () => {
        await initializeItemsList();
        showModal('borrowItemsModal')
      });
  }

  verifyAdminForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const adminId = document.getElementById('verifyAdminId').value;
    const password = document.getElementById('password').value;

    const isVerified = await verifyAdmin(adminId, password);
    if (isVerified == true) {
      // Fetch admin record only if adminId is numeric
      const isNumericId = /^\d+$/.test(adminId);
      if (isNumericId) {
        const adminRecord = await getAdminRecordByAdminID(adminId);
        if (adminRecord && adminRecord.data.length > 0) {
          const { "First Name": firstName, "Middle Name": middleName, "Last Name": lastName } = adminRecord.data[0];
          currentAdminName = [firstName, middleName, lastName].filter(Boolean).join(' ');
        } else {
          currentAdminName = adminId; // fallback
        }
      } else {
        currentAdminName = adminId; // fallback for non-numeric IDs
      }
      currentAdminId = adminId;
      await initializeItemsList();
      hideModal('verifyAdminModal');
      showModal('borrowItemsModal');
      verifyAdminForm.reset();
    } else {
      const errorDiv = document.getElementById('verifyAdminError');
      if (errorDiv) {
        errorDiv.textContent = 'Invalid credentials. Please try again.';
        errorDiv.classList.remove('hidden');
      }
    }
  });

  borrowBtn?.addEventListener('click', () => {
    hideModal('transactionTypeModal');
    showModal('borrowItemsModal');
  });

  // Other event listeners
  addItemBtn.addEventListener('click', () => {
    const itemSearch = document.getElementById('itemSearch');
    if (itemSearch?.value) {
      addItemToTable(itemSearch.value);
      itemSearch.value = '';
    }
  });

  // If press enter, it causes the receipt to pop up, without any back button may cause additional errors
  borrowItemsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedItems.length > 0) {
      hideModal('borrowItemsModal');

      // Gather transaction data for the receipt
      const adminId = currentAdminId;
      const adminName = currentAdminName;
      const date = new Date().toLocaleString();
      const items = selectedItems.map(item => ({
        name: item.itemName,
        quantity: item.quantity
      }));

      const borrowRemarks = document.getElementById('borrowRemarks').value.trim();
      showBorrowReceipt({
        transactionId: nextTransactionId,
        adminId,
        adminName,
        date,
        items,
        remarks: borrowRemarks,
        onConfirm: async () => {
          await addTransaction();
        },
        // I've commented this for now, may mga times kasi na if mag transaction tas mag press ng "Enter"
        // accidentally, diretso na tayong reciept, so hindi na makabalik, mawawala pa progress :<
        // So, gi-comment ko muna for now hehe -Waks

        // onCancel: () => {
        //   // Optionally reset forms or UI
        //   selectedItems = [];
        //   clearItemsTable();
        //   document.getElementById('borrowRemarks').value = '';
        // }
        onCancel: () => { // Temporarily makes this a back button
          hideModal('borrowReceiptModal')
          showModal('borrowItemsModal')
        }
      });
    } else {
      showToast('Please add at least one item', true);
    }
  });

  // TODO: ADD transaction
  confirmTransactionBtn?.addEventListener('click', addTransaction);

  cancelVerifyBtn?.addEventListener('click', () => {
    hideModal('verifyAdminModal');
    verifyAdminForm?.reset();
  });

  cancelBorrowBtn?.addEventListener('click', () => {
    hideModal('borrowItemsModal');
    selectedItems = [];
    clearItemsTable();
    document.getElementById('borrowRemarks').value = '';
    const selectedItemsTable = document.getElementById('selectedItemsTable');
    if (selectedItemsTable) selectedItemsTable.innerHTML = '';
  });

  cancelConfirmBtn?.addEventListener('click', () => hideModal('confirmationModal'));
}

async function initializeItemsList() {
  try {
    itemData = await getAllItemMasterListNameBrandRecords();
    
    if (!itemData.success){
      console.error('HTTP Error: Unable to get item master list record.')
      return;
    }

    itemData = itemData.data
    if (itemData.length == 0) {
      console.error("Item Master List table has no records.");
      return;
    }

    const itemsList = document.getElementById('itemsList');
    if (!itemsList) return;

    // Clear existing options
    itemsList.innerHTML = '';

    itemData.forEach((item) => {
      if (Number(item["Remaining Quantity"]) == 0)
        return;

      const option = document.createElement('option');
      option.value = item["Name"] + " (" + item["Brand"] + ")";
      option.textContent = `${item["Remaining Quantity"]} ${item["Unit Type"]} available`;
      itemsList.appendChild(option);
    })

  } catch (generalError) {
    console.error(generalError);
  } finally {
    hideLoading();
  }
}

async function initializeNextTransactionId() {
  try {
    nextTransactionId = await getNextTransactionId();

    if (nextTransactionId.data < 0) {
      console.error("The Next Transaction ID cannot be found.");
      nextTransactionId = 20;
    }

  } catch (generalError) {
    console.error(generalError);
  } finally {
    hideLoading();
  }
}

// Adds a transaction
async function addTransaction() {
  hideModal('confirmationModal');

  let itemIdArray = Array();
  let borrowQuantityArray = Array();
  const borrowRemarks = document.getElementById("borrowRemarks");

  // selected items (itemName, quantity)
  // itemName consists of : Name (Brand)
  selectedItems.forEach((item) => {
    var tempItem = itemData.find(tempItemData => item.itemName.includes(tempItemData["Name"]) == true && item.itemName.includes(tempItemData["Brand"]) == true)

    itemIdArray.push(tempItem["Item ID"]);
    borrowQuantityArray.push(item.quantity);
    console.log(tempItem["Item ID"], " ", item.quantity)
  });

  let result = await addTransactionRecord(currentAdminId, borrowRemarks.value.trim(), itemIdArray, borrowQuantityArray);
  console.log(result);

  if (!result || (typeof result.data === 'string' && result.data.includes("ERROR"))) {
    showToast(result.data || "Transaction failed", true);
  } else {
    // result should be an array/object with the new transaction, e.g. [{ "Transaction ID": ... }]
    let transactionId = nextTransactionId;
    // if (Array.isArray(result) && result[0] && result[0]['Transaction ID']) {
    //   transactionId = result[0]['Transaction ID'];
    // } else if (typeof result === 'object' && result['Transaction ID']) {
    //   transactionId = result['Transaction ID'];
    // } else if (typeof result === 'string') {
    //   transactionId = result; // fallback
    // }

    // Update the receipt modal with the transaction ID
    const receiptContent = document.getElementById('borrowReceiptContent');
    if (receiptContent) {
      const idSpan = receiptContent.querySelector('.text-sm span');
      if (idSpan) idSpan.textContent = transactionId;
    }
    showToast('Transaction completed successfully!', false);
    clearItemsTable();
    selectedItems = [];
    const borrowRemarks = document.getElementById('borrowRemarks');
    if (borrowRemarks) borrowRemarks.value = '';
    nextTransactionId++;
  }
}

// =================================================
// Backend Methods

async function getAllItemMasterListNameBrandRecords(){
  try{
    const response = await fetch(`/iml/get-all-iml-name-brand-records`, {
      method: 'GET',
    });
    
    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }

    const data = await response.json();
    return (data);
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return false;
  }
}

async function getNextTransactionId(){
  try{
    const response = await fetch(`/transaction/get-next-transaction-id`, {
      method: 'GET',
    });
    
    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }

    const data = await response.json();
    return (data);
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return -1;
  }
}

async function getAdminRecordByAdminID(adminId){
  try{
    const response = await fetch(`admins/get-admin-record-by-admin-id`, {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        adminId : adminId,
      })
    });
    
    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }

    const data = await response.json();
    return (data);
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return false;
  }
}

async function addTransactionRecord(currentAdminId, borrowRemarks, itemIdArray, borrowQuantityArray){
  try{
    const response = await fetch(`/transaction/update-transaction-records`, {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        adminId : currentAdminId,
        remarks : borrowRemarks,
        itemIdArray : itemIdArray,
        borrowQuantityArray : borrowQuantityArray
      })
    });
    
    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }

    const data = await response.json();
    return (data);
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return false;
  }
}