import { initializeSizeUpdates } from './resize-handler.js';
import { initializeHeaderBehavior } from './header.js';
import { initializeMenuBehavior } from './menu.js';
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

    initializePages(
        mainInnerElem,
        menuContentElem
    );
});
