import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, urlsplit


ROOT = Path(__file__).resolve().parent
GALLERY_DIRS = ("nos-males", "nos-femelles", "mariages", "nos-chatons")
IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


class WebsiteHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path == "/galleries.json":
            self.send_gallery_manifest()
            return
        super().do_GET()

    def send_gallery_manifest(self):
        try:
            galleries = {
                folder: [
                    f"/{folder}/{quote(image.name)}"
                    for image in sorted(
                        (ROOT / folder).iterdir(),
                        key=lambda item: item.name.casefold(),
                    )
                    if image.is_file() and image.suffix.lower() in IMAGE_EXTENSIONS
                ]
                for folder in GALLERY_DIRS
            }
        except OSError as error:
            self.log_error("Could not read gallery folders: %s", error)
            self.send_error(500, "Could not read gallery folders")
            return

        body = json.dumps(galleries, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(ROOT)
    address = ("127.0.0.1", 8000)
    print(f"Site disponible sur http://localhost:{address[1]}")
    ThreadingHTTPServer(address, WebsiteHandler).serve_forever()
