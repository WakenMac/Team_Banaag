// Import the database handler
import * as dbhandler from "../../Backend_Code/mainHandler.js";

// Mock data for testing
const mockAdmins = [
  { admin_id: '123', password: 'password123', name: 'John Smith' },
  { admin_id: 'admin', password: 'admin123', name: 'Jane Doe' }
];

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

const mockTransactionHistory = [
  {
    transaction_id: 'TRANS-001',
    type: 'borrow',
    admin_id: '123',
    admin_name: 'Waken Cean Maclang',
    items: [
      { name: 'Microscope', quantity: 2, is_consumable: false },
      { name: 'Petri Dish', quantity: 5, is_consumable: true }
    ],
    date: '2024-03-15T09:30:00',
    status: 'pending_return',
    remarks: 'For biology class'
  },
  {
    transaction_id: 'TRANS-002',
    type: 'borrow',
    admin_id: '123',
    admin_name: 'Dave Shanna Marie Gigawin',
    items: [
      { name: 'Beaker 100ml', quantity: 5, is_consumable: false }
    ],
    date: '2024-03-14T14:15:00',
    status: 'partially_returned',
    remarks: 'Chemistry experiment'
  },
  {
    transaction_id: 'TRANS-003',
    type: 'borrow',
    admin_id: '456',
    admin_name: 'Allan Tagle',
    items: [
      { name: 'Test Tube', quantity: 10 }
    ],
    date: '2024-03-14T11:45:00',
    status: 'pending_return',
    remarks: 'Lab practice'
  },
  {
    transaction_id: 'TRANS-004',
    type: 'return',
    admin_id: '123',
    admin_name: 'Jeff Ronyl Pausal',
    items: [
      { name: 'Beaker 100ml', quantity: 3 }
    ],
    date: '2024-03-15T16:20:00',
    status: 'completed',
    remarks: 'Returned in good condition'
  }
];

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
]

// Global state
let currentAdminId = null;
let selectedItems = [];
let filteredTransactions = [];

// Initialize the page
async function initializePage() {
  try {
    showLoading();
    await loadTransactionHistory();
    setupEventListeners();
    hideLoading();
  } catch (error) {
    console.error('Error initializing page:', error);
    hideLoading();
    showToast('Error loading page. Please refresh.', true);
  }
}

// TODO: Dave there is an error regarding the tableLoadingState lines that are commented. 

// Helper Functions
function showLoading() {
  document.getElementById('loadingSpinner').style.display = 'flex';
  document.getElementById('tableLoadingState').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loadingSpinner').style.display = 'none';
  document.getElementById('tableLoadingState').style.display = 'none';
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  
  toast.style.backgroundColor = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(44, 161, 74, 0.95)';
  
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, isError ? 4000 : 3000);
}

function getStatusStyle(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending_return':
      return 'bg-yellow-100 text-yellow-800';
    case 'partially_returned':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Transaction History Functions
async function loadTransactionHistory() {
  const table = document.getElementById('transactionHistoryTable');
  if (!table) return;

  try {
    showTableLoading();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Apply filters
    const searchTerm = document.getElementById('transactionSearch')?.value.toLowerCase() || '';
    const type = document.getElementById('transactionFilter')?.value || 'all';
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    filteredTransactions = mockTransactionHistory.filter(transaction => {
      const matchesSearch = 
        transaction.transaction_id.toLowerCase().includes(searchTerm) ||
        transaction.admin_name.toLowerCase().includes(searchTerm);

      const matchesType = type === 'all' || transaction.type === type;

      const transactionDate = new Date(transaction.date);
      const matchesDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                              (!endDate || transactionDate <= new Date(endDate));

      return matchesSearch && matchesType && matchesDateRange;
    });

    // Sort by date (most recent first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredTransactions.length === 0) {
      table.innerHTML = `
        <tr class="h-[250px] text-center text-gray-500 italic">
          <td colspan="5" class="align-middle">
            No transactions found
          </td>
        </tr>
      `;
      hideTableLoading();
      return;
    }

    // Render transactions
    table.innerHTML = filteredTransactions.map(transaction => `
      <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150" onclick="showTransactionDetails('${transaction.transaction_id}')">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${transaction.transaction_id}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${formatDateTime(transaction.date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${transaction.type === 'borrow' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
            ${transaction.type}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${transaction.admin_name}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${getStatusStyle(transaction.status)}">
            ${transaction.status.replace('_', ' ')}
          </span>
        </td>
      </tr>
    `).join('');

    hideTableLoading();
  } catch (error) {
    console.error('Error loading transactions:', error);
    table.innerHTML = `
      <tr class="h-[250px] text-center text-red-500 italic">
        <td colspan="5" class="align-middle">
          Error loading transactions. Please try again.
        </td>
      </tr>
    `;
    hideTableLoading();
  }
}

function showTableLoading() {
  const table = document.getElementById('transactionHistoryTable');
  if (!table) return;

  table.innerHTML = Array(5).fill(0).map(() => `
    <tr class="animate-pulse">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="h-4 bg-gray-200 rounded w-28"></div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  `).join('');
}

function hideTableLoading() {
  document.getElementById('tableLoadingState').style.display = 'none';
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('transactionSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => loadTransactionHistory(), 300));
  }

  // Transaction type filter
  const typeFilter = document.getElementById('transactionFilter');
  if (typeFilter) {
    typeFilter.addEventListener('change', () => loadTransactionHistory());
  }

  // Date filters
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  if (startDate && endDate) {
    startDate.addEventListener('change', () => loadTransactionHistory());
    endDate.addEventListener('change', () => loadTransactionHistory());
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Make functions available globally for onclick handlers
window.showTransactionDetails = showTransactionDetails;

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
      
      // Debug logging
      console.log(`Transaction ${transactionId}:`, {
        returnQuantity,
        maxQuantity,
        comparison: returnQuantity > maxQuantity
      });
      
      // Validate return quantity
      if (!returnQuantity || isNaN(returnQuantity) || returnQuantity < 1) {
        throw new Error(`Invalid return quantity for transaction ${transactionId}`);
      }
      
      if (returnQuantity > maxQuantity) {
        throw new Error(`Cannot return more items than borrowed for transaction ${transactionId}`);
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
  
  hideModal(returnItemsModal.id);
  const returnNotes = document.getElementById('returnNotes');
  const returnSearchInput = document.getElementById('returnSearchInput');
  const selectAllItems = document.getElementById('selectAllItems');

  if (returnNotes) returnNotes.value = '';
  if (returnSearchInput) returnSearchInput.value = '';
  if (selectAllItems) selectAllItems.checked = false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the page when the DOM is loaded
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
  addTransactionBtn?.addEventListener('click', () => showModal(verifyAdminModal.id));

  verifyAdminForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminId = document.getElementById('verifyAdminId').value;
    const password = document.getElementById('verifyAdminPassword').value;
    
    const isVerified = await verifyAdmin(adminId, password);
    if (isVerified) {
      hideModal(verifyAdminModal.id);
      showModal(transactionTypeModal.id);
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
    hideModal(transactionTypeModal.id);
    showModal(borrowItemsModal.id);
    initializeItemsList();
  });

  returnBtn?.addEventListener('click', () => {
    hideModal(transactionTypeModal.id);
    loadBorrowedItems();
    showModal(returnItemsModal.id);
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
      hideModal(borrowItemsModal.id);
      showModal(confirmationModal.id);
    } else {
      showToast('Please add at least one item');
    }
  });

  confirmTransactionBtn?.addEventListener('click', () => {
    hideModal(confirmationModal.id);
    showToast('Transaction completed successfully!');
    clearItemsTable();
    const borrowRemarks = document.getElementById('borrowRemarks');
    if (borrowRemarks) borrowRemarks.value = '';
  });

  cancelVerifyBtn?.addEventListener('click', () => {
    hideModal(verifyAdminModal.id);
    verifyAdminForm?.reset();
  });

  cancelBorrowBtn?.addEventListener('click', () => {
    hideModal(borrowItemsModal.id);
    selectedItems = [];
    const selectedItemsTable = document.getElementById('selectedItemsTable');
    if (selectedItemsTable) selectedItemsTable.innerHTML = '';
  });

  cancelConfirmBtn?.addEventListener('click', () => hideModal(confirmation.id));
});

// Make functions available globally
window.removeItem = removeItem;
window.updateItemQuantity = updateItemQuantity;

// TODO: Make the function to implement item list
// window.initializeItemsList = initializeItemsList;

function showTransactionDetails(transactionId) {
  console.log(transactionId);

  const transaction = filteredTransactions.find(t => t.transaction_id === transactionId);
  if (!transaction) return;

  // Update modal content
  document.getElementById('transactionIdDisplay').textContent = `Transaction ID: ${transaction.transaction_id}`;
  document.getElementById('adminInfoDisplay').textContent = transaction.admin_name;
  document.getElementById('dateTimeDisplay').textContent = formatDateTime(transaction.date);
  document.getElementById('typeDisplay').textContent = transaction.type;
  document.getElementById('statusDisplay').innerHTML = `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(transaction.status)}">
      ${transaction.status.replace('_', ' ')}
    </span>
  `;
  document.getElementById('remarksDisplay').textContent = transaction.remarks || 'No remarks';

  // Update items table
  const itemsTable = document.getElementById('transactionItemsTable');
  itemsTable.innerHTML = transaction.items.map(item => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.quantity}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${item.is_consumable ? 'Consumable' : 'Non-consumable'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(transaction.status)}">
          ${transaction.status.replace('_', ' ')}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${item.is_consumable ? 'No' : 'Yes'}
      </td>
    </tr>
  `).join('');

  showModal('transactionDetailsModal');
}

function showModal(modalId) {
  console.log(modalId)
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Add event listeners for closing the modal
  const closeButtons = modal.querySelectorAll('[id$="closeDetailsBtn"], [id$="closeDetailsModalBtn"]');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => hideModal(modalId));
  });
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
} 