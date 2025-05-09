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

// Initialize dropdown menus
setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");
