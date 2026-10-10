import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hostname } from "node:os";
import { createServer } from "node:http";
import express from "express";
import wisp from "wisp-server-node";

import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "..", "public");

const app = express();

// ── Archivos estáticos ──
app.use(express.static(PUBLIC_DIR));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// ── 404 ──
app.use((req, res) => {
    res.status(404);
    res.sendFile(join(PUBLIC_DIR, "404.html"), (err) => {
        if (err) {
            res.type("text/plain").send("404 - Not Found");
        }
    });
});

// ── Servidor HTTP ──
const server = createServer();

server.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    app(req, res);
});

// ── WebSocket para Wisp / Epoxy ──
server.on("upgrade", (req, socket, head) => {
    const url = req.url || "";
    if (url.startsWith("/wisp/") || url === "/wisp") {
        wisp.routeRequest(req, socket, head);
        return;
    }
    socket.end();
});

// ── Puerto ──
let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

server.on("listening", () => {
    const address = server.address();
    console.log("✅ Waevo UV Backend escuchando:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
});

// ── Shutdown limpio ──
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("Cerrando servidor...");
    server.close();
    process.exit(0);
}

server.listen({ port });
