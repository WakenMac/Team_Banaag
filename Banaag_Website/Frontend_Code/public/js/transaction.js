// Import the database handler
import * as login from "/js/login.js";

// Global Data
var transactionData;
var itemsTransactedData;
var useMockData;

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

// Loads the transaction history
async function loadTransactionHistory() {
  const table = document.getElementById('transactionHistoryTable');
  if (!table) return;
  
  try {
    showTableLoading();
    const searchTerm = document.getElementById('transactionSearch')?.value.toLowerCase() || '';
    const status = document.getElementById('transactionFilter')?.value || 'all';
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    if (useMockData == true){
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
                id = "${transaction.transaction_id}"
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

      // Use database history
      // Apply filters
      filteredTransactions = transactionData.filter(transaction => {
        const matchesSearch = 
          String(transaction["Transaction ID"]).toLowerCase().includes(searchTerm) ||
          transaction["Admin Name"].toLowerCase().includes(searchTerm);

        const matchesStatus = status === 'all' || transaction["Status"]?.toLowerCase() === status;

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
                id = "${transaction["Transaction ID"]}"
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
    
    // Adds the "click" event listener to prepare and view the transactionDetailsModal
    filteredTransactions.map(transaction => {
      let row = document.getElementById(transaction["Transaction ID"]) || document.getElementById(transaction.transaction_id);
      if (!row) return;
      row.addEventListener('click', (e) => {
        showTransactionDetails(row.children[0].textContent.trim())
      })
    })

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

// Previews the transaction history
function showTransactionDetails (transactionId) {
  if (useMockData == true){
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
          <tr data-name-tr="${item.name}" data-name-id="${transaction.transaction_id}">
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
                      min="0"
                      max="${remainingQuantity}"
                      value="0"
                      data-item="${item.name}">
                    <button data-item-button="${item.name}"
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
  } else {
    const transaction = filteredTransactions.find(t => Number(t["Transaction ID"]) === Number(transactionId));
    
    if (!transaction) return;
    
    const modal = document.getElementById('transactionDetailsModal');
    if (!modal) return;
    
    const itemsTransacted = itemsTransactedData.filter(item => Number(item["Transaction ID"]) == Number(transactionId))

    // Update modal content
    document.getElementById('transactionIdDisplay').textContent = transaction["Transaction ID"];
    document.getElementById('adminInfoDisplay').textContent = transaction["Admin Name"];
    document.getElementById('dateTimeDisplay').textContent = formatDateTime(transaction["Transaction Date"]);
    document.getElementById('statusDisplay').innerHTML = `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(transaction["Status"])}">
        ${transaction["Status"].replace('_', ' ')}
        </span>
    `;

    // Optimized: Show both main and return remarks in one section
    let html = '';
    html += (!transaction["Remarks"] || transaction["Remarks"] === '') // Check if remarks is not empty
        ? '<div class="italic text-gray-400">No remarks</div>'
        : `<div>${transaction["Remarks"]}</div>`;
    
    let returnRemarks = itemsTransacted
    .filter(item => item["Remarks"] != null && item["Remarks"] != '')
    .map(item => `<li><span class='font-semibold text-gray-800'>${item["Item Name"]}:</span> <span class='text-gray-700'>${item["Remarks"]}</span></li>`)
    .join('');

    if (returnRemarks) 
        html += `<div class='mt-2'><span class='font-semibold'>Return Remarks:</span><ul class='list-disc ml-6 mt-1'>${returnRemarks}</ul></div>`;
    document.getElementById('remarksDisplay').innerHTML = html;

    // Populate items table with correct columns
    const itemsTable = document.getElementById('transactionItemsTable');
    if (itemsTable) {
      itemsTable.innerHTML = itemsTransacted.map(item => {
      const returnedQuantity = (item["Initial Borrowed Quantity"] - item["Current Borrowed Quantity"]) || 0;
      const remainingQuantity = item["Current Borrowed Quantity"] || 0;
      const isConsumable = (!item["Item Type"] && item['Item Type'] !== 'Chemicals' && item["Item Type"] !== 'Consumable Items')? false : true
      return `
          <tr data-name-tr="${item["Item Name"]}" data-name-id="${transaction["Transaction ID"]}" ">
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">${item["Item Name"]}</td>
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
                ${isConsumable ? `${returnedQuantity}/${item["Initial Borrowed Quantity"]} (${remainingQuantity} remaining)` : item["Initial Borrowed Quantity"]}
            </td>
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
                ${isConsumable ? 'Consumable' : 'Non-consumable'}
            </td>
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm break-words">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(item["Status"])}">
                ${item["Status"]}
                </span>
            </td>
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-900 break-words">
                ${isConsumable ? 'Yes' : 'No'}
            </td>
            <td class="px-6 py-4 align-middle whitespace-nowrap text-sm text-center break-words">
                ${(item["Status"] !== 'Non Returnable' && item["Status"] !== 'Completed') ? `
                <div class="flex flex-col items-center space-y-2">
                  <div class="flex items-center space-x-2">
                    <input type="number" 
                        class="return-quantity w-20 rounded-md border border-gray-300 px-2 py-1"
                        min="0"
                        max="${remainingQuantity}"
                        value="0"
                        data-item="${item["Item Name"]}">
                    <button data-item-button="${item["Item Name"]}"
                        class="px-3 py-1 rounded-md bg-[#2dc653] text-white text-xs font-semibold hover:bg-[#27b04a] focus:outline-none focus:ring-2 focus:ring-[#27b04a]">
                        Return
                    </button>
                  </div>
                  <textarea id='remark-${item["Item Name"]}' class="return-remark w-full rounded-md border border-gray-300 px-2 py-1 text-xs" placeholder="Describe the condition, issues, or notes (optional)" data-item-remark="${item["Item Name"]}"></textarea>
                </div>
                ` : ''}
            </td>
          </tr>
      `;
      }).join('');
    }
  }

  document.querySelectorAll(`tr[data-name-tr]`)
  .forEach(row => {
    let itemName = row.getAttribute('data-name-tr')
    let transactionId = row.getAttribute('data-name-id')
    let button = row.querySelector(`button[data-item-button="${itemName}"]`)
    let input = document.querySelector(`input[data-item="${itemName}"]`);

    // Listener for the return button's functionality
    if (!button) return;
    button.addEventListener("click", async function handleReturn(e){
      e.preventDefault();
      await processReturn(transactionId, itemName)
    });

    // Adds key listener in inputs (To limit the max number of items to return)
    if (!input) return;
    input.addEventListener('keyup', function inputListener(e){
      e.preventDefault();
      let value = Number(input.value);
      if (value > input.max)
        input.value = input.max;
    })
  })


  // Show the modal
  showModal('transactionDetailsModal');
};

// Returns an item
async function processReturn (transactionId, itemName) {
  // Temporarily used dead code before we connect it to the database
  const quantityInput = document.querySelector(`input[data-item="${itemName}"]`);
  if (!quantityInput) return;
  const returnQuantity = parseFloat(quantityInput.value);
  if (isNaN(returnQuantity) || returnQuantity < 1) {
    showToast('Please enter a valid return quantity', true);
    return;
  }

  // Checks the remarks
  const remarkInput = document.querySelector(`textarea[data-item-remark="${itemName}"]`);
  const returnRemark = remarkInput ? remarkInput.value.trim() : '';

  // Gets the index for the details in each dataset.
  let transactionIndex = filteredTransactions.findIndex(t => { return t["Transaction ID"] === Number(transactionId) })
  let itemIndex = itemsTransactedData.findIndex(i => { return i["Item Name"] === itemName && i["Transaction ID"] === Number(transactionId) })

  try {
    let queryResult = await returnItemTransacted(
      transactionId, itemsTransactedData[itemIndex]["Item ID"], returnQuantity, returnRemark);
    queryResult = (queryResult != null)? queryResult.data : null;
    if (!queryResult || queryResult.includes('ERROR')){
      throw queryResult;
    } else {
      let transactionStatus = queryResult.slice(47, queryResult.length); // Gets the transaction status (Part of the query's return statement)
      
      // Update the content within each data.
      transactionData[transactionIndex]["Status"] = transactionStatus;
      itemsTransactedData[itemIndex]["Current Borrowed Quantity"] = parseFloat(itemsTransactedData[itemIndex]["Current Borrowed Quantity"]) - parseFloat(returnQuantity);
      itemsTransactedData[itemIndex]["Status"] = (itemsTransactedData[itemIndex]["Current Borrowed Quantity"] == 0)?
        "Completed" : "Partially Returned";
      itemsTransactedData[itemIndex]["Remarks"] = (returnRemark === '')? itemsTransactedData[itemIndex]["Remarks"] : returnRemark;

      showToast('Item returned successfully');
      await loadTransactionHistory(); // Refresh the main table
      showTransactionDetails(transactionId); // Force refresh modal content
      if (remarkInput) remarkInput.value = '';
    }

  } catch (error) {
    console.error('Error processing return:', error);
    showToast('Error processing return. Please try again.', true);
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the page when the DOM is loaded
  showLoading();
  useMockData = false;
  setupEventListeners();
  await initializeTransactionData();
  await initializeItemsTransacted();
  await loadTransactionHistory(); // For returning

  // Add event listeners for closing the transaction details modal
  const closeBtn = document.getElementById('closeDetailsBtn');
  const closeModalBtn = document.getElementById('closeDetailsModalBtn');

  if (closeBtn)
    closeBtn.onclick = () => hideModal('transactionDetailsModal');
  if (closeModalBtn) 
    closeModalBtn.onclick = () => hideModal('transactionDetailsModal');

  hideLoading();
});

// Updates Transaction history. (For the transaction table)
window.addNewTransaction = function (newTransaction) {
  const transactions = mockTransactionHistory || [];
  transactions.push(newTransaction);
  mockTransactionHistory = transactions;
  if (typeof loadTransactionHistory === 'function') {
    loadTransactionHistory();
  }
};

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

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('flex');

  toast.style.backgroundColor = isError ? 'rgba(220, 38, 38, 0.95)' : 'rgba(44, 161, 74, 0.95)';

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, isError ? 3000 : 4000);
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

// ================================================================
// Helper Methods

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusStyle(status) {
  switch (status) {
    case 'completed':
    case 'Completed':
    case 'not_returnable':
    case 'Non Returnable':
      return 'bg-green-100 text-green-800';

    case 'pending_return':
    case 'Pending Return':
      return 'bg-yellow-100 text-yellow-800';

    case 'partially_returned':
    case 'Partially Returned':
      return 'bg-orange-100 text-orange-800';

    // case 'not_returnable':
    // case 'Non Returnable':
    //   return 'bg-red-100 text-red-800';

    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// =================================================================
// Backend Methods

async function initializeTransactionData(){
  try{
    let data = await getAllTransactionRecords();
    transactionData = data.data;
    if (!transactionData)
      console.log("Transaction Data is null")
    else if (transactionData.length == 0)
      console.log('Transaction Data is empty')
    else
      console.log('Loaded transaction data successfully!')

  } catch (error){
    console.log(error);
  }
}

async function initializeItemsTransacted(){
  try{
    let data = await getAllItemsTransactedRecords();
    itemsTransactedData = data.data;
    if (!itemsTransactedData)
      console.log("Items Transacted Data is null")
    else if (itemsTransactedData.length == 0)
      console.log('Items Transacted Data is empty')
    else
      console.log('Loaded Items Transacted data successfully!')

  } catch (error){
    console.log(error);
  }
}

// ========================================
// Backend Related Methods

async function returnItemTransacted(transactionId, itemId, returnQuantity, returnRemarks){
  try {
    let response = await fetch('/items-transacted/update-items-transacted', {
      method: 'PATCH',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        transactionId : transactionId, 
        itemId : itemId, 
        returnQuantity : returnQuantity, 
        remarks : returnRemarks
      })
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function getAllItemsTransactedRecords(){
  try {
    let response = await fetch('/items-transacted/get-all-items-transacted-records', {
      method: 'GET',
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}

async function getAllTransactionRecords(){
  try {
    let response = await fetch('/transaction/get-all-transaction-records', {
      method: 'GET',
    }); 

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
    }
    
    const data = await response.json();
    return (data)
  } catch (error){
      console.log('Frontend: Error checking admin validity:', error);
      return null;
  }
}