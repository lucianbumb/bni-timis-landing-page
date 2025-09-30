// App.js - Landing Page BNI Timiș - Recolta de Oportunități
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== CONFIGURĂRI GENERALE ====================
    
    // Smooth scroll pentru linkuri interne
    function initSmoothScroll() {
        const scrollElements = document.querySelectorAll('[href^="#"]');
        
        scrollElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header-fixed').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ==================== HEADER FUNCTIONALITY ====================
    
    function initHeader() {
        const header = document.querySelector('.header-fixed');
        const headerBtn = document.getElementById('headerBookBtn');
        const heroBtn = document.getElementById('heroBookBtn');
        
        // Scroll to booking section
        function scrollToBooking() {
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = bookingSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Event listeners pentru butoanele de rezervare
        if (headerBtn) {
            headerBtn.addEventListener('click', scrollToBooking);
        }
        
        if (heroBtn) {
            heroBtn.addEventListener('click', scrollToBooking);
        }
        
        // Header appearance on scroll
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolling
            if (scrollTop > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ==================== ANIMATIONS ====================
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.benefit-card, .detail-card, .promo-content, .payment-container');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ==================== PAYMENT SYSTEM ====================
    
    function initPaymentSystem() {
        console.log('🚀 Initializing payment system...');
        
        // Payment configuration
        const PAYMENT_CONFIG = {
            earlyBooking: {
                price: 180,
                link: 'https://mpy.ro/7q3g5nght?language=ro',
                deadline: new Date('2025-10-07T23:59:00+03:00') // 7 Oct 2025, 23:59 Romanian time
            },
            regularBooking: {
                price: 240,
                link: 'https://mpy.ro/7q3g5nhht?language=ro'
            }
        };
        
        // Get payment elements
        const paymentLink = document.getElementById('paymentLink');
        const currentPrice = document.getElementById('currentPrice');
        const priceTitle = document.getElementById('priceTitle');
        const priceNote = document.getElementById('priceNote');
        
        console.log('🔍 Payment elements:', {
            paymentLink: !!paymentLink,
            currentPrice: !!currentPrice,
            priceTitle: !!priceTitle,
            priceNote: !!priceNote
        });
        
        if (!paymentLink || !currentPrice || !priceTitle || !priceNote) {
            console.error('❌ Payment elements not found:', {
                paymentLink: paymentLink ? 'found' : 'missing',
                currentPrice: currentPrice ? 'found' : 'missing',
                priceTitle: priceTitle ? 'found' : 'missing',
                priceNote: priceNote ? 'found' : 'missing'
            });
            return;
        }
        
        // Update payment info based on current date
        function updatePaymentInfo() {
            const now = new Date();
            const isEarlyBooking = now < PAYMENT_CONFIG.earlyBooking.deadline;
            
            if (isEarlyBooking) {
                // Early booking period
                paymentLink.href = PAYMENT_CONFIG.earlyBooking.link;
                currentPrice.textContent = PAYMENT_CONFIG.earlyBooking.price;
                priceTitle.textContent = 'Early Booking';
                
                console.log('💳 Early booking link set:', PAYMENT_CONFIG.earlyBooking.link);
                
                priceNote.innerHTML = `
                    <p>Preț valabil până pe <strong>7 octombrie 2025, 23:59</strong></p>
                    <p class="countdown-note">După această dată: <strong>240 RON / bilet</strong></p>
                `;
                
                // Add countdown
                initCountdown();
                
            } else {
                // Regular booking period
                paymentLink.href = PAYMENT_CONFIG.regularBooking.link;
                currentPrice.textContent = PAYMENT_CONFIG.regularBooking.price;
                priceTitle.textContent = 'Tarif Regular';
                
                console.log('💳 Regular booking link set:', PAYMENT_CONFIG.regularBooking.link);
                
                priceNote.innerHTML = `
                    <p><strong>Perioada de early booking s-a încheiat</strong></p>
                    <p>Preț actual: <strong>240 RON / bilet</strong></p>
                    <p class="event-reminder">Evenimentul este pe <strong>9 octombrie 2025</strong></p>
                `;
            }
            
            // Security: Add additional checks to prevent manipulation
            Object.freeze(PAYMENT_CONFIG);
            
            console.log(`💳 Payment system updated - ${isEarlyBooking ? 'Early' : 'Regular'} booking active`);
        }
        
        // Countdown timer for early booking deadline
        function initCountdown() {
            const countdownElement = document.createElement('div');
            countdownElement.className = 'countdown-timer';
            countdownElement.style.cssText = `
                background: linear-gradient(135deg, var(--primary-red), var(--dark-red));
                color: white;
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                text-align: center;
                font-weight: 600;
            `;
            
            priceNote.appendChild(countdownElement);
            
            function updateCountdown() {
                const now = new Date();
                const timeLeft = PAYMENT_CONFIG.earlyBooking.deadline - now;
                
                if (timeLeft <= 0) {
                    updatePaymentInfo();
                    return;
                }
                
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                let countdownHTML = '<div style="font-size: 0.9rem; margin-bottom: 0.5rem;">⏰ Timp rămas pentru early booking:</div>';
                countdownHTML += '<div style="display: flex; justify-content: center; gap: 1rem; font-size: 1.1rem;">';
                
                if (days > 0) {
                    countdownHTML += `<div><strong>${days}</strong><br><small>zile</small></div>`;
                }
                countdownHTML += `
                    <div><strong>${hours.toString().padStart(2, '0')}</strong><br><small>ore</small></div>
                    <div><strong>${minutes.toString().padStart(2, '0')}</strong><br><small>min</small></div>
                    <div><strong>${seconds.toString().padStart(2, '0')}</strong><br><small>sec</small></div>
                `;
                countdownHTML += '</div>';
                
                countdownElement.innerHTML = countdownHTML;
            }
            
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
            
            // Clear interval when deadline is reached
            setTimeout(() => {
                clearInterval(countdownInterval);
            }, PAYMENT_CONFIG.earlyBooking.deadline - new Date());
        }
        
        // Add payment link analytics (simplified - no blocking)
        paymentLink.addEventListener('click', function(e) {
            console.log('� Payment button clicked, redirecting to:', this.href);
            
            // Track payment click for analytics
            if (typeof gtag !== 'undefined') {
                const now = new Date();
                const isEarlyBooking = now < PAYMENT_CONFIG.earlyBooking.deadline;
                const price = isEarlyBooking ? PAYMENT_CONFIG.earlyBooking.price : PAYMENT_CONFIG.regularBooking.price;
                
                gtag('event', 'payment_link_click', {
                    event_category: 'ecommerce',
                    event_label: isEarlyBooking ? 'early_booking' : 'regular_booking',
                    value: price
                });
            }
        });
        
        // Initialize payment system
        updatePaymentInfo();
        
        // Check for updates every minute (in case user keeps page open during deadline)
        setInterval(updatePaymentInfo, 60000);
        
        console.log('💳 Payment system initialized successfully');
    }

    
    // ==================== UTILITY FUNCTIONS ====================
    
    // Add loading animation CSS
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            .btn {
                position: relative;
                z-index: 1;
            }
            
            .btn * {
                position: relative;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Track page interactions (pentru analytics)
    function initAnalytics() {
        // Track scroll depth
        let scrollDepths = [25, 50, 75, 100];
        let scrollDepthsTriggered = [];
        
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !scrollDepthsTriggered.includes(depth)) {
                    scrollDepthsTriggered.push(depth);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            event_category: 'engagement',
                            event_label: `${depth}%`,
                            value: depth
                        });
                    }
                }
            });
        });
        
        // Track button clicks
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'button_click', {
                        event_category: 'interaction',
                        event_label: buttonText
                    });
                }
            });
        });
    }
    
    // ==================== EASTER EGGS ====================
    
    function initEasterEggs() {
        // Konami code pentru un mesaj special
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                console.log('🎉 Ai descoperit codul secret! Ești cu adevărat un networker dedicat!');
                
                // Add special animation
                document.body.style.animation = 'shake 0.5s ease-in-out';
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 500);
            }
        });
        
        // Add shake animation
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(shakeStyle);
    }
    
    // ==================== SMOOTH SCROLLING NAVIGATION ====================
    
    function initSectionNavigation() {
        // Definire secțiuni pentru navigare
        const sections = [
            { id: 'hero', name: 'Acasă' },
            { id: 'about', name: 'Despre' },
            { id: 'details', name: 'Detalii' },
            { id: 'booking', name: 'Rezervare' }
        ];
        
        // Creează navigation dots
        function createNavigationDots() {
            const nav = document.createElement('div');
            nav.className = 'scroll-nav';
            
            sections.forEach((section, index) => {
                const dot = document.createElement('div');
                dot.className = 'scroll-nav-dot';
                dot.setAttribute('data-tooltip', section.name);
                dot.setAttribute('data-section', section.id);
                
                dot.addEventListener('click', () => {
                    scrollToSection(section.id);
                    showScrollIndicator(`Navighez la: ${section.name}`);
                });
                
                nav.appendChild(dot);
            });
            
            document.body.appendChild(nav);
        }
        
        // Creează butoane de navigare pentru fiecare secțiune
        function createSectionArrows() {
            sections.forEach((section, index) => {
                const sectionElement = document.getElementById(section.id);
                if (sectionElement && index < sections.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.className = 'section-nav';
                    arrow.innerHTML = `
                        <div class="section-nav-arrow" data-next="${sections[index + 1].id}">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    `;
                    
                    arrow.addEventListener('click', () => {
                        const nextSection = sections[index + 1];
                        scrollToSection(nextSection.id);
                        showScrollIndicator(`Navighez la: ${nextSection.name}`);
                    });
                    
                    sectionElement.appendChild(arrow);
                }
            });
        }
        
        // Funcție pentru smooth scroll la secțiune
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = document.querySelector('.header-fixed')?.offsetHeight || 0;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track navigation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_navigation', {
                        event_category: 'navigation',
                        event_label: sectionId
                    });
                }
            }
        }
        
        // Actualizează dot-urile active pe baza scroll-ului
        function updateActiveDots() {
            const scrollPosition = window.scrollY + 100;
            const dots = document.querySelectorAll('.scroll-nav-dot');
            
            sections.forEach((section, index) => {
                const element = document.getElementById(section.id);
                if (element) {
                    const sectionTop = element.offsetTop;
                    const sectionBottom = sectionTop + element.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        dots.forEach(dot => dot.classList.remove('active'));
                        if (dots[index]) {
                            dots[index].classList.add('active');
                        }
                    }
                }
            });
        }
        
        // Afișează indicatorul de scroll
        function showScrollIndicator(message) {
            let indicator = document.querySelector('.auto-scroll-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'auto-scroll-indicator';
                document.body.appendChild(indicator);
            }
            
            indicator.textContent = message;
            indicator.classList.add('show');
            
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
        
        // Navigare cu taste
        function initKeyboardNavigation() {
            let currentSectionIndex = 0;
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' && e.ctrlKey) {
                    e.preventDefault();
                    currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
                    scrollToSection(sections[currentSectionIndex].id);
                    showScrollIndicator(`Navighez la: ${sections[currentSectionIndex].name}`);
                } else if (e.key === 'ArrowUp' && e.ctrlKey) {
                    e.preventDefault();
                    currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
                    scrollToSection(sections[currentSectionIndex].id);
                    showScrollIndicator(`Navighez la: ${sections[currentSectionIndex].name}`);
                }
            });
        }
        
        // Auto-scroll la load (opțional)
        function initAutoScroll() {
            // Scroll automat la secțiunea următoare după 10 secunde pe hero
            let autoScrollTimer;
            
            function resetAutoScrollTimer() {
                clearTimeout(autoScrollTimer);
                
                if (window.scrollY < 100) { // Dacă suntem pe hero
                    autoScrollTimer = setTimeout(() => {
                        scrollToSection('about');
                        showScrollIndicator('Auto-navigare la secțiunea "Despre"');
                    }, 15000); // 15 secunde
                }
            }
            
            // Reset timer la interacțiune
            ['scroll', 'click', 'keydown', 'mousemove'].forEach(event => {
                document.addEventListener(event, resetAutoScrollTimer);
            });
            
            resetAutoScrollTimer();
        }
        
        // Inițializează tot
        createNavigationDots();
        createSectionArrows();
        initKeyboardNavigation();
        initAutoScroll();
        
        // Event listeners
        window.addEventListener('scroll', updateActiveDots);
        window.addEventListener('load', updateActiveDots);
        
        // Expune funcția global
        window.scrollToSection = scrollToSection;
        
        console.log('🧭 Smooth scrolling navigation inițializat!');
        console.log('💡 Folosește Ctrl + ↑/↓ pentru navigare cu tastatura');
    }
    
    // ==================== INITIALIZATION ====================

    // Initialize all functionality
    function init() {
        console.log('🚀 BNI Timiș Landing Page - Inițializare completă!');
        
        addAnimationStyles();
        initSmoothScroll();
        initHeader();
        initScrollAnimations();
        initPaymentSystem();
        initAnalytics();
        initEasterEggs();
        initSectionNavigation();
        
        // Log pentru debugging
        console.log('📊 Pentru a vedea rezervările demo: console.log(JSON.parse(localStorage.getItem("bni_bookings")))');
    }
    
    // Start the app
    init();
    
    // ==================== GOOGLE MAPS INTEGRATION ====================
    
    // Function to open Google Maps with the event location
    window.openGoogleMaps = function() {
        // Coordonatele pentru Valery - Moșnița Nouă, Timiș
        const lat = 45.6833;  // Latitudine aproximativă pentru Moșnița Nouă
        const lng = 21.2333;  // Longitudine aproximativă pentru Moșnița Nouă
        const address = encodeURIComponent('Valery, Moșnița Nouă, nr. 861, Timiș, România');
        
        // Construiește URL-ul pentru Google Maps
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}&query_place_id=ChIJ_location_placeholder`;
        
        // Alternativă cu coordonate
        const googleMapsCoordUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
        
        // Deschide în tab nou
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
        
        // Track click pentru analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'map_click', {
                event_category: 'interaction',
                event_label: 'google_maps_redirect',
                value: 1
            });
        }
        
        console.log('🗺️ Deschid Google Maps pentru locația evenimentului...');
    };
    
    // ==================== PUBLIC API ====================
    
    // Expose some functions globally for debugging
    window.BNILandingPage = {
        version: '1.0.0',
        getBookings: () => JSON.parse(localStorage.getItem('bni_bookings') || '[]'),
        clearBookings: () => localStorage.removeItem('bni_bookings'),
        openGoogleMaps: () => window.openGoogleMaps(),
        scrollToSection: (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = document.querySelector('.header-fixed').offsetHeight;
                window.scrollTo({
                    top: element.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        }
    };
});

// ==================== SERVICE WORKER (dacă este necesar) ====================

// Register service worker pentru performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Comentat pentru că nu avem service worker implementat
        // navigator.serviceWorker.register('/sw.js');
    });
}