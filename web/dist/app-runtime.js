(function () {
    const config = window.STOCK_MONITOR_APP_CONFIG || {};
    const configApiBaseUrl = normalizeBase(config.API_BASE_URL || config.apiBaseUrl || "");
    const configWsBaseUrl = normalizeBase(config.WS_BASE_URL || config.wsBaseUrl || "");
    const localApiBaseUrl = normalizeBase(config.LOCAL_API_BASE_URL || config.localApiBaseUrl || "http://127.0.0.1:8000");
    const localWsBaseUrl = normalizeBase(config.LOCAL_WS_BASE_URL || config.localWsBaseUrl || "ws://127.0.0.1:8000/api/ws");
    const apiToken = String(config.API_TOKEN || config.apiToken || "").trim();
    const apiBaseUrl = isNativeApp() ? configApiBaseUrl : (isFilePreview() ? localApiBaseUrl : "");
    const wsBaseUrl = isNativeApp() ? configWsBaseUrl : (isFilePreview() ? localWsBaseUrl : "");

    function normalizeBase(value) {
        return String(value || "").trim().replace(/\/+$/, "");
    }

    function normalizePath(path) {
        const value = String(path || "");
        return value.startsWith("/") ? value : `/${value}`;
    }

    function joinBase(baseUrl, path) {
        const normalizedPath = normalizePath(path);
        if (!baseUrl) {
            return normalizedPath;
        }
        if (baseUrl.endsWith("/api/ws") && normalizedPath === "/api/ws") {
            return baseUrl;
        }
        if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
            return `${baseUrl}${normalizedPath.slice(4)}`;
        }
        return `${baseUrl}${normalizedPath}`;
    }

    function apiUrl(path) {
        return joinBase(apiBaseUrl, path);
    }

    function authHeaders(existingHeaders) {
        const headers = Object.assign({}, existingHeaders || {});
        if (apiToken) {
            headers["X-API-Token"] = apiToken;
        }
        return headers;
    }

    function fetchOptions(options) {
        const merged = Object.assign({}, options || {});
        merged.headers = authHeaders(merged.headers);
        return merged;
    }

    function appendQueryParam(url, key, value) {
        if (!value) {
            return url;
        }
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }

    function wsUrl(path) {
        let url;
        if (wsBaseUrl) {
            url = joinBase(wsBaseUrl, path || "/api/ws");
        } else if (apiBaseUrl) {
            url = apiUrl(path || "/api/ws").replace(/^http/i, "ws");
        } else {
            const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
            url = `${wsProtocol}://${window.location.host}${normalizePath(path || "/api/ws")}`;
        }
        return appendQueryParam(url, "token", apiToken);
    }

    function isNativeApp() {
        const capacitor = window.Capacitor;
        if (capacitor) {
            if (typeof capacitor.isNativePlatform === "function") {
                return capacitor.isNativePlatform();
            }
            if (typeof capacitor.getPlatform === "function") {
                const platform = capacitor.getPlatform();
                return platform === "android" || platform === "ios";
            }
        }
        return window.location.protocol === "capacitor:" ||
            (window.location.protocol === "https:" && window.location.hostname === "localhost" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || ""));
    }

    function isFilePreview() {
        return window.location.protocol === "file:";
    }

    function isLocalApp() {
        return isNativeApp() || isFilePreview();
    }

    function pageUrl(path) {
        const normalized = String(path || "index.html").replace(/^\/+/, "");
        return isLocalApp() ? normalized : `/${normalized}`;
    }

    function navigate(path) {
        window.location.href = pageUrl(path);
    }

    window.StockMonitorRuntime = {
        apiUrl,
        wsUrl,
        pageUrl,
        navigate,
        isLocalApp,
        isNativeApp,
        isFilePreview,
        apiBaseUrl,
        wsBaseUrl,
        apiToken,
        authHeaders,
        fetchOptions
    };
})();
