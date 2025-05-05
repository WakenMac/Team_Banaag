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
