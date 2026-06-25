# SERVER.PY - Clean local server with MIME override
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

# Override file extension mappings directly
Handler.extensions_map = {
    '': 'application/octet-stream',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
}

socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
