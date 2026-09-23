const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function makeCrcTable() {
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  return crcTable;
}

const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(rowSize * height);

  // Colors: Emerald-600 background (#059669), White cart (#FFFFFF), Light Mint checkmark (#6EE7B7)
  const bgR = 5, bgG = 150, bgB = 105;
  const whiteR = 255, whiteG = 255, whiteB = 255;
  const mintR = 110, mintG = 231, mintB = 183;

  const scale = width / 512;
  const cx = width / 2;
  const cy = height / 2;

  // Maskable icons need extra safe margin (central 80%)
  const iconScale = isMaskable ? 0.72 * scale : 0.88 * scale;

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pxOffset = y * rowSize + 1 + x * 4;
    // Simple alpha blending
    if (a === 255) {
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = 255;
    } else {
      const prevA = raw[pxOffset + 3] / 255;
      const alpha = a / 255;
      const outA = alpha + prevA * (1 - alpha);
      if (outA > 0) {
        raw[pxOffset] = Math.round((r * alpha + raw[pxOffset] * prevA * (1 - alpha)) / outA);
        raw[pxOffset + 1] = Math.round((g * alpha + raw[pxOffset + 1] * prevA * (1 - alpha)) / outA);
        raw[pxOffset + 2] = Math.round((b * alpha + raw[pxOffset + 2] * prevA * (1 - alpha)) / outA);
        raw[pxOffset + 3] = Math.round(outA * 255);
      }
    }
  }

  function drawThickLine(x0, y0, x1, y1, thickness, r, g, b) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(len * 2));
    const rad = thickness / 2;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const curX = x0 + dx * t;
      const curY = y0 + dy * t;
      const minX = Math.floor(curX - rad);
      const maxX = Math.ceil(curX + rad);
      const minY = Math.floor(curY - rad);
      const maxY = Math.ceil(curY + rad);

      for (let py = minY; py <= maxY; py++) {
        for (let px = minX; px <= maxX; px++) {
          const d = Math.hypot(px - curX, py - curY);
          if (d <= rad) {
            setPixel(px, py, r, g, b, 255);
          }
        }
      }
    }
  }

  function drawCircle(centerX, centerY, radius, r, g, b) {
    const minX = Math.floor(centerX - radius);
    const maxX = Math.ceil(centerX + radius);
    const minY = Math.floor(centerY - radius);
    const maxY = Math.ceil(centerY + radius);
    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const d = Math.hypot(px - centerX, py - centerY);
        if (d <= radius) {
          setPixel(px, py, r, g, b, 255);
        }
      }
    }
  }

  // 1. Fill background
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      setPixel(x, y, bgR, bgG, bgB, 255);
    }
  }

  // If not maskable, we can round the corners nicely (e.g. for apple-touch-icon or standard display)
  if (!isMaskable) {
    const cornerRadius = width * 0.22;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let isOutside = false;
        if (x < cornerRadius && y < cornerRadius) {
          if (Math.hypot(x - cornerRadius, y - cornerRadius) > cornerRadius) isOutside = true;
        } else if (x > width - cornerRadius && y < cornerRadius) {
          if (Math.hypot(x - (width - cornerRadius), y - cornerRadius) > cornerRadius) isOutside = true;
        } else if (x < cornerRadius && y > height - cornerRadius) {
          if (Math.hypot(x - cornerRadius, y - (height - cornerRadius)) > cornerRadius) isOutside = true;
        } else if (x > width - cornerRadius && y > height - cornerRadius) {
          if (Math.hypot(x - (width - cornerRadius), y - (height - cornerRadius)) > cornerRadius) isOutside = true;
        }
        if (isOutside) {
          const pxOffset = y * rowSize + 1 + x * 4;
          raw[pxOffset + 3] = 0; // transparent corner
        }
      }
    }
  }

  // Cart dimensions in 512 space, translated to center
  const ox = cx - 256 * iconScale;
  const oy = cy - 256 * iconScale;
  const mapPoint = (x, y) => [ox + x * iconScale, oy + y * iconScale];

  const strokeCart = Math.max(3, 26 * iconScale);
  const strokeCheck = Math.max(3, 24 * iconScale);

  // Cart handle & top rail
  const p1 = mapPoint(120, 150);
  const p2 = mapPoint(170, 150);
  const p3 = mapPoint(208, 334);
  const p4 = mapPoint(394, 334);
  const p5 = mapPoint(426, 196);
  const p6 = mapPoint(180, 196);

  drawThickLine(p1[0], p1[1], p2[0], p2[1], strokeCart, whiteR, whiteG, whiteB);
  drawThickLine(p2[0], p2[1], p3[0], p3[1], strokeCart, whiteR, whiteG, whiteB);
  drawThickLine(p3[0], p3[1], p4[0], p4[1], strokeCart, whiteR, whiteG, whiteB);
  drawThickLine(p4[0], p4[1], p5[0], p5[1], strokeCart, whiteR, whiteG, whiteB);
  drawThickLine(p5[0], p5[1], p6[0], p6[1], strokeCart, whiteR, whiteG, whiteB);

  // Wheels
  const w1 = mapPoint(218, 392);
  const w2 = mapPoint(384, 392);
  const wheelRadius = Math.max(3, 24 * iconScale);
  drawCircle(w1[0], w1[1], wheelRadius, whiteR, whiteG, whiteB);
  drawCircle(w2[0], w2[1], wheelRadius, whiteR, whiteG, whiteB);

  // Inner checkmark in light mint
  const c1 = mapPoint(252, 248);
  const c2 = mapPoint(288, 284);
  const c3 = mapPoint(356, 212);
  drawThickLine(c1[0], c1[1], c2[0], c2[1], strokeCheck, mintR, mintG, mintB);
  drawThickLine(c2[0], c2[1], c3[0], c3[1], strokeCheck, mintR, mintG, mintB);

  const idatData = zlib.deflateSync(raw, { level: 9 });
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.png'), createPng(48, 48, false));

console.log('Successfully generated all PWA icons in /public!');
