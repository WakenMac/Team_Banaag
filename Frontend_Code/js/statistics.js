// Chart colors and icons for best practices
const sectionColors = {
  chemicals: 'green',
  items: 'yellow',
  apparatus: 'blue',
  glassware: 'purple',
  equipment: 'orange'
};
const sectionIcons = {
  chemicals: 'fa-vial',
  items: 'fa-box-open',
  apparatus: 'fa-cog',
  glassware: 'fa-wine-glass-alt',
  equipment: 'fa-microscope'
};

// Mock data for statistics
const mockData = {
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
      { name: 'Hydrogen Peroxide', daysLeft: 5 },
      { name: 'Formaldehyde', daysLeft: 7 },
      { name: 'Acetic Acid', daysLeft: 10 }
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
      { name: 'Gloves (Box)', daysLeft: 3 },
      { name: 'Face Masks (Box)', daysLeft: 5 },
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
      { name: 'Beaker', borrower: 'Kyrie Irving' },
      { name: 'Erlenmeyer Flask', borrower: 'Allan George' },
      { name: 'Bunsen Burner', borrower: 'Dave Shanna' }
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
      { name: 'Test Tube Set', borrower: 'Jeff Ronyl' },
      { name: 'Pipette Set', borrower: 'Waken Cean' },
      { name: 'Burette', borrower: 'Marcellin' }
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
      { name: 'Microscope', borrower: 'Dwight Ramos' },
      { name: 'Centrifuge', borrower: 'Lebron James' },
      { name: 'pH Meter', borrower: 'Kobe Bryant' }
    ]
  }
};

window.addEventListener('DOMContentLoaded', function () {
  renderQuickAlerts();
  renderSummaryRow();
  renderStatisticsCards();
});

function renderQuickAlerts() {
  const alerts = [];
  // Soon to expire (Chemicals & Items)
  const soonToExpire = [
    ...mockData.chemicals.soonToExpire.map(item => ({ ...item, type: 'chemicals' })),
    ...mockData.items.soonToExpire.map(item => ({ ...item, type: 'items' }))
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
    ...mockData.apparatus.currentlyBorrowed.map(item => ({ ...item, type: 'apparatus' })),
    ...mockData.glassware.currentlyBorrowed.map(item => ({ ...item, type: 'glassware' })),
    ...mockData.equipment.currentlyBorrowed.map(item => ({ ...item, type: 'equipment' }))
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
  document.getElementById('quickAlerts').innerHTML = alerts.join('');
}

function renderSummaryRow() {
  // Best practice: visually distinct cards, icons, color, clear numbers
  const totalConsumed = mockData.chemicals.totalConsumed + mockData.items.totalConsumed;
  const totalBorrowed = mockData.apparatus.totalBorrowed + mockData.glassware.totalBorrowed + mockData.equipment.totalBorrowed;
  const soonToExpireCount = mockData.chemicals.soonToExpire.length + mockData.items.soonToExpire.length;
  const currentlyBorrowedCount = mockData.apparatus.currentlyBorrowed.length + mockData.glassware.currentlyBorrowed.length + mockData.equipment.currentlyBorrowed.length;
  document.getElementById('summaryRow').innerHTML = `
    <div class="flex-1 min-w-[180px] bg-green-100 rounded-lg p-4 flex items-center gap-3 shadow">
      <i class="fas fa-archive text-green-600 text-2xl"></i>
      <div>
        <div class="text-lg font-bold text-green-700">${totalConsumed}</div>
        <div class="text-xs text-gray-700">Total Consumables Consumed</div>
      </div>
    </div>
    <div class="flex-1 min-w-[180px] bg-blue-100 rounded-lg p-4 flex items-center gap-3 shadow">
      <i class="fas fa-hand-holding text-blue-600 text-2xl"></i>
      <div>
        <div class="text-lg font-bold text-blue-700">${totalBorrowed}</div>
        <div class="text-xs text-gray-700">Total Non-Consumables Borrowed</div>
      </div>
    </div>
    <div class="flex-1 min-w-[180px] bg-red-100 rounded-lg p-4 flex items-center gap-3 shadow">
      <i class="fas fa-exclamation-circle text-red-600 text-2xl"></i>
      <div>
        <div class="text-lg font-bold text-red-700">${soonToExpireCount}</div>
        <div class="text-xs text-gray-700">Soon to Expire</div>
      </div>
    </div>
    <div class="flex-1 min-w-[180px] bg-purple-100 rounded-lg p-4 flex items-center gap-3 shadow">
      <i class="fas fa-user-clock text-purple-600 text-2xl"></i>
      <div>
        <div class="text-lg font-bold text-purple-700">${currentlyBorrowedCount}</div>
        <div class="text-xs text-gray-700">Currently Borrowed</div>
      </div>
    </div>
  `;
}

function renderStatisticsCards() {
  // --- Chemicals ---
  renderTop10List(
    'top10Chemicals',
    mockData.chemicals.topMoving,
    'quantity',
    'green'
  );
  document.getElementById('chemicalsConsumedCount').textContent = mockData.chemicals.totalConsumed;
  renderSoonToExpireList('chemicalsExpiryList', mockData.chemicals.soonToExpire, 'green');

  // --- Items ---
  renderTop10List(
    'top10Items',
    mockData.items.topMoving,
    'quantity',
    'yellow'
  );
  document.getElementById('itemsConsumedCount').textContent = mockData.items.totalConsumed;
  renderSoonToExpireList('itemsExpiryList', mockData.items.soonToExpire, 'yellow');

  // --- Apparatus ---
  renderTop10List(
    'top10Apparatus',
    mockData.apparatus.topBorrowed,
    'times',
    'blue'
  );
  document.getElementById('apparatusBorrowedCount').textContent = mockData.apparatus.totalBorrowed;
  renderCurrentlyBorrowedList('apparatusBorrowedList', mockData.apparatus.currentlyBorrowed, 'blue');

  // --- Glassware ---
  renderTop10List(
    'top10Glassware',
    mockData.glassware.topBorrowed,
    'times',
    'purple'
  );
  document.getElementById('glasswareBorrowedCount').textContent = mockData.glassware.totalBorrowed;
  renderCurrentlyBorrowedList('glasswareBorrowedList', mockData.glassware.currentlyBorrowed, 'purple');

  // --- Equipment ---
  renderTop10List(
    'top10Equipment',
    mockData.equipment.topBorrowed,
    'times',
    'orange'
  );
  document.getElementById('equipmentBorrowedCount').textContent = mockData.equipment.totalBorrowed;
  renderCurrentlyBorrowedList('equipmentBorrowedList', mockData.equipment.currentlyBorrowed, 'orange');
}

function renderTop10List(listId, data, valueKey, color) {
  const list = document.getElementById(listId);
  if (!list) return;
  list.innerHTML = data.slice(0, 10).map((item, idx) => {
    const isTop = idx === 0;
    return `
      <li class="flex items-center justify-between px-3 py-2 rounded ${isTop ? `bg-${color}-100 font-bold` : ''}">
        <span class="flex items-center gap-2">
          <span class="text-gray-400 font-bold text-lg" style="min-width:2ch;">${idx + 1}.</span>
          ${isTop ? '<i class=\'fas fa-crown text-yellow-500\'></i>' : ''}
          <span>${item.name}</span>
        </span>
        <span class="text-${color}-700 font-semibold">${item[valueKey]}</span>
      </li>
    `;
  }).join('');
}

function renderSoonToExpireList(listId, data, color) {
  const list = document.getElementById(listId);
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<li class="text-gray-400">None</li>';
    return;
  }
  list.innerHTML = data.map(item => `
    <li class="flex justify-between items-center px-2 py-1 bg-${color}-50 rounded">
      <span>${item.name}</span>
      <span class="text-red-600 font-semibold">${item.daysLeft}d</span>
    </li>
  `).join('');
}

function renderCurrentlyBorrowedList(listId, data, color) {
  const list = document.getElementById(listId);
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<li class="text-gray-400">None</li>';
    return;
  }
  list.innerHTML = data.map(item => `
    <li class="flex justify-between items-center px-2 py-1 bg-${color}-50 rounded">
      <span>${item.name}</span>
      <span class="text-${color}-700 font-semibold">${item.borrower}</span>
    </li>
  `).join('');
}


// Chart Configurations
function initializeCharts() {
  // Fast-Moving Consumables Chart
  const topConsumablesCtx = document.getElementById('topConsumablesBarChart');
  if (topConsumablesCtx) {
    new Chart(topConsumablesCtx, {
      type: 'bar',
      data: {
        labels: mockChartData.fastMovingConsumables.labels,
        datasets: [{
          label: 'Consumption Rate (%)',
          data: mockChartData.fastMovingConsumables.data,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Consumption Rate (%)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // Consumption Trend Chart
  const consumptionTrendCtx = document.getElementById('consumptionTrendChart');
  if (consumptionTrendCtx) {
    new Chart(consumptionTrendCtx, {
      type: 'line',
      data: {
        labels: mockChartData.consumptionTrend.labels,
        datasets: [
          {
            label: 'Chemicals',
            data: mockChartData.consumptionTrend.chemicals,
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4
          },
          {
            label: 'Items',
            data: mockChartData.consumptionTrend.items,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity'
            }
          }
        }
      }
    });
  }

  // Borrowing Trend Chart
  const borrowingTrendCtx = document.getElementById('borrowingTrendChart');
  if (borrowingTrendCtx) {
    new Chart(borrowingTrendCtx, {
      type: 'line',
      data: {
        labels: mockChartData.borrowingTrend.labels,
        datasets: [
          {
            label: 'Apparatus',
            data: mockChartData.borrowingTrend.apparatus,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Glassware',
            data: mockChartData.borrowingTrend.glassware,
            borderColor: 'rgba(168, 85, 247, 1)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4
          },
          {
            label: 'Equipment',
            data: mockChartData.borrowingTrend.equipment,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Borrows'
            }
          }
        }
      }
    });
  }

  // Top 10 Frequently Borrowed Non-consumables Chart
  const topNonconsumablesCtx = document.getElementById('topNonconsumablesBarChart');
  if (topNonconsumablesCtx) {
    new Chart(topNonconsumablesCtx, {
      type: 'bar',
      data: {
        labels: mockChartData.topBorrowedNonConsumables.labels,
        datasets: [{
          label: 'Times Borrowed',
          data: mockChartData.topBorrowedNonConsumables.data,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Times Borrowed'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // Update dashboard summary cards with mock data
  const totalItems = 150;
  const totalConsumables = 75;
  const totalNonConsumables = 75;
  const totalTransactions = 45;

  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalConsumables').textContent = totalConsumables;
  document.getElementById('totalNonConsumables').textContent = totalNonConsumables;
  document.getElementById('totalTransactions').textContent = totalTransactions;
}
