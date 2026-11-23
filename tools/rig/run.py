#!/usr/bin/env python3
"""The shared rig's launcher for machines that have Python and no PowerShell.

It does what serve.ps1 and run.ps1 do on Windows, route for route, and nothing else: the scenarios, the fake
Firebase, the helpers and the bridge are the same files both launchers serve.

    python3 -I run.py --suite <name> --tree <folder holding index.html> --label <name> --out <log file>
                      [--rig-dir <folder holding driver.html>] [--chrome <path>] [--timeout 900]

--suite names a file in scenarios/ (fb-1a runs scenarios/fb-1a.js). Exit code: 0 when the suite's last summary
line reads "0 failed" and the run was not stopped; 1 when a check failed or the run stopped; 2 when the page
never printed RIG-DONE.

The contract with the page is in README.md ("The contract between a launcher and the page"). In short:
port 8800 serves the driver page; ports 8801..8806 serve the tree, one port per "device", so each device is its
own origin and keeps its own localStorage. The three vendored Firebase scripts are answered with the fake
(app-compat) or an empty script; index.html alone gets a Content-Security-Policy (only its own origin may be
fetched) and two script tags straight after <head> (bridge.js, helpers-guard.js). POST /__rig/log appends the
driver's lines to --out. Chrome runs headless with a fresh profile; the run ends at the driver's RIG-DONE line.
Standard library only. Downloads nothing.
"""
import argparse, datetime, os, re, shutil, subprocess, sys, tempfile, threading, time, urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORTS = range(8800, 8807)
TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
         '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
         '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
         '.webmanifest': 'application/manifest+json', '.md': 'text/markdown; charset=utf-8'}
CSP = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:"
INJECT = b'<head><script src="/__rig/bridge.js"></script><script src="/__rig/helpers-guard.js"></script>'
LOCK = threading.Lock()


def handler(root, rig_dir, out):
    root, rig_dir = os.path.realpath(root), os.path.realpath(rig_dir)

    class H(BaseHTTPRequestHandler):
        protocol_version = 'HTTP/1.0'

        def log_message(self, *a):
            pass

        def send(self, body, ctype, status=200, extra=None):
            self.send_response(status)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(body)

        def do_POST(self):
            path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
            body = self.rfile.read(int(self.headers.get('Content-Length') or 0))
            if path == '/__rig/log':
                with LOCK:
                    with open(out, 'ab') as f:
                        f.write(body)
                self.send(b'ok', 'text/plain')
            else:
                self.send(b'', 'text/plain', 404)

        def do_GET(self):
            path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
            port = self.server.server_address[1]
            if path == '/' and port == 8800:
                path = '/__rig/driver.html'
            if path == '/':
                path = '/index.html'
            if '/vendor/firebase/' in path:
                if 'firebase-app-compat' in path:
                    with open(os.path.join(rig_dir, 'fake-firebase.js'), 'rb') as f:
                        self.send(f.read(), TYPES['.js'])
                else:
                    self.send(b'/* rig */', TYPES['.js'])
                return
            base = root
            if path.startswith('/__rig/'):
                base, path = rig_dir, path[6:]
            full = os.path.realpath(os.path.join(base, path.lstrip('/')))
            if not (full == base or full.startswith(base + os.sep)) or not os.path.isfile(full):
                self.send(b'', 'text/plain', 404)
                return
            with open(full, 'rb') as f:
                body = f.read()
            extra = None
            if base == root and path == '/index.html':
                extra = {'Content-Security-Policy': CSP}
                i = body.index(b'<head>')
                body = body[:i] + INJECT + body[i + 6:]
            self.send(body, TYPES.get(os.path.splitext(full)[1].lower(), 'application/octet-stream'), 200, extra)

    return H


def find_chrome(given):
    for c in ([given] if given else []) + ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
                                             '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']:
        p = c if os.path.isfile(c) else shutil.which(c)
        if p:
            return p
    sys.exit('no Chrome found: pass --chrome <path>')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--suite', required=True)
    ap.add_argument('--tree', required=True)
    ap.add_argument('--label', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--rig-dir', default=os.path.dirname(os.path.abspath(__file__)))
    ap.add_argument('--chrome', default='')
    ap.add_argument('--timeout', type=int, default=900)
    a = ap.parse_args()
    if not os.path.isfile(os.path.join(a.tree, 'index.html')):
        sys.exit('--tree must hold index.html')
    open(a.out, 'wb').close()
    H = handler(a.tree, a.rig_dir, a.out)
    servers = [ThreadingHTTPServer(('127.0.0.1', p), H) for p in PORTS]
    for s in servers:
        s.daemon_threads = True
        threading.Thread(target=s.serve_forever, daemon=True).start()
    prof = tempfile.mkdtemp(prefix='praxis-rig-')
    url = 'http://localhost:8800/__rig/driver.html?suite=' + urllib.parse.quote(a.suite) + '&label=' + urllib.parse.quote(a.label)
    flags = ['--headless=new', '--user-data-dir=' + prof, '--no-first-run', '--no-default-browser-check',
             '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
             '--disable-backgrounding-occluded-windows', '--window-size=1400,900']
    if hasattr(os, 'geteuid') and os.geteuid() == 0:
        flags.append('--no-sandbox')   # Chrome refuses to start as root without it
    chrome = subprocess.Popen([find_chrome(a.chrome)] + flags + [url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    t0, done = time.time(), False
    while time.time() - t0 < a.timeout:
        time.sleep(2)
        with open(a.out, 'rb') as f:
            if b'RIG-DONE' in f.read():
                done = True
                break
    secs = int(time.time() - t0)
    chrome.terminate()
    try:
        chrome.wait(timeout=10)
    except subprocess.TimeoutExpired:
        chrome.kill()
    for s in servers:
        s.shutdown()
    shutil.rmtree(prof, ignore_errors=True)
    with open(a.out, 'ab') as f:
        if not done:
            f.write(('\nRUNNER: no RIG-DONE within %d s\n' % a.timeout).encode())
        f.write(('RUNNER: %s took %d s, %s\n' % (a.label, secs, datetime.datetime.now().strftime('%Y-%m-%d %H:%M'))).encode())
    with open(a.out, 'rb') as f:
        text = f.read().decode('utf-8', 'replace')
    sums = re.findall(r'(?m)^.*: (\d+) / (\d+) passed, (\d+) failed(.*)$', text)
    clean = done and bool(sums) and sums[-1][2] == '0' and 'STOPPED' not in sums[-1][3]
    print('done: %s in %d s -> %s%s' % (a.label, secs, a.out, '' if clean else '   (NOT clean)'))
    sys.exit(0 if clean else (1 if done else 2))


if __name__ == '__main__':
    main()
