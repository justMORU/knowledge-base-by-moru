import { initializeSizeUpdates } from './resize-handler.js';
import { initializeHeaderBehavior } from './header.js';
import { initializeMenuBehavior } from './menu.js';
import { ResourceManager } from './resource-manager.js';
import { initializeNavigation } from './navigation-loader.js';
import { initializePages } from './page-loader.js';

document.addEventListener("DOMContentLoaded", () => {
    const resourceManager = new ResourceManager();

    const headerElem = document.querySelector('.header');
    const mainElem = document.querySelector('.main');
    const mainInnerElem = document.querySelector('.main__inner');
    const menuElem = document.querySelector('.menu');
    const menuContentElem = document.querySelector('.menu__content');
    const menuToggleElem = document.querySelector('.header__menu-toggle');
    const menuToggleOpenIconElem = document.querySelector('.header__menu-toggle-icon--open');
    const menuToggleCloseIconElem = document.querySelector('.header__menu-toggle-icon--close');

    const pagesPath = 'pages/';
    const configPath = 'config/';
    const pagesConfigPath = configPath + 'pages.json';
    const navigationConfigPath = configPath + 'navigation.json';

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

    (async () => {
        try {
            const pagesConfig = await resourceManager.loadResource({
                url: `${pagesConfigPath}`,
                type: 'json',
                loadingText: 'Loading pages configuration...',
                errorText: 'Failed to load pages configuration'
            });

            const navigationConfig = await resourceManager.loadResource({
                url: `${navigationConfigPath}`,
                type: 'json',
                loadingText: 'Loading navigation configuration...',
                errorText: 'Failed to load navigation configuration'
            });

            initializePages(
                pagesPath,
                pagesConfig,
                resourceManager,
                mainInnerElem
            );

            initializeNavigation(
                pagesConfig,
                pagesPath,
                navigationConfig,
                resourceManager,
                mainInnerElem,
                menuContentElem
            );
        } catch (error) {
            console.error('Application initialization failed:', error);
        }
    })();
});
