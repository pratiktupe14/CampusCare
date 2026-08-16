class AppSidebar extends HTMLElement {
    connectedCallback() {
        // Read the explicit active state attribute
        const currentActive = this.getAttribute('active') || 'dashboard';
        const role = this.getAttribute('role') || 'student';
        const isFaculty = role === 'faculty';
        const isStaff = role === 'staff';
        const isAdmin = role === 'admin';

        let subtitle = 'Student Access';
        if (isFaculty) subtitle = 'Faculty Management';
        if (isStaff) subtitle = 'Maintenance Staff';
        if (isAdmin) subtitle = 'Admin Console';

        const newRequestHref = isFaculty ? 'report-complaint-faculty.html' : 'report-complaint.html';

        let navItems = [];
        if (isAdmin) {
            navItems = [
                { id: 'dashboard', href: 'admin-dashboard.html', icon: 'dashboard', text: 'Dashboard Overview', fill: true },
                { id: 'complaint-management', href: 'complaint-management.html', icon: 'assignment', text: 'Complaint Management', fill: false },
                { id: 'user-management', href: 'user-management.html', icon: 'group', text: 'User Management', fill: false },
                { id: 'assign-work', href: 'assign-work.html', icon: 'build', text: 'Maintenance Management', fill: false },
                { id: 'reports', href: 'admin-reports.html', icon: 'analytics', text: 'Reports & Analytics', fill: false },
                { divider: true },
                { id: 'settings', href: 'settings.html', icon: 'settings', text: 'Settings', fill: false },
            ];
        } else if (isStaff) {
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
                
                navHTML += `
                <a class="flex items-center gap-3 px-3 py-2 rounded-r-sm transition-all duration-300 ease-out ${activeClasses}" href="${item.href}">
                    <span class="material-symbols-outlined text-[18px]" ${fillStyle}>${item.icon}</span>
                    <span class="text-sm font-medium whitespace-nowrap">${item.text}</span>
                </a>`;
            }
        });

        // Mobile Navigation Items
        let mobileNavItems = [];
        if (isAdmin) {
            mobileNavItems = [
                { id: 'dashboard', href: 'admin-dashboard.html', icon: 'dashboard', text: 'Dashboard' },
                { id: 'complaint-management', href: 'complaint-management.html', icon: 'assignment', text: 'Complaints' },
                { id: 'user-management', href: 'user-management.html', icon: 'group', text: 'Users' },
                { id: 'assign-work', href: 'assign-work.html', icon: 'build', text: 'Maintenance' },
                { id: 'reports', href: 'admin-reports.html', icon: 'analytics', text: 'Reports' },
            ];
        } else if (isStaff) {
            mobileNavItems = [
                { id: 'dashboard', href: 'dashboard-staff.html', icon: 'dashboard', text: 'Dashboard' },
                { id: 'task-management', href: 'task-management-staff.html', icon: 'assignment', text: 'Tasks' },
                { id: 'work-progress', href: 'work-progress-staff.html', icon: 'pending_actions', text: 'Progress' },
                { id: 'notifications', href: 'notifications-staff.html', icon: 'notifications', text: 'Alerts' },
                { id: 'reports', href: 'reports-staff.html', icon: 'assessment', text: 'Reports' },
            ];
        } else if (isFaculty) {
            mobileNavItems = [
                { id: 'dashboard', href: 'dashboard-faculty.html', icon: 'home', text: 'Home' },
                { id: 'report-complaint', href: 'report-complaint-faculty.html', icon: 'add_box', text: 'Request' },
                { id: 'my-complaints', href: 'my-complaints-faculty.html', icon: 'list_alt', text: 'Complaints' },
                { id: 'complaint-history', href: 'complaint-history-faculty.html', icon: 'history', text: 'History' },
            ];
        } else {
            mobileNavItems = [
                { id: 'dashboard', href: 'index.html', icon: 'home', text: 'Home' },
                { id: 'report-complaint', href: 'report-complaint.html', icon: 'add_box', text: 'Request' },
                { id: 'my-complaints', href: 'my-complaints.html', icon: 'list_alt', text: 'Complaints' },
                { id: 'complaint-history', href: 'complaint-history.html', icon: 'history', text: 'History' },
            ];
        }

        let mobileNavHTML = '';
        mobileNavItems.forEach(item => {
            const isActive = (item.id === currentActive);
            const activeColor = isActive ? 'text-primary font-bold' : 'text-on-surface-variant';
            const fillStyle = isActive ? `style="font-variation-settings: 'FILL' 1;"` : '';
            
            mobileNavHTML += `
            <a href="${item.href}" class="flex flex-col items-center justify-center ${activeColor} rounded-sm px-2 py-1 transition-transform active:scale-90">
                <span class="material-symbols-outlined text-[20px]" ${fillStyle}>${item.icon}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest mt-0.5">${item.text}</span>
            </a>`;
        });

        this.innerHTML = `
        <aside class="fixed left-0 top-16 h-[calc(100vh-64px)] w-[220px] hidden md:flex flex-col border-r border-gray-200 py-md pr-md flex-shrink-0 z-40 bg-paper">
            <div class="px-gutter mb-lg">
                <div class="flex items-center gap-sm p-sm bg-white border border-gray-200 rounded-sm">
                    <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">${isAdmin ? 'admin_panel_settings' : 'school'}</span>
                    <div>
                        <p class="text-base font-bold text-primary font-serif">CampusCare</p>
                        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider">${subtitle}</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 space-y-1">
                ${navHTML}
            </nav>
            <div class="mt-auto px-4 py-4 w-full flex flex-col">
                ${isAdmin ? `
                <div class="p-3 bg-surface-container-low rounded-sm flex items-center gap-3 mb-4 border border-gray-200">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-outline-variant">
                        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDccDlGFRfIF8rMdrMeNZN3dlDCrM-taCZn9Jke32tmCH9C0xjFQUouKtXEeCSyIyy3WL_7Wvp2qfgDf1am_qC9jpVxFspKgtDAZmC8gsb7H9DlQ5EoijCXAWXLXsvPnJSgzc8tyDSoVUDAVzfI3PjNZZTreLk-unQKl3wfXiLgJl8nrsYBA5l8vOe3pfZF7I08mC4NUjJmdX8yeROrr8gzVGJHuOARAzwp3NHMGB1KJnvhM5O4DL_Kgw" alt="Admin. Miller">
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-sm font-bold text-on-surface truncate font-serif">Admin. Miller</p>
                        <p class="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">Administrator</p>
                    </div>
                </div>
                ` : isStaff ? `
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

        <!-- Mobile Bottom Navigation Bar -->
        <nav class="fixed bottom-0 left-0 right-0 w-full z-50 md:hidden border-t border-gray-200 bg-paper flex justify-around items-center h-16 px-2 pb-safe shadow-lg">
            ${mobileNavHTML}
        </nav>
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

