document.addEventListener('DOMContentLoaded', function() {
    // 1. Naprawienie nachodzenia paska nawigacji na sekcję hero
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');

    function updateHeroMargin() {
        const headerHeight = header.offsetHeight;
        hero.style.marginTop = headerHeight + 'px';
    }

    // Wywołanie funkcji przy załadowaniu i zmianie rozmiaru okna
    updateHeroMargin();
    window.addEventListener('resize', updateHeroMargin);

    // 2. Menu hamburgerowe - lepsze rozłożenie elementów na urządzeniach mobilnych
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        // Równomierne rozłożenie elementów menu po wysokości
        if (navMenu.classList.contains('active')) {
            const navItems = navMenu.querySelectorAll('li');
            const navHeight = navMenu.offsetHeight;
            const itemHeight = navHeight / navItems.length;

            navItems.forEach((item, index) => {
                item.style.paddingTop = '10px';
                item.style.paddingBottom = '10px';
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'center';
            });
        }
    });

    // Zamykanie menu po kliknięciu w link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // 3. Galeria - funkcjonalność "Zobacz więcej/Zwiń"
    const galleries = {
        'church-gallery': {
            button: document.getElementById('church-toggle'),
            additionalImages: [
                'images/gallery/church/kosciol_4.JPG',
                'images/gallery/church/kosciol_5.JPG',
                '/api/placeholder/600/400?text=Kościół 6',
                '/api/placeholder/600/400?text=Kościół 7',
                '/api/placeholder/600/400?text=Kościół 8',
                '/api/placeholder/600/400?text=Kościół 9'
            ],
            expanded: false
        },
        'hall-gallery': {
            button: document.getElementById('hall-toggle'),
            additionalImages: [
                'images/gallery/wedding_hall/sala_4p.JPG',
                'images/gallery/wedding_hall/sala_5p.JPG',
                'images/gallery/wedding_hall/sala_6.JPG',
                'images/gallery/wedding_hall/sala_7p.JPG',
                'images/gallery/wedding_hall/sala_3.JPG',
                'images/gallery/wedding_hall/sala_9p.JPG'
            ],
            expanded: false
        },
        'outdoor-gallery': {
            button: document.getElementById('outdoor-toggle'),
            additionalImages: [
                'images/gallery/outdoor_wedding/plener_4p.jpg',
                'images/gallery/outdoor_wedding/plener-bukiet_2.jpg',
                'images/gallery/outdoor_wedding/plener_6.jpg',
                'images/gallery/outdoor_wedding/plener_7.jpg',  // obroc to zdjecie !!!!!!
                '/api/placeholder/600/400?text=Plener 8',
                '/api/placeholder/600/400?text=Plener 9'
            ],
            expanded: false
        }
    };

    // Implementacja funkcjonalności przycisków "Zobacz więcej/Zwiń"
    for (const [galleryId, galleryData] of Object.entries(galleries)) {
        const gallery = document.getElementById(galleryId);
        const button = galleryData.button;

        if (button && gallery) {
            button.addEventListener('click', function() {
                if (!galleryData.expanded) {
                    // Dodawanie dodatkowych zdjęć
                    galleryData.additionalImages.forEach(imageSrc => {
                        const newItem = document.createElement('div');
                        newItem.className = 'gallery-item additional-item';

                        const newImage = document.createElement('img');
                        newImage.src = imageSrc;
                        newImage.alt = `Dodatkowe zdjęcie`;
                        newImage.className = 'gallery-img';

                        newItem.appendChild(newImage);
                        gallery.appendChild(newItem);
                    });

                    button.textContent = 'Zwiń';
                    galleryData.expanded = true;
                } else {
                    // Usuwanie dodatkowych zdjęć
                    const additionalItems = gallery.querySelectorAll('.additional-item');
                    additionalItems.forEach(item => gallery.removeChild(item));

                    button.textContent = 'Zobacz więcej';
                    galleryData.expanded = false;
                }
            });
        }
    }

    // Płynne przewijanie do sekcji po kliknięciu w nawigację
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Zmiana stylu nawigacji podczas przewijania
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});
