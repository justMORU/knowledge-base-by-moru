export class ResourceManager {
    constructor() {
        this.cache = new Map();
    }

    async loadResource(config) {
        const {
            url,
            type = 'json',
            container = null,
            loadingText = 'Loading...',
            errorText = 'Failed to load resource'
        } = config;

        // Check cache
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        // Show loader if container provided
        const loader = container ? this._showLoader(container, loadingText) : null;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();

            let result;
            switch (type) {
                case 'json':
                    result = JSON.parse(content);
                    break;
                case 'css':
                    result = this._injectCSS(content, url);
                    break;
                case 'js':
                    result = await this._executeScript(content, url);
                    break;
                default:
                    result = content;
            }

            // Cache result
            this.cache.set(url, result);

            // Remove loader
            if (loader) loader.remove();

            return result;
        } catch (error) {
            if (container) {
                this._showError(container, errorText);
            }
            throw error;
        }
    }

    _injectCSS(css, url) {
        // Remove existing style with same URL
        const existingStyle = document.querySelector(`style[data-url="${url}"]`);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.setAttribute('data-url', url);
        style.textContent = css;
        document.head.appendChild(style);
    }

    async _executeScript(js, url) {
        // Remove existing script with same URL
        const existingScript = document.querySelector(`script[data-url="${url}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.setAttribute('data-url', url);
            script.type = 'module';
            script.textContent = js;

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error: ${url}`));

            document.body.appendChild(script);
        });
    }

    _showLoader(container, text) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="loader__spinner"></div>
            <div class="loader__text">${text}</div>
        `;
        container.appendChild(loader);
        return loader;
    }

    _showError(container, text) {
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = text;
        container.innerHTML = '';
        container.appendChild(error);
    }

    clearCache(url = null) {
        if (url) {
            this.cache.delete(url);
        } else {
            this.cache.clear();
        }
    }
};