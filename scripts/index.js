import { initializeSizeUpdates } from './resize-handler.js';
import { initializeHeaderBehavior } from './header.js';
import { initializeMenuBehavior } from './menu.js';
import { createElement } from './components.js';
import { initializeNavigation } from './navigation-loader.js';
import { initializePages } from './page-loader.js';

document.addEventListener("DOMContentLoaded", () => {
    const headerElem = document.querySelector('.header');
    const mainElem = document.querySelector('.main');
    const mainInnerElem = document.querySelector('.main__inner');
    const menuElem = document.querySelector('.menu');
    const menuContentElem = document.querySelector('.menu__content');
    const menuToggleElem = document.querySelector('.header__menu-toggle');
    const menuToggleOpenIconElem = document.querySelector('.header__menu-toggle-icon--open');
    const menuToggleCloseIconElem = document.querySelector('.header__menu-toggle-icon--close');

    initializeSizeUpdates(
        headerElem,
        mainElem,
        mainInnerElem
    );

    initializeHeaderBehavior(headerElem, menuElem);

    initializeMenuBehavior(
        mainElem,
        menuToggleElem,
        menuToggleOpenIconElem,
        menuToggleCloseIconElem,
        menuElem
    );

    // Initialize pages
    const pagesPath = 'pages/';
    const dataPath = 'config/';
    const pagesDataPath = dataPath + 'pages.json';
    const navDataPath = dataPath + 'navigation.json';

    Promise.all([fetch(pagesDataPath).then((res) => res.json()), fetch(navDataPath).then((res) => res.json())])
        .then(([pagesData, navData]) => {
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

            initializePages(
                pagesPath,
                pagesData,
                pageTitleElem,
                pageDescriptionElem,
                pageContentElem
            );

            initializeNavigation(
                pagesData,
                navData,
                pagesPath,
                pageTitleElem,
                pageDescriptionElem,
                pageContentElem,
                menuContentElem
            );
        })
        .catch((error) => {
            console.error('Error initializing pages or navigation:', error);
        });
});
