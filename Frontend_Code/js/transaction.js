// Import the database handler
import * as dbhandler from "../../Backend_Code/mainHandler.js";
import * as login from "./login.js";

// Global data
var itemData;
var transactionData;
var itemsTransactedData;

// Mock data for testing
const mockAdmins = [
  { admin_id: '123', password: 'password123', name: 'Chicco' },
  { admin_id: 'admin', password: 'admin123', name: 'Rar' }
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

// In-memory mock transaction history
let mockTransactionHistory = [
  {
    transaction_id: 'TRANS-001',
    type: 'borrow',
    admin_id: '123',
    admin_name: 'Waken Cean Maclang',
    items: [
      { name: 'Microscope', quantity: 2, is_consumable: false, returned_quantity: 1, return_remark: 'Lens slightly dusty' },
      { name: 'Petri Dish', quantity: 5, is_consumable: true }
    ],
    date: '2024-03-15T09:30:00',
    status: 'partially_returned',
    remarks: 'for testing'
  },
  {
    transaction_id: 'TRANS-002',
    type: 'borrow',
    admin_id: '123',
    admin_name: 'Dave Shanna Marie Gigawin',
    items: [
      { name: 'Beaker 100ml', quantity: 5, is_consumable: false, returned_quantity: 5, return_remark: 'All intact' }
    ],
    date: '2024-03-14T14:15:00',
    status: 'completed',
    remarks: 'Chemistry experiment'
  },
  {
    transaction_id: 'TRANS-003',
    type: 'borrow',
    admin_id: '456',
    admin_name: 'Allan Tagle',
    items: [
      { name: 'Test Tube', quantity: 10, is_consumable: false, returned_quantity: 0 }
    ],
    date: '2024-03-14T11:45:00',
    status: 'pending_return',
    remarks: ''
  },
  {
    transaction_id: 'TRANS-004',
    type: 'return',
    admin_id: '123',
    admin_name: 'Jeff Ronyl Pausal',
    items: [
      { name: 'Beaker 100ml', quantity: 3, is_consumable: false, returned_quantity: 3, return_remark: 'Clean and dry' }
    ],
    date: '2024-03-15T16:20:00',
    status: 'completed',
    remarks: 'Returned in good condition'
  },
  // New: Only consumable items
  {
    transaction_id: 'TRANS-005',
    type: 'borrow',
    admin_id: '789',
    admin_name: 'Sarah Duterte',
    items: [
      { name: 'Petri Dish', quantity: 10, is_consumable: true },
      { name: 'Bunsen Burner', quantity: 1, is_consumable: true }
    ],
    date: '2024-03-16T10:00:00',
    status: 'completed',
    remarks: 'Microbiology class'
  },
  // New: No remarks
  {
    transaction_id: 'TRANS-006',
    type: 'borrow',
    admin_id: '321',
    admin_name: 'Bongbong Marcos',
    items: [
      { name: 'Lab Coat', quantity: 2, is_consumable: false, returned_quantity: 2, return_remark: 'One button missing' }
    ],
    date: '2024-03-17T13:30:00',
    status: 'completed',
    remarks: ''
  },
  // New: Multiple items, some returned, some not, with remarks
  {
    transaction_id: 'TRANS-007',
    type: 'borrow',
    admin_id: '654',
    admin_name: 'Leni Robredo',
    items: [
      { name: 'Safety Goggles', quantity: 4, is_consumable: false, returned_quantity: 2, return_remark: '2 have scratches' },
      { name: 'pH Meter', quantity: 1, is_consumable: false, returned_quantity: 0 },
      { name: 'Petri Dish', quantity: 8, is_consumable: true }
    ],
    date: '2024-03-18T09:00:00',
    status: 'partially_returned',
    remarks: 'Group project'
  },
  // New: All items fully returned, each with a return remark
  {
    transaction_id: 'TRANS-008',
    type: 'borrow',
    admin_id: '987',
    admin_name: 'Raffy Tulfo',
    items: [
      { name: 'Test Tube', quantity: 6, is_consumable: false, returned_quantity: 6, return_remark: 'All clean' },
      { name: 'Beaker 100ml', quantity: 2, is_consumable: false, returned_quantity: 2, return_remark: 'No cracks' }
    ],
    date: '2024-03-19T15:45:00',
    status: 'completed',
    remarks: 'Finals week'
  }
];

const mockBorrowedItems = [
  {
    id: 'TRANS-001',
    items: { name: 'Microscope', is_consumable: false },
    quantity: 2,
    returned_quantity: 0,
    transaction_date: '2024-03-15T09:30:00',
    is_returned: false
  },
  {
    id: 'TRANS-002',
    items: { name: 'Beaker 100ml', is_consumable: false },
    quantity: 5,
    returned_quantity: 2,
    transaction_date: '2024-03-14T14:15:00',
    is_returned: false
  },
  {
    id: 'TRANS-003',
    items: { name: 'Test Tube', is_consumable: false },
    quantity: 10,
    returned_quantity: 0,
    transaction_date: '2024-03-14T11:45:00',
    is_returned: false
  }
];

// Global state
let currentAdminId = null; // Use localStorage later.
let selectedItems = [];
let filteredTransactions = [];

// Mock admin credentials for testing
const mockAdmin = {
  id: "123",
  password: "admin123"
};

// Mock data for charts
const mockChartData = {
  fastMovingConsumables: {
    labels: ['Petri Dish', 'Test Tubes', 'Gloves', 'Masks', 'Alcohol', 'Cotton', 'Syringes', 'Bandages', 'Gauze', 'Tape'],
    data: [85, 78, 72, 65, 60, 55, 50, 45, 40, 35]
  },
  consumptionTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    chemicals: [120, 150, 180, 90, 160, 200],
    items: [80, 100, 120, 60, 140, 160]
  },
  borrowingTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    apparatus: [45, 40, 35, 30, 25, 20],
    glassware: [50, 45, 40, 35, 30, 25],
    equipment: [30, 25, 20, 18, 15, 12]
  },
  topBorrowedNonConsumables: {
    labels: [
      'Test Tube', 'Beaker', 'Pipette', 'Erlenmeyer Flask', 'Burette',
      'Volumetric Flask', 'Microscope', 'Centrifuge', 'pH Meter', 'Hot Plate'
    ],
    data: [50, 45, 45, 40, 40, 35, 30, 25, 20, 18]
  }
};

// Initialize the page
async function initializePage() {
  try {
    showLoading();
    setupEventListeners();
    // await initializeTransactionData(); // For loading all transactions
    await loadTransactionHistory(); // For returning
    login.initializePasswordToggle();
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
    case 'Completed':
      return 'bg-green-100 text-green-800';

    case 'pending_return':
    case 'Pending Return':
      return 'bg-yellow-100 text-yellow-800';

    case 'partially_returned':
    case 'Partially Returned':
      return 'bg-orange-100 text-orange-800';

    case 'not_returnable':
    case 'Not Returnable':
      return 'bg-red-100 text-red-800';

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
    await new Promise(resolve => setTimeout(resolve, 1000));

    const searchTerm = document.getElementById('transactionSearch')?.value.toLowerCase() || '';
    const status = document.getElementById('transactionFilter')?.value || 'all';
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    var isMockData = true;
    if (isMockData == true){
      filteredTransactions = mockTransactionHistory.filter(transaction => {
        const matchesSearch = 
          transaction.transaction_id.toLowerCase().includes(searchTerm) ||
          transaction.admin_name.toLowerCase().includes(searchTerm);

        const matchesStatus = status === 'all' || transaction.status === status;

        const transactionDate = new Date(transaction.date);
        const matchesDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                                (!endDate || transactionDate <= new Date(endDate));

        return matchesSearch && matchesStatus && matchesDateRange;
      });

      filteredTransactions.sort((a, b) => new Date(b["Transaction Date"]) - new Date(a["Transaction Date"]));

      if (filteredTransactions.length === 0) {
        table.innerHTML = `
          <tr class="h-[250px] text-center text-gray-500 italic">
            <td colspan="7" class="align-middle">
              No transactions found
            </td>
          </tr>
        `;
        hideTableLoading();
        return;
      }

      // Render transactions
      table.innerHTML = filteredTransactions.map(transaction => {
        // Truncate remarks if too long
        const maxRemarkLength = 40;
        let displayRemark = transaction.remarks || '';
        let isTruncated = false;
        if (displayRemark.length > maxRemarkLength) {
          displayRemark = displayRemark.slice(0, maxRemarkLength) + '...';
          isTruncated = true;
        }
          return `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150" 
                onclick="showTransactionDetails('${transaction.transaction_id}')"
                data-transaction-id="${transaction.transaction_id}">
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${transaction.transaction_id || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${formatDateTime(transaction.date) || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${transaction.admin_name || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${getStatusStyle(transaction.status)}">
                  ${(transaction.status || '').replace('_', ' ')}
                </span>
              </td>
              <td class="px-6 py-4 text-left whitespace-normal text-sm text-gray-900" title="${isTruncated ? transaction.remarks : ''}">
                ${displayRemark || '<span class=\'italic text-gray-400\'>No remarks</span>'}
              </td>
            </tr>
          `;
      }).join('');

    } else {

      // Use in-memory mockTransactionHistory
      // Apply filters
      filteredTransactions = transactionData.filter(transaction => {
        console.log(transaction);
        const matchesSearch = 
          String(transaction["Transaction ID"]).toLowerCase().includes(searchTerm) ||
          transaction["Admin Name"].toLowerCase().includes(searchTerm);

        const matchesStatus = status === 'all' || transaction["Status"] === status;

        const transactionDate = new Date(transaction["Transaction Date"]);
        const matchesDateRange = (!startDate || transactionDate >= new Date(startDate)) &&
                                (!endDate || transactionDate <= new Date(endDate));

        return matchesSearch && matchesStatus && matchesDateRange;
      });

      filteredTransactions.sort((a, b) => new Date(b["Transaction Date"]) - new Date(a["Transaction Date"]));

      if (filteredTransactions.length === 0) {
        table.innerHTML = `
          <tr class="h-[250px] text-center text-gray-500 italic">
            <td colspan="7" class="align-middle">
              No transactions found
            </td>
          </tr>
        `;
        hideTableLoading();
        return;
      }

      table.innerHTML = filteredTransactions.map(transaction => {
        console.log(transaction["Status"], getStatusStyle(transaction["Status"]))

        // Truncate remarks if too long
        const maxRemarkLength = 40;
        let displayRemark = (!transaction["Remarks"] || transaction["Remarks"] == "")? '' : transaction["Remarks"];
        let isTruncated = false;
        if (displayRemark.length > maxRemarkLength) {
          displayRemark = displayRemark.slice(0, maxRemarkLength) + '...';
          isTruncated = true;
        }
          return `
            <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150" 
                onclick="showTransactionDetails('${transaction["Transaction ID"]}')"
                data-transaction-id="${transaction["Transaction ID"]}">
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${transaction["Transaction ID"] || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${formatDateTime(transaction["Transaction Date"]) || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                ${transaction["Admin Name"] || ''}
              </td>
              <td class="px-6 py-4 text-left whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${getStatusStyle(transaction["Status"])}">
                  ${(transaction["Status"] || '').replace('_', ' ')}
                </span>
              </td>
              <td class="px-6 py-4 text-left whitespace-normal text-sm text-gray-900" title="${isTruncated ? transaction["Remarks"] : ''}">
                ${displayRemark || '<span class=\'italic text-gray-400\'>No remarks</span>'}
              </td>
            </tr>
          `;
      }).join('');
    }
    
    hideTableLoading();
  } catch (error) {
    console.error('Error loading transactions:', error);
    table.innerHTML = `
      <tr class="h-[250px] text-center text-red-500 italic">
        <td colspan="6" class="align-middle">
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

  table.innerHTML = `
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
  `;
}

function hideTableLoading() {
  document.getElementById('tableLoadingState').style.display = 'none';
}

function searchTransactionsTable() {
  const tbody = document.getElementById('transactionHistoryTable');
  const searchInput = document.getElementById('transactionSearch');
  const searchValue = searchInput.value.toLowerCase();
  const rows = tbody.querySelectorAll('tr:not(.no-result-row)');
  let hasResult = false;

  // Remove existing no-results message if present
  const existingNoResults = tbody.querySelector('.no-result-row');
  if (existingNoResults) {
    existingNoResults.remove();
  }

  rows.forEach((row) => {
    const transactionId = row.querySelector('td:nth-child(1)')?.textContent.toLowerCase() || '';
    const dateTime = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
    const adminName = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
    const status = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';
    const remarks = row.querySelector('td:nth-child(5)')?.textContent.toLowerCase() || '';

    const showRow =
      !searchValue ||
      transactionId.includes(searchValue) ||
      dateTime.includes(searchValue) ||
      adminName.includes(searchValue) ||
      status.includes(searchValue) ||
      remarks.includes(searchValue);

    row.style.display = showRow ? '' : 'none';
    if (showRow) {
      hasResult = true;
    }
  });

  if (!hasResult && searchValue) {
    const noResultRow = document.createElement('tr');
    noResultRow.className = 'no-result-row';
    noResultRow.innerHTML = `
      <td colspan="5" class="px-6 py-16 text-center w-full">
        <div class="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-gray-500 text-lg font-medium">No transactions found matching "${searchValue}"</p>
          <p class="text-gray-400 text-base">Try adjusting your search term</p>
        </div>
      </td>
    `;
    tbody.appendChild(noResultRow);
  }
}

function setupEventListeners() {
  // Search input with new implementation
  const searchInput = document.getElementById('transactionSearch');
  if (searchInput) {
    searchInput.addEventListener('input', searchTransactionsTable);
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

// Make all necessary functions available globally
window.showTransactionDetails = function (transactionId) {
  const transaction = filteredTransactions.find(t => t.transaction_id === transactionId);
  if (!transaction) return;

  const modal = document.getElementById('transactionDetailsModal');
  if (!modal) return;

  // Update modal content
  document.getElementById('transactionIdDisplay').textContent = transaction.transaction_id;
  document.getElementById('adminInfoDisplay').textContent = transaction.admin_name;
  document.getElementById('dateTimeDisplay').textContent = formatDateTime(transaction.date);
  document.getElementById('typeDisplay').textContent = transaction.type;
  document.getElementById('statusDisplay').innerHTML = `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(transaction.status)}">
      ${transaction.status.replace('_', ' ')}
    </span>
  `;

  // Optimized: Show both main and return remarks in one section
  let html = '';
  html += transaction.remarks
    ? `<div>${transaction.remarks}</div>`
    : '<div class="italic text-gray-400">No remarks</div>';
  const returnRemarks = transaction.items
    .filter(item => item.return_remark && item.return_remark.trim() !== '')
    .map(item => `<li><span class='font-semibold text-gray-800'>${item.name}:</span> <span class='text-gray-700'>${item.return_remark}</span></li>`)
    .join('');
  if (returnRemarks) {
    html += `<div class='mt-2'><span class='font-semibold'>Return Remarks:</span><ul class='list-disc ml-6 mt-1'>${returnRemarks}</ul></div>`;
  }
  document.getElementById('remarksDisplay').innerHTML = html;

  // Populate items table with correct columns
  const itemsTable = document.getElementById('transactionItemsTable');
  if (itemsTable) {
    itemsTable.innerHTML = transaction.items.map(item => {
      const isReturned = (item.returned_quantity || 0) >= item.quantity;
      const remainingQuantity = item.quantity - (item.returned_quantity || 0);
      const returnedQuantity = item.returned_quantity || 0;
      return `
        <tr>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">${item.name}</td>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
            ${!item.is_consumable ? `${returnedQuantity}/${item.quantity} (${remainingQuantity} remaining)` : item.quantity}
          </td>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
            ${item.is_consumable ? 'Consumable' : 'Non-consumable'}
          </td>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm break-words">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(item.is_consumable ? 'not_returnable' : (isReturned ? 'completed' : 'pending_return'))}">
              ${item.is_consumable ? 'Not Returnable' : (isReturned ? 'Returned' : 'Pending Return')}
            </span>
          </td>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
            ${item.is_consumable ? 'No' : 'Yes'}
          </td>
          <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-center break-words">
            ${!item.is_consumable && !isReturned ? `
              <div class="flex flex-col items-center space-y-2">
                <div class="flex items-center space-x-2">
                  <input type="number" 
                    class="return-quantity w-20 rounded-md border border-gray-300 px-2 py-1"
                    min="1"
                    max="${remainingQuantity}"
                    value="${remainingQuantity}"
                    data-item="${item.name}">
                  <button onclick="window.processReturn('${transaction.transaction_id}', '${item.name}')"
                    class="px-3 py-1 rounded-md bg-[#2dc653] text-white text-xs font-semibold hover:bg-[#27b04a] focus:outline-none focus:ring-2 focus:ring-[#27b04a]">
                    Return
                  </button>
                </div>
                <textarea id='remark-${item.name}' class="return-remark w-full rounded-md border border-gray-300 px-2 py-1 text-xs" placeholder="Describe the condition, issues, or notes (optional)" data-item-remark="${item.name}"></textarea>
              </div>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Show the modal
  showModal('transactionDetailsModal');
};

// TODO: What does this do?
window.processReturn = async function (transactionId, itemName) {
  const quantityInput = document.querySelector(`input[data-item="${itemName}"]`);
  if (!quantityInput) return;
  const remarkInput = document.querySelector(`textarea[data-item-remark="${itemName}"]`);
  const returnRemark = remarkInput ? remarkInput.value.trim() : '';
  const returnQuantity = parseInt(quantityInput.value);
  if (isNaN(returnQuantity) || returnQuantity < 1) {
    showToast('Please enter a valid return quantity', true);
    return;
  }

  try {
    // Update transaction status and item data in mockTransactionHistory
    const transaction = mockTransactionHistory.find(t => t.transaction_id === transactionId);
    if (transaction) {
      const item = transaction.items.find(i => i.name === itemName);
      if (item) {
        item.returned_quantity = (item.returned_quantity || 0) + returnQuantity;
        if (returnRemark) {
          item.return_remark = returnRemark;
        }
        // Check if all non-consumable items are returned
        const allNonConsumablesReturned = transaction.items
          .filter(i => !i.is_consumable)
          .every(i => (i.returned_quantity || 0) >= i.quantity);
        if (allNonConsumablesReturned) {
          transaction.status = 'completed';
        } else {
          transaction.status = 'partially_returned';
        }
      }
    }

    showToast('Item returned successfully');
    await loadTransactionHistory(); // Refresh the main table
    window.showTransactionDetails(transactionId); // Force refresh modal content
    if (remarkInput) remarkInput.value = '';
  } catch (error) {
    console.error('Error processing return:', error);
    showToast('Error processing return. Please try again.', true);
  }
};

// Verify admin credentials using mock data for testing
async function verifyAdmin(adminId, password) {
  try {

    // Keep for now for the presentation
    var adminExists = mockAdmins.some(admin =>
      admin.admin_id === adminId && admin.password === password
    );

    if (adminExists === false)
      adminExists = await dbhandler.adminExists(adminId, password);

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

  console.log(index)
  if (index !== -1) {
    const inventoryItem = itemData.find(item => itemName.includes(item["Name"]) && itemName.includes(item["Brand"]));
    const maxQuantity = inventoryItem ? inventoryItem["Remaining Quantity"] : 1;


    newQuantity = Math.min(Math.max(1, parseFloat(newQuantity) || 1), maxQuantity);
    selectedItems[index].quantity = newQuantity;

    const input = document.querySelector(`input[data-item="${itemName}"]`);
    if (input) {
      console.log(newQuantity);
      input.value = newQuantity;
    }
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
        <button type="button" 
          class="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2ca14a]"
          onclick="updateItemQuantity('${itemName}', (parseInt(document.querySelector('input[data-item=\\'${itemName}\\']').value) || 1) - 1)">
          <i class="fas fa-minus text-gray-600"></i>
        </button>
        <input 
          type="number" 
          value="1"
          min="1"
          max="${inventoryItem["Remaining Quantity"]}"
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

  hideModal('returnItemsModal');
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
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', () => showModal('verifyAdminModal'));
  }

  verifyAdminForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminId = document.getElementById('verifyAdminId').value;
    const password = document.getElementById('verifyAdminPassword').value;

    const isVerified = await verifyAdmin(adminId, password);
    if (isVerified) {
      hideModal('verifyAdminModal');
      // Directly show borrow items modal, skip transaction type modal
      showModal('borrowItemsModal');
      initializeItemsList();
      await dbhandler.prepareUser();
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
    // initializeItemsList();
  });

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

      hideModal('borrowItemsModal');
      showModal('confirmationModal');
    } else {
      showToast('Please add at least one item');
    }
  });

  // TODO: ADD transaction
  confirmTransactionBtn?.addEventListener('click', async () => {
    hideModal('confirmationModal');

    let itemIdArray = Array();
    let borrowQuantityArray = Array();

    // selected items (itemName, quantity)
    // itemName consists of : Name (Brand)
    selectedItems.forEach((item) => {
      var tempItem = itemData.find(tempItemData => item.itemName.includes(tempItemData["Name"]) == true && item.itemName.includes(tempItemData["Brand"]) == true)

      itemIdArray.push(tempItem["Item ID"]);
      borrowQuantityArray.push(item.quantity);
      console.log(tempItem["Item ID"], " ", item.quantity)
    });

    let result = await dbhandler.addTransactionRecord(currentAdminId, borrowRemarks.value.trim(), itemIdArray, borrowQuantityArray);

    if (result.includes("ERROR")) {
      showToast(result, true)
    } else {
      showToast('Transaction completed successfully!', false);
      clearItemsTable();
      const borrowRemarks = document.getElementById('borrowRemarks');
      if (borrowRemarks) borrowRemarks.value = '';
    }
  });

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

  // Add event listeners for closing the transaction details modal
  const closeBtn = document.getElementById('closeDetailsBtn');
  const closeModalBtn = document.getElementById('closeDetailsModalBtn');

  if (closeBtn) {
    closeBtn.onclick = () => hideModal('transactionDetailsModal');
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => hideModal('transactionDetailsModal');
  }
});

// Make functions available globally
window.removeItem = removeItem;
window.updateItemQuantity = updateItemQuantity;
window.initializeItemsList = initializeItemsList;

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

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the page
  initializePage();

  // Add event listeners for closing the transaction details modal
  const closeBtn = document.getElementById('closeDetailsBtn');
  const closeModalBtn = document.getElementById('closeDetailsModalBtn');

  if (closeBtn) {
    closeBtn.onclick = () => hideModal('transactionDetailsModal');
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => hideModal('transactionDetailsModal');
  }
});

// This is after adding a new transaction

// Add a new transaction and refresh the transaction history table
window.addNewTransaction = function (newTransaction) {
  const transactions = mockTransactionHistory || [];
  transactions.push(newTransaction);
  mockTransactionHistory = transactions;
  if (typeof loadTransactionHistory === 'function') {
    loadTransactionHistory();
  }
};

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

// ================================================================
// Backend Methods

async function initializeItemsList() {
  try {
    itemData = await dbhandler.getAllItemMasterListNameBrandRecords();

    if (itemData.length == 0) {
      console.error("Item Master List table has no records.");
      return;
    }

    const itemsList = document.getElementById('itemsList');
    if (!itemsList) return;

    // Clear existing options
    itemsList.innerHTML = '';
    console.log(itemsList);

    // Commented for the mean time (Not fully implemented yet.)
    itemData.forEach((item) => {
      if (Number(item["Remaining Quantity"]) == 0)
        return;

      const option = document.createElement('option');
      option.value = item["Name"] + " (" + item["Brand"] + ")";
      option.textContent = `${item["Remaining Quantity"]} ${item["Unit Type"]} available`;
      itemsList.appendChild(option);
    })

    // Add items from mock inventory
    // mockInventory.forEach(item => {
    //   const option = document.createElement('option');
    //   option.value = item.item_name;
    //   option.textContent = `${item.item_name} (${item.available_quantity} available)`;
    //   itemsList.appendChild(option);
    // });

  } catch (generalError) {
    console.error(generalError);
  } finally {
    hideLoading();
  }
}
