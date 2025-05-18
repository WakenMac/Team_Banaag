// Import the database handler
import * as dbhandler from "../../Backend_Code/mainHandler.js";

// NOTE THAT ALL DATA HERE IS MOCK DATA FOR TESTING PURPOSES
// Loading state management
function showLoading() {
  document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingSpinner').style.display = 'none';
}

// Initialize the page
async function initializePage() {
  try {
    showLoading();
    
    // Initialize all the required data
    await Promise.all([
      initializeItemsList(),
    ]);
    
    // Hide loading spinner after everything is loaded
    hideLoading();
  } catch (error) {
    console.error('Error initializing page:', error);
    hideLoading();
    showToast('Error loading page. Please refresh.');
  }
}

// Mock admin data for testing
const mockAdmins = [
  { admin_id: '123', password: 'password123' },
  { admin_id: 'admin', password: 'admin123' }
];

// Mock inventory data for testing
const mockInventory = [
  { item_name: 'Beaker 100ml', available_quantity: 10, is_consumable: false },
  { item_name: 'Test Tube', available_quantity: 50, is_consumable: false },
  { item_name: 'Microscope', available_quantity: 5, is_consumable: false },
  { item_name: 'Petri Dish', available_quantity: 30, is_consumable: true },
  { item_name: 'Bunsen Burner', available_quantity: 8, is_consumable: false },
  { item_name: 'pH Meter', available_quantity: 3, is_consumable: false },
  { item_name: 'Safety Goggles', available_quantity: 25, is_consumable: false },
  { item_name: 'Lab Coat', available_quantity: 15, is_consumable: false }
];

// Mock borrowed items data for testing
const mockBorrowedItems = [
  {
    id: 'TRANS-001',
    transaction_date: '2024-03-15',
    items: {
      id: 1,
      name: 'Microscope',
      is_consumable: false
    },
    quantity: 2,
    returned_quantity: 0
  },
  {
    id: 'TRANS-002',
    transaction_date: '2024-03-14',
    items: {
      id: 2,
      name: 'Beaker 100ml',
      is_consumable: false
    },
    quantity: 5,
    returned_quantity: 2
  },
  {
    id: 'TRANS-003',
    transaction_date: '2024-03-14',
    items: {
      id: 3,
      name: 'Test Tube',
      is_consumable: false
    },
    quantity: 10,
    returned_quantity: 0
  },
  {
    id: 'TRANS-004',
    transaction_date: '2024-03-13',
    items: {
      id: 4,
      name: 'pH Meter',
      is_consumable: false
    },
    quantity: 1,
    returned_quantity: 0
  },
  {
    id: 'TRANS-005',
    transaction_date: '2024-03-13',
    items: {
      id: 5,
      name: 'Safety Goggles',
      is_consumable: false
    },
    quantity: 8,
    returned_quantity: 5
  }
];

// Store the current admin ID after verification
let currentAdminId = null;
let selectedItems = [];

// Initialize datalist with mock items
function initializeItemsList() {
  const itemsList = document.getElementById('itemsList');
  if (!itemsList) return; // Guard clause if element doesn't exist
  
  itemsList.innerHTML = '';
  mockInventory.forEach(item => {
    const option = document.createElement('option');
    option.value = item.item_name;
    itemsList.appendChild(option);
  });
}

// Helper function to show/hide modals
function showModal(modal) {
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function hideModal(modal) {
  if (!modal) return;
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Verify admin credentials using mock data for testing
async function verifyAdmin(adminId, password) {
  try {
    const adminExists = mockAdmins.some(admin => 
      admin.admin_id === adminId && admin.password === password
    );
    
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

// Update item quantity in the selectedItems array
function updateItemQuantity(itemName, newQuantity) {
  const index = selectedItems.findIndex(item => item.itemName === itemName);
  if (index !== -1) {
    const inventoryItem = mockInventory.find(item => item.item_name === itemName);
    const maxQuantity = inventoryItem ? inventoryItem.available_quantity : 1;
    
    newQuantity = Math.min(Math.max(1, parseInt(newQuantity) || 1), maxQuantity);
    selectedItems[index].quantity = newQuantity;
    
    const input = document.querySelector(`input[data-item="${itemName}"]`);
    if (input) {
      input.value = newQuantity;
    }
  }
}

// Add item to the selected items table
function addItemToTable(itemName) {
  const selectedItemsTable = document.getElementById('selectedItemsTable');
  const noItemsRow = document.getElementById('noItemsRow');
  
  if (!selectedItemsTable) return;
  
  if (selectedItems.some(item => item.itemName === itemName)) {
    showToast('Item already added to the list');
    return;
  }
  
  const inventoryItem = mockInventory.find(item => item.item_name === itemName);
  if (!inventoryItem) {
    showToast('Item not found in inventory');
    return;
  }
  
  if (noItemsRow) {
    noItemsRow.style.display = 'none';
  }
  
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">
      ${inventoryItem.is_consumable ? '<span class="text-[#2ca14a] font-medium">*</span>' : ''}${itemName}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900 text-center">${inventoryItem.available_quantity}</td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-900">
      <div class="flex items-center justify-center w-full space-x-2">
        <button type="button" 
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]"
          onclick="updateItemQuantity('${itemName}', (parseInt(document.querySelector('input[data-item=\\'${itemName}\\']').value) || 1) - 1)">
          <i class="fas fa-minus text-gray-600"></i>
        </button>
        <input 
          type="number" 
          value="1"
          min="1"
          max="${inventoryItem.available_quantity}"
          data-item="${itemName}"
          class="w-16 text-center rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2ca14a] focus:border-transparent text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          onchange="updateItemQuantity('${itemName}', this.value)"
        >
        <button type="button"
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]"
          onclick="updateItemQuantity('${itemName}', (parseInt(document.querySelector('input[data-item=\\'${itemName}\\']').value) || 1) + 1)">
          <i class="fas fa-plus text-gray-600"></i>
        </button>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-center">
      <div class="flex justify-center">
        <button type="button" 
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]" 
          onclick="removeItem('${itemName}')"
          title="Remove item"
        >
          <i class="fas fa-trash-alt text-red-600"></i>
        </button>
      </div>
    </td>
  `;
  
  selectedItemsTable.appendChild(row);
  selectedItems.push({ itemName, quantity: 1 });
}


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

// Remove item from the selected items table
function removeItem(itemName) {
  selectedItems = selectedItems.filter(item => item.itemName !== itemName);
  
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

// Return functionality
async function loadBorrowedItems() {
  const borrowedItemsTable = document.getElementById('borrowedItemsTable');
  
  if (!borrowedItemsTable) {
    console.error('Borrowed items table not found');
    return;
  }

  // Show loading state
  borrowedItemsTable.innerHTML = `
    <tr class="loading-row h-[250px] text-center text-gray-500 italic">
      <td colspan="6" class="align-middle">Loading borrowed items...</td>
    </tr>
  `;

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter out consumable items from mock data
    const nonConsumableItems = mockBorrowedItems.filter(item => !item.items?.is_consumable);

    if (nonConsumableItems.length === 0) {
      borrowedItemsTable.innerHTML = `
        <tr class="h-[250px] text-center text-gray-500 italic">
          <td colspan="6" class="align-middle">No items available for return</td>
        </tr>
      `;
      return;
    }

    // Populate table with borrowed items
    borrowedItemsTable.innerHTML = nonConsumableItems.map(item => {
      const remainingQuantity = item.quantity - (item.returned_quantity || 0);
      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4">
            <input type="checkbox" 
              class="return-item-checkbox rounded border-gray-300 text-[#2ca14a] focus:ring-[#2ca14a]"
              data-item-id="${item.id}">
          </td>
          <td class="px-6 py-4">${item.id}</td>
          <td class="px-6 py-4">${item.items?.name || 'Unknown Item'}</td>
          <td class="px-6 py-4">${item.quantity}</td>
          <td class="px-6 py-4">${new Date(item.transaction_date).toLocaleDateString()}</td>
          <td class="px-6 py-4">
            <input type="number" 
              class="return-quantity w-20 rounded-md border border-gray-300 px-2 py-1"
              min="1"
              max="${remainingQuantity}"
              value="${remainingQuantity}">
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error displaying borrowed items:', error);
    borrowedItemsTable.innerHTML = `
      <tr class="h-[250px] text-center text-gray-500 italic">
        <td colspan="6" class="align-middle">Error loading items. Please try again.</td>
      </tr>
    `;
    showToast('Error loading borrowed items', true);
  }
}

async function handleReturnItems() {
  const checkedItems = document.querySelectorAll('.return-item-checkbox:checked');
  const returnNotes = document.getElementById('returnNotes')?.value.trim() || '';
  
  if (checkedItems.length === 0) {
    showToast('Please select items to return', true);
    return;
  }

  // Show loading state
  const confirmReturnBtn = document.getElementById('confirmReturnBtn');
  if (confirmReturnBtn) {
    confirmReturnBtn.disabled = true;
    confirmReturnBtn.innerHTML = `
      <div class="flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
        Processing...
      </div>
    `;
  }

  try {
    const itemsToReturn = [];
    
    // Validate all items first
    for (const checkbox of checkedItems) {
      const row = checkbox.closest('tr');
      if (!row) continue;
      
      const transactionId = checkbox.dataset.itemId;
      const returnQuantityInput = row.querySelector('.return-quantity');
      const returnQuantity = parseInt(returnQuantityInput?.value);
      const maxQuantity = parseInt(returnQuantityInput?.getAttribute('max'));
      
      // Validate return quantity
      if (!returnQuantity || isNaN(returnQuantity) || returnQuantity < 1) {
        throw new Error(`Invalid return quantity for transaction ${transactionId}`);
      }
      
      if (returnQuantity > maxQuantity) {
        throw new Error(`Return quantity cannot exceed borrowed quantity for transaction ${transactionId}`);
      }
      
      itemsToReturn.push({ transactionId, returnQuantity });
    }

    // Process returns using mock data
    for (const item of itemsToReturn) {
      const borrowedItem = mockBorrowedItems.find(mock => mock.id === item.transactionId);
      if (!borrowedItem) {
        throw new Error(`Transaction ${item.transactionId} not found`);
      }

      // Update mock data
      borrowedItem.returned_quantity = (borrowedItem.returned_quantity || 0) + item.returnQuantity;
      
      // If all items are returned, mark as fully returned
      if (borrowedItem.returned_quantity >= borrowedItem.quantity) {
        borrowedItem.is_returned = true;
      }

      // Update inventory mock data
      const inventoryItem = mockInventory.find(inv => inv.item_name === borrowedItem.items.name);
      if (inventoryItem) {
        inventoryItem.available_quantity += item.returnQuantity;
      }
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    showToast('Items returned successfully');
    closeReturnModal();
    
    // Refresh the borrowed items list
    await loadBorrowedItems();
    
  } catch (error) {
    console.error('Error processing returns:', error);
    showToast(error.message || 'Error processing returns. Please try again.', true);
  } finally {
    // Reset button state
    if (confirmReturnBtn) {
      confirmReturnBtn.disabled = false;
      confirmReturnBtn.innerHTML = 'Return Selected Items';
    }
  }
}

function closeReturnModal() {
  const returnItemsModal = document.getElementById('returnItemsModal');
  if (!returnItemsModal) return;
  
  hideModal(returnItemsModal);
  const returnNotes = document.getElementById('returnNotes');
  const returnSearchInput = document.getElementById('returnSearchInput');
  const selectAllItems = document.getElementById('selectAllItems');

  if (returnNotes) returnNotes.value = '';
  if (returnSearchInput) returnSearchInput.value = '';
  if (selectAllItems) selectAllItems.checked = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the page
  initializePage();

  // Get all modal elements
  const verifyAdminModal = document.getElementById('verifyAdminModal');
  const transactionTypeModal = document.getElementById('transactionTypeModal');
  const borrowItemsModal = document.getElementById('borrowItemsModal');
  const confirmationModal = document.getElementById('confirmationModal');
  const returnItemsModal = document.getElementById('returnItemsModal');

  // Get all form elements
  const verifyAdminForm = document.getElementById('verifyAdminForm');
  const borrowItemsForm = document.getElementById('borrowItemsForm');

  // Get all button elements
  const addTransactionBtn = document.getElementById('addTransactionBtn');
  const cancelVerifyBtn = document.getElementById('cancelVerifyBtn');
  const borrowBtn = document.getElementById('borrowBtn');
  const returnBtn = document.getElementById('returnBtn');
  const addItemBtn = document.getElementById('addItemBtn');
  const cancelBorrowBtn = document.getElementById('cancelBorrowBtn');
  const cancelReturnBtn = document.getElementById('cancelReturnBtn');
  const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
  const confirmTransactionBtn = document.getElementById('confirmTransactionBtn');
  const confirmReturnBtn = document.getElementById('confirmReturnBtn');
  const selectAllItems = document.getElementById('selectAllItems');
  const returnSearchInput = document.getElementById('returnSearchInput');

  // Event listeners for transaction type
  addTransactionBtn?.addEventListener('click', () => showModal(verifyAdminModal));

  verifyAdminForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminId = document.getElementById('verifyAdminId').value;
    const password = document.getElementById('verifyAdminPassword').value;
    
    const isVerified = await verifyAdmin(adminId, password);
    if (isVerified) {
      hideModal(verifyAdminModal);
      showModal(transactionTypeModal);
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
    hideModal(transactionTypeModal);
    showModal(borrowItemsModal);
    initializeItemsList();
  });

  returnBtn?.addEventListener('click', () => {
    hideModal(transactionTypeModal);
    loadBorrowedItems();
    showModal(returnItemsModal);
  });

  // Return functionality event listeners
  cancelReturnBtn?.addEventListener('click', closeReturnModal);
  confirmReturnBtn?.addEventListener('click', handleReturnItems);

  returnItemsModal?.addEventListener('click', (e) => {
    if (e.target === returnItemsModal) closeReturnModal();
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

  // Other event listeners
  addItemBtn?.addEventListener('click', () => {
    const itemSearch = document.getElementById('itemSearch');
    if (itemSearch?.value) {
      addItemToTable(itemSearch.value);
      itemSearch.value = '';
    }
  });

  borrowItemsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (selectedItems.length > 0) {
      hideModal(borrowItemsModal);
      showModal(confirmationModal);
    } else {
      showToast('Please add at least one item');
    }
  });

  confirmTransactionBtn?.addEventListener('click', () => {
    hideModal(confirmationModal);
    showToast('Transaction completed successfully!');
    clearItemsTable();
    const borrowRemarks = document.getElementById('borrowRemarks');
    if (borrowRemarks) borrowRemarks.value = '';
  });

  cancelVerifyBtn?.addEventListener('click', () => {
    hideModal(verifyAdminModal);
    verifyAdminForm?.reset();
  });

  cancelBorrowBtn?.addEventListener('click', () => {
    hideModal(borrowItemsModal);
    selectedItems = [];
    const selectedItemsTable = document.getElementById('selectedItemsTable');
    if (selectedItemsTable) selectedItemsTable.innerHTML = '';
  });

  cancelConfirmBtn?.addEventListener('click', () => hideModal(confirmationModal));
});

// Make functions available globally
window.removeItem = removeItem;
window.updateItemQuantity = updateItemQuantity; 
window.updateItemQuantity = updateItemQuantity; 