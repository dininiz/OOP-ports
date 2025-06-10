import { serve } from "https://deno.land/std/http/server.ts";

serve(async (_req) => {
    const url = new URL(_req.url, `http://${_req.headers.get("host")}`);
    try {
        if (url.pathname.startsWith("/img/")) {
            const filePath = `web${url.pathname}`;
            const file = await Deno.readFile(filePath);
            const contentType = getContentType(filePath);
            return new Response(file, {
                headers: { "Content-Type": contentType },
            });
        } else if (url.pathname === "/css/style.css") { // Fixed condition
            const css = await Deno.readTextFile("web/css/style.css");
            return new Response(css, {
                headers: { "Content-Type": "text/css" },
            });
        } else if (url.pathname === "/") {
            const html = await Deno.readTextFile("web/index.html");
            return new Response(html, {
                headers: { "Content-Type": "text/html" },
            });
        } else {
            return new Response("Not Found", { status: 404 });
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response("Error loading page", { status: 500 });
    }
}, { port: 8000 });

function getContentType(filePath: string): string {
    if (filePath.endsWith(".png")) return "image/png";
    if (filePath.endsWith(".svg")) return "image/svg+xml";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
    if (filePath.endsWith(".gif")) return "image/gif";
    if (filePath.endsWith(".css")) return "text/css";
    return "application/octet-stream"; // Default content type
}