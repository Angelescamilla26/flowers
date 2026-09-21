'use strict';

// A dependency-free preview server. Run with: node dev-server.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');

const root = fs.realpathSync(__dirname);
const port = 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg'
};

function insideRoot(filename) {
  const relative = path.relative(root, filename);
  return relative !== '' && relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function respond(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(message);
}

function parseByteRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size === 0) return null;

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) ||
      start >= size || requestedEnd < start) return null;
  return { start, end: Math.min(requestedEnd, size - 1) };
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    respond(res, 405, 'Method not allowed');
    return;
  }

  try {
    let pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    if (!pathname.startsWith('/') || /[\\\0:]/.test(pathname)) {
      respond(res, 400, 'Invalid path');
      return;
    }
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.'))) {
      respond(res, 404, 'Not found');
      return;
    }
    if (pathname === '/') pathname = '/index.html';
    const filename = path.resolve(root, `.${pathname}`);
    const contentType = types[path.extname(filename).toLowerCase()];
    if (!insideRoot(filename) || !contentType) {
      respond(res, 404, 'Not found');
      return;
    }

    const realFilename = await fs.promises.realpath(filename);
    if (!insideRoot(realFilename)) {
      respond(res, 404, 'Not found');
      return;
    }
    const stat = await fs.promises.stat(realFilename);
    if (!stat.isFile()) {
      respond(res, 404, 'Not found');
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    };
    let byteRange;
    if (contentType === 'audio/mpeg') {
      headers['Accept-Ranges'] = 'bytes';
      if (req.headers.range !== undefined) {
        byteRange = parseByteRange(req.headers.range, stat.size);
        if (!byteRange) {
          res.writeHead(416, {
            ...headers,
            'Content-Length': 0,
            'Content-Range': `bytes */${stat.size}`
          });
          res.end();
          return;
        }
        headers['Content-Range'] = `bytes ${byteRange.start}-${byteRange.end}/${stat.size}`;
        headers['Content-Length'] = byteRange.end - byteRange.start + 1;
      }
    }

    res.writeHead(byteRange ? 206 : 200, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    pipeline(fs.createReadStream(realFilename, byteRange || undefined), res, error => {
      if (error && !res.destroyed) res.destroy(error);
    });
  } catch (error) {
    if (!res.headersSent) respond(res, error instanceof URIError ? 400 : 404, 'Not found');
    else res.destroy(error);
  }
});

server.on('error', error => {
  console.error(`Preview server: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Garden preview: http://localhost:${port}`);
});
