const pagesPath = 'pages/';
const dataPath = 'config/';
const pagesDataPath = dataPath + 'pages.json';
const navDataPath = dataPath + 'navigation.json';

const loadResource = (type, url, datasetKey, datasetValue, parentElement) => {
    const existingElement = document.querySelector(`${type}[data-${datasetKey}="${datasetValue}"]`);
    if (existingElement) {
        return;
    }

    const element = document.createElement(type);

    element.setAttribute(`data-${datasetKey}`, datasetValue);

    if (type === 'link') {
        element.rel = 'stylesheet';
        element.href = url;
    } else if (type === 'script') {
        element.src = url;
    }

    element.onerror = () => {
        console.warn(`Failed to load resource: ${url}`);
        element.remove();
    };

    parentElement.appendChild(element);
};

const cleanupOldResources = (pageURL) => {
    document.querySelectorAll(`[data-page-style]:not([data-page-style="${pageURL}"])`).forEach(el => el.remove());
    document.querySelectorAll(`[data-page-script]:not([data-page-script="${pageURL}"])`).forEach(el => el.remove());
};

const showPage = (pageData, pageURL, pageTitleElem, pageDescriptionElem, pageContentElem) => {
    if (!pageData) {
        showPage(
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

const createElement = (tag, classNames = [], attributes = {}) => {
    const element = document.createElement(tag);
    classNames.forEach((className) => element.classList.add(className));
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
};

const addNavSection = (navSectionData, pagesData, navElem, pageTitleElem, pageDescriptionElem, pageContentElem) => {

    const navSectionElem = createElement('div', ['nav__section']);
    const navSectionHeaderElem = createElement('div', ['nav__section-header']);
    const navSectionTitleElem = createElement('p', ['nav__section-title']);
    navSectionTitleElem.textContent = navSectionData.title;
    const navSectionIndicatorElem = createElement('img', ['nav__section-indicator'], {
        src: 'assets/icons/dropdown-arrow-24.svg',
        alt: 'toggle',
    });
    const navSectionContentElem = createElement('div', ['nav__section-content']);
    const navSectionLinksElem = createElement('div', ['nav__section-content-inner']);

    navElem.appendChild(navSectionElem);
    navSectionElem.appendChild(navSectionHeaderElem);
    navSectionHeaderElem.appendChild(navSectionTitleElem);
    navSectionHeaderElem.appendChild(navSectionIndicatorElem);
    navSectionElem.appendChild(navSectionContentElem);
    navSectionContentElem.appendChild(navSectionLinksElem);

    navSectionData.pages.forEach((pageURL) => {
        const navLink = createElement('p', ['nav__section-link']);
        if (pageURL && pagesData[pageURL]) {
            navLink.textContent = pagesData[pageURL].title;
            navLink.addEventListener('click', () => {
                showPage(pagesData[pageURL], pageURL, pageTitleElem, pageDescriptionElem, pageContentElem);
            });
        } else {
            navLink.classList.add('inactive');
            navLink.textContent = 'Nothing yet';
        }
        navSectionLinksElem.appendChild(navLink);
    });

    navSectionHeaderElem.addEventListener('click', () => {
        const isActive = navSectionContentElem.classList.toggle('active');
        navSectionContentElem.style.height = isActive ? `${navSectionLinksElem.offsetHeight}px` : '0';
        navSectionIndicatorElem.classList.toggle('active', isActive);
    });
};

const initializePages = (mainInnerElem, menuContentElem) => {
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


    Promise.all([fetch(pagesDataPath).then((res) => res.json()), fetch(navDataPath).then((res) => res.json())])
        .then(([pagesData, navData]) => {
            const defaultPageURL = 'home';

            const loadPageFromURL = (isPopState = false) => {
                const currentPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;
                const pageData = pagesData[currentPageURL];

                if (!isPopState) {
                    // Обновляем историю только если это не popstate
                    window.history.pushState({ page: currentPageURL }, '', `?page=${currentPageURL}`);
                }

                showPage(pageData, currentPageURL, pageTitleElem, pageDescriptionElem, pageContentElem);
            };

            // Initial page loading
            const initialPageURL = new URL(window.location).searchParams.get('page') || defaultPageURL;
            window.history.replaceState({ page: initialPageURL }, '', `?page=${initialPageURL}`);
            loadPageFromURL(true);

            window.addEventListener('popstate', (event) => {
                const state = event.state;
                if (state && state.page) {
                    showPage(pagesData[state.page], state.page, pageTitleElem, pageDescriptionElem, pageContentElem);
                }
            });

            const navElem = createElement('nav', ['nav'])
            menuContentElem.appendChild(navElem);

            navData['nav-sections'].forEach((navSectionData) => {
                addNavSection(navSectionData, pagesData, navElem, pageTitleElem, pageDescriptionElem, pageContentElem);
            });
        })
        .catch((error) => {
            console.error('Error initializing pages or navigation:', error);
        });
};

export { initializePages };