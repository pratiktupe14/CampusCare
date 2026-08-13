class AppSidebar extends HTMLElement {
    connectedCallback() {
        // Read the explicit active state attribute
        const currentActive = this.getAttribute('active') || 'dashboard';

        const navItems = [
            { id: 'dashboard', href: 'index.html', icon: 'dashboard', text: 'Dashboard', fill: true },
            { id: 'report-complaint', href: 'report-complaint.html', icon: 'add_circle', text: 'Report Complaint', fill: false },
            { id: 'my-complaints', href: 'my-complaints.html', icon: 'list_alt', text: 'My Complaints', fill: false },
            { id: 'complaint-history', href: 'complaint-history.html', icon: 'history', text: 'Complaint History', fill: false },
            { divider: true },
            { id: 'notifications', href: 'notifications.html', icon: 'notifications', text: 'Notifications', fill: false },
            { id: 'reports', href: 'reports.html', icon: 'assessment', text: 'Reports', fill: false },
            { id: 'profile', href: 'profile.html', icon: 'person', text: 'Profile', fill: false },
            { id: 'settings', href: 'settings.html', icon: 'settings', text: 'Settings', fill: false },
        ];

        let navHTML = '';
        navItems.forEach(item => {
            if (item.divider) {
                navHTML += `<div class="my-md mx-gutter border-t border-outline-variant"></div>`;
            } else {
                const isActive = (item.id === currentActive);
                
                const activeClasses = isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high';
                const fillStyle = (isActive || item.fill) ? `style="font-variation-settings: 'FILL' 1;"` : '';
                
                // Added whitespace-nowrap to prevent label wrapping causing layout shifts
                navHTML += `
                <a class="flex items-center gap-3 px-3 py-2 rounded-r-full transition-all duration-200 ${activeClasses}" href="${item.href}">
                    <span class="material-symbols-outlined text-[18px]" ${fillStyle}>${item.icon}</span>
                    <span class="text-sm font-medium whitespace-nowrap">${item.text}</span>
                </a>`;
            }
        });

        this.innerHTML = `
        <aside class="fixed left-0 top-16 h-[calc(100vh-56px)] w-[220px] hidden md:flex flex-col border-r border-outline-variant py-md pr-md flex-shrink-0 z-40 bg-white">
            <div class="px-gutter mb-lg">
                <div class="flex items-center gap-sm p-sm bg-white border border-gray-200 rounded-xl">
                    <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">school</span>
                    <div>
                        <p class="text-base font-bold text-primary">Maintenance Portal</p>
                        <p class="text-xs text-on-surface-variant uppercase tracking-wider">Student Access</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                ${navHTML}
            </nav>
            <div class="mt-auto px-4 py-4 w-full flex flex-col">
                <a href="report-complaint.html" class="w-full bg-primary-container text-on-primary-container py-2 px-4 text-sm rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md mb-4">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    <span class="">New Request</span>
                </a>
                <div class="border-t border-outline-variant mb-2"></div>
                <button id="logout-btn" class="flex items-center gap-3 px-3 py-2 w-full text-left text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-lg">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                    <span class="text-sm font-medium whitespace-nowrap">Logout</span>
                </button>
            </div>
        </aside>
        `;

        // Handle disabled links
        this.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') e.preventDefault();
            });
        });

        // Handle Logout
        const logoutBtn = this.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                const confirmLogout = confirm("Are you sure you want to log out?");
                if (confirmLogout) {
                    // TODO: connect to real auth/logout endpoint
                    // localStorage.removeItem('authToken');
                    window.location.href = 'login.html';
                }
            });
        }
    }
}

customElements.define('app-sidebar', AppSidebar);
