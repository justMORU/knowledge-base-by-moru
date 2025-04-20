let isOnSmallScreen;
let isMenuOpened = sessionStorage.getItem('isMenuOpened') === 'true';

const setDefaultMenuToggleIconPos = (closeIcon, openIcon) => {
    if (isMenuOpened) {
        closeIcon.style.transform = 'translateX(0)';
        openIcon.style.transform = 'translateX(0)';
    } else {
        closeIcon.style.transform = 'translateX(-100%)';
        openIcon.style.transform = 'translateX(-100%)';
    }
}

const openMenu = (main, openIcon, closeIcon, menu) => {
    menu.style.left = '0';
    openIcon.style.transform = 'translateX(0)';
    closeIcon.style.transform = 'translateX(0)';

    if (isOnSmallScreen) {
        main.style.paddingLeft = '0'; // on small screens
    } else {
        main.style.paddingLeft = menu.offsetWidth  + 'px'; // on big screens
    }

    isMenuOpened = true;
}

const closeMenu = (main, openIcon, closeIcon, menu) => {
    menu.style.left = -menu.offsetWidth + 'px';
    openIcon.style.transform = 'translateX(-100%)';
    closeIcon.style.transform = 'translateX(-100%)';

    main.style.paddingLeft = '0';

    isMenuOpened = false;
}

const toggleDefaultMenuPos = (main, openIcon, closeIcon, menu) => {
    isOnSmallScreen = document.documentElement.clientWidth > 1000 ? false : true;

    if (sessionStorage.getItem('isMenuOpened') === null) {
        isMenuOpened = isOnSmallScreen ? true : false;

        sessionStorage.setItem('isMenuOpened', isMenuOpened);
    } else {
        isMenuOpened = sessionStorage.getItem('isMenuOpened') === 'true';
    }

    setDefaultMenuToggleIconPos(closeIcon, openIcon);

    if (isMenuOpened) {
        openMenu(main, openIcon, closeIcon, menu);
    } else {
        closeMenu(main, openIcon, closeIcon, menu);
    }
}

const toggleMenu = (main, openIcon, closeIcon, menu) => {
    if (isMenuOpened) {
        closeMenu(main, openIcon, closeIcon, menu);
    } else {
        openMenu(main, openIcon, closeIcon, menu);
    }

    sessionStorage.setItem('isMenuOpened', isMenuOpened);
}

const initializeMenuBehavior = (main, toggle, openIcon, closeIcon, menu) => {
    toggleDefaultMenuPos(
        main,
        openIcon,
        closeIcon,
        menu
    );

    window.addEventListener('resize', () => {
        toggleDefaultMenuPos(
            main,
            openIcon,
            closeIcon,
            menu
        );
    });

    toggle.addEventListener('click', () => {
        toggleMenu(
            main,
            openIcon,
            closeIcon,
            menu
        );
    });
};

export { initializeMenuBehavior };