document.addEventListener('DOMContentLoaded', () => {
    const copyQuoteButton = document.getElementById('copy-quote');
    const searchBar = document.getElementById('search-bar');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const modalText = document.getElementById('modal-text');
    const chimeSound = document.getElementById('chime-sound');

    // Fetch and load products from goods.html
document.addEventListener('DOMContentLoaded', function() 
{
    fetch('goods.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const products = doc.querySelectorAll('.product');
            const catalog = document.getElementById('catalog');

            products.forEach(product => {
                catalog.appendChild(product.cloneNode(true));
            });

            // Quantity adjustment functionality
            const updateQuantity = (input, delta) => {
                const value = parseInt(input.value);
                if (!isNaN(value) && value + delta > 0) {
                    input.value = value + delta;
                }
            };

            document.querySelectorAll('.plus').forEach(button => {
                button.addEventListener('click', (event) => {
                    const input = event.target.parentElement.querySelector('input');
                    updateQuantity(input, 1);
                });
            });

            document.querySelectorAll('.minus').forEach(button => {
                button.addEventListener('click', (event) => {
                    const input = event.target.parentElement.querySelector('input');
                    updateQuantity(input, -1);
                });
            });

            // Copy quote functionality
            if (copyQuoteButton) {
                copyQuoteButton.addEventListener('click', () => {
                    const selectedProducts = [];
                    const productCheckboxes = catalog.querySelectorAll('.product input[type="checkbox"]');
                    const productQuantities = catalog.querySelectorAll('.product input[type="number"]');

                    productCheckboxes.forEach((checkbox, index) => {
                        if (checkbox.checked && checkbox.closest('.product').style.display !== 'none') {
                            const quantity = productQuantities[index].value;
                            selectedProducts.push(`${checkbox.value} - Quantity: ${quantity}`);
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
            }

            // Product search functionality
            if (searchBar) {
                searchBar.addEventListener('input', (event) => {
                    const searchTerm = event.target.value.toLowerCase();
                    products.forEach((product) => {
                        const productName = product.querySelector('h3').textContent.toLowerCase();
                        if (productName.includes(searchTerm)) {
                            product.style.display = 'block';
                        } else {
                            product.style.display = 'none';
                        }
                    });
                });
            }

            // Modal close functionality
            const closeModal = () => {
                modal.style.display = 'none';
            };

            if (closeButton) {
                closeButton.addEventListener('click', closeModal);
            }

            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
});



