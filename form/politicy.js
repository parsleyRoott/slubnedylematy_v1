// JavaScript dla obsługi modalu polityki prywatności
document.addEventListener('DOMContentLoaded', function() {
    // Znajdujemy link do polityki prywatności i dodajemy event listener
    const privacyLink = document.querySelector('label[for="gdprConsent"] a');
    const modal = document.getElementById('privacyModal');
    const closeButton = document.querySelector('.close-button');
    const acceptButton = document.querySelector('.accept-btn');

    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    // Funkcja otwierająca modal
    function openModal() {
        modal.style.display = 'block';
        // Używamy setTimeout, aby umożliwić płynną animację
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        // Blokujemy przewijanie strony w tle
        document.body.style.overflow = 'hidden';
    }

    // Funkcja zamykająca modal
    function closeModal() {
        modal.classList.remove('show');
        // Czekamy na zakończenie animacji przed ukryciem
        setTimeout(() => {
            modal.style.display = 'none';
            // Przywracamy przewijanie strony
            document.body.style.overflow = '';
        }, 300);
    }

    // Obsługa zamykania modalu
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', closeModal);
    }

    // Zamknięcie modalu po kliknięciu poza jego obszarem
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Obsługa klawisza Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});