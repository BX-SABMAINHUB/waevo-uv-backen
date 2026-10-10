"use strict";

importScripts("/baremux/index.js");

const stockSW = "/uv/uv.sw.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
    if (
        location.protocol !== "https:" &&
        !swAllowedHostnames.includes(location.hostname)
    ) {
        throw new Error("Service workers cannot be registered without https.");
    }

    if (!navigator.serviceWorker) {
        throw new Error("Your browser doesn't support service workers.");
    }

    // Registrar el Service Worker de Ultraviolet
    await navigator.serviceWorker.register(stockSW, {
        scope: __uv$config.prefix,
    });

    // Conectar BareMux → Epoxy → Wisp
    const wispUrl =
        (location.protocol === "https:" ? "wss://" : "ws://") +
        location.host +
        "/wisp/";

    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
}

registerSW().catch((err) => {
    console.error("[Waevo] Error registrando SW:", err);
});
