document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.popup-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const doNotShowCheckbox = document.querySelector('#do-not-show');
    const subscribeBtn = document.querySelector('.subscribe-btn');

    if (!localStorage.getItem('hideNewsletter')) {
        setTimeout(() => {
            popup.classList.add('active');
        },100000);
    }

    closeBtn.addEventListener('click', () => {
        popup.classList.remove('active');
        if (doNotShowCheckbox.checked) {
            localStorage.setItem('hideNewsletter', 'true');
        }
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    subscribeBtn.addEventListener('click', () => {
        const email = document.querySelector('.email-input').value;
        if (email && email.includes('@')) {
            alert('Thank you for subscribing!');
            popup.classList.remove('active');
        } else {
            alert('Please enter a valid email address');
        }
    });
});

const products = [
    {
        id: 1,
        name: 'Fresh Potatoes',
        price: 14.99,
        category: 'Vegetables',
        rating: 4,
        image: './Assets/list1.png',
        inStock: true
    },
    {
        id: 2,
        name: 'Chinese Cabbage',
        price: 14.99,
        category: 'Vegetables',
        rating: 4,
        image: './Assets/list2.png',
        inStock: true
    },
    {
        id: 3,
        name: 'Corn',
        price: 14.99,
        category: 'Vegetables',
        rating: 4,
        image: './Assets/list3.png',
        inStock: false
    },
    {
        id: 4,
        name: 'Eggplant',
        price: 12.99,
        category: 'Vegetables',
        rating: 3,
        image: './Assets/list4.png',
        inStock: true
    },
    {
        id: 5,
        name: 'Green Apple',
        price: 16.99,
        category: 'Fresh Fruit',
        rating: 5,
        image: './Assets/list5.png',
        inStock: true
    }
];

const categories = [
    { name: 'All Categories', count: 323 },
    { name: 'Fresh Fruit', count: 123 },
    { name: 'Vegetables', count: 150 },
    { name: 'Cooking', count: 50 }
];

let state = {
    category: 'All Categories',
    priceRange: 1500,
    rating: 0,
    sortBy: 'latest'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    setupEventListeners();
    
    updateProductDisplay();
});

function initializeApp() {
    document.getElementById('landingPage').style.display = 'flex';
    document.getElementById('shopPage').style.display = 'hidden';
    
    renderCategories();
    
    renderRatingFilters();
}

function setupEventListeners() {
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('shopPage').classList.remove('hidden'); // Remove the hidden class
            updateProductDisplay(); 
        });
    }

    const priceRangeInput = document.getElementById('priceRange');
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', (e) => {
            state.priceRange = parseInt(e.target.value);
            updateProductDisplay();
        });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            updateProductDisplay();
        });
    }
}


function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    const categoriesHTML = categories.map(category => `
        <div class="category-item">
            <label>
                <input type="radio" 
                       name="category" 
                       value="${category.name}" 
                       ${category.name === state.category ? 'checked' : ''}>
                <span>${category.name}</span>
            </label>
            <span class="count">(${category.count})</span>
        </div>
    `).join('');

    categoriesList.innerHTML = categoriesHTML;

    categoriesList.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.category = e.target.value;
            updateProductDisplay();
        });
    });
}

function renderRatingFilters() {
    const ratingFilters = document.getElementById('ratingFilters');
    if (!ratingFilters) return;

    const ratingsHTML = [5, 4, 3, 2, 1].map(rating => `
        <div class="rating-item">
            <label>
                <input type="radio" 
                       name="rating" 
                       value="${rating}" 
                       ${rating === state.rating ? 'checked' : ''}>
                ${generateStars(rating)} & up
            </label>
        </div>
    `).join('');

    ratingFilters.innerHTML = ratingsHTML;

    ratingFilters.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.rating = parseInt(e.target.value);
            updateProductDisplay();
        });
    });
}

function generateStars(rating) {
    return Array(5).fill('').map((_, index) => 
        `<span class="${index < rating ? 'star' : 'star star-empty'}">★</span>`
    ).join('');
}

function filterProducts() {
    return products.filter(product => {
        if (state.category !== 'All Categories' && product.category !== state.category) return false;
        
        if (product.price > state.priceRange) return false;
        
        if (state.rating > 0 && product.rating < state.rating) return false;
        
        return true;
    });
}

function sortProducts(filteredProducts) {
    const productsCopy = [...filteredProducts];
    
    switch (state.sortBy) {
        case 'price-low':
            return productsCopy.sort((a, b) => a.price - b.price);
        case 'price-high':
            return productsCopy.sort((a, b) => b.price - a.price);
        case 'rating':
            return productsCopy.sort((a, b) => b.rating - a.rating);
        default: 
            return productsCopy;
    }
}

function updateProductDisplay() {
    const productsGrid = document.getElementById('productsGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!productsGrid || !resultsCount) return;

    const filteredProducts = filterProducts();
    const sortedProducts = sortProducts(filteredProducts);

    resultsCount.textContent = sortedProducts.length;

    const productsHTML = sortedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${!product.inStock ? '<span class="out-of-stock">Out of Stock</span>' : ''}
                <button class="wishlist-btn">❤</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="rating-stars">${generateStars(product.rating)}</div>
                <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;
}

const slider = document.getElementById('slider');
let tx = 0;

function slideForward() {
    if (tx > -75) { // Updated range based on item count
        tx -= 25;
    }
    slider.style.transform = `translateX(${tx}%)`;
}

function slideBackward() {
    if (tx < 0) {
        tx += 25;
    }
    slider.style.transform = `translateX(${tx}%)`;
}