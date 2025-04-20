const initializeHeaderBehavior = (headerElem, menuElem) => {
    const root = document.documentElement;
    let headerHeight = headerElem.offsetHeight;
    let lastScrollY = window.scrollY;
    let isHeaderHidden = false;

    root.style.setProperty('--header-height', `${headerHeight}px`);

    const showHeader = () => {
        headerElem.style.transform = 'translateY(0)';
        menuElem.style.transform = 'translateY(0)';
        isHeaderHidden = false;
    };

    const hideHeader = () => {
        headerElem.style.transform = `translateY(-${headerHeight}px)`;
        menuElem.style.transform = `translateY(-${headerHeight}px)`;
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
};

export { initializeHeaderBehavior };