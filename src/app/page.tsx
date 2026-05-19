export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-gradient-to-br from-[#0c0f1d] via-[#070814] to-[#020205] text-zinc-100 font-sans selection:bg-[#4f46e5]/40 selection:text-white overflow-hidden relative">
      {/* Decorative blurred glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-800/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-teal-500/10 to-indigo-800/20 blur-[150px] pointer-events-none" />

      {/* Header Section */}
      <div className="z-10 w-full max-w-5xl flex items-center justify-between border-b border-zinc-800/60 pb-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-lg text-white">
            L
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Loyalty Engine
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Decoupled Architecture System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Harness Ready
          </span>
        </div>
      </div>

      {/* Main Hero & Visual Architecture Flow */}
      <div className="z-10 w-full max-w-5xl my-auto py-12 flex flex-col gap-12">
        <div className="text-center md:text-left max-w-3xl flex flex-col gap-4">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
            Architected for <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              Infinite Scalability
            </span>
          </h2>
          <p className="text-lg text-zinc-400 font-normal leading-relaxed">
            Welcome to the new restructured codebase. By placing everything inside <code className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-indigo-300 font-mono text-sm border border-zinc-700/50">src/</code>, we separated representation layers from backend business logic. If your backend grows, simply extract the <code className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-emerald-300 font-mono text-sm border border-zinc-700/50">backend/</code> directory without changing a single line of React code.
          </p>
        </div>

        {/* Visual Decoupling Pipeline Card */}
        <div className="w-full rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 opacity-60" />
          
          <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Data Flow & Decoupling Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 hover:border-indigo-500/50 transition-all duration-300 group/step">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-2">Layer 1: View</span>
              <h4 className="font-bold text-sm text-white mb-1">React Pages</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Strictly representation. Components are modular and state-free.
              </p>
              <span className="mt-4 text-[10px] font-mono text-zinc-600 group-hover/step:text-indigo-300 transition-colors">
                src/app/admin/dashboard
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 hover:border-purple-500/50 transition-all duration-300 group/step">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider mb-2">Layer 2: State</span>
              <h4 className="font-bold text-sm text-white mb-1">Custom Hooks</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Orchestrates state, fetching, and local UI status.
              </p>
              <span className="mt-4 text-[10px] font-mono text-zinc-600 group-hover/step:text-purple-300 transition-colors">
                src/hooks/use-traffic
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 hover:border-pink-500/50 transition-all duration-300 group/step">
              <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-2">Layer 3: Router</span>
              <h4 className="font-bold text-sm text-white mb-1">API Hand-off</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Next.js routes parsing parameters and passing them to Controllers.
              </p>
              <span className="mt-4 text-[10px] font-mono text-zinc-600 group-hover/step:text-pink-300 transition-colors">
                src/app/api/traffic
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 hover:border-teal-500/50 transition-all duration-300 group/step">
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider mb-2">Layer 4: Controller</span>
              <h4 className="font-bold text-sm text-white mb-1">Backend Controller</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Isolated requests coordinator. Completely detached from Next.js.
              </p>
              <span className="mt-4 text-[10px] font-mono text-zinc-600 group-hover/step:text-teal-300 transition-colors">
                src/backend/controllers
              </span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 hover:border-emerald-500/50 transition-all duration-300 group/step">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-2">Layer 5: Business</span>
              <h4 className="font-bold text-sm text-white mb-1">Services & Models</h4>
              <p className="text-xs text-zinc-400 leading-normal">
                External APIs, AI pipelines, and raw DB query executions.
              </p>
              <span className="mt-4 text-[10px] font-mono text-zinc-600 group-hover/step:text-emerald-300 transition-colors">
                src/backend/services
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-zinc-400">
                Architecture fully initialized and verified with zero coupling.
              </span>
            </div>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/link"
            >
              Learn standard Next.js 16 conventions
              <span className="transform translate-x-0 group-hover/link:translate-x-1 transition-transform inline-block">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="z-10 w-full max-w-5xl border-t border-zinc-800/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Loyalty Engine. Engineered under strict SDD parameters.
        </p>
        <div className="flex gap-4">
          <span className="text-xs text-zinc-600 font-mono">tsconfig: @/* → ./src/*</span>
          <span className="text-xs text-zinc-600 font-mono">framework: Next.js 16.2 (App Router)</span>
        </div>
      </div>
    </main>
  );
}
