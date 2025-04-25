const updateSizes = (header, main, mainInner) => {
    const viewportHeight = window.innerHeight;
    const headerHeight = header.offsetHeight;

    main.style.paddingTop = `${headerHeight}px`;
    mainInner.style.minHeight = `${viewportHeight - headerHeight}px`;
};

export const initializeSizeUpdates = (header, main, mainInner) => {
    updateSizes(header, main, mainInner);
    window.addEventListener('resize', () => updateSizes(header, main, mainInner));
    window.addEventListener('orientationchange', () => updateSizes(headerElem, mainElem, mainInnerElem));
};
