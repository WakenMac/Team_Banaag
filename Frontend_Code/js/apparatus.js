// ----------------------------------------------------------
/*
 * This code is for apparatus html. most specifically, the modal form.
 */
// -----------------------------------------------------------

/* This is the code for the dropdown menus. */

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

setupDropdown("masterlistBtn", "masterlistMenu");
setupDropdown("consumablesBtn", "consumablesMenu");
setupDropdown("nonconsumablesBtn", "nonconsumablesMenu");
setupDropdown("propertiesBtn", "propertiesMenu");

/* 
-----------------------------------------------------------

* This code is for the modal form that allows the user to add a new apparatus.
* It includes the logic for opening and closing the modal, as well as handling the form submission.
* It also includes the logic for adding a new row to the table and deleting a row from the table.
* The modal is opened when the "Add Apparatus" button is clicked, and closed when the cancel button or backdrop is clicked.
* When the form is submitted, a new row is added to the table with the values from the form.
* The new row includes the apparatus ID, name, unit, location, brand, and quantity.
* The row also includes edit and delete buttons.
* When the delete button is clicked, the row is removed from the table.
* The form includes validation to ensure that all required fields are filled in before submission.
* The form is reset when the modal is closed.

TODO: The edit button is not yet implemented, but it will be added later.

------------------------------------------------------------
*/
const addApparatusBtn = document.getElementById("addApparatusBtn");
const addApparatusModal = document.getElementById("addApparatusModal");
const modalBackdropApparatus = document.getElementById(
  "modalBackdropApparatus"
);
const cancelApparatusBtn = document.getElementById("cancelApparatusBtn");
const addApparatusForm = document.getElementById("addApparatusForm");
const tbody = document.querySelector("tbody");

function openModal() {
  addApparatusModal.classList.remove("hidden");
  addApparatusModal.classList.add("flex");
}

function closeModal() {
  addApparatusModal.classList.add("hidden");
  addApparatusModal.classList.remove("flex");
  addApparatusForm.reset();
}

addApparatusBtn.addEventListener("click", openModal);
cancelApparatusBtn.addEventListener("click", closeModal);
modalBackdropApparatus.addEventListener("click", closeModal);

addApparatusForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const apparatusId = addApparatusForm.apparatusId.value.trim();
  const apparatusName = addApparatusForm.apparatusName.value.trim();
  const apparatusUnit = addApparatusForm.apparatusUnit.value.trim();
  const apparatusLocation = addApparatusForm.apparatusLocation.value.trim();
  const apparatusBrand = addApparatusForm.apparatusBrand.value.trim();
  const apparatusQuantity = addApparatusForm.apparatusQuantity.value.trim();

  if (
    !apparatusId ||
    !apparatusName ||
    !apparatusUnit ||
    !apparatusLocation ||
    !apparatusBrand ||
    !apparatusQuantity
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create new row
  const tr = document.createElement("tr");

  tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusUnit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusLocation}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusBrand}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">${apparatusQuantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
              <button aria-label="Edit apparatus" class="text-yellow-400 hover:text-yellow-500">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button aria-label="Delete apparatus" class="text-red-600 hover:text-red-700">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          `;
  tbody.appendChild(tr);
  closeModal();
});

tbody.addEventListener("click", (e) => {
  if (
    e.target.closest("button") &&
    e.target.closest("button").getAttribute("aria-label") === "Delete apparatus"
  ) {
    const row = e.target.closest("tr");
    if (row) {
      row.remove();
    }
  }
});
