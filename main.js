/* ===================================
   DOCSHARE - MAIN JAVASCRIPT
   Version: 2.0
   =================================== */

// ===================================
// 1. CONFIGURATION
// ===================================

const API_URL = 'http://localhost:3000/api';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];

// ===================================
// 2. INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadInitialData();
});

// Initialize page
function initializePage() {
    hideLoading();
    setupBackToTop();
    setupCategoryFilters();
    setupQuickFilters();
    checkUserSession();
}

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDocuments();
            }
        });
        
        // Clear button functionality
        searchInput.addEventListener('input', function() {
            const clearBtn = document.querySelector('.clear-search');
            if (clearBtn) {
                clearBtn.style.opacity = this.value ? '1' : '0';
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', subscribeNewsletter);
    }

    // Sort and view selects
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortDocuments);
    }

    const viewSelect = document.getElementById('viewSelect');
    if (viewSelect) {
        viewSelect.addEventListener('change', changeView);
    }
}

// Load initial data
function loadInitialData() {
    loadRecentDocuments();
    loadCategories();
    loadFeaturedDocuments();
    animateStats();
}

// ===================================
// 3. USER SESSION MANAGEMENT
// ===================================

// Check user session
function checkUserSession() {
    const user = getUser();
    const token = getToken();
    
    if (user && token) {
        updateUIForLoggedInUser(user);
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
        navButtons.innerHTML = `
            <div class="user-menu">
                <button class="user-avatar" onclick="toggleUserMenu()">
                    <span>👤</span> ${user.ho_ten || user.email}
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="./sinhvien/dashboard.html">📊 Dashboard</a>
                    <a href="./sinhvien/my-documents.html">📄 Tài liệu của tôi</a>
                    <a href="./sinhvien/upload.html">⬆️ Tải lên</a>
                    <a href="./sinhvien/profile.html">⚙️ Cài đặt</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="logout()">🚪 Đăng xuất</a>
                </div>
            </div>
        `;
    }
}

// Toggle user menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// ===================================
// 4. AUTHENTICATION FUNCTIONS
// ===================================

// Check authentication
function checkAuth() {
    const user = getUser();
    const token = getToken();
    return user !== null && token !== null;
}

// Get user from localStorage
function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Logout user
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        showToast('Đã đăng xuất thành công', 'success');
        setTimeout(() => {
            // Redirect về trang chủ
            const isAdminPage = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/sinhvien/') || window.location.pathname.includes('/documents/');
            window.location.href = isAdminPage ? '../index.html' : './index.html';
        }, 1000);
    }
}

// ===================================
// 5. LOADING & NOTIFICATIONS
// ===================================

// Show loading overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Show notification toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = 'notification-toast show ' + type;
        toast.dataset.showTime = Date.now();
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Close toast
function closeToast() {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Show alert (legacy support)
function showAlert(message, type = 'info') {
    showToast(message, type);
}

// ===================================
// 6. MOBILE MENU
// ===================================

// Toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// ===================================
// 7. SEARCH FUNCTIONALITY
// ===================================

// Search documents
async function searchDocuments() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    if (!query) {
        showToast('Vui lòng nhập từ khóa tìm kiếm', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        window.location.href = `./documents/list.html?search=${encodeURIComponent(query)}`;
    }, 500);
}

// Clear search input
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
}

// Quick search
function quickSearch(keyword) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = keyword;
        searchDocuments();
    }
}

// ===================================
// 8. CATEGORIES MANAGEMENT
// ===================================

// Load categories
async function loadCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    try {
        const response = await fetch(`${API_URL}/categories/danhmuc`);
        
        if (response.ok) {
            const categories = await response.json();
            displayCategories(categories, categoryGrid);
        } else {
            // If API fails, use default categories
            displayDefaultCategories(categoryGrid);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        displayDefaultCategories(categoryGrid);
    }
}

// Display categories
function displayCategories(categories, container) {
    if (!categories || categories.length === 0) {
        displayDefaultCategories(container);
        return;
    }
    
    const icons = {
        'tech': ['💻', '🗄️', '🔗', '⚙️', '🌐'],
        'science': ['⚛️', '⚗️', '🔬', '🧪'],
        'business': ['📈', '💼', '📊'],
        'language': ['🌐', '📖', '🗣️'],
        'social': ['📚', '⚖️', '🏛️']
    };
    
    let html = '';
    categories.forEach((cat, index) => {
        const categoryType = cat.loai || 'tech';
        const iconList = icons[categoryType] || icons['tech'];
        const icon = iconList[index % iconList.length];
        
        html += createCategoryCard(cat, icon);
    });
    
    container.innerHTML = html;
}

// Display default categories
function displayDefaultCategories(container) {
    const defaultCategories = [
        { ma_danh_muc: 1, ten_danh_muc: 'Toán cao cấp', loai: 'tech', khoa: 'Giải tích, Đại số' },
        { ma_danh_muc: 2, ten_danh_muc: 'Lập trình C++', loai: 'tech', khoa: 'OOP, STL' },
        { ma_danh_muc: 3, ten_danh_muc: 'Cơ sở dữ liệu', loai: 'tech', khoa: 'SQL, NoSQL' }
    ];
    
    displayCategories(defaultCategories, container);
}

// Create category card HTML
function createCategoryCard(cat, icon) {
    const stats = {
        docs: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 50000) + 10000
    };
    
    return `
        <div class="category-card" data-category="${cat.loai || 'tech'}" onclick="viewCategory(${cat.ma_danh_muc})">
            ${Math.random() > 0.7 ? '<div class="category-badge"><span class="badge-hot">HOT</span></div>' : ''}
            <div class="category-icon">${icon}</div>
            <h4>${cat.ten_danh_muc}</h4>
            <p>${cat.khoa || 'Không có mô tả'}</p>
            <div class="category-stats">
                <span>📄 ${formatNumber(stats.docs)} tài liệu</span>
                <span>⬇️ ${formatNumber(stats.downloads)} lượt tải</span>
            </div>
            <div class="category-tags">
                ${generateCategoryTags(cat.khoa)}
            </div>
        </div>
    `;
}

// Generate category tags
function generateCategoryTags(description) {
    if (!description) return '';
    
    const tags = description.split(',').map(tag => tag.trim()).slice(0, 2);
    return tags.map(tag => `<span>${tag}</span>`).join('');
}

// View category
function viewCategory(categoryId) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        window.location.href = `./documents/list.html?category=${categoryId}`;
    }, 500);
}

// View subject
function viewSubject(subjectName) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        window.location.href = `./subject.html?name=${encodeURIComponent(subjectName)}`;
    }, 500);
}

// Upload for subject
function uploadForSubject(subjectName) {
    const user = getUser();
    if (!user) {
        localStorage.setItem('redirectSubject', subjectName);
        showToast('Vui lòng đăng nhập để tải tài liệu lên', 'info');
        setTimeout(() => {
            window.location.href = './login.html';
        }, 1500);
    } else {
        localStorage.setItem('selectedSubject', subjectName);
        window.location.href = './sinhvien/upload.html';
    }
}

// ===================================
// 9. CATEGORY FILTERS
// ===================================

// Setup category filters
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.category-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCategories(this.dataset.category);
        });
    });
}

// Filter categories
function filterCategories(category) {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ===================================
// 10. QUICK FILTERS
// ===================================

// Setup quick filters
function setupQuickFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyQuickFilter(this.dataset.filter);
        });
    });
}

// Apply quick filter
function applyQuickFilter(filter) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showToast(`Đã lọc theo: ${getFilterLabel(filter)}`, 'success');
        // In real app, would reload documents with filter
    }, 500);
}

// Get filter label
function getFilterLabel(filter) {
    const labels = {
        'all': 'Tất cả',
        'new': 'Mới nhất',
        'popular': 'Phổ biến',
        'free': 'Miễn phí'
    };
    return labels[filter] || filter;
}

// ===================================
// 11. DOCUMENTS MANAGEMENT
// ===================================

// Load recent documents
async function loadRecentDocuments() {
    const recentDocsContainer = document.getElementById('recentDocs');
    if (!recentDocsContainer) return;
    
    try {
        const response = await fetch(`${API_URL}/documents/recent`);
        
        if (response.ok) {
            const docs = await response.json();
            displayDocuments(docs, recentDocsContainer);
        } else {
            // If API fails, show placeholder
            displayPlaceholderDocuments(recentDocsContainer);
        }
    } catch (error) {
        console.error('Error loading recent documents:', error);
        displayPlaceholderDocuments(recentDocsContainer);
    }
}

// Load featured documents
async function loadFeaturedDocuments() {
    const featuredCarousel = document.getElementById('featuredCarousel');
    if (!featuredCarousel) return;
    
    try {
        const response = await fetch(`${API_URL}/documents/featured`);
        
        if (response.ok) {
            const docs = await response.json();
            displayFeaturedDocuments(docs, featuredCarousel);
        }
    } catch (error) {
        console.error('Error loading featured documents:', error);
    }
}

// Display documents
function displayDocuments(docs, container) {
    if (!docs || docs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Chưa có tài liệu</h3>
                <p>Hiện tại chưa có tài liệu nào trong danh mục này</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    docs.forEach(doc => {
        html += createDocumentCard(doc);
    });
    
    container.innerHTML = html;
}

// Display placeholder documents
function displayPlaceholderDocuments(container) {
    const placeholderDocs = [
        {
            ma_tai_lieu: 1,
            tieu_de: 'Bài giảng Toán cao cấp A1',
            mo_ta: 'Giáo trình đầy đủ cho môn Toán cao cấp A1',
            ngay_tai: new Date().toISOString(),
            email: 'student@example.com',
            so_luot_xem: 1234,
            so_luot_tai: 567
        },
        {
            ma_tai_lieu: 2,
            tieu_de: 'Bài tập C++ có lời giải',
            mo_ta: '100 bài tập lập trình C++ từ cơ bản đến nâng cao',
            ngay_tai: new Date().toISOString(),
            email: 'dev@example.com',
            so_luot_xem: 2456,
            so_luot_tai: 892
        }
    ];
    
    displayDocuments(placeholderDocs, container);
}

// Create document card HTML
function createDocumentCard(doc) {
    const uploadDate = new Date(doc.ngay_tai);
    const formattedDate = formatDate(uploadDate);
    const fileType = getFileType(doc.ten_file || 'document.pdf');
    
    return `
        <div class="doc-card">
            <div class="doc-header">
                <span class="doc-type">${fileType}</span>
                <button class="doc-favorite" onclick="toggleFavorite(this)" title="Yêu thích">
                    ♡
                </button>
            </div>
            <div class="doc-thumbnail">
                <img src="${doc.thumbnail || getDefaultThumbnail(fileType)}" 
                     alt="${doc.tieu_de}"
                     onerror="this.src='${getDefaultThumbnail(fileType)}'">
            </div>
            <div class="doc-body">
                <h4>${doc.tieu_de}</h4>
                <p class="doc-description">${doc.mo_ta || 'Không có mô tả'}</p>
                <div class="doc-info">
                    <span class="doc-author" title="Người đăng">
                        👤 ${doc.ho_ten || doc.email || 'Anonymous'}
                    </span>
                    <span class="doc-date" title="Ngày đăng">
                        📅 ${formattedDate}
                    </span>
                </div>
                <div class="doc-tags">
                    ${generateDocTags(doc)}
                </div>
                <div class="doc-stats">
                    <span title="Lượt xem">👁️ ${formatNumber(doc.so_luot_xem || 0)}</span>
                    <span title="Lượt tải">⬇️ ${formatNumber(doc.so_luot_tai || 0)}</span>
                    <span title="Đánh giá">⭐ ${doc.rating || '4.5'}</span>
                    <span title="Bình luận">💬 ${doc.comments || Math.floor(Math.random() * 50)}</span>
                </div>
                <div class="doc-actions">
                    <a href="./documents/detail.html?id=${doc.ma_tai_lieu}" class="btn-view">
                        <span>👁️</span> Xem
                    </a>
                    <button class="btn-download" onclick="downloadDoc(${doc.ma_tai_lieu})">
                        <span>⬇️</span> Tải về
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display featured documents
function displayFeaturedDocuments(docs, container) {
    if (!docs || docs.length === 0) return;
    
    let html = '';
    docs.forEach((doc, index) => {
        const badge = index === 0 ? '⭐ Xuất sắc' : index === 1 ? '🔥 Thịnh hành' : '✨ Mới';
        html += `
            <div class="featured-card">
                <div class="featured-badge">${badge}</div>
                <div class="featured-image">
                    <img src="${doc.thumbnail || getDefaultThumbnail('PDF')}" 
                         alt="${doc.tieu_de}">
                </div>
                <div class="featured-content">
                    <h4>${doc.tieu_de}</h4>
                    <p class="featured-author">👤 ${doc.ho_ten || 'Anonymous'}</p>
                    <div class="featured-meta">
                        <span>⬇️ ${formatNumber(doc.so_luot_tai || 0)} lượt tải</span>
                        <span>⭐ ${doc.rating || '4.8'}/5</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Generate document tags
function generateDocTags(doc) {
    const tags = [];
    
    if (doc.ten_danh_muc) tags.push(doc.ten_danh_muc);
    if (doc.ten_mon_hoc) tags.push(doc.ten_mon_hoc);
    
    // Add some random tags if none exist
    if (tags.length === 0) {
        const defaultTags = ['Học tập', 'Tài liệu'];
        tags.push(...defaultTags.slice(0, 2));
    }
    
    return tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Get file type from filename
function getFileType(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    const typeMap = {
        'PDF': 'PDF',
        'DOC': 'DOCX',
        'DOCX': 'DOCX',
        'PPT': 'PPTX',
        'PPTX': 'PPTX',
        'XLS': 'XLSX',
        'XLSX': 'XLSX'
    };
    return typeMap[ext] || 'FILE';
}

// Get default thumbnail
function getDefaultThumbnail(fileType) {
    const colors = {
        'PDF': '%23667eea',
        'DOCX': '%2327ae60',
        'PPTX': '%23e74c3c',
        'XLSX': '%23f39c12'
    };
    const color = colors[fileType] || '%23667eea';
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='${color}' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E📄%3C/text%3E%3C/svg%3E`;
}

// Toggle favorite
function toggleFavorite(btn) {
    if (btn.textContent === '♡') {
        btn.textContent = '♥';
        btn.style.color = '#e74c3c';
        showToast('Đã thêm vào yêu thích', 'success');
    } else {
        btn.textContent = '♡';
        btn.style.color = '';
        showToast('Đã xóa khỏi yêu thích', 'info');
    }
}

// Download document
async function downloadDoc(docId) {
    if (!checkAuth()) {
        showToast('Vui lòng đăng nhập để tải tài liệu', 'info');
        setTimeout(() => {
            window.location.href = './login.html';
        }, 1500);
        return;
    }
    
    showLoading();
    
    try {
        const response = await apiGet(`/documents/${docId}/download`);
        
        if (response && response.ok) {
            showToast('Đang tải tài liệu...', 'success');
            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document_${docId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showToast('Không thể tải tài liệu', 'error');
        }
    } catch (error) {
        console.error('Download error:', error);
        showToast('Đã xảy ra lỗi khi tải tài liệu', 'error');
    } finally {
        hideLoading();
    }
}

// Sort documents
function sortDocuments() {
    const sortValue = document.getElementById('sortSelect').value;
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showToast(`Đã sắp xếp theo: ${getSortLabel(sortValue)}`, 'success');
        // In real app, would reload documents with sort order
    }, 500);
}

// Get sort label
function getSortLabel(sort) {
    const labels = {
        'newest': 'Mới nhất',
        'popular': 'Phổ biến nhất',
        'rating': 'Đánh giá cao',
        'downloads': 'Tải nhiều nhất'
    };
    return labels[sort] || sort;
}

// Change view (grid/list)
function changeView() {
    const viewValue = document.getElementById('viewSelect').value;
    const docsGrid = document.getElementById('recentDocs');
    
    if (docsGrid) {
        if (viewValue === 'list') {
            docsGrid.classList.add('list-view');
        } else {
            docsGrid.classList.remove('list-view');
        }
    }
}

// Load more documents
function loadMoreDocs() {
    const btn = document.querySelector('.btn-load-more');
    if (!btn) return;
    
    const loadingText = btn.querySelector('.loading-text');
    const loadingSpinner = btn.querySelector('.loading-spinner');
    
    loadingText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    btn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        loadingText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
        btn.disabled = false;
        showToast('Đã tải thêm tài liệu', 'success');
        
        // In real app, would append more documents
    }, 1500);
}

// ===================================
// 12. STATISTICS ANIMATION
// ===================================

// Animate statistics
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    
    const duration = 2000;
    const frameDuration = 1000 / 60;
    
    stats.forEach(stat => {
        const target = parseFloat(stat.dataset.target);
        if (isNaN(target)) return;
        
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;
        let current = 0;
        let frame = 0;
        
        const counter = setInterval(() => {
            frame++;
            current += increment;
            
            if (frame === totalFrames) {
                clearInterval(counter);
                current = target;
            }
            
            if (target % 1 === 0) {
                stat.textContent = Math.floor(current).toLocaleString();
            } else {
                stat.textContent = current.toFixed(1);
            }
        }, frameDuration);
    });
}

// ===================================
// 13. CAROUSEL
// ===================================

let carouselPosition = 0;

// Slide carousel
function slideCarousel(direction) {
    const carousel = document.getElementById('featuredCarousel');
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.featured-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 25; // card width + gap
    const maxPosition = cards.length - 1;
    
    carouselPosition += direction;
    
    // Loop carousel
    if (carouselPosition < 0) {
        carouselPosition = maxPosition;
    } else if (carouselPosition > maxPosition) {
        carouselPosition = 0;
    }
    
    carousel.style.transform = `translateX(-${carouselPosition * cardWidth}px)`;
}

// Auto slide carousel
function startAutoCarousel() {
    setInterval(() => {
        slideCarousel(1);
    }, 5000);
}

// ===================================
// 14. FAQ
// ===================================

// Toggle FAQ
function toggleFAQ(btn) {
    const faqItem = btn.parentElement;
    const icon = btn.querySelector('.faq-icon');
    const isOpen = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const itemIcon = item.querySelector('.faq-icon');
        if (itemIcon) itemIcon.textContent = '+';
    });
    
    // Toggle current FAQ
    if (!isOpen) {
        faqItem.classList.add('active');
        icon.textContent = '−';
    }
}

// ===================================
// 15. NEWSLETTER
// ===================================

// Subscribe newsletter
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletterEmail');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!validateEmail(email)) {
        showToast('Email không hợp lệ', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        showToast('Đăng ký thành công! Cảm ơn bạn đã quan tâm.', 'success');
        emailInput.value = '';
    }, 1000);
}

// ===================================
// 16. BACK TO TOP
// ===================================

// Setup back to top button
function setupBackToTop() {
    window.addEventListener('scroll', function() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// 17. API HELPER FUNCTIONS
// ===================================

// API request wrapper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            showToast('Phiên đăng nhập đã hết hạn', 'info');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1500);
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        showToast('Không thể kết nối đến máy chủ', 'error');
        throw error;
    }
}

// GET request
async function apiGet(endpoint) {
    return await apiRequest(endpoint, { method: 'GET' });
}

// POST request
async function apiPost(endpoint, data) {
    return await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// PUT request
async function apiPut(endpoint, data) {
    return await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

// DELETE request
async function apiDelete(endpoint) {
    return await apiRequest(endpoint, { method: 'DELETE' });
}

// File upload helper
async function uploadFile(endpoint, formData) {
    const token = getToken();
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            showToast('Phiên đăng nhập đã hết hạn', 'info');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1500);
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('File Upload Error:', error);
        showToast('Không thể tải file lên', 'error');
        throw error;
    }
}

// ===================================
// 18. VALIDATION FUNCTIONS
// ===================================

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    return { valid: true };
}

// Validate file
function validateFile(file, maxSize = MAX_FILE_SIZE, allowedTypes = ALLOWED_FILE_TYPES) {
    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        return { 
            valid: false, 
            message: `File quá lớn! Kích thước tối đa: ${maxSizeMB}MB` 
        };
    }
    
    // Check file type
    if (allowedTypes.length > 0) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExt)) {
            return { 
                valid: false, 
                message: `Chỉ chấp nhận file: ${allowedTypes.join(', ')}` 
            };
        }
    }
    
    return { valid: true };
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// ===================================
// 19. UTILITY FUNCTIONS
// ===================================

// Format number
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format date
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Hôm nay';
    } else if (diffDays === 1) {
        return 'Hôm qua';
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} tuần trước`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} tháng trước`;
    } else {
        return date.toLocaleDateString('vi-VN');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Set URL parameter
function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Remove URL parameter
function removeUrlParameter(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép vào clipboard', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
            showToast('Không thể sao chép', 'error');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Đã sao chép vào clipboard', 'success');
        } catch (err) {
            showToast('Không thể sao chép', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// Share document
function shareDocument(docId, title) {
    const url = `${window.location.origin}/documents/detail.html?id=${docId}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Xem tài liệu này trên DocShare',
            url: url
        }).then(() => {
            showToast('Đã chia sẻ thành công', 'success');
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
        });
    } else {
        copyToClipboard(url);
    }
}

// Download file from URL
async function downloadFileFromUrl(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Download failed:', error);
        showToast('Không thể tải file', 'error');
    }
}

// ===================================
// 20. LOCAL STORAGE HELPERS
// ===================================

// Save to localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
    }
}

// Get from localStorage
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return null;
    }
}

// Remove from localStorage
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
    }
}

// Clear localStorage
function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (e) {
        console.error('LocalStorage error:', e);
        return false;
    }
}

// ===================================
// 21. MODAL FUNCTIONS
// ===================================

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal on background click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target.id);
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            hideModal(modal.id);
        });
    }
});

// ===================================
// 22. TABS FUNCTIONS
// ===================================

// Show tab
function showTab(tabId) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tab items
    document.querySelectorAll('.tab-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab pane
    const tabPane = document.getElementById(tabId);
    if (tabPane) {
        tabPane.classList.add('active');
    }
    
    // Add active class to selected tab item
    const tabItem = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabItem) {
        tabItem.classList.add('active');
    }
}

// ===================================
// 23. ACCORDION FUNCTIONS
// ===================================

// Toggle accordion
function toggleAccordion(btn) {
    const accordionItem = btn.parentElement;
    const isOpen = accordionItem.classList.contains('active');
    
    // Close all accordions in the same group
    const accordionGroup = accordionItem.closest('.accordion');
    if (accordionGroup) {
        accordionGroup.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Toggle current accordion
    if (!isOpen) {
        accordionItem.classList.add('active');
    }
}

// ===================================
// 24. PAGINATION FUNCTIONS
// ===================================

// Go to page
function goToPage(page) {
    showLoading();
    
    // Update URL
    setUrlParameter('page', page);
    
    // Simulate loading
    setTimeout(() => {
        hideLoading();
        showToast(`Đã chuyển đến trang ${page}`, 'info');
        scrollToTop();
        
        // In real app, would load documents for this page
    }, 500);
}

// Update pagination UI
function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    let html = '';
    
    // Previous button
    html += `
        <div class="page-item ${currentPage === 1 ? 'disabled' : ''}" 
             onclick="${currentPage > 1 ? `goToPage(${currentPage - 1})` : ''}">
            ‹
        </div>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <div class="page-item ${i === currentPage ? 'active' : ''}" 
                     onclick="goToPage(${i})">
                    ${i}
                </div>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<div class="page-item disabled">...</div>`;
        }
    }
    
    // Next button
    html += `
        <div class="page-item ${currentPage === totalPages ? 'disabled' : ''}" 
             onclick="${currentPage < totalPages ? `goToPage(${currentPage + 1})` : ''}">
            ›
        </div>
    `;
    
    pagination.innerHTML = html;
}

// ===================================
// 25. DROPDOWN FUNCTIONS
// ===================================

// Toggle dropdown
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.closest('.dropdown').classList.toggle('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// ===================================
// 26. PRINT FUNCTIONS
// ===================================

// Print page
function printPage() {
    window.print();
}

// Print element
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<link rel="stylesheet" href="./style.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// ===================================
// 27. EXPORT FUNCTIONS
// ===================================

// Export to CSV
function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Convert array to CSV
function convertToCSV(array) {
    const headers = Object.keys(array[0]);
    const rows = array.map(obj => headers.map(header => obj[header]));
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ===================================
// 28. LAZY LOADING
// ===================================

// Setup lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===================================
// 29. ERROR HANDLING
// ===================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // In production, you might want to send this to a logging service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to a logging service
});

// ===================================
// 30. PERFORMANCE MONITORING
// ===================================

// Log page load time
window.addEventListener('load', function() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// ===================================
// 31. ANALYTICS (Optional)
// ===================================

// Track page view
function trackPageView(pageName) {
    // In production, integrate with analytics service like Google Analytics
    console.log('Page view:', pageName);
}

// Track event
function trackEvent(category, action, label) {
    // In production, integrate with analytics service
    console.log('Event:', category, action, label);
}

// ===================================
// 33. MOBILE MENU (Optional)
// ===================================

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===================================
// 34. AUTO-START FUNCTIONS
// ===================================

// Start auto carousel if exists
if (document.getElementById('featuredCarousel')) {
    // Uncomment to enable auto carousel
    // startAutoCarousel();
}

// Setup lazy loading
if ('IntersectionObserver' in window) {
    setupLazyLoading();
}

// Track initial page view
trackPageView(document.title);

// ===================================
// END OF MAIN.JS
// ===================================

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        apiGet,
        apiPost,
        apiPut,
        apiDelete,
        uploadFile,
        showToast,
        showLoading,
        hideLoading,
        formatNumber,
        formatDate,
        formatFileSize,
        validateEmail,
        validatePassword,
        validateFile,
        getUser,
        checkAuth,
        logout
    };
}