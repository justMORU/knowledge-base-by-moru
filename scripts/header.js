export const initializeHeaderBehavior = (headerElem, menuElem) => {
    let lastScrollY = window.scrollY;
    let isHeaderHidden = false;
    let headerHeight = headerElem.offsetHeight;

    const updateHeaderHeight = () => {
        headerHeight = headerElem.offsetHeight;
    };

    const showHeader = () => {
        headerElem.style.top = '0';
        menuElem.style.top = `${headerHeight}px`;
        isHeaderHidden = false;
    };

    const hideHeader = () => {
        headerElem.style.top = `${-headerHeight}px`;
        menuElem.style.top = '0';
        isHeaderHidden = true;
    };

    const updateHeaderPosition = () => {
        const scrollY = window.scrollY;

        if (scrollY > headerHeight) {
            if (scrollY > lastScrollY && !isHeaderHidden) {
                hideHeader();
            } else if (scrollY < lastScrollY && isHeaderHidden) {
                showHeader();
            }

            lastScrollY = scrollY;
        }
    };

    const setDefaultHeaderPosition = () => {
        if (window.scrollY > headerHeight) {
            hideHeader();
        } else {
            showHeader();
        }
    };

    setDefaultHeaderPosition();

    window.addEventListener('scroll', updateHeaderPosition);
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('resize', setDefaultHeaderPosition);
};