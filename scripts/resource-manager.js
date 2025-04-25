export class ResourceManager {
    constructor() {
        this.cache = new Map();
    }

    async loadResource({ url, type, container = null, loadingText = 'Loading...', errorText = 'Failed to load resource' }) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();

            switch (type) {
                case 'html':
                    return content;
                case 'json':
                    return JSON.parse(content);
                case 'css':
                    this._injectCSS(content, url);
                    return true;
                case 'js':
                    await this._executeScript(content, url);
                    return true;
                default:
                    return content;
            }
        } catch (error) {
            console.error(`Failed to load ${url}:`, error);
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

    _showError(container, message) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    clearCache(url = null) {
        if (url) {
            this.cache.delete(url);
        } else {
            this.cache.clear();
        }
    }
};