// Sample Products Array
const products = [
    { id: 1, name: "Paracetamol", category: "Painkiller", price: 20.00, image: "https://via.placeholder.com/300?text=Paracetamol" },
    { id: 2, name: "Amoxicillin", category: "Antibiotic", price: 50.00, image: "https://via.placeholder.com/300?text=Amoxicillin" },
    { id: 3, name: "Ibuprofen", category: "Anti-inflammatory", price: 30.00, image: "https://via.placeholder.com/300?text=Ibuprofen" },
    { id: 4, name: "Aspirin", category: "Painkiller", price: 25.00, image: "https://via.placeholder.com/300?text=Aspirin" },
    { id: 5, name: "Cough Syrup", category: "Cough", price: 15.00, image: "https://via.placeholder.com/300?text=Cough+Syrup" },
    { id: 6, name: "Vitamins", category: "Supplements", price: 100.00, image: "https://via.placeholder.com/300?text=Vitamins" },
    { id: 7, name: "Cold Relief", category: "Cold", price: 35.00, image: "https://via.placeholder.com/300?text=Cold+Relief" },
    { id: 8, name: "Antihistamine", category: "Allergy", price: 45.00, image: "https://via.placeholder.com/300?text=Antihistamine" }
];

// Dynamically Generate Product Cards
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ""; // Clear the current products

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
}

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('Product not found!');
        return;
    }

    fetch('/medicinedelivery/cart', { // Ensure the route matches your backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }) // Send product ID to backend
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg); });
        }
        return response.json(); // Expect updated cart count or a success message
    })
    .then(data => {
        alert(`${product.name} added to cart!`);
        updateCartCount(); // Update cart count dynamically
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('added the product to cart.');
    });
}

// Update Cart Count in Header
function updateCartCount() {
    fetch('/medicinedelivery/cart')
        .then(response => response.json())
        .then(cartItems => {
            const cartCount = cartItems.length; // Get cart length
            document.getElementById('cart-count').textContent = cartCount; // Update the cart count display
        })
        .catch(error => {
            console.error('Error fetching cart count:', error);
        });
}

// Filter Products Based on Search
document.getElementById('search-box').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
    displayFilteredProducts(filteredProducts);
});

// Display Filtered Products
function displayFilteredProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ""; // Clear current products

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
}

// Fetch Products from Server (if needed)
function fetchProducts() {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('product-list');
            productContainer.innerHTML = ""; // Clear existing products
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-item');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// View Cart Items
function viewCart() {
    fetch('/medicinedelivery/cart')
        .then(response => response.json())
        .then(cartItems => {
            const cartContainer = document.getElementById('cart-items');
            cartContainer.innerHTML = ""; // Clear existing cart items
            cartItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.classList.add('cart-item');
                itemCard.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₹${(item.price * item.quantity).toFixed(2)}</p>
                `;
                cartContainer.appendChild(itemCard);
            });
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
        });
}

// Place Order
function placeOrder() {
    fetch('/medicinedelivery/cart')
        .then(response => response.json())
        .then(cartItems => {
            const orderData = {
                delivery_address: '123 Main Street', // Replace with user input dynamically
            };

            fetch('/medicinedelivery/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to place the order');
                }
                alert('Order placed successfully!');
                location.reload();
            })
            .catch(error => {
                console.error('Error placing order:', error);
            });
        });
}

// Initial Load
displayProducts();
updateCartCount(); // Initialize cart count on page load
