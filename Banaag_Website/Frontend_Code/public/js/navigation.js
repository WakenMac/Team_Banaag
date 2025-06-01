// Navigation functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
  // Dropdown menu functionality
  const dropdownButtons = ['masterlistBtn', 'consumablesBtn', 'nonconsumablesBtn'];
  
  dropdownButtons.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(buttonId.replace('Btn', 'Menu'));
    
    if (button && menu) {
      button.addEventListener('click', () => {
        menu.classList.toggle('opacity-0');
        menu.classList.toggle('invisible');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.add('opacity-0');
          menu.classList.add('invisible');
        }
      });
    }
  });

  // Set active state for current page
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('border-[#2ca14a]');
      link.classList.add('text-[#2ca14a]');
      link.classList.remove('border-transparent');
    }
  });

  // Set active state for dropdown items
  const dropdownItems = document.querySelectorAll('nav ul li a');
  dropdownItems.forEach(item => {
    if (item.getAttribute('href') === currentPage) {
      const parentButton = item.closest('li').parentElement.previousElementSibling;
      if (parentButton) {
        parentButton.classList.add('border-[#2ca14a]');
        parentButton.classList.add('text-[#2ca14a]');
        parentButton.classList.remove('border-transparent');
      }
    }
  });
}); 