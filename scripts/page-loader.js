import { createElement } from './components.js';

const showPage = async (pageConfig, pagesPath, pageURL, resourceManager, mainInnerElem) => {
    mainInnerElem.innerHTML = '';

    const html = await resourceManager.loadResource({
        url: `${pagesPath}${pageURL}/index.html`,
        type: 'html',
        container: mainInnerElem,
        loadingText: 'Loading page...',
        errorText: 'Failed to load page'
    });

    const pageElem = createElement('div', ['page']);
    const pageHeaderElem = createElement('div', ['page__header']);
    const pageTitleElem = createElement('p', ['page__title']);
    const pageDescriptionElem = createElement('p', ['page__description']);
    const pageContentElem = createElement('div', ['page__content']);

    mainInnerElem.appendChild(pageElem);
    pageElem.appendChild(pageHeaderElem);
    pageElem.appendChild(pageContentElem);
    pageHeaderElem.appendChild(pageTitleElem);
    pageHeaderElem.appendChild(pageDescriptionElem);

    pageTitleElem.textContent = pageConfig['title'] || '';
    pageDescriptionElem.textContent = `Last updated: ${pageConfig['last-updated-time'] || '-'}`;
    pageContentElem.innerHTML = html;

    await resourceManager.loadResource({
        url: `${pagesPath}${pageURL}/styles.css`,
        type: 'css',
        loadingText: 'Loading page styles...',
        errorText: 'Failed to load page styles'
    }).catch(() => console.log(`No styles found for page ${pageURL}`));

    await resourceManager.loadResource({
        url: `${pagesPath}${pageURL}/script.js`,
        type: 'js',
        loadingText: 'Loading page script...',
        errorText: 'Failed to load page script'
    }).catch(() => console.log(`No script found for page ${pageURL}`));


    window.history.pushState(
        { page: pageURL },
        '',
        `${window.location.pathname}?page=${pageURL}`
    );
};

const initializePages = (pagesPath, pagesConfig, resourceManager, mainInnerElem) => {
    const defaultPageURL = 'home';
    const initialPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;

    const loadPageFromURL = (isPopState = false) => {
        const currentPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;
        const pageConfig = pagesConfig[currentPageURL];

        if (!isPopState) {
            window.history.pushState(
                { page: pageURL },
                '',
                `${window.location.pathname}?page=${pageURL}`
            );
        }

        showPage(pageConfig, pagesPath, currentPageURL, resourceManager, mainInnerElem);
    };

    // Initial page loading
    window.history.replaceState(
        { page: initialPageURL },
        '',
        `?page=${initialPageURL}`
    );
    loadPageFromURL(true);

    // Browser navigation handler
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        const pageURL = state.page;
        const pageConfig = pagesConfig[pageURL];

        if (state && state.page) {
            showPage(pageConfig, pagesPath, pageURL, resourceManager, mainInnerElem);
        }
    });

    // Preventing the standard link behavior
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href && link.href.includes('?page=')) {
            event.preventDefault();
            const url = new URL(link.href);
            const pageURL = url.searchParams.get('page');
            const pageConfig = pagesConfig[pageURL];
            if (pageConfig) {
                showPage(pageConfig, pagesPath, pageURL, resourceManager, mainInnerElem);
            }
        }
    });
};

export { initializePages, showPage };