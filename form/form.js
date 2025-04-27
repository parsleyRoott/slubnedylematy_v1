document.addEventListener('DOMContentLoaded', function() {
    // Obsługa formularza kontaktowego
    const contactForm = document.getElementById('contactForm');

    // Pobieramy header do obliczenia offsetu przewijania
    const header = document.querySelector('header');
    let headerHeight = header ? header.offsetHeight : 0;

    // Obsługa navbar dla podstrony formularza (takie samo zachowanie jak na głównej stronie)
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
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
    }

    // Zamykanie menu po kliknięciu w link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Aktualizacja headera przy przewijaniu (tak samo jak na głównej stronie)
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    if(contactForm) {
        // Funkcja walidująca adres email
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Dodajemy efekty wizualne dla pól formularza
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            // Efekt skupienia - dodajemy klasę active do rodzica
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('input-focused');
                }
            });

            // Usuwanie klasy error przy ponownym wprowadzaniu danych
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });

        // Animacje dla opcji dekoracji
        const decorationOptions = document.querySelectorAll('.decoration-option');
        decorationOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                // Pozwalamy na kliknięcie całego obszaru, nie tylko checkboxa
                if (e.target !== this.querySelector('input')) {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;

                    // Wyzwalamy zdarzenie change aby uruchomić dodatkowe funkcje
                    const event = new Event('change');
                    checkbox.dispatchEvent(event);
                }

                // Wizualny efekt zaznaczenia
                if (this.querySelector('input').checked) {
                    this.classList.add('option-selected');
                } else {
                    this.classList.remove('option-selected');
                }
            });
        });

        // Usuwanie klasy error z tytułu opcji dekoracji po zaznaczeniu checkboxa
        const decorationCheckboxes = document.querySelectorAll('input[name="decorationScope[]"]');
        decorationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    document.querySelector('.decoration-options-title').classList.remove('error');
                }
            });
        });

        // Funkcja walidująca formularz
        function validateForm() {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                // Usuwamy poprzednie komunikaty o błędach
                field.classList.remove('error');

                // Sprawdzamy puste pola
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');

                    // Efekt potrząsania dla błędnego pola
                    field.classList.add('shake-error');
                    setTimeout(() => {
                        field.classList.remove('shake-error');
                    }, 500);
                }

                // Dodatkowa walidacja dla pola email
                if (field.type === 'email' && !validateEmail(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                }

                // Dodatkowa walidacja dla pola liczba gości
                if (field.id === 'guestCount' && (field.value < 1 || isNaN(field.value))) {
                    isValid = false;
                    field.classList.add('error');
                }
            });

            // Sprawdzamy czy przynajmniej jedna opcja zakresu dekoracji została wybrana
            const decorationOptions = document.querySelectorAll('input[name="decorationScope[]"]:checked');
            if (decorationOptions.length === 0) {
                isValid = false;
                document.querySelector('.decoration-options-title').classList.add('error');

                // Efekt wizualny dla całego kontenera opcji
                const decorationContainer = document.querySelector('.decoration-options-container');
                decorationContainer.classList.add('shake-error');
                setTimeout(() => {
                    decorationContainer.classList.remove('shake-error');
                }, 500);
            } else {
                document.querySelector('.decoration-options-title').classList.remove('error');
            }

            return isValid;
        }

        // Obsługa zdarzenia submit formularza
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm()) {
                // Zmiana stanu przycisku - informacja o wysyłaniu
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Wysyłanie...';
                submitButton.classList.add('btn-loading');

                // Tutaj w rzeczywistym scenariuszu można dodać kod do wysłania formularza
                // np. fetch() lub FormData do wysłania do API
                const formData = new FormData(this);

                // Symulacja opóźnienia sieci, w rzeczywistej implementacji to będzie fetch
                setTimeout(() => {
                    // Efekt wizualny potwierdzenia
                    submitButton.classList.remove('btn-loading');
                    submitButton.classList.add('btn-submit-success');
                    submitButton.textContent = 'Wysłano pomyślnie!';

                    // Alert z potwierdzeniem
                    setTimeout(() => {
                        alert('Dziękujemy za wypełnienie formularza! Skontaktujemy się z Tobą w ciągu 48 godzin.');
                        contactForm.reset();

                        // Resetowanie stanu przycisków i pól
                        submitButton.classList.remove('btn-submit-success');
                        submitButton.textContent = 'Wyślij zapytanie';

                        // Resetujemy stan checkboxów
                        document.querySelectorAll('.decoration-option').forEach(option => {
                            option.classList.remove('option-selected');
                        });

                        // Resetujemy stan pól z klasą input-focused
                        document.querySelectorAll('.input-focused').forEach(field => {
                            field.classList.remove('input-focused');
                        });
                    }, 1500);
                }, 1500);
            } else {
                // Płynne przewinięcie do pierwszego błędnego pola
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    window.scrollTo({
                        top: firstError.getBoundingClientRect().top + window.pageYOffset - headerHeight - 50,
                        behavior: 'smooth'
                    });
                }

                // Subtelniejsze powiadomienie zamiast alert
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = 'Proszę poprawnie wypełnić wszystkie wymagane pola.';

                // Dodajemy przed przyciskiem submit
                contactForm.querySelector('.form-submit').prepend(errorMessage);

                // Usuwamy komunikat po 3 sekundach
                setTimeout(() => {
                    errorMessage.classList.add('fade-out');
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 300);
                }, 3000);
            }
        });
    }

    // Płynne przewijanie do formularza, jeśli w URL jest fragment #formularz
    if (window.location.hash === '#formularz') {
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: formSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Dodajemy klasy do animacji wejścia elementów formularza
    function addFormAnimations() {
        const formElements = document.querySelectorAll('.form-group, .decoration-options, .form-check, .form-submit');
        formElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.transitionDelay = (index * 0.05) + 's';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // Uruchamiamy animacje po załadowaniu strony
    if (contactForm) {
        addFormAnimations();
    }
});