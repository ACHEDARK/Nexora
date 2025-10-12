// Custom JavaScript for Nexora website

// Import Firebase modules
import { db } from '/assets/services/FirebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

// Mobile menu toggle
function toggleMobileMenu() {
  console.log('toggleMobileMenu called');
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');

  console.log('Menu element:', menu);
  console.log('Button element:', button);

  if (menu && button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    console.log('Current expanded state:', isExpanded);
    
    button.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('hidden');
    
    console.log('Menu classes after toggle:', menu.className);
    console.log('Button aria-expanded after toggle:', button.getAttribute('aria-expanded'));
  } else {
    console.error('Menu or button not found:', { menu, button });
  }
}

// Form validation and submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('form-error');
      isValid = false;
    } else {
      input.classList.remove('form-error');
    }
  });

  if (isValid) {
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') || form.querySelector('input[type="text"]').value,
      email: formData.get('email') || form.querySelector('input[type="email"]').value,
      message: formData.get('message') || form.querySelector('textarea').value,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'contacts'), data);
      showMessage(form, 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.', 'success');
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage(form, 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    }
  }
}

// Function to show success or error messages
function showMessage(form, message, type) {
  let messageDiv = form.querySelector('.form-message');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.className = 'form-message mt-4 p-4 rounded-lg';
    form.appendChild(messageDiv);
  }

  messageDiv.textContent = message;
  messageDiv.className = `form-message mt-4 p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Smooth scrolling for menu navigation
function handleMenuClick(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('data-target');
  const targetElement = document.getElementById(targetId);
  const contentContainer = document.getElementById('content-container') || document.getElementById('ai-content-container') || document.getElementById('datos-content-container');

  if (targetElement && contentContainer) {
    // Remove active class from all menu items
    document.querySelectorAll('.menu-link, .ai-menu-link, .datos-menu-link').forEach(link => {
      link.classList.remove('text-blue-600', 'bg-blue-50');
      link.classList.add('text-gray-700');
    });

    // Add active class to clicked menu item
    event.currentTarget.classList.remove('text-gray-700');
    event.currentTarget.classList.add('text-blue-600', 'bg-blue-50');

    // Scroll to the target element within the content container
    const containerRect = contentContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const scrollTop = targetRect.top - containerRect.top + contentContainer.scrollTop;

    contentContainer.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  }
}

// Update active menu item on scroll
function updateActiveMenuItem() {
  const contentContainer = document.getElementById('content-container') || document.getElementById('ai-content-container') || document.getElementById('datos-content-container');
  const menuLinks = document.querySelectorAll('.menu-link, .ai-menu-link, .datos-menu-link');

  if (!contentContainer || menuLinks.length === 0) return;

  const containerRect = contentContainer.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;

  let activeLink = null;

  menuLinks.forEach(link => {
    const targetId = link.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = targetRect.top;
      const targetBottom = targetRect.bottom;

      // Check if the target element is in view
      if (targetTop <= containerTop + 100 && targetBottom >= containerTop + 100) {
        activeLink = link;
      }
    }
  });

  // Update active class
  menuLinks.forEach(link => {
    link.classList.remove('text-blue-600', 'bg-blue-50');
    link.classList.add('text-gray-700');
  });

  if (activeLink) {
    activeLink.classList.remove('text-gray-700');
    activeLink.classList.add('text-blue-600', 'bg-blue-50');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners for forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });

  // Add event listeners for menu links
  const menuLinks = document.querySelectorAll('.menu-link, .ai-menu-link, .datos-menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', handleMenuClick);
  });

  // Add scroll event listener for content containers
  const contentContainer = document.getElementById('content-container');
  const aiContentContainer = document.getElementById('ai-content-container');
  const datosContentContainer = document.getElementById('datos-content-container');

  if (contentContainer) {
    contentContainer.addEventListener('scroll', updateActiveMenuItem);
  }
  if (aiContentContainer) {
    aiContentContainer.addEventListener('scroll', updateActiveMenuItem);
  }
  if (datosContentContainer) {
    datosContentContainer.addEventListener('scroll', updateActiveMenuItem);
  }

  // Lazy load images
  lazyLoadImages();

  // Add event listener for mobile menu (for dynamic header loading)
  addMobileMenuListener();
});

// Function to add mobile menu listener, checking periodically for the button
function addMobileMenuListener() {
  const checkForButton = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
      // Remove any existing event listeners to avoid duplicates
      mobileMenuButton.removeEventListener('click', toggleMobileMenu);
      mobileMenuButton.addEventListener('click', toggleMobileMenu);
      console.log('Mobile menu listener added successfully');
    } else {
      // If not found, check again after a short delay
      setTimeout(checkForButton, 100);
    }
  };
  checkForButton();
}

// Alternative approach: Use event delegation on document
document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'mobile-menu-button') {
    toggleMobileMenu();
  }
});
