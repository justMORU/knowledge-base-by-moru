import { loadResource, cleanupOldResources, createLoader } from './components.js';

const showPage = (pagesPath, pageData, pageURL, pageTitleElem, pageDescriptionElem, pageContentElem) => {
    pageTitleElem.innerHTML = '';
    const pageTitleLoader = createLoader();
    pageTitleElem.appendChild(pageTitleLoader);

    pageDescriptionElem.innerHTML = '';
    const pageDescriptionLoader = createLoader();
    pageDescriptionElem.appendChild(pageDescriptionLoader);

    pageContentElem.innerHTML = '';
    const pageContentLoader = createLoader();
    pageContentElem.appendChild(pageContentLoader);

    if (!pageData) {
        showPage(
            pagesPath,
            {
                title: 'Error 404 (Page not found)',
                'last-updated-time': '-',
            },
            '404',
            pageTitleElem,
            pageDescriptionElem,
            pageContentElem
        );
        return;
    }

    // Add URL in history
    window.history.pushState({ page: pageURL }, '', `?page=${pageURL}`);

    fetch(`${pagesPath}${pageURL}/index.html`)
        .then((response) => response.text())
        .then((html) => {
            pageTitleElem.innerHTML = pageData.title;
            pageDescriptionElem.innerHTML = `Last updated: ${pageData['last-updated-time']}`;
            pageContentElem.innerHTML = html;

            cleanupOldResources(pageURL);

            // Load styles.css
            loadResource('link', `${pagesPath}${pageURL}/styles.css`, 'page-style', pageURL, document.head);

            // Load script.js
            loadResource('script', `${pagesPath}${pageURL}/script.js`, 'page-script', pageURL, document.body);
        })
        .catch((error) => {
            console.error('Error loading page:', error);
        });
};

const initializePages = (pagesPath, pagesData, pageTitleElem, pageDescriptionElem, pageContentElem) => {
    const defaultPageURL = 'home';
    const initialPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;

    const loadPageFromURL = (isPopState = false) => {
        const currentPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;
        const pageData = pagesData[currentPageURL];

        if (!isPopState) {
            window.history.pushState({ page: currentPageURL }, '', `?page=${currentPageURL}`);
        }

        showPage(pagesPath, pageData, currentPageURL, pageTitleElem, pageDescriptionElem, pageContentElem);
    };

    // Initial page loading
    window.history.replaceState({ page: initialPageURL }, '', `?page=${initialPageURL}`);
    loadPageFromURL(true);

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.page) {
            showPage(pagesData[state.page], state.page, pageTitleElem, pageDescriptionElem, pageContentElem);
        }
    });
};

export { initializePages, showPage };