import { serve } from "https://deno.land/std/http/server.ts";


serve(async (_req) => {
    const url = new URL(_req.url, `http://${_req.headers.get("host")}`);
    const pathn = url.pathname;
    async function fileParse(_pathn: string){
        const filePath = `web${pathn}`;
            const file = await Deno.readFile(filePath);
            const contentType = getContentType(filePath);
            return new Response(file, {
                headers: { "Content-Type": contentType },
            });
    }
    try {
        if (pathn.startsWith("/img/")) {
            return await fileParse(pathn)
        } else if (pathn === "/css/style.css") { // Fixed condition
            return await fileParse(pathn)
        } else if (url.pathname === "/") {
            const html = await Deno.readTextFile("web/index.html");
            return new Response(html, {
                headers: { "Content-Type": "text/html" },
        });
        } else if (pathn.startsWith("/js/")) {
           return await fileParse(pathn)
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
    if (filePath.endsWith(".css")) return "text/js";
    return "application/octet-stream"; // Default content type
}