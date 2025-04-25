import { createElement } from './components.js';
import { showPage } from './page-loader.js';

const addNavSection = (pagesConfig, pagesPath, navSectionConfig, resourceManager, navElem, mainInnerElem) => {
    const navSectionElem = createElement('div', ['nav__section']);
    const navSectionHeaderElem = createElement('div', ['nav__section-header']);
    const navSectionTitleElem = createElement('p', ['nav__section-title']);
    navSectionTitleElem.textContent = navSectionConfig.title;
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

    navSectionConfig['pages'].forEach((pageURL) => {
        const navLink = createElement('li', ['nav__section-link']);
        if (pageURL && pagesConfig[pageURL]) {
            navLink.textContent = pagesConfig[pageURL]['title'];
            navLink.addEventListener('click', () => {
                showPage(pagesConfig[pageURL], pagesPath, pageURL, resourceManager, mainInnerElem);
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

export const initializeNavigation = (pagesConfig, pagesPath, navigationConfig, resourceManager, mainInnerElem, menuContentElem) => {
    const navElem = createElement('nav', ['nav'])
    menuContentElem.appendChild(navElem);

    navigationConfig['nav-sections'].forEach(navSectionConfig => {
        addNavSection(pagesConfig, pagesPath, navSectionConfig, resourceManager, navElem, mainInnerElem);
    });
};