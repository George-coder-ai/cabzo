import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export const MapApiKeyModal = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#111827] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
              Geographical Map API Guide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            How to Extract & Add Your Map API Keys
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Cabzo uses OpenStreetMap & OSRM with dark inversion out-of-the-box (zero watermark, 100% free). You can also link your custom Mapbox or Carto credentials below.
          </p>
        </div>

        {/* Option 1: Mapbox (Recommended for High-Res Dark Maps) */}
        <div className="bg-[#1E293B] border border-brand-cyan/30 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan font-bold text-xs">
                MB
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Mapbox Access Token
                  <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full font-semibold">
                    Recommended (50k Free Loads/mo)
                  </span>
                </h3>
                <p className="text-[11px] text-brand-muted">Studio dark vectors, street labels & 3D buildings</p>
              </div>
            </div>

            <a
              href="https://account.mapbox.com/auth/signup/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-brand-cyan hover:underline"
            >
              <span>mapbox.com</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5 pl-1">
            <li>Go to <a href="https://account.mapbox.com" target="_blank" rel="noreferrer" className="text-brand-cyan underline">mapbox.com</a> and sign up or log in.</li>
            <li>From your main dashboard, navigate to the <strong className="text-white">Tokens</strong> section.</li>
            <li>Copy your <strong className="text-white">Default public token</strong> (starts with <code className="text-brand-cyan bg-black/40 px-1 rounded">pk.eyJ...</code>).</li>
            <li>Paste it into your <code className="text-white bg-black/40 px-1 rounded">.env</code> file:</li>
          </ol>

          <div className="flex items-center justify-between bg-[#0B0F17] p-2.5 rounded-xl border border-white/10 font-mono text-xs text-brand-cyan">
            <span className="truncate pr-2">VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ123...</span>
            <button
              onClick={() => handleCopy('VITE_MAPBOX_ACCESS_TOKEN=your_token_here', 'mapbox')}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#1E293B] hover:bg-[#2A3B54] text-white text-[10px] shrink-0"
            >
              {copiedKey === 'mapbox' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedKey === 'mapbox' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Option 2: CartoDB Basemaps API Key */}
        <div className="bg-[#1E293B] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-xs">
                CD
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">CartoDB Dark Matter Key</h3>
                <p className="text-[11px] text-brand-muted">Removes the "API KEY REQUIRED" watermark from Carto tiles</p>
              </div>
            </div>

            <a
              href="https://carto.com/signup"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-brand-orange hover:underline"
            >
              <span>carto.com</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1.5 pl-1">
            <li>Create an account at <a href="https://carto.com" target="_blank" rel="noreferrer" className="text-brand-orange underline">carto.com</a>.</li>
            <li>Go to <strong className="text-white">Settings &rarr; Developers &rarr; API Keys</strong>.</li>
            <li>Copy your <strong className="text-white">Master API Key</strong>.</li>
            <li>Add it to your <code className="text-white bg-black/40 px-1 rounded">.env</code>:</li>
          </ol>

          <div className="flex items-center justify-between bg-[#0B0F17] p-2.5 rounded-xl border border-white/10 font-mono text-xs text-brand-orange">
            <span className="truncate pr-2">VITE_CARTO_API_KEY=your_carto_key_here</span>
            <button
              onClick={() => handleCopy('VITE_CARTO_API_KEY=your_carto_key_here', 'carto')}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#1E293B] hover:bg-[#2A3B54] text-white text-[10px] shrink-0"
            >
              {copiedKey === 'carto' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedKey === 'carto' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Option 3: Built-in OpenStreetMap (Active Now with 0 Watermarks) */}
        <div className="bg-[#0B0F17] border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-white">Active Built-in Zero-Key Solution</h4>
            <p className="text-brand-muted">
              We have configured high-contrast dark OpenStreetMap tiles and real OSRM road geometry routing. You can book rides and navigate between any two places immediately without needing any key!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#0B0F17] font-bold text-xs tracking-wide shadow-glow-cyan transition-all"
        >
          Got It, Back to Booking
        </button>
      </div>
    </div>
  );
};
