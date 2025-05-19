// Common UI Functions for CARES System

// Loading State Management
export function showPageLoading(customMessage = null) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    const messageEl = spinner.querySelector('.loading-message');
    if (messageEl && customMessage) {
      messageEl.textContent = customMessage;
    }
    spinner.style.display = 'flex';
    spinner.style.opacity = '0';
    // Fade in animation
    setTimeout(() => {
      spinner.style.transition = 'opacity 0.3s ease-in-out';
      spinner.style.opacity = '1';
    }, 0);
  }
}

export function hidePageLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    // Fade out animation
    spinner.style.transition = 'opacity 0.3s ease-in-out';
    spinner.style.opacity = '0';
    setTimeout(() => {
      spinner.style.display = 'none';
    }, 300);
  }
}

export function showTableLoading(tableId = 'dataTable', message = 'Loading data...') {
  const tableBody = document.getElementById(tableId + 'Body');
  const loadingState = document.getElementById('tableLoadingState');
  if (tableBody && loadingState) {
    const loadingMessage = loadingState.querySelector('.loading-message');
    if (loadingMessage) {
      loadingMessage.textContent = message;
    }
    
    tableBody.style.opacity = '0';
    tableBody.style.transition = 'opacity 0.3s ease-in-out';
    loadingState.classList.remove('hidden');
    loadingState.style.opacity = '0';
    // Fade in animation
    setTimeout(() => {
      loadingState.style.transition = 'opacity 0.3s ease-in-out';
      loadingState.style.opacity = '1';
    }, 0);
  }
}

export function hideTableLoading(tableId = 'dataTable') {
  const tableBody = document.getElementById(tableId + 'Body');
  const loadingState = document.getElementById('tableLoadingState');
  if (tableBody && loadingState) {
    // Fade out loading state
    loadingState.style.transition = 'opacity 0.3s ease-in-out';
    loadingState.style.opacity = '0';
    
    setTimeout(() => {
      loadingState.classList.add('hidden');
      // Fade in table body
      tableBody.style.transition = 'opacity 0.3s ease-in-out';
      tableBody.style.opacity = '1';
    }, 300);
  }
}

// Toast Notifications
export function showToast(message, isError = false, time = 3000) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "32px";
    toast.style.right = "32px";
    toast.style.background = isError ? "rgba(220, 38, 38, 0.95)" : "rgba(44, 161, 74, 0.95)";
    toast.style.color = "white";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "16px";
    toast.style.fontWeight = "500";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease-in-out";
    toast.style.zIndex = "9999";
    
    // Add icon container
    const iconContainer = document.createElement("div");
    iconContainer.style.display = "flex";
    iconContainer.style.alignItems = "center";
    iconContainer.style.gap = "12px";
    
    // Add icon
    const icon = document.createElement("i");
    icon.className = isError ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    icon.style.fontSize = "20px";
    
    iconContainer.appendChild(icon);
    iconContainer.appendChild(document.createTextNode(message));
    toast.appendChild(iconContainer);
    
    document.body.appendChild(toast);
  } else {
    const icon = toast.querySelector("i");
    if (icon) {
      icon.className = isError ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    }
    const textNode = toast.querySelector("div");
    if (textNode) {
      textNode.lastChild.textContent = message;
    }
  }
  
  toast.style.background = isError ? "rgba(220, 38, 38, 0.95)" : "rgba(44, 161, 74, 0.95)";
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 0);
  
  // Animate out
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, time);
}

// Common Loading Template
export const loadingSpinnerHTML = `
  <div id="loadingSpinner" class="fixed inset-0 z-50 flex items-center justify-center bg-[#f3f7f7]">
    <div class="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2ca14a]"></div>
      <p class="mt-4 text-gray-700 text-lg font-medium loading-message">Loading CARES System</p>
      <p class="mt-2 text-gray-500 text-sm">Please wait while we prepare everything for you...</p>
    </div>
  </div>
`;

export const tableLoadingHTML = `
  <div id="tableLoadingState" class="hidden">
    <div class="animate-pulse space-y-4 p-4">
      <!-- Header shimmer -->
      <div class="h-8 bg-gray-200 rounded w-1/4"></div>
      <!-- Table header shimmer -->
      <div class="h-12 bg-gray-200 rounded mb-4"></div>
      <!-- Table rows shimmer -->
      <div class="space-y-3">
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded opacity-75"></div>
        <div class="h-10 bg-gray-200 rounded opacity-50"></div>
        <div class="h-10 bg-gray-200 rounded opacity-75"></div>
        <div class="h-10 bg-gray-200 rounded opacity-50"></div>
      </div>
      <!-- Loading message -->
      <div class="flex items-center justify-center mt-6">
        <p class="text-gray-500 text-sm loading-message">Loading data...</p>
      </div>
    </div>
  </div>
`;

// Dropdown Menu Setup
export function setupDropdown(buttonId, menuId) {
  const btn = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);
  
  if (!btn || !menu) return;

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

// Initialize Common UI Elements
export function initializeCommonUI() {
  // Add loading spinner if not present
  if (!document.getElementById('loadingSpinner')) {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.innerHTML = loadingSpinnerHTML;
    document.body.appendChild(spinnerContainer.firstElementChild);
  }

  if (!document.getElementById('tableLoadingState')) {
    const tableLoadingContainer = document.createElement('div');
    tableLoadingContainer.innerHTML = tableLoadingHTML;
    document.body.appendChild(tableLoadingContainer.firstElementChild);
  }

  const commonDropdowns = [
    { button: 'masterlistBtn', menu: 'masterlistMenu' },
    { button: 'consumablesBtn', menu: 'consumablesMenu' },
    { button: 'nonconsumablesBtn', menu: 'nonconsumablesMenu' },
    { button: 'propertiesBtn', menu: 'propertiesMenu' }
  ];

  commonDropdowns.forEach(({ button, menu }) => {
    setupDropdown(button, menu);
  });
} 