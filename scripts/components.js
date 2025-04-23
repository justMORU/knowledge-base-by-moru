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

const createElement = (tag, classNames = [], attributes = {}) => {
    const element = document.createElement(tag);
    classNames.forEach((className) => element.classList.add(className));
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
};

const createLoader = () => {
    const container = createElement('div', ['loader-container']);
    const loader = createElement('div', ['loader']);
    container.appendChild(loader);
    return container;
};

export { loadResource, cleanupOldResources, createElement, createLoader };