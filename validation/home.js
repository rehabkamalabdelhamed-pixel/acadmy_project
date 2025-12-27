// home.js - Enhanced with modern features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initApp();
});

function initApp() {
    // Update date and time
    updateDateTime();
    
    // Load user data with animation
    loadUserData().then(() => {
        animateUserCard();
    });
    
    // Setup enhanced image slider
    setupImageSlider();
    
    // Setup mobile sidebar
    setupSidebar();
    
    // Add term card animations
    setupTermCards();
    
    // Add scroll animations
    setupScrollAnimations();
    
    // Add loading states
    setupLoadingStates();
}

function updateDateTime() {
    const now = new Date();
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const time = now.toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const dateElement = document.getElementById('currentDate');
    dateElement.innerHTML = `
        <span class="day">${day} ${time}</span>
        <span class="date">${date} ${month} ${year}</span>
    `;
    
    // Update time every minute
    setTimeout(updateDateTime, 60000);
}

async function loadUserData() {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData = {
            name: 'أحمد محمد',
            avatar: '../../assets/images/avatar.png',
            grade: 'الصف الثاني الثانوي',
            points: 1250,
            level: 3
        };
        
        // Update UI with animation
        const nameElement = document.getElementById('userName');
        const avatarElement = document.getElementById('userAvatar');
        
        nameElement.textContent = userData.name;
        avatarElement.src = userData.avatar;
        
        // Add user stats to the sidebar
        addUserStats(userData);
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('تعذر تحميل بيانات المستخدم');
    }
}

function addUserStats(userData) {
    const userInfo = document.querySelector('.user-info');
    
    const statsHTML = `
        <div class="user-stats">
            <div class="stat-item">
                <i class="bi bi-trophy-fill"></i>
                <span>${userData.points} نقطة</span>
            </div>
            <div class="stat-item">
                <i class="bi bi-star-fill"></i>
                <span>المستوى ${userData.level}</span>
            </div>
        </div>
    `;
    
    userInfo.insertAdjacentHTML('beforeend', statsHTML);
}

function animateUserCard() {
    const userSection = document.querySelector('.user-section');
    userSection.style.animation = 'fadeIn 0.8s ease-out';
}

function setupImageSlider() {
    const images = [
        { src: '../../assets/images/images (1).jpeg', alt: 'فصل دراسي' },
        { src: '../../assets/images/images (3).jpeg', alt: 'معمل حاسوب' },
        { src: '../../assets/images/images (4).jpeg', alt: 'طلاب يدرسون' },
        { src: '../../assets/images/images (5).jpeg', alt: 'مشاريع طلابية' }
    ];
    
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.getElementById('sliderDots');
    
    // Clear existing content
    sliderTrack.innerHTML = '';
    sliderDots.innerHTML = '';
    
    // Add slides
    images.forEach((img, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        slide.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <div class="slide-caption">
                <h4>${img.alt}</h4>
                <p>صورة ${index + 1} من ${images.length}</p>
            </div>
        `;
        sliderTrack.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `انتقل إلى الصورة ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    // Clone for infinite effect
    const firstClone = sliderTrack.firstElementChild.cloneNode(true);
    const lastClone = sliderTrack.lastElementChild.cloneNode(true);
    sliderTrack.appendChild(firstClone);
    sliderTrack.insertBefore(lastClone, sliderTrack.firstElementChild);
    
    let currentSlide = 1;
    const slideCount = images.length;
    const slideWidth = 100 / (slideCount + 2);
    
    // Initial setup
    sliderTrack.style.width = `${(slideCount + 2) * 100}%`;
    sliderTrack.style.transform = `translateX(-${slideWidth}%)`;
    
    // Controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        if (currentSlide <= 0) return;
        currentSlide--;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide >= slideCount + 1) return;
        currentSlide++;
        updateSlider();
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left
                currentSlide++;
            } else {
                // Swipe right
                currentSlide--;
            }
            updateSlider();
        }
    }
    
    function updateSlider() {
        sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update dots
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === (currentSlide - 1) % slideCount);
        });
        
        // Handle infinite loop
        if (currentSlide === slideCount + 1) {
            setTimeout(() => {
                sliderTrack.style.transition = 'none';
                currentSlide = 1;
                sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            }, 500);
        }
        
        if (currentSlide === 0) {
            setTimeout(() => {
                sliderTrack.style.transition = 'none';
                currentSlide = slideCount;
                sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            }, 500);
        }
    }
    
    // Auto slide
    let autoSlide = setInterval(() => {
        currentSlide++;
        updateSlider();
    }, 5000);
    
    // Pause on hover
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentSlide++;
            updateSlider();
        }, 5000);
    });
    
    function goToSlide(index) {
        currentSlide = index + 1;
        updateSlider();
    }
}

function setupSidebar() {
    if (window.innerWidth < 992) {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
        toggleBtn.setAttribute('aria-label', 'قائمة التنقل');
        document.querySelector('.main-content').prepend(toggleBtn);
        
        // Toggle sidebar
        toggleBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('show');
            
            // Update button icon
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.className = 'bi bi-x';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'bi bi-list';
                document.body.style.overflow = '';
            }
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            const toggleBtn = document.querySelector('.sidebar-toggle');
            
            if (sidebar.classList.contains('show') && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('show');
                document.body.style.overflow = '';
                toggleBtn.querySelector('i').className = 'bi bi-list';
            }
        });
    }
}

function setupTermCards() {
    const termCards = document.querySelectorAll('.term-card');
    
    termCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '100';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
        
        // Add click effect
        const termBtn = card.querySelector('.term-btn');
        termBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading animation
            this.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status"></span>
                جاري التحميل...
            `;
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 1000);
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.term-card, .section-header, .gallery-section, .hero-section'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

function setupLoadingStates() {
    // Handle image loading
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');
        
        // Remove when loaded
        if (img.complete) {
            img.classList.remove('loading');
        } else {
            img.addEventListener('load', () => {
                img.classList.remove('loading');
            });
            
            img.addEventListener('error', () => {
                img.classList.remove('loading');
                img.classList.add('error');
            });
        }
    });
}

function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>${message}</span>
        <button class="close-btn"><i class="bi bi-x"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Close button
    toast.querySelector('.close-btn').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Add CSS for error toast
const toastStyles = `
    .error-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .error-toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .error-toast i:first-child {
        font-size: 1.2rem;
    }
    
    .error-toast .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-right: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .error-toast .close-btn:hover {
        opacity: 1;
    }
    
    .spinner-border {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        vertical-align: text-bottom;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border 0.75s linear infinite;
    }
    
    @keyframes spinner-border {
        to { transform: rotate(360deg); }
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);