// Header Authentication and User Dropdown
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if user is logged in
    if (token && user.email) {
        // Show user dropdown, hide login button
        const loginBtn = document.getElementById('loginBtn');
        const userDropdown = document.getElementById('userDropdown');
        const userName = document.getElementById('userName');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (userDropdown) {
            userDropdown.style.display = 'block';
            if (userName) userName.textContent = user.ten || user.email;
        }
        
        // Show admin link if user is admin
        if (user.chuc_vu === 'admin') {
            const adminLink = document.getElementById('adminLink');
            if (adminLink) adminLink.style.display = 'block';
        }
    } else {
        // Show login button, hide user dropdown
        const loginBtn = document.getElementById('loginBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (loginBtn) loginBtn.style.display = 'block';
        if (userDropdown) userDropdown.style.display = 'none';
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/index.html';
        });
    }
    
    // Toggle dropdown
    const userAvatar = document.querySelector('.user-avatar');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userAvatar && dropdownMenu) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }
});
