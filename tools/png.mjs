// Minimal PNG encoder (RGBA, 8-bit) using Node's zlib. No dependencies.
// Used by the sprite generator so all pixel art is authored as data in-repo.
import { deflateSync } from 'node:zlib'

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Uint8Array} rgba  width*height*4
 * @returns {Buffer} PNG bytes
 */
export function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0 // deflate
  ihdr[11] = 0 // adaptive filtering
  ihdr[12] = 0 // no interlace

  // Raw scanlines, each prefixed with filter type 0.
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1,
    )
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** Parse "#rrggbb" or "#rrggbbaa" into [r,g,b,a]. */
export function hex(c) {
  const s = c.replace('#', '')
  const r = parseInt(s.slice(0, 2), 16)
  const g = parseInt(s.slice(2, 4), 16)
  const b = parseInt(s.slice(4, 6), 16)
  const a = s.length >= 8 ? parseInt(s.slice(6, 8), 16) : 255
  return [r, g, b, a]
}

/**
 * Render a char-grid sprite to RGBA using a palette map.
 * '.' (and ' ') are always transparent.
 */
export function render(grid, palette) {
  const h = grid.length
  const w = grid[0].length
  for (let y = 0; y < h; y++) {
    if (grid[y].length !== w) {
      throw new Error(
        `Row ${y} has width ${grid[y].length}, expected ${w}:\n"${grid[y]}"`,
      )
    }
  }
  const out = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = grid[y][x]
      if (ch === '.' || ch === ' ') continue
      const col = palette[ch]
      if (!col) throw new Error(`No palette entry for '${ch}' at ${x},${y}`)
      const [r, g, b, a] = hex(col)
      const i = (y * w + x) * 4
      out[i] = r
      out[i + 1] = g
      out[i + 2] = b
      out[i + 3] = a
    }
  }
  return { width: w, height: h, rgba: out }
}

/** Layer grids: later layers overwrite where not '.'. All must match size. */
export function compose(...grids) {
  const base = grids[0].map((r) => r.split(''))
  for (const g of grids.slice(1)) {
    if (g.length !== base.length) throw new Error('Layer height mismatch')
    for (let y = 0; y < g.length; y++) {
      if (g[y].length !== base[y].length) throw new Error(`Layer width mismatch at row ${y}`)
      for (let x = 0; x < g[y].length; x++) {
        const ch = g[y][x]
        if (ch !== '.' && ch !== ' ') base[y][x] = ch
      }
    }
  }
  return base.map((r) => r.join(''))
}

/** Nearest-neighbour upscale of an RGBA image (for preview sheets). */
export function upscale(img, factor) {
  const { width: w, height: h, rgba } = img
  const W = w * factor
  const H = h * factor
  const out = new Uint8Array(W * H * 4)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = Math.floor(x / factor)
      const sy = Math.floor(y / factor)
      const si = (sy * w + sx) * 4
      const di = (y * W + x) * 4
      out[di] = rgba[si]
      out[di + 1] = rgba[si + 1]
      out[di + 2] = rgba[si + 2]
      out[di + 3] = rgba[si + 3]
    }
  }
  return { width: W, height: H, rgba: out }
}

/** Blit src image onto dst at (dx,dy), simple alpha-over. */
export function blit(dst, src, dx, dy) {
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const tx = dx + x
      const ty = dy + y
      if (tx < 0 || ty < 0 || tx >= dst.width || ty >= dst.height) continue
      const si = (y * src.width + x) * 4
      const a = src.rgba[si + 3]
      if (a === 0) continue
      const di = (ty * dst.width + tx) * 4
      const sa = a / 255
      for (let c = 0; c < 3; c++) {
        dst.rgba[di + c] = Math.round(
          src.rgba[si + c] * sa + dst.rgba[di + c] * (1 - sa),
        )
      }
      dst.rgba[di + 3] = Math.max(dst.rgba[di + 3], a)
    }
  }
}

export function blank(width, height, fill) {
  const rgba = new Uint8Array(width * height * 4)
  if (fill) {
    const [r, g, b, a] = hex(fill)
    for (let i = 0; i < width * height; i++) {
      rgba[i * 4] = r
      rgba[i * 4 + 1] = g
      rgba[i * 4 + 2] = b
      rgba[i * 4 + 3] = a
    }
  }
  return { width, height, rgba }
}
