// Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Theme
document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#f5f5f7');
document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#1d1d1f');
document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#86868b');
document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#007aff');
document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#ffffff');

// User data
let user = tg.initDataUnsafe.user || {
    id: 123456,
    first_name: 'Пользователь',
    username: 'user'
};

let userData = null;
let allProducts = [];
let currentCategory = 'all';

// API URL
const API_URL = 'https://your-bot-url.com/api';
const DEMO_MODE = true; // Демо режим

// Demo products with Apple emojis
const DEMO_PRODUCTS = [
    {
        id: '1',
        title: '🎯 НОВЫЙ БРАВЛ ПАСС ПЛЮС',
        description: 'Моментальный ответ ✅ Доказательство выхода 📸',
        price: 1199,
        oldPrice: 2499,
        discount: '-52%',
        category: 'merch_bins',
        quantity: -1,
        views: 128050,
        rating: 5.0,
        reviews: 245,
        seller: 'AUDIN'
    },
    {
        id: '2',
        title: '✅ ДЕШЕВЛЕ ВСЕХ | МЕНЕЕ 2 МИНУТ',
        description: 'Новый Brawl Pass со скидкой',
        price: 1139,
        oldPrice: 1499,
        discount: '-24%',
        category: 'merch_bins',
        quantity: 5,
        views: 3484,
        rating: 4.9,
        reviews: 156,
        seller: 'UniPay'
    },
    {
        id: '3',
        title: '🔥 ПИН МАТЧЕРИНО БЕЗ ВХОДА',
        description: 'Супер оффер со скидкой',
        price: 639,
        oldPrice: 999,
        discount: '-36%',
        category: 'training',
        quantity: 10,
        views: 3547,
        rating: 5.0,
        reviews: 89,
        seller: 'SUPERCELL ID'
    },
    {
        id: '4',
        title: '💳 НОВЫЙ БРАВЛ ПАСС 47 СЕЗОН',
        description: 'Быстрая доставка',
        price: 874,
        oldPrice: 999,
        discount: '-13%',
        category: 'payment_bins',
        quantity: -1,
        views: 2341,
        rating: 4.8,
        reviews: 67,
        seller: 'Playerok'
    },
    {
        id: '5',
        title: '🎮 BRAWL PASS PLUS ФЕВРАЛЬ',
        description: 'Моментально, видео выхода №2',
        price: 1189,
        oldPrice: 2499,
        discount: '-52%',
        category: 'merch_bins',
        quantity: 3,
        views: 12850,
        rating: 5.0,
        reviews: 312,
        seller: 'AUDIN'
    },
    {
        id: '6',
        title: '🛠 Cardcheck Pro Tools',
        description: 'Инструмент для проверки',
        price: 1225,
        oldPrice: 2489,
        discount: '-51%',
        category: 'training',
        quantity: 7,
        views: 1563,
        rating: 4.7,
        reviews: 45,
        seller: 'Tools Market'
    }
];

// Init
async function init() {
    try {
        console.log('🚀 Инициализация...');
        
        showLoader();
        
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            userData = {
                balance: 2450.50,
                total_purchases: 12,
                total_sales: 5,
                rating: 4.8,
                rating_count: 15,
                active_listings: 3
            };
            allProducts = DEMO_PRODUCTS;
        } else {
            userData = await fetchUserData();
            allProducts = await fetchProducts();
        }
        
        updateUI();
        loadFeaturedProducts();
        updateCategoryCounts();
        hideLoader();
        
        console.log('✅ Готово!');
    } catch (error) {
        console.error('❌ Ошибка:', error);
        hideLoader();
    }
}

function showLoader() {
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('app').classList.add('hidden');
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
}

// API
async function fetchUserData() {
    try {
        const response = await fetch(`${API_URL}/user/${user.id}`, {
            headers: {
                'Authorization': tg.initData,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        return { balance: 0, total_purchases: 0, total_sales: 0, rating: 5.0, rating_count: 0 };
    }
}

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/listings?status=active`, {
            headers: {
                'Authorization': tg.initData,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}

// Update UI
function updateUI() {
    const balance = userData?.balance || 0;
    document.getElementById('headerBalance').textContent = balance.toFixed(2) + '$';
    document.getElementById('profileBalance').textContent = balance.toFixed(2) + '$';
    document.getElementById('profileName').textContent = user.first_name;
    document.getElementById('profileId').textContent = user.id;
    document.getElementById('statPurchases').textContent = userData?.total_purchases || 0;
    document.getElementById('statSales').textContent = userData?.total_sales || 0;
    document.getElementById('statRating').textContent = (userData?.rating || 5.0).toFixed(1);
    document.getElementById('statActive').textContent = userData?.active_listings || 0;
}

function updateCategoryCounts() {
    const all = allProducts.length;
    const merch = allProducts.filter(p => p.category === 'merch_bins').length;
    const payment = allProducts.filter(p => p.category === 'payment_bins').length;
    const training = allProducts.filter(p => p.category === 'training').length;
    
    document.getElementById('count-all').textContent = `${all} товаров`;
    document.getElementById('count-merch').textContent = `${merch} товаров`;
    document.getElementById('count-payment').textContent = `${payment} товаров`;
    document.getElementById('count-training').textContent = `${training} товаров`;
}

// Navigation
function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('marketplace').classList.add('hidden');
    document.getElementById('profile').classList.add('hidden');
    tg.BackButton.hide();
}

function showMarketplace() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('marketplace').classList.remove('hidden');
    document.getElementById('profile').classList.add('hidden');
    loadMarketplaceProducts();
    tg.BackButton.show();
    tg.BackButton.onClick(showMainMenu);
}

function showProfile() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('marketplace').classList.add('hidden');
    document.getElementById('profile').classList.remove('hidden');
    tg.BackButton.show();
    tg.BackButton.onClick(showMainMenu);
}

// Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const featured = allProducts.slice(0, 3);
    container.innerHTML = featured.map(createProductCard).join('');
}

function loadMarketplaceProducts() {
    let filtered = allProducts;
    
    if (currentCategory !== 'all') {
        filtered = allProducts.filter(p => p.category === currentCategory);
    }
    
    document.getElementById('productsCount').textContent = `${filtered.length} товаров`;
    const container = document.getElementById('marketplaceProducts');
    container.innerHTML = filtered.length > 0 
        ? filtered.map(createProductCard).join('')
        : '<div style="text-align:center;padding:60px 20px;color:var(--tg-theme-hint-color);">📦 Товары не найдены</div>';
}

function createProductCard(product) {
    return `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <div class="product-image">
                ${product.discount ? `<div class="product-badge sale">${product.discount}</div>` : ''}
                🛍️
            </div>
            <div class="product-info">
                <div class="product-header">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price-tag">${product.price}$</div>
                </div>
                ${product.oldPrice ? `<div class="product-price-old">${product.oldPrice}$</div>` : ''}
                <div class="product-description">${product.description}</div>
                <div class="product-meta">
                    <div class="product-meta-left">
                        <span class="product-rating">⭐ ${product.rating}</span>
                        <span>👁️ ${formatNumber(product.views)}</span>
                    </div>
                    <span style="font-size:12px;color:var(--tg-theme-hint-color);">
                        ${product.quantity === -1 ? '∞' : product.quantity + ' шт'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.category === category) {
            chip.classList.add('active');
        }
    });
    
    // Update category cards on main menu
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.transform = 'scale(1)';
    });
    
    if (document.getElementById('marketplace').classList.contains('hidden')) {
        // На главном экране - просто переходим на маркетплейс
        showMarketplace();
    } else {
        // На маркетплейсе - обновляем товары
        loadMarketplaceProducts();
    }
}

function sortProducts(type) {
    console.log('Сортировка:', type);
    // TODO: Implement sorting
}

function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="background:var(--primary-gradient);height:250px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:100px;margin-bottom:20px">
            🛍️
        </div>
        
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h2 style="font-size:22px;font-weight:700">${product.title}</h2>
            <div style="background:var(--success-color);color:white;padding:8px 16px;border-radius:12px;font-size:18px;font-weight:700">
                ${product.price}$
            </div>
        </div>
        
        ${product.oldPrice ? `
            <div style="display:flex;gap:12px;margin-bottom:16px">
                <span style="text-decoration:line-through;color:var(--tg-theme-hint-color)">${product.oldPrice}$</span>
                <span style="color:var(--danger-color);font-weight:600">${product.discount}</span>
            </div>
        ` : ''}
        
        <div style="margin-bottom:20px">
            <div style="font-size:14px;font-weight:600;margin-bottom:8px">📝 Описание</div>
            <div style="color:var(--tg-theme-hint-color);line-height:1.6">${product.description}</div>
        </div>
        
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px">
            <div style="background:var(--tg-theme-bg-color);padding:16px;border-radius:12px">
                <div style="font-size:12px;color:var(--tg-theme-hint-color);margin-bottom:4px">Количество</div>
                <div style="font-size:16px;font-weight:600">${product.quantity === -1 ? '∞ Бесконечно' : product.quantity + ' шт'}</div>
            </div>
            <div style="background:var(--tg-theme-bg-color);padding:16px;border-radius:12px">
                <div style="font-size:12px;color:var(--tg-theme-hint-color);margin-bottom:4px">Просмотров</div>
                <div style="font-size:16px;font-weight:600">👁️ ${formatNumber(product.views)}</div>
            </div>
            <div style="background:var(--tg-theme-bg-color);padding:16px;border-radius:12px">
                <div style="font-size:12px;color:var(--tg-theme-hint-color);margin-bottom:4px">Рейтинг</div>
                <div style="font-size:16px;font-weight:600">⭐ ${product.rating} (${product.reviews})</div>
            </div>
            <div style="background:var(--tg-theme-bg-color);padding:16px;border-radius:12px">
                <div style="font-size:12px;color:var(--tg-theme-hint-color);margin-bottom:4px">Продавец</div>
                <div style="font-size:16px;font-weight:600">${product.seller}</div>
            </div>
        </div>
        
        <button onclick="buyProduct('${product.id}')" style="width:100%;background:var(--tg-theme-button-color);color:white;border:none;padding:16px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer">
            🛒 Купить за ${product.price}$
        </button>
    `;
    
    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

async function buyProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (userData.balance < product.price) {
        tg.showPopup({
            title: '❌ Недостаточно средств',
            message: `Нужно ${product.price}$, у вас ${userData.balance.toFixed(2)}$`,
            buttons: [
                {type: 'default', text: '💳 Пополнить', id: 'deposit'},
                {type: 'cancel'}
            ]
        }, (buttonId) => {
            if (buttonId === 'deposit') {
                closeProductModal();
                deposit();
            }
        });
        return;
    }
    
    tg.showConfirm(`Купить "${product.title}" за ${product.price}$?`, (confirmed) => {
        if (confirmed) {
            // TODO: Implement purchase
            tg.showAlert('✅ Товар успешно куплен! (демо режим)');
            closeProductModal();
        }
    });
}

// Actions
function deposit() {
    tg.showPopup({
        title: '💰 Пополнение баланса',
        message: '💸 Минимум: 1$\n💳 Комиссия: 3%\n\nВведите сумму для пополнения',
        buttons: [{type: 'close'}]
    });
}

function withdraw() {
    if (userData.balance < 10) {
        tg.showAlert('❌ Минимальная сумма для вывода: 10$');
        return;
    }
    tg.showPopup({
        title: '💸 Вывод средств',
        message: `💰 Доступно: ${userData.balance.toFixed(2)}$\n💵 Минимум: 10$\n⚠️ Комиссия: 15%`,
        buttons: [{type: 'close'}]
    });
}

function showInfo() {
    tg.showPopup({
        title: 'ℹ️ UniPay MarketPlace',
        message: '🔐 Безопасные сделки\n💰 Возврат средств\n🛡️ Защита покупателя',
        buttons: [{type: 'close'}]
    });
}

function showMyListings() {
    tg.showAlert('📦 Мои товары\n\nЗдесь будут ваши товары');
}

function showPurchaseHistory() {
    tg.showAlert('🛒 История покупок\n\nЗдесь будет история покупок');
}

function showSalesHistory() {
    tg.showAlert('💸 История продаж\n\nЗдесь будет история продаж');
}

// Utils
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Start
window.addEventListener('DOMContentLoaded', init);
