document.addEventListener('DOMContentLoaded', () => {
    const copyQuoteButton = document.getElementById('copy-quote');
    const searchBar = document.getElementById('search-bar');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const modalText = document.getElementById('modal-text');
    const chimeSound = document.getElementById('chime-sound');

    const filterProducts = (searchTerm) => {
        const products = document.querySelectorAll('.product input[type="checkbox"]');
        products.forEach((product) => {
            const productName = product.closest('.product').querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm.toLowerCase())) {
                product.closest('.product').style.display = 'block';
            } else {
                product.closest('.product').style.display = 'none';
            }
        });
    };

    searchBar.addEventListener('input', (event) => {
        filterProducts(event.target.value);
    });

    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    const setupProducts = () => {
        const products = document.querySelectorAll('.product input[type="checkbox"]');
        copyQuoteButton.addEventListener('click', () => {
            const selectedProducts = [];
            products.forEach((checkbox) => {
                if (checkbox.checked && checkbox.closest('.product').style.display !== 'none') {
                    selectedProducts.push(checkbox.value);
                }
            });

            if (selectedProducts.length === 0) {
                alert('Please select at least one product.');
                return;
            }

            // Format the product list with bullet points for display
            const productListForDisplay = selectedProducts.map(product => `• ${product}`).join('<br>');
            // Format the product list with newline characters for copying
            const productListForCopying = selectedProducts.map(product => `• ${product}`).join('\n');

            modalText.innerHTML = productListForDisplay;
            modal.style.display = 'block';

            // Auto-select and copy text to clipboard
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = productListForCopying;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

            // Play chime sound
            chimeSound.play();

            // Launch confetti
            confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 },
            });
        });
    };

    fetch('products.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('product-list-container').innerHTML = data;
            setupProducts();
        });
});
