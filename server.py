import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent


if __name__ == "__main__":
    os.chdir(ROOT)
    address = ("127.0.0.1", 8000)
    print(f"Site disponible sur http://localhost:{address[1]}")
    ThreadingHTTPServer(address, SimpleHTTPRequestHandler).serve_forever()
