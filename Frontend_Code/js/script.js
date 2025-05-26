// FOR NAVIGATION BAR DROPDOWN FUNCTIONS

// Function to toggle dropdown visibility on click and close others
document.querySelectorAll("nav ul > li.relative > button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    // Close all dropdowns
    document
      .querySelectorAll("nav ul > li.relative > button")
      .forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const menu = document.getElementById(btn.id.replace("Btn", "Menu"));
        menu.classList.add("opacity-0", "invisible");
        menu.classList.remove("opacity-100", "visible");
      });
    if (!expanded) {
      button.setAttribute("aria-expanded", "true");
      const menu = document.getElementById(button.id.replace("Btn", "Menu"));
      menu.classList.remove("opacity-0", "invisible");
      menu.classList.add("opacity-100", "visible");
    }
  });
});

// Close dropdowns if clicking outside
document.addEventListener("click", (e) => {
  const nav = document.querySelector("nav");
  if (!nav.contains(e.target)) {
    document
      .querySelectorAll("nav ul > li.relative > button")
      .forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        const menu = document.getElementById(btn.id.replace("Btn", "Menu"));
        menu.classList.add("opacity-0", "invisible");
        menu.classList.remove("opacity-100", "visible");
      });
  }
});

// Helper function to show toast notification
function showToast(message) {
  const toastMessage = document.getElementById('toastMessage')
  toastMessage.textContent = message
  showModal(toastNotification)
  setTimeout(() => {
    hideModal(toastNotification)
  }, 3000)
}

document.addEventListener('DOMContentLoaded', () => {
  // Logout modal logic
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener('click', () => {
      logoutModal.classList.remove('hidden');
      logoutModal.classList.add('flex');
    });
  }
  if (cancelLogoutBtn && logoutModal) {
    cancelLogoutBtn.addEventListener('click', () => {
      logoutModal.classList.add('hidden');
      logoutModal.classList.remove('flex');
    });
  }
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
      window.location.href = "login.html";
    });
  }
  // Optional: close modal when clicking backdrop
  logoutModal?.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
      logoutModal.classList.add('hidden');
      logoutModal.classList.remove('flex');
    }
  });
});

// --- Dashboard Notification and Summary Cards Logic ---

// Update mock data for all dashboard sections
const dashboardMockData = {
  chemicals: {
    topMoving: [
      { name: 'Sodium Chloride', quantity: 150 },
      { name: 'Hydrochloric Acid', quantity: 120 },
      { name: 'Sodium Hydroxide', quantity: 100 },
      { name: 'Ethanol', quantity: 90 },
      { name: 'Acetone', quantity: 85 },
      { name: 'Methanol', quantity: 80 },
      { name: 'Sulfuric Acid', quantity: 75 },
      { name: 'Nitric Acid', quantity: 70 },
      { name: 'Potassium Hydroxide', quantity: 65 },
      { name: 'Ammonia', quantity: 60 }
    ],
    totalConsumed: 895,
    soonToExpire: [
      { name: 'Hydrogen Peroxide', daysLeft: 3 },
      { name: 'Formaldehyde', daysLeft: 5 },
      { name: 'Acetic Acid', daysLeft: 7 },
      { name: 'Ethanol', daysLeft: 9 },
      { name: 'Sodium Chloride', daysLeft: 10 }
    ]
  },
  items: {
    topMoving: [
      { name: 'Gloves', quantity: 200 },
      { name: 'Face Masks', quantity: 180 },
      { name: 'Test Tubes', quantity: 150 },
      { name: 'Pipettes', quantity: 120 },
      { name: 'Petri Dishes', quantity: 100 },
      { name: 'Filter Paper', quantity: 90 },
      { name: 'Cotton Swabs', quantity: 85 },
      { name: 'Alcohol Wipes', quantity: 80 },
      { name: 'Syringes', quantity: 75 },
      { name: 'Needles', quantity: 70 }
    ],
    totalConsumed: 1150,
    soonToExpire: [
      { name: 'Gloves (Box)', daysLeft: 2 },
      { name: 'Face Masks (Box)', daysLeft: 4 },
      { name: 'Alcohol Wipes', daysLeft: 8 }
    ]
  },
  apparatus: {
    topBorrowed: [
      { name: 'Beaker', times: 45 },
      { name: 'Erlenmeyer Flask', times: 40 },
      { name: 'Graduated Cylinder', times: 35 },
      { name: 'Bunsen Burner', times: 30 },
      { name: 'Tripod Stand', times: 25 },
      { name: 'Wire Gauze', times: 20 },
      { name: 'Test Tube Rack', times: 18 },
      { name: 'Crucible', times: 15 },
      { name: 'Watch Glass', times: 12 },
      { name: 'Evaporating Dish', times: 10 }
    ],
    totalBorrowed: 250,
    currentlyBorrowed: [
      { name: 'Beaker', borrower: 'Allan George', dueDate: '2025-06-15' },
      { name: 'Erlenmeyer Flask', borrower: 'Dave Shanna', dueDate: '2025-06-16' },
      { name: 'Bunsen Burner', borrower: 'Waken Cean', dueDate: '2025-06-17' },
      { name: 'Tripod Stand', borrower: 'Jeff Ronyl', dueDate: '2025-06-18' }
    ]
  },
  glassware: {
    topBorrowed: [
      { name: 'Test Tube', times: 50 },
      { name: 'Pipette', times: 45 },
      { name: 'Burette', times: 40 },
      { name: 'Volumetric Flask', times: 35 },
      { name: 'Conical Flask', times: 30 },
      { name: 'Beaker', times: 25 },
      { name: 'Funnel', times: 20 },
      { name: 'Dropper', times: 15 },
      { name: 'Stirring Rod', times: 12 },
      { name: 'Watch Glass', times: 10 }
    ],
    totalBorrowed: 282,
    currentlyBorrowed: [
      { name: 'Test Tube Set', borrower: 'Bruno Mars', dueDate: '2025-06-19' },
      { name: 'Pipette Set', borrower: 'Group 1', dueDate: '2025-06-20' },
      { name: 'Burette', borrower: 'Blackpink', dueDate: '2025-06-21' }
    ]
  },
  equipment: {
    topBorrowed: [
      { name: 'Microscope', times: 30 },
      { name: 'Centrifuge', times: 25 },
      { name: 'pH Meter', times: 20 },
      { name: 'Hot Plate', times: 18 },
      { name: 'Balance', times: 15 },
      { name: 'Autoclave', times: 12 },
      { name: 'Incubator', times: 10 },
      { name: 'Spectrophotometer', times: 8 },
      { name: 'Vortex Mixer', times: 6 },
      { name: 'Water Bath', times: 5 }
    ],
    totalBorrowed: 149,
    currentlyBorrowed: [
      { name: 'Microscope', borrower: 'Marcellin', dueDate: '2025-06-22' },
      { name: 'Centrifuge', borrower: 'Kurt', dueDate: '2025-06-23' },
      { name: 'pH Meter', borrower: 'BSCS', dueDate: '2025-06-24' }
    ]
  },
  pendingReturns: [
    { transactionId: 'TRX-101', items: ['Beaker', 'Test Tube Set'] },
    { transactionId: 'TRX-102', items: ['Microscope'] },
    { transactionId: 'TRX-103', items: ['Pipette', 'Burette'] }
  ]
};

// Add mock data for most recent transactions
const dashboardRecentTransactions = [
  {
    id: 'TRX-201',
    admin: 'Admin User',
    dateTime: '2024-06-10 14:30',
    type: 'Borrow',
    status: 'Completed',
    remarks: 'Borrowed for Chem Lab 1'
  },
  {
    id: 'TRX-200',
    admin: 'Admin User',
    dateTime: '2024-06-09 10:15',
    type: 'Return',
    status: 'Returned',
    remarks: 'Returned all items in good condition.'
  },
  {
    id: 'TRX-199',
    admin: 'Admin User',
    dateTime: '2024-06-08 16:45',
    type: 'Borrow',
    status: 'Pending',
    remarks: 'Pending approval.'
  }
];

function renderDashboardQuickAlerts() {
  const quickAlerts = document.getElementById('quickAlerts');
  if (!quickAlerts) return;
  const alerts = [];
  // Soon to expire (Chemicals & Items)
  const soonToExpire = [
    ...(dashboardMockData.chemicals.soonToExpire || []),
    ...(dashboardMockData.items.soonToExpire || [])
  ];
  if (soonToExpire.length > 0) {
    alerts.push(`
      <div class="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
        <i class="fas fa-exclamation-triangle mr-3 text-xl"></i>
        <div>
          <span class="font-semibold">Attention:</span> ${soonToExpire.length} consumable${soonToExpire.length > 1 ? 's are' : ' is'} soon to expire.
        </div>
      </div>
    `);
  }
  // Currently borrowed (Apparatus, Glassware, Equipment)
  const currentlyBorrowed = [
    ...(dashboardMockData.apparatus.currentlyBorrowed || []),
    ...(dashboardMockData.glassware.currentlyBorrowed || []),
    ...(dashboardMockData.equipment.currentlyBorrowed || [])
  ];
  if (currentlyBorrowed.length > 0) {
    alerts.push(`
      <div class="flex items-center bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-sm">
        <i class="fas fa-info-circle mr-3 text-xl"></i>
        <div>
          <span class="font-semibold">Notice:</span> ${currentlyBorrowed.length} non-consumable${currentlyBorrowed.length > 1 ? 's are' : ' is'} currently borrowed.
        </div>
      </div>
    `);
  }
  quickAlerts.innerHTML = alerts.join('');
}

function renderDashboardSummaryRow() {
  const summaryRow = document.getElementById('dashboardSummary');
  if (!summaryRow) return;
  const totalConsumed = (dashboardMockData.chemicals.totalConsumed || 0) + (dashboardMockData.items.totalConsumed || 0);
  const totalBorrowed = (dashboardMockData.apparatus.totalBorrowed || 0) + (dashboardMockData.glassware.totalBorrowed || 0) + (dashboardMockData.equipment.totalBorrowed || 0);
  const soonToExpireCount = (dashboardMockData.chemicals.soonToExpire?.length || 0) + (dashboardMockData.items.soonToExpire?.length || 0);
  const currentlyBorrowedCount = (dashboardMockData.apparatus.currentlyBorrowed?.length || 0) + (dashboardMockData.glassware.currentlyBorrowed?.length || 0) + (dashboardMockData.equipment.currentlyBorrowed?.length || 0);
  const totalItems = totalConsumed + totalBorrowed;
  summaryRow.innerHTML = `
    <div class="bg-white rounded-xl shadow flex flex-col items-center justify-center p-4">
      <div class="text-sm text-gray-500 mb-1">Total Items</div>
      <div class="text-3xl font-extrabold text-gray-900">${totalItems}</div>
    </div>
    <div class="bg-green-50 rounded-xl shadow flex flex-col items-center justify-center p-4">
      <div class="text-sm text-gray-500 mb-1">Consumed</div>
      <div class="text-3xl font-extrabold text-green-600">${totalConsumed}</div>
    </div>
    <div class="bg-blue-50 rounded-xl shadow flex flex-col items-center justify-center p-4">
      <div class="text-sm text-gray-500 mb-1">Borrowed</div>
      <div class="text-3xl font-extrabold text-blue-600">${totalBorrowed}</div>
    </div>
    <div class="bg-purple-50 rounded-xl shadow flex flex-col items-center justify-center p-4">
      <div class="text-sm text-gray-500 mb-1">Transactions</div>
      <div class="text-3xl font-extrabold text-purple-600">42</div>
    </div>
  `;
}

// Add chart rendering functions
function renderConsumptionTrendChart() {
  const ctx = document.getElementById('consumptionTrendChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Consumables',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#2ca14a',
        tension: 0.4,
        fill: false
      }, {
        label: 'Non-consumables',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#3b82f6',
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderMonthlyStatsChart() {
  const ctx = document.getElementById('monthlyStatsChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Transactions',
        data: [12, 19, 15, 17, 22, 25],
        borderColor: '#8b5cf6',
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderTopConsumablesBarChart() {
  const ctx = document.getElementById('topConsumablesBarChart');
  if (!ctx) return;
  const top10 = [...(dashboardMockData.chemicals.topMoving || []), ...(dashboardMockData.items.topMoving || [])]
    .sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  // Remove any existing summary badge
  const parent = ctx.closest('.flex-col');
  const oldBadge = parent && parent.querySelector('.chart-summary');
  if (oldBadge) oldBadge.remove();
  // Render chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(item => item.name),
      datasets: [{
        label: 'Consumed',
        data: top10.map(item => item.quantity),
        backgroundColor: '#2ca14a',
        borderRadius: 6,
        maxBarThickness: 32,
        categoryPercentage: 1,
        barPercentage: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      layout: { padding: { left: 0, right: 0 } },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { maxRotation: 30, minRotation: 30, padding: 2 },
          offset: true,
          categoryPercentage: 1,
          barPercentage: 1
        },
        y: { beginAtZero: true }
      }
    }
  });
  // Add summary badge below chart
  if (parent) {
    const total = top10.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.createElement('div');
    badge.className = 'chart-summary mt-2 text-green-700 font-bold text-lg';
    badge.innerHTML = `<i class='fas fa-box-open mr-1'></i>Total Consumed: <span class='bg-green-100 px-2 py-1 rounded'>${total}</span>`;
    ctx.parentElement.after(badge);
  }
}

function renderTopNonconsumablesBarChart() {
  const ctx = document.getElementById('topNonconsumablesBarChart');
  if (!ctx) return;
  const top10 = [...(dashboardMockData.apparatus.topBorrowed || []), ...(dashboardMockData.glassware.topBorrowed || []), ...(dashboardMockData.equipment.topBorrowed || [])]
    .sort((a, b) => b.times - a.times).slice(0, 10);
  // Remove any existing summary badge
  const parent = ctx.closest('.flex-col');
  const oldBadge = parent && parent.querySelector('.chart-summary');
  if (oldBadge) oldBadge.remove();
  // Render chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(item => item.name),
      datasets: [{
        label: 'Borrowed',
        data: top10.map(item => item.times),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        maxBarThickness: 32,
        categoryPercentage: 1,
        barPercentage: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      layout: { padding: { left: 0, right: 0 } },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { maxRotation: 30, minRotation: 30, padding: 2 },
          offset: true,
          categoryPercentage: 1,
          barPercentage: 1
        },
        y: { beginAtZero: true }
      }
    }
  });
  // Add summary badge below chart
  if (parent) {
    const total = top10.reduce((sum, item) => sum + item.times, 0);
    const badge = document.createElement('div');
    badge.className = 'chart-summary mt-2 text-blue-700 font-bold text-lg';
    
    badge.innerHTML = `<i class='fas fa-hand-holding mr-1'></i>Total Borrowed: <span class='bg-blue-100 px-2 py-1 rounded'>${total}</span>`;
    ctx.parentElement.after(badge);
  }
}

function renderBorrowedDoughnutChart() {
  const ctx = document.getElementById('borrowedDoughnutChart');
  if (!ctx) return;
  // Mock: borrowed vs available (total 1000 for demo)
  const borrowed = (dashboardMockData.apparatus.totalBorrowed || 0) + (dashboardMockData.glassware.totalBorrowed || 0) + (dashboardMockData.equipment.totalBorrowed || 0);
  const available = 1000 - borrowed;
  // Add summary badge
  const parent = ctx.closest('.flex-col');
  if (parent && !parent.querySelector('.chart-summary')) {
    const badge = document.createElement('div');
    badge.className = 'chart-summary mb-2 text-purple-700 font-bold text-lg';
    badge.innerHTML = `<i class='fas fa-pie-chart mr-1'></i>Borrowed: <span class='bg-purple-100 px-2 py-1 rounded'>${borrowed}</span> &nbsp; Available: <span class='bg-green-100 px-2 py-1 rounded'>${available}</span>`;
    parent.insertBefore(badge, ctx.parentElement);
  }
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Borrowed', 'Available'],
      datasets: [{
        data: [borrowed, available],
        backgroundColor: ['#fb923c', '#22c55e'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderBorrowingTrendChart() {
  const ctx = document.getElementById('borrowingTrendChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Borrowed',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245,158,66,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Update renderDashboardSections function
function renderDashboardSections() {
  // Overall Summary Cards (Compact)
  const overallItemQuantity = (dashboardMockData.chemicals.totalConsumed || 0) + (dashboardMockData.items.totalConsumed || 0) + (dashboardMockData.apparatus.totalBorrowed || 0) + (dashboardMockData.glassware.totalBorrowed || 0) + (dashboardMockData.equipment.totalBorrowed || 0);
  const overallConsumedItems = (dashboardMockData.chemicals.totalConsumed || 0) + (dashboardMockData.items.totalConsumed || 0);
  const overallItemsBorrowed = (dashboardMockData.apparatus.totalBorrowed || 0) + (dashboardMockData.glassware.totalBorrowed || 0) + (dashboardMockData.equipment.totalBorrowed || 0);
  const overallCompletedTransactions = 42;

  const summaryContainer = document.getElementById('dashboardSummary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm text-gray-500">Total Items</div>
          <div class="text-2xl font-bold text-gray-800">${overallItemQuantity}</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm text-gray-500">Consumed</div>
          <div class="text-2xl font-bold text-green-600">${overallConsumedItems}</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm text-gray-500">Borrowed</div>
          <div class="text-2xl font-bold text-blue-600">${overallItemsBorrowed}</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm text-gray-500">Transactions</div>
          <div class="text-2xl font-bold text-purple-600">${overallCompletedTransactions}</div>
        </div>
      </div>
    `;
  }

  // Charts Section
  const chartsContainer = document.getElementById('dashboardCharts');
  if (chartsContainer) {
    chartsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Consumption Trend</h3>
          <div class="h-48">
            <canvas id="consumptionTrendChart"></canvas>
          </div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Monthly Statistics</h3>
          <div class="h-48">
            <canvas id="monthlyStatsChart"></canvas>
          </div>
        </div>
      </div>
    `;
    renderConsumptionTrendChart();
    renderMonthlyStatsChart();
  }

  // Top Items and Alerts (Compact Grid)
  const topItemsContainer = document.getElementById('dashboardTopItems');
  if (topItemsContainer) {
    const top10Consumables = [...(dashboardMockData.chemicals.topMoving || []), ...(dashboardMockData.items.topMoving || [])].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    const top10Nonconsumables = [...(dashboardMockData.apparatus.topBorrowed || []), ...(dashboardMockData.glassware.topBorrowed || []), ...(dashboardMockData.equipment.topBorrowed || [])].sort((a, b) => b.times - a.times).slice(0, 5);
    
    topItemsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Top Consumables</h3>
          <ul class="space-y-1">
            ${top10Consumables.map((item, idx) => `
              <li class="flex justify-between items-center text-sm">
                <span class="flex items-center gap-1">
                  <span class="text-gray-400">${idx + 1}.</span>
                  ${item.name}
                </span>
                <span class="text-green-600">${item.quantity}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Top Non-consumables</h3>
          <ul class="space-y-1">
            ${top10Nonconsumables.map((item, idx) => `
              <li class="flex justify-between items-center text-sm">
                <span class="flex items-center gap-1">
                  <span class="text-gray-400">${idx + 1}.</span>
                  ${item.name}
                </span>
                <span class="text-blue-600">${item.times}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Quick Alerts and Recent Activity (Compact)
  const alertsContainer = document.getElementById('dashboardAlerts');
  if (alertsContainer) {
    const soonToExpire = [...(dashboardMockData.chemicals.soonToExpire || []), ...(dashboardMockData.items.soonToExpire || [])];
    const currentlyBorrowed = [...(dashboardMockData.apparatus.currentlyBorrowed || []), ...(dashboardMockData.glassware.currentlyBorrowed || []), ...(dashboardMockData.equipment.currentlyBorrowed || [])];
    
    alertsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Quick Alerts</h3>
          <div class="space-y-2">
            ${soonToExpire.length > 0 ? `
              <div class="flex items-center text-sm text-red-600">
                <i class="fas fa-exclamation-circle mr-2"></i>
                ${soonToExpire.length} items expiring soon
              </div>
            ` : ''}
            ${currentlyBorrowed.length > 0 ? `
              <div class="flex items-center text-sm text-blue-600">
                <i class="fas fa-info-circle mr-2"></i>
                ${currentlyBorrowed.length} items currently borrowed
              </div>
            ` : ''}
          </div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h3>
          <div class="text-sm text-gray-600">
            Last transaction: ${new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    `;
  }

  // Top 10 Fast Moving Consumables
  const top10Consumables = [...(dashboardMockData.chemicals.topMoving || []), ...(dashboardMockData.items.topMoving || [])].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  const top10ConsumablesList = document.getElementById('dashboardTop10Consumables');
  if (top10ConsumablesList) {
    top10ConsumablesList.innerHTML = top10Consumables.map((item, idx) => `
      <li class="flex items-center justify-between px-3 py-2 rounded ${idx === 0 ? 'bg-green-50 font-bold' : ''}">
        <span class="flex items-center gap-2">
          <span class="text-gray-400 font-bold text-lg" style="min-width:2ch;">${idx + 1}.</span>
          ${idx === 0 ? '<i class=\'fas fa-crown text-yellow-500\'></i>' : ''}
          <span>${item.name}</span>
        </span>
        <span class="text-green-700 font-semibold">${item.quantity}</span>
      </li>
    `).join('');
  }
  // Top 10 Frequently Borrowed Nonconsumables
  const top10Nonconsumables = [...(dashboardMockData.apparatus.topBorrowed || []), ...(dashboardMockData.glassware.topBorrowed || []), ...(dashboardMockData.equipment.topBorrowed || [])].sort((a, b) => b.times - a.times).slice(0, 10);
  const top10NonconsumablesList = document.getElementById('dashboardTop10Nonconsumables');
  if (top10NonconsumablesList) {
    top10NonconsumablesList.innerHTML = top10Nonconsumables.map((item, idx) => `
      <li class="flex items-center justify-between px-3 py-2 rounded ${idx === 0 ? 'bg-blue-50 font-bold' : ''}">
        <span class="flex items-center gap-2">
          <span class="text-gray-400 font-bold text-lg" style="min-width:2ch;">${idx + 1}.</span>
          ${idx === 0 ? '<i class=\'fas fa-crown text-yellow-500\'></i>' : ''}
          <span>${item.name}</span>
        </span>
        <span class="text-blue-700 font-semibold">${item.times}</span>
      </li>
    `).join('');
  }
  // Currently Borrowed Items
  const currentlyBorrowed = [
    ...(dashboardMockData.apparatus.currentlyBorrowed || []),
    ...(dashboardMockData.glassware.currentlyBorrowed || []),
    ...(dashboardMockData.equipment.currentlyBorrowed || [])
  ];
  const currentlyBorrowedList = document.getElementById('dashboardCurrentlyBorrowed');
  if (currentlyBorrowedList) {
    currentlyBorrowedList.innerHTML = currentlyBorrowed.map(item => `
      <li class="flex justify-between items-center px-2 py-1 bg-purple-50 rounded">
        <span>${item.name}</span>
        <span class="text-purple-700 font-semibold">${item.borrower} <span class='text-xs text-gray-500'>(Due: ${item.dueDate})</span></span>
      </li>
    `).join('');
  }
  // Soon to Expire Consumables (within 10 days)
  const soonToExpire = [
    ...(dashboardMockData.chemicals.soonToExpire || []),
    ...(dashboardMockData.items.soonToExpire || [])
  ].filter(item => item.daysLeft <= 10);
  const soonToExpireList = document.getElementById('dashboardSoonToExpire');
  if (soonToExpireList) {
    soonToExpireList.innerHTML = soonToExpire.map(item => `
      <li class="flex justify-between items-center px-2 py-1 bg-red-50 rounded">
        <span>${item.name}</span>
        <span class="text-red-600 font-semibold">${item.daysLeft}d</span>
      </li>
    `).join('');
  }
  // Pending/Partially Returns
  const pendingReturns = dashboardMockData.pendingReturns || [];
  const pendingReturnsList = document.getElementById('dashboardPendingReturns');
  if (pendingReturnsList) {
    pendingReturnsList.innerHTML = pendingReturns.map(item => `
      <li class="flex flex-col px-2 py-1 bg-yellow-50 rounded">
        <span class="font-semibold text-yellow-700">Transaction: ${item.transactionId}</span>
        <span class="text-gray-700 text-sm">Items: ${item.items.join(', ')}</span>
      </li>
    `).join('');
  }

  // Most Recent Transactions (show 3)
  const recentTransactionDiv = document.getElementById('dashboardRecentTransaction');
  if (recentTransactionDiv) {
    recentTransactionDiv.innerHTML = dashboardRecentTransactions.map(tx => `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b last:border-b-0 py-2">
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <span class="font-semibold text-gray-800">${tx.id}</span>
          <span class="text-xs text-gray-500">${tx.dateTime}</span>
          <span class="text-xs text-gray-500">${tx.type}</span>
        </div>
        <div class="flex items-center gap-2 mt-1 md:mt-0">
          <span class="px-2 py-1 rounded text-xs font-semibold ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : tx.status === 'Returned' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}">${tx.status}</span>
          <span class="text-xs text-gray-600">${tx.remarks}</span>
        </div>
      </div>
    `).join('');
  }

  // After rendering containers:
  renderConsumptionTrendChart();
  renderBorrowingTrendChart();
  renderTopConsumablesBarChart();
  renderTopNonconsumablesBarChart();
  renderBorrowedDoughnutChart();
}

window.addEventListener('DOMContentLoaded', function () {
  renderDashboardQuickAlerts();
  renderDashboardSummaryRow();
  renderDashboardSections();
});