/**
 * Common functions and helpers
 */
export const App = {

    /**
     * Forming full url with provided path
     *
     * @param {string} path
     * @returns {string}
     */
    url (path = '') {
        if (/^https?:\/\//.exec(path)) {
            return path;
        }
        return location.origin + (path.substr(0, 1) == '/' ? '' : '/') + path;
    },

    /**
     * Returns CSRF token, if it exists on page
     *
     * @param {string} selector jQuery selector
     * @returns {string}
     */
    csrf (selector = "input[name='_token']") {
        let el = this.el(selector);
        return el ? el.value : '';
    },

    /**
     * Return DOM object by selector
     *
     * @param {string} selector
     * @return {Element}
     */
    el (selector) {
        return document.querySelector(selector);
    },

    // I prefer toggle objects visibility by using 'hidden' css class
    // instead of using 'style.display' property or jQuery methods

    /**
     * Hide object by 'hidden' CSS class
     *
     * @param {string} selector
     */
    hide (selector) {
        this.toggleVisibility(selector, false);
    },

    /**
     * Remove 'hidden' class on object
     *
     * @param selector
     */
    show (selector) {
        this.toggleVisibility(selector, true);
    },

    /**
     * Toggle object's visibility by 'hidden' CSS class
     *
     * @param selector
     * @param {boolean|null} show = null
     */
    toggleVisibility (selector, show = null) {
        let el = this.el(selector);
        if (!el) {
            console.warn('El "' + selector + '" not found to toggle visibility!');
            return;
        }
        if (show === null) {
            el.classList.toggle('hidden');
        } else if (show) {
            this.el(selector).classList.remove('hidden');
        } else {
            this.el(selector).classList.add('hidden');
        }
    },

    /**
     * Toggle visibility of content block and it's loader
     *
     * @param contentSelector
     * @param loaderSelector
     */
    toggleLoader (contentSelector, loaderSelector = '#loader') {
        this.toggleVisibility(loaderSelector);
        this.toggleVisibility(contentSelector);
    },

    /**
     * Checking event occurred in object screen coordinates
     *
     * @param event
     * @param object
     * @return boolean
     */
    eventOnElement (event, object) {
        let rect = object.getBoundingClientRect();
        return event.pageX >= rect.left
            && event.pageY >= rect.top
            && event.pageX <= rect.right
            && event.pageY <= rect.bottom;
    }
};

