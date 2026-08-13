document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Only intercept same-origin HTML links (exclude # and external)
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

    e.preventDefault();

    try {
        const response = await fetch(href);
        if (!response.ok) throw new Error('Failed to fetch page');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract <main> and update current page
        const newMain = doc.querySelector('main');
        const currentMain = document.querySelector('main');
        
        if (newMain && currentMain) {
            currentMain.replaceWith(newMain);
        }

        // Update Title
        document.title = doc.title;

        // Update active state in sidebar explicitly
        const sidebar = document.querySelector('app-sidebar');
        if (sidebar) {
            // Map the href to the active ID
            const mapping = {
                'index.html': 'dashboard',
                'report-complaint.html': 'report-complaint',
                'my-complaints.html': 'my-complaints',
                'complaint-history.html': 'complaint-history',
                'notifications.html': 'notifications',
                'reports.html': 'reports',
                'profile.html': 'profile',
                'settings.html': 'settings',
                'dashboard-faculty.html': 'dashboard',
                'report-complaint-faculty.html': 'report-complaint',
                'my-complaints-faculty.html': 'my-complaints',
                'complaint-history-faculty.html': 'complaint-history',
                'notifications-faculty.html': 'notifications',
                'reports-faculty.html': 'reports',
                'profile-settings-faculty.html': 'profile',
                'settings-faculty.html': 'settings'
            };
            const activeId = mapping[href] || 'dashboard';
            
            sidebar.setAttribute('active', activeId);
            // Re-render the sidebar by re-running connectedCallback logic or similar
            // Since we want to avoid layout shifts, we can just update the classes directly
            const links = sidebar.querySelectorAll('nav a');
            links.forEach(a => {
                const isMatch = a.getAttribute('href') === href;
                const span = a.querySelector('span.material-symbols-outlined');
                
                if (isMatch) {
                    a.className = "flex items-center gap-3 px-3 py-2 rounded-r-full transition-all duration-200 bg-secondary-container text-on-secondary-container font-bold";
                    if (span) span.style.fontVariationSettings = "'FILL' 1";
                } else {
                    a.className = "flex items-center gap-3 px-3 py-2 rounded-r-full transition-all duration-200 text-on-surface-variant hover:bg-surface-container-high";
                    if (span && !a.href.includes('index.html') && !a.href.includes('dashboard-faculty.html')) {
                        // index.html or dashboard-faculty.html icon might be set to fill true by default in config, keeping it simple
                        span.style.fontVariationSettings = "";
                    }
                }
            });
        }

        // Push state to history
        window.history.pushState({}, '', href);
        
        // Scroll to top
        window.scrollTo(0, 0);

    } catch (err) {
        // Fallback to normal navigation if fetch fails
        window.location.href = href;
    }
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    window.location.reload(); // Simple fallback for back button
});
