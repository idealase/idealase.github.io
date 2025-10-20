(function(window) {
    'use strict';

    const memoryStore = new Map();
    const COOKIE_PREFIX = 'site_auth_';
    const DEFAULT_COOKIE_MAX_AGE = 2 * 60 * 60; // 2 hours

    function storageAvailable(type) {
        try {
            const storage = window[type];
            const testKey = '__storage_test__';
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn(`${type} is not available:`, error.message);
            return false;
        }
    }

    function setCookie(name, value, maxAgeSeconds) {
        const encodedValue = encodeURIComponent(value);
        const maxAge = typeof maxAgeSeconds === 'number' ? maxAgeSeconds : DEFAULT_COOKIE_MAX_AGE;
        document.cookie = `${COOKIE_PREFIX}${name}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    function getCookie(name) {
        const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_PREFIX}${name}=([^;]*)`));
        return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    }

    function removeCookie(name) {
        document.cookie = `${COOKIE_PREFIX}${name}=; path=/; max-age=0; SameSite=Lax`;
    }

    const sessionEnabled = storageAvailable('sessionStorage');
    const localEnabled = storageAvailable('localStorage');
    const cookiesEnabled = navigator.cookieEnabled === undefined ? true : navigator.cookieEnabled;

    function setItem(key, value, options = {}) {
        const { maxAgeSeconds = DEFAULT_COOKIE_MAX_AGE, allowMemory = false } = options;

        if (sessionEnabled) {
            try {
                window.sessionStorage.setItem(key, value);
                return { success: true, mode: 'sessionStorage' };
            } catch (error) {
                console.warn('sessionStorage setItem failed:', error.message);
            }
        }

        if (localEnabled) {
            try {
                window.localStorage.setItem(key, value);
                return { success: true, mode: 'localStorage' };
            } catch (error) {
                console.warn('localStorage setItem failed:', error.message);
            }
        }

        if (cookiesEnabled) {
            try {
                setCookie(key, value, maxAgeSeconds);
                return { success: true, mode: 'cookie' };
            } catch (error) {
                console.warn('Cookie storage failed:', error.message);
            }
        }

        if (allowMemory) {
            memoryStore.set(key, value);
            return { success: true, mode: 'memory' };
        }

        return { success: false, mode: 'none' };
    }

    function getItem(key) {
        if (sessionEnabled) {
            try {
                const value = window.sessionStorage.getItem(key);
                if (value !== null) {
                    return value;
                }
            } catch (error) {
                console.warn('sessionStorage getItem failed:', error.message);
            }
        }

        if (localEnabled) {
            try {
                const value = window.localStorage.getItem(key);
                if (value !== null) {
                    return value;
                }
            } catch (error) {
                console.warn('localStorage getItem failed:', error.message);
            }
        }

        if (cookiesEnabled) {
            try {
                const cookieValue = getCookie(key);
                if (cookieValue !== null) {
                    return cookieValue;
                }
            } catch (error) {
                console.warn('Cookie retrieval failed:', error.message);
            }
        }

        if (memoryStore.has(key)) {
            return memoryStore.get(key);
        }

        return null;
    }

    function removeItem(key) {
        let removed = false;

        if (sessionEnabled) {
            try {
                window.sessionStorage.removeItem(key);
                removed = true;
            } catch (error) {
                console.warn('sessionStorage removeItem failed:', error.message);
            }
        }

        if (localEnabled) {
            try {
                window.localStorage.removeItem(key);
                removed = true;
            } catch (error) {
                console.warn('localStorage removeItem failed:', error.message);
            }
        }

        if (cookiesEnabled) {
            try {
                removeCookie(key);
                removed = true;
            } catch (error) {
                console.warn('Cookie removal failed:', error.message);
            }
        }

        if (memoryStore.has(key)) {
            memoryStore.delete(key);
            removed = true;
        }

        return removed;
    }

    function setJSON(key, value, options = {}) {
        try {
            return setItem(key, JSON.stringify(value), options);
        } catch (error) {
            console.warn('Failed to serialize JSON for key', key, error.message);
            return { success: false, mode: 'none' };
        }
    }

    function getJSON(key, defaultValue = null) {
        const raw = getItem(key);
        if (!raw) {
            return defaultValue;
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            console.warn('Failed to parse JSON for key', key, error.message);
            return defaultValue;
        }
    }

    function clearKeys(keys) {
        keys.forEach(key => removeItem(key));
    }

    function getStatus() {
        return {
            sessionEnabled,
            localEnabled,
            cookiesEnabled,
            memoryFallbackActive: memoryStore.size > 0
        };
    }

    window.StorageUtils = {
        setItem,
        getItem,
        removeItem,
        setJSON,
        getJSON,
        clearKeys,
        getStatus,
        COOKIE_PREFIX
    };
})(window);
