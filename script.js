// Дані товарів
const products = [
    {
        id: 1,
        name: "Сухий корм для собак",
        category: "food",
        pet: "dog",
        price: 450,
        description: "Повнораціонний корм для дорослих собак всіх порід",
        image: "https://happypet.in.ua/content/images/18/536x536l50nn0/premium-korm-dlia-sobak-z-yalovychynoiu-1-kh-78747726512167.jpg"
    },
    {
        id: 2,
        name: "Іграшка-головоломка для котів",
        category: "toys",
        pet: "cat",
        price: 320,
        description: "Інтерактивна іграшка для розвитку інтелекту котів",
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRmFyrUEwZ0FqvRbesXd9-JQS3vINYEIx4P9v6aXXBRYP1InThzBlLjBzO75IBl_mtahgP1Scb64uTNJ5Fx99nF5RfSnD5zgH0gVARQhi18MwRamZO7xKvpsQFr&usqp=CAc"
    },
    {
        id: 3,
        name: "Переноска для тварин",
        category: "accessories",
        pet: "all",
        price: 850,
        description: "Зручна переноска для транспортування дрібних тварин",
        image: "https://murchyk.com.ua/img/10/188/240/240-1272-lg.jpg"
    },
    {
        id: 4,
        name: "Шампунь для собак",
        category: "care",
        pet: "dog",
        price: 280,
        description: "Гіпоалергенний шампунь для чутливої шкіри",
        image: "https://gloscenter.com.ua/Media/shop-26737/_imports/12314/product.jpg"
    },
    {
        id: 5,
        name: "Корм для котів преміум",
        category: "food",
        pet: "cat",
        price: 520,
        description: "Високоякісний корм з куркою та лососем",
        image: "https://petchoice.ua/assets/image-cache/images/products/11238/josera-naturecat-bezzernovoj-korm-s-domashnej-pticej-i-lososem698jpg.e6ed4652.jpg"
    },
    {
        id: 6,
        name: "Клітка для птахів",
        category: "accessories",
        pet: "bird",
        price: 1200,
        description: "Простора клітка з аксесуарами для птахів",
        image: "https://zoomagazin.dp.ua/image/cache/catalog/Savic/ges-tovars_pics-3-6-5-6-0-36560-5687_0048~36560~1~800-1200x800.jpg.webp"
    },
    {
        id: 7,
        name: "Акваріум 50л",
        category: "accessories",
        pet: "fish",
        price: 1800,
        description: "Сучасний акваріум з системою фільтрації",
        image: "https://images.prom.ua/5861271577_akvarium-komplekt-sunsun-hlft-1500fd.jpg"
    },
    {
        id: 8,
        name: "Когтеточка для котів",
        category: "toys",
        pet: "cat",
        price: 650,
        description: "Багаторівнева когтеточка з ігровим майданчиком",
        image: "https://img0.peton.com.ua/img/pe/0fa/0fa52cef2272acc2fd165633ded0ac8ax700x700x50.avif"
    }
];

// Кошик
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Оновлення лічильника кошика
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Збереження кошика в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Додавання товару в кошик
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} додано до кошика!`);
    
    // Якщо ми на сторінці кошика, оновити її
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// Видалення товару з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// Зміна кількості товару
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
    }
}

// Показ сповіщення
function showNotification(message) {
    // Створюємо елемент сповіщення
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: var(--primary-color); color: white; padding: 15px 25px; border-radius: 8px; box-shadow: var(--shadow); z-index: 1000; animation: slideIn 0.3s ease;">
            ${message}
        </div>
    `;
    document.body.appendChild(notification);
    
    // Видаляємо сповіщення через 3 секунди
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Рендер товарів на сторінці товарів
function renderProducts(filterCategory = 'all', filterPet = 'all') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    let filteredProducts = products;
    
    if (filterCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    }
    
    if (filterPet !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.pet === filterPet || p.pet === 'all');
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}" data-pet="${product.pet}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} грн</div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Додати в кошик
                    </button>
                    <button class="btn-favorite">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Рендер кошика
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart-message');
    
    if (!container) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (summary) summary.style.display = 'none';
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Ваш кошик порожній</h2>
                <p>Додайте товари з каталогу, щоб зробити покупку</p>
                <a href="products.html" class="btn" style="margin-top: 20px;">Перейти до товарів</a>
            </div>
        `;
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (summary) summary.style.display = 'block';
    
    let subtotal = 0;
    
    container.innerHTML = cart.map(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">${item.price} грн/шт</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity} шт</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${total} грн</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // Оновлення підсумку
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    
    if (summary) {
        document.getElementById('subtotal').textContent = `${subtotal} грн`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Безкоштовно' : `${shipping} грн`;
        document.getElementById('total').textContent = `${total} грн`;
    }
}

// Ініціалізація фільтрів на сторінці товарів
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Видаляємо активний клас з усіх кнопок групи
            const group = this.closest('.filter-options');
            group.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Додаємо активний клас до натиснутої кнопки
            this.classList.add('active');
            
            // Отримуємо значення фільтрів
            const categoryFilter = document.querySelector('[data-category].active').dataset.category;
            const petFilter = document.querySelector('[data-pet].active').dataset.pet;
            
            // Рендеримо відфільтровані товари
            renderProducts(categoryFilter, petFilter);
        });
    });
}

// Ініціалізація кнопки оформлення замовлення
function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Кошик порожній!');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = total >= 1000 ? 0 : 50;
            
            alert(`Дякуємо за замовлення!\nСума: ${total + shipping} грн\nНаш менеджер зв'яжеться з вами для підтвердження.`);
            
            // Очищаємо кошик
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
        });
    }
}

// Ініціалізація всіх сторінок
document.addEventListener('DOMContentLoaded', function() {
    // Оновлюємо лічильник кошика
    updateCartCount();
    
    // Ініціалізація для сторінки товарів
    if (window.location.pathname.includes('products.html')) {
        renderProducts();
        initFilters();
    }
    
    // Ініціалізація для сторінки кошика
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        initCheckout();
    }
    
    // Додаємо стилі для анімації сповіщення
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});