"use client";

import { useState, useMemo } from "react";

export interface WifiInfoQrComponentProps {
  ssid: string;
  password?: string;
  security?: string;
  onCopy?: () => void;
}

// --- QR Generator Helper ---
const expTable = new Uint8Array(256);
const logTable = new Uint8Array(256);
let _x = 1;
for (let i = 0; i < 255; i++) {
  expTable[i] = _x;
  logTable[_x] = i;
  _x <<= 1;
  if (_x & 0x100) _x ^= 0x11d;
}

function mul(a: number, b: number) {
  return a === 0 || b === 0 ? 0 : expTable[(logTable[a] + logTable[b]) % 255];
}

function getRsPoly(ecLen: number) {
  let poly = [1];
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= mul(poly[j], expTable[i]);
    }
    poly = next;
  }
  return poly;
}

function rsDiv(data: number[], poly: number[]) {
  const msg = [...data, ...new Array(poly.length - 1).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 1; j < poly.length; j++) {
        msg[i + j] ^= mul(poly[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

function generateQrMatrix(text: string): boolean[][] {
  const configs = [
    { v: 3, ecLevel: 'M', dataBytes: 44, ecBytes: 26, align: 22, format: 0x5412 },
    { v: 4, ecLevel: 'L', dataBytes: 80, ecBytes: 20, align: 26, format: 0x77c4 },
    { v: 5, ecLevel: 'L', dataBytes: 108, ecBytes: 26, align: 30, format: 0x77c4 }
  ];
  
  let config = configs[0];
  for (const c of configs) {
    if (text.length + 2 <= c.dataBytes) {
      config = c;
      break;
    }
  }
  if (text.length + 2 > configs[2].dataBytes) {
    config = configs[2]; // fallback
  }
  
  const dataBits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) dataBits.push((val >>> i) & 1);
  };
  
  pushBits(4, 4);
  pushBits(text.length, 8);
  for (let i = 0; i < text.length; i++) pushBits(text.charCodeAt(i), 8);
  pushBits(0, 4);
  while (dataBits.length % 8 !== 0) dataBits.push(0);
  
  const pads = [0xec, 0x11];
  let pIdx = 0;
  while (dataBits.length < config.dataBytes * 8) {
    pushBits(pads[pIdx++ % 2], 8);
  }
  
  const dataBytesArr = [];
  for (let i = 0; i < config.dataBytes; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | dataBits[i * 8 + j];
    dataBytesArr.push(b);
  }
  
  const poly = getRsPoly(config.ecBytes);
  const ecBytesArr = rsDiv(dataBytesArr, poly);
  const finalBytes = [...dataBytesArr, ...ecBytesArr];
  
  const size = config.v * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(-1));
  const setM = (r: number, c: number, v: number) => { if (r >= 0 && r < size && c >= 0 && c < size) matrix[r][c] = v; };
  
  const drawFinder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        let v = 0;
        if (i === 0 || i === 6 || j === 0 || j === 6) v = 1;
        else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) v = 1;
        else if (i === -1 || i === 7 || j === -1 || j === 7) v = 0;
        setM(r + i, c + j, v);
      }
    }
  };
  drawFinder(0, 0); drawFinder(0, size - 7); drawFinder(size - 7, 0);
  
  const drawAlign = (r: number, c: number) => {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        setM(r + i, c + j, (i === -2 || i === 2 || j === -2 || j === 2 || (i === 0 && j === 0)) ? 1 : 0);
      }
    }
  };
  drawAlign(config.align, config.align);
  
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === -1) setM(6, i, i % 2 === 0 ? 1 : 0);
    if (matrix[i][6] === -1) setM(i, 6, i % 2 === 0 ? 1 : 0);
  }
  
  setM(size - 8, 8, 1);
  
  const fmt = config.format;
  for (let i = 0; i < 15; i++) {
    const bit = (fmt >> i) & 1;
    if (i < 6) setM(8, i, bit);
    else if (i < 8) setM(8, i + 1, bit);
    else setM(8, size - 15 + i, bit);
    
    if (i < 7) setM(size - 1 - i, 8, bit);
    else if (i < 9) setM(15 - i, 8, bit);
    else setM(15 - i - 1, 8, bit);
  }
  
  let bitIdx = 0;
  let up = true;
  for (let c = size - 1; c > 0; c -= 2) {
    if (c === 6) c--;
    for (let r = 0; r < size; r++) {
      const row = up ? size - 1 - r : r;
      for (let i = 0; i < 2; i++) {
        const col = c - i;
        if (matrix[row][col] === -1) {
          let bit = 0;
          if (bitIdx < finalBytes.length * 8) {
            bit = (finalBytes[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1;
            bitIdx++;
          }
          if ((row + col) % 2 === 0) bit ^= 1;
          setM(row, col, bit);
        }
      }
    }
    up = !up;
  }
  
  return matrix.map(row => row.map(cell => cell === 1));
}
// --- End QR Generator ---

export function WifiInfoQrComponent({
  ssid,
  password = "",
  security = "WPA",
  onCopy
}: WifiInfoQrComponentProps) {
  const [copied, setCopied] = useState(false);

  const qrString = `WIFI:S:${ssid};T:${security};P:${password};;`;
  
  const qrPath = useMemo(() => {
    const matrix = generateQrMatrix(qrString);
    const size = matrix.length;
    let path = "";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          path += `M${c},${r}h1v1h-1z`;
        }
      }
    }
    return { path, size };
  }, [qrString]);

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 shadow-2xl relative overflow-hidden group">
      {/* Visual Accent Lights */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 blur-[40px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-teal-500/20 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-indigo-500/20 group-hover:scale-110" />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
          Automatic Join
        </span>
        <h4 className="text-lg font-bold text-white tracking-tight">Wi-Fi Connection Gateway</h4>
        <p className="text-xs text-zinc-400 mt-1">Scan code below with your phone camera to connect</p>
      </div>

      {/* QR Code Container */}
      <div className="flex items-center justify-center p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl mb-6 relative group-hover:border-zinc-700/60 transition-all duration-300 z-10">
        <div className="w-48 h-48 bg-white rounded-xl p-3 flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <svg
            viewBox={`0 0 ${qrPath.size} ${qrPath.size}`}
            shapeRendering="crispEdges"
            className="w-full h-full"
            role="img"
          >
            <title>Wi-Fi Automatic Connection QR Code</title>
            <path d={qrPath.path} fill="#09090b" />
          </svg>
        </div>
      </div>

      {/* Connection Info */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-6 text-xs font-mono text-zinc-400 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">SSID:</span>
          <span className="text-zinc-100 font-bold tracking-tight">{ssid}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">SECURITY:</span>
          <span className="text-zinc-300">{security}</span>
        </div>
      </div>

      {/* Interactive Actions */}
      <button
        onClick={handleCopyCredentials}
        aria-label={copied ? "Wi-Fi password copied successfully" : "Copy Wi-Fi password to clipboard"}
        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 relative z-10 min-h-[48px] ${
          copied
            ? "bg-teal-500 text-zinc-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-[0.98]"
            : "bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-[1.02] shadow-lg shadow-black/20"
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied Password!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Password
          </>
        )}
      </button>
    </div>
  );
}

export const WifiQRComponent = WifiInfoQrComponent; // Fallback alias
