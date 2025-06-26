import { serve } from "https://deno.land/std/http/server.ts";

abstract class FilePath {
    filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    abstract getContentType(): string;
}

class ImageFilePath extends FilePath {
    getContentType(): string {
        if (this.filePath.endsWith(".png")) return "image/png";
        if (this.filePath.endsWith(".svg")) return "image/svg+xml";
        if (this.filePath.endsWith(".jpg") || this.filePath.endsWith(".jpeg")) return "image/jpeg";
        if (this.filePath.endsWith(".gif")) return "image/gif";
        return "application/octet-stream";
    }
}

class CssFilePath extends FilePath {
    getContentType(): string {
        return "text/css";
    }
}

class JsFilePath extends FilePath {
    getContentType(): string {
        return "application/javascript";
    }
}

class DefaultFilePath extends FilePath {
    getContentType(): string {
        return "application/octet-stream";
    }
}

function createFilePath(pathn: string): FilePath {
    if (pathn.startsWith("/img/")) return new ImageFilePath(`web${pathn}`);
    if (pathn === "/css/style.css") return new CssFilePath(`web${pathn}`);
    if (pathn.startsWith("/js/")) return new JsFilePath(`web${pathn}`);
    return new DefaultFilePath(`web${pathn}`);
}


serve(async (_req) => {
    const url = new URL(_req.url, `http://${_req.headers.get("host")}`);
    const pathn = url.pathname;

    async function fileParse(_pathn: string) {
        const fileObj = createFilePath(_pathn);
        const file = await Deno.readFile(fileObj.filePath);
        const contentType = fileObj.getContentType();
        return new Response(file, {
            headers: { "Content-Type": contentType },
        });
    }
    try {
        if (pathn.startsWith("/img/")) {
            return await fileParse(pathn)
        } else if (pathn === "/css/style.css") { 
            return await fileParse(pathn)
        } else if (url.pathname === "/") {
            const html = await Deno.readTextFile("web/index.html");
            return new Response(html, {
                headers: { "Content-Type": "text/html" },
        });
        } else if (pathn.startsWith("/js/")) {
           return await fileParse(pathn)
        } else if (_req.method === "POST" && url.pathname === "/save-path") {
            const body = await _req.json();
            await Deno.writeTextFile("saved_path.json", JSON.stringify(body.path));
            return new Response("Path saved", { status: 200 });
        } else{
            return new Response("Not Found", { status: 404 });
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response("Error loading page", { status: 500 });
    }
}, { port: 8000 });

