class AppSidebar extends HTMLElement {
    connectedCallback() {
        // Read the explicit active state attribute
        const currentActive = this.getAttribute('active') || 'dashboard';
        const role = this.getAttribute('role') || 'student';
        const isFaculty = role === 'faculty';
        const isStaff = role === 'staff';

        let subtitle = 'Student Access';
        if (isFaculty) subtitle = 'Faculty Management';
        if (isStaff) subtitle = 'Maintenance Staff';

        const newRequestHref = isFaculty ? 'report-complaint-faculty.html' : 'report-complaint.html';

        let navItems = [];
        if (isStaff) {
            navItems = [
                { id: 'dashboard', href: 'dashboard-staff.html', icon: 'dashboard', text: 'Dashboard', fill: true },
                { id: 'task-management', href: 'task-management-staff.html', icon: 'assignment', text: 'Task Management', fill: false },
                { id: 'work-progress', href: 'work-progress-staff.html', icon: 'pending_actions', text: 'Work Progress', fill: false },
                { divider: true },
                { id: 'notifications', href: 'notifications-staff.html', icon: 'notifications', text: 'Notifications', fill: false },
                { id: 'reports', href: 'reports-staff.html', icon: 'assessment', text: 'Reports', fill: false },
                { id: 'profile', href: 'profile-settings-staff.html', icon: 'person', text: 'Profile', fill: false },
            ];
        } else {
            navItems = [
                { id: 'dashboard', href: isFaculty ? 'dashboard-faculty.html' : 'index.html', icon: 'dashboard', text: 'Dashboard', fill: true },
                { id: 'report-complaint', href: isFaculty ? 'report-complaint-faculty.html' : 'report-complaint.html', icon: 'add_circle', text: 'Report Complaint', fill: false },
                { id: 'my-complaints', href: isFaculty ? 'my-complaints-faculty.html' : 'my-complaints.html', icon: 'list_alt', text: 'My Complaints', fill: false },
                { id: 'complaint-history', href: isFaculty ? 'complaint-history-faculty.html' : 'complaint-history.html', icon: 'history', text: 'Complaint History', fill: false },
                { divider: true },
                { id: 'notifications', href: isFaculty ? 'notifications-faculty.html' : 'notifications.html', icon: 'notifications', text: 'Notifications', fill: false },
                { id: 'reports', href: isFaculty ? 'reports-faculty.html' : 'reports.html', icon: 'assessment', text: 'Reports', fill: false },
                { id: 'profile', href: isFaculty ? 'profile-settings-faculty.html' : 'profile.html', icon: 'person', text: 'Profile', fill: false },
                { id: 'settings', href: isFaculty ? 'settings-faculty.html' : 'settings.html', icon: 'settings', text: 'Settings', fill: false },
            ];
        }

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
                <a class="flex items-center gap-3 px-3 py-2 rounded-r-sm transition-all duration-200 ${activeClasses}" href="${item.href}">
                    <span class="material-symbols-outlined text-[18px]" ${fillStyle}>${item.icon}</span>
                    <span class="text-sm font-medium whitespace-nowrap">${item.text}</span>
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
                        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider">${subtitle}</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                ${navHTML}
            </nav>
            <div class="mt-auto px-4 py-4 w-full flex flex-col">
                ${isStaff ? `
                <div class="p-3 bg-surface-container-low rounded-sm flex items-center gap-3 mb-4 border border-gray-200">
                    <div class="w-10 h-10 rounded-sm overflow-hidden bg-gray-200 flex-shrink-0">
                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD7sL2MBNHL1zGJ-lsss2BDno6GAsbpWMyxI8BfCUK96IJKDlrS8kRz2eVV1UPUICqqpDxCVdDGJoldgUwHMV8wA9vIaB_27AgkbH7GE_UVYdAksSGC5nDciMQmZXS10kkZJKSycsRcuArRmBkC-w4FmIzcQYpY9u5LNJWM8e3FIgwlCYOjgn7_83K4N4pmZXstMed87M_GbHo76H_xDPEohekUZt20a8v9Kh3fwVDL4p1lwTfaQ40UA" alt="Alex Rivera">
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-sm font-bold text-on-surface truncate font-serif">Alex Rivera</p>
                        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">ID: #ST-99283</p>
                    </div>
                </div>
                ` : `
                <a href="${newRequestHref}" class="w-full bg-primary-container text-on-primary-container py-2 px-4 text-sm rounded-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 mb-4">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    <span class="">New Request</span>
                </a>
                `}
                <div class="border-t border-gray-200 mb-2"></div>
                <button id="logout-btn" class="flex items-center gap-3 px-3 py-2 w-full text-left text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-sm">
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
