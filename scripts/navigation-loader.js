import { createElement, createLoader } from './components.js';
import { showPage } from './page-loader.js';

const addNavSection = (navSectionData, pagesPath, pagesData, navElem, pageTitleElem, pageDescriptionElem, pageContentElem) => {

    const navSectionElem = createElement('div', ['nav__section']);
    const navSectionHeaderElem = createElement('div', ['nav__section-header']);
    const navSectionTitleElem = createElement('p', ['nav__section-title']);
    navSectionTitleElem.textContent = navSectionData.title;
    const navSectionIndicatorElem = createElement('img', ['nav__section-indicator'], {
        src: 'assets/icons/dropdown-arrow-24.svg',
        alt: 'toggle',
    });
    const navSectionContentElem = createElement('div', ['nav__section-content']);
    const navSectionContentInnerElem = createElement('ol', ['nav__section-content-inner']);

    navElem.appendChild(navSectionElem);
    navSectionElem.appendChild(navSectionHeaderElem);
    navSectionHeaderElem.appendChild(navSectionTitleElem);
    navSectionHeaderElem.appendChild(navSectionIndicatorElem);
    navSectionElem.appendChild(navSectionContentElem);
    navSectionContentElem.appendChild(navSectionContentInnerElem);

    navSectionData.pages.forEach((pageURL) => {
        const navLink = createElement('li', ['nav__section-link']);
        if (pageURL && pagesData[pageURL]) {
            navLink.textContent = pagesData[pageURL].title;
            navLink.addEventListener('click', () => {
                showPage(pagesPath, pagesData[pageURL], pageURL, pageTitleElem, pageDescriptionElem, pageContentElem);
            });
        } else {
            navLink.classList.add('inactive');
            navLink.textContent = 'Nothing yet';
        }
        navSectionContentInnerElem.appendChild(navLink);
    });

    navSectionHeaderElem.addEventListener('click', () => {
        const isActive = navSectionContentElem.classList.toggle('active');
        navSectionContentElem.style.height = isActive ? `${navSectionContentInnerElem.offsetHeight}px` : '0';
        navSectionIndicatorElem.classList.toggle('active', isActive);
    });
};

const initializeNavigation = (pagesData, navData, pagesPath, pageTitleElem, pageDescriptionElem, pageContentElem, menuContentElem) => {
    menuContentElem.innerHTML = '';
    const loader = createLoader();
    menuContentElem.appendChild(loader);

    const navElem = createElement('nav', ['nav'])
    menuContentElem.appendChild(navElem);

    // Add sections with a delay for animation
    Promise.all(navData['nav-sections'].map((section, index) => {
        return new Promise(resolve => {
            setTimeout(() => {
                addNavSection(section, pagesPath, pagesData, navElem, pageTitleElem, pageDescriptionElem, pageContentElem);
                resolve();
            }, index * 10);
        });
    })).then(() => {
        // Delete loader
        menuContentElem.innerHTML = '';
        menuContentElem.appendChild(navElem);
    });
}

export { initializeNavigation }