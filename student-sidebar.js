class StudentSidebar extends HTMLElement {
    connectedCallback() {
        const currentPage = this.getAttribute('current-page') || 'dashboard';

        const navItems = [
            { id: 'dashboard', href: 'index.html', icon: 'dashboard', text: 'Dashboard', fill: true },
            { id: 'report-complaint', href: 'report-complaint.html', icon: 'add_circle', text: 'Report Complaint', fill: false },
            { id: 'my-complaints', href: 'my-complaints.html', icon: 'list_alt', text: 'My Complaints', fill: false },
            { id: 'complaint-history', href: 'complaint-history.html', icon: 'history', text: 'Complaint History', fill: false },
            { divider: true },
            { id: 'notifications', href: '#', icon: 'notifications', text: 'Notifications', fill: false },
            { id: 'reports', href: '#', icon: 'assessment', text: 'Reports', fill: false },
            { id: 'profile', href: '#', icon: 'person', text: 'Profile', fill: false },
            { id: 'settings', href: '#', icon: 'settings', text: 'Settings', fill: false },
        ];

        let navHTML = '';
        navItems.forEach(item => {
            if (item.divider) {
                navHTML += `<div class="my-md mx-gutter border-t border-gray-200"></div>`;
            } else {
                const isActive = item.id === currentPage;
                const activeClasses = isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high';
                const fillStyle = (isActive || item.fill) ? `style="font-variation-settings: 'FILL' 1;"` : '';
                
                navHTML += `
                <a class="flex items-center gap-md px-gutter py-3 rounded-r-sm transition-all duration-200 ${activeClasses}" href="${item.href}">
                    <span class="material-symbols-outlined" ${fillStyle}>${item.icon}</span>
                    <span class="font-label-md">${item.text}</span>
                </a>`;
            }
        });

        this.innerHTML = `
        <aside class="fixed left-0 top-16 h-[calc(100vh-64px)] w-[220px] hidden md:flex flex-col border-r border-gray-200 py-md pr-md flex-shrink-0 z-40 bg-paper">
            <div class="px-gutter mb-lg">
                <div class="flex items-center gap-sm p-sm bg-white border border-gray-200 rounded-sm">
                    <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">school</span>
                    <div>
                        <p class="text-base font-bold text-primary font-serif">Maintenance Portal</p>
                        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider">Student Access</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                ${navHTML}
            </nav>
            <div class="mt-auto px-gutter py-md">
                <a href="report-complaint.html" class="w-full bg-primary-container text-on-primary-container py-3 rounded-sm font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-95">
                    <span class="material-symbols-outlined">add</span>
                    <span class="">New Request</span>
                </a>
            </div>
        </aside>
        `;

        // Simple micro-interaction for active state tracking (simulation)
        this.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Prevent reload for demo
                if(this.getAttribute('href') === '#') e.preventDefault();
            });
        });
    }
}
customElements.define('student-sidebar', StudentSidebar);
