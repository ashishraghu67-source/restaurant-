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
  const itemsPerView = window.innerWidth > 980 ? 3 : window.innerWidth > 700 ? 2 : 1;
  const totalSlides = Math.ceil(items.length / itemsPerView);
  
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
  
  function updateCarousel() {
    const itemWidth = items[0]?.offsetWidth + 18; // width + gap
    const scrollPosition = currentIndex * itemWidth * itemsPerView;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateDots();
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
    } else {
      currentIndex = 0; // Loop back
    }
    updateCarousel();
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1; // Loop to end
    }
    updateCarousel();
  }
  
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);
  
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
      currentIndex = 0;
      initGalleryCarousel();
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
  const itemsPerView = window.innerWidth > 980 ? 2 : 1;
  const totalSlides = Math.ceil(items.length / itemsPerView);
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
  
  function updateCarousel() {
    const itemWidth = items[0]?.offsetWidth + 24; // width + gap
    const scrollPosition = currentIndex * itemWidth * itemsPerView;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    updateDots();
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
    } else {
      currentIndex = 0; // Loop back
    }
    updateCarousel();
    resetAutoPlay();
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1; // Loop to end
    }
    updateCarousel();
    resetAutoPlay();
  }
  
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
      currentIndex = 0;
      stopAutoPlay();
      initTestimonialsCarousel();
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