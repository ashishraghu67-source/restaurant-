// Site Loader
function initSiteLoader() {
  const loader = document.getElementById('siteLoader');
  const mainContent = document.getElementById('mainContent');
  
  if (!loader || !mainContent) return;
  
  // Simulate loading progress
  let progress = 0;
  const progressBar = loader.querySelector('.loader-progress-bar');
  
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Wait for minimum display time
      setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.classList.add('loaded');
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after animation
        setTimeout(() => {
          loader.remove();
        }, 800);
      }, 500);
    }
  }, 100);
  
  // Fallback: Hide loader after max 3 seconds
  setTimeout(() => {
    clearInterval(progressInterval);
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      mainContent.classList.add('loaded');
      document.body.classList.add('loaded');
      setTimeout(() => {
        loader.remove();
      }, 800);
    }
  }, 3000);
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteLoader);
} else {
  initSiteLoader();
}

// Mobile menu toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Back to top button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Close mobile menu when clicking a link
navLinksAll.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 700) {
      navLinks.classList.remove('active');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Update copyright year automatically
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// Gallery Carousel
function initGalleryCarousel() {
  const carousel = document.getElementById('galleryCarousel');
  const prevBtn = carousel?.parentElement.querySelector('.carousel-btn-prev');
  const nextBtn = carousel?.parentElement.querySelector('.carousel-btn-next');
  const dotsContainer = document.getElementById('galleryDots');
  
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  let itemsPerView = window.innerWidth > 980 ? 3 : window.innerWidth > 700 ? 2 : 1;
  let totalSlides = Math.ceil(items.length / itemsPerView);
  
  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  function updateButtons() {
    // Hide prev button at start
    if (prevBtn) {
      if (currentIndex === 0) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
      }
    }
    
    // Hide next button at end
    if (nextBtn) {
      if (currentIndex >= totalSlides - 1) {
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    }
  }
  
  function updateCarousel() {
    const itemWidth = items[0]?.offsetWidth + 18; // width + gap
    const scrollPosition = currentIndex * itemWidth * itemsPerView;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateDots();
    updateButtons();
  }
  
  function updateDots() {
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    dots?.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
  }
  
  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }
  
  // Initialize button states
  updateButtons();
  
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);
  
  // Update buttons on scroll (for manual scrolling)
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    const itemWidth = items[0]?.offsetWidth + 18;
    
    // Calculate current index based on scroll position
    const newIndex = Math.round(scrollLeft / (itemWidth * itemsPerView));
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
      currentIndex = newIndex;
      updateDots();
      updateButtons();
    }
  });
  
  // Touch/swipe support
  let startX = 0;
  let scrollLeft = 0;
  let isDown = false;
  
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Update on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate dimensions
      itemsPerView = window.innerWidth > 980 ? 3 : window.innerWidth > 700 ? 2 : 1;
      totalSlides = Math.ceil(items.length / itemsPerView);
      
      // Adjust currentIndex if needed
      if (currentIndex >= totalSlides) {
        currentIndex = Math.max(0, totalSlides - 1);
      }
      
      // Update carousel position
      const itemWidth = items[0]?.offsetWidth + 18;
      const scrollPosition = currentIndex * itemWidth * itemsPerView;
      carousel.scrollTo({ left: scrollPosition, behavior: 'auto' });
      
      // Recreate dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
        }
      }
      
      // Update buttons
      updateButtons();
    }, 250);
  });
}

// Testimonials Carousel
function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn = carousel?.parentElement.querySelector('.carousel-btn-prev');
  const nextBtn = carousel?.parentElement.querySelector('.carousel-btn-next');
  const dotsContainer = document.getElementById('testimonialsDots');
  
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let itemsPerView = window.innerWidth > 980 ? 2 : 1;
  let totalSlides = Math.ceil(items.length / itemsPerView);
  let autoPlayInterval;
  
  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  function updateButtons() {
    // Hide prev button at start
    if (prevBtn) {
      if (currentIndex === 0) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
      }
    }
    
    // Hide next button at end
    if (nextBtn) {
      if (currentIndex >= totalSlides - 1) {
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    }
  }
  
  function updateCarousel() {
    const itemWidth = items[0]?.offsetWidth + 24; // width + gap
    const scrollPosition = currentIndex * itemWidth * itemsPerView;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateDots();
    updateButtons();
  }
  
  function updateDots() {
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    dots?.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
    resetAutoPlay();
  }
  
  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
      resetAutoPlay();
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      resetAutoPlay();
    }
  }
  
  // Initialize button states
  updateButtons();
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);
  
  // Update buttons on scroll (for manual scrolling)
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    const itemWidth = items[0]?.offsetWidth + 24;
    
    // Calculate current index based on scroll position
    const newIndex = Math.round(scrollLeft / (itemWidth * itemsPerView));
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
      currentIndex = newIndex;
      updateDots();
      updateButtons();
      resetAutoPlay();
    }
  });
  
  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  
  // Touch/swipe support
  let startX = 0;
  let scrollLeft = 0;
  let isDown = false;
  
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    stopAutoPlay();
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    startAutoPlay();
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    startAutoPlay();
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Start auto-play
  startAutoPlay();
  
  // Update on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate dimensions
      itemsPerView = window.innerWidth > 980 ? 2 : 1;
      totalSlides = Math.ceil(items.length / itemsPerView);
      
      // Adjust currentIndex if needed
      if (currentIndex >= totalSlides) {
        currentIndex = Math.max(0, totalSlides - 1);
      }
      
      // Update carousel position
      const itemWidth = items[0]?.offsetWidth + 24;
      const scrollPosition = currentIndex * itemWidth * itemsPerView;
      carousel.scrollTo({ left: scrollPosition, behavior: 'auto' });
      
      // Recreate dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
        }
      }
      
      // Update buttons
      updateButtons();
      stopAutoPlay();
      resetAutoPlay();
    }, 250);
  });
}

// Initialize carousels when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGalleryCarousel();
    initTestimonialsCarousel();
  });
} else {
  initGalleryCarousel();
  initTestimonialsCarousel();
}