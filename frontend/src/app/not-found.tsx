import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.1]"
        style={{ background: "radial-gradient(circle, rgba(0,194,255,0.5) 0%, transparent 70%)", filter: "blur(90px)" }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="gradient-text float-y font-orbitron text-[26vw] font-bold leading-none tracking-tighter md:text-[13rem]"
          style={{ filter: "drop-shadow(0 0 40px rgba(0,194,255,0.25))" }}
        >
          404
        </h1>
        <h2 className="mt-2 font-orbitron text-2xl font-bold tracking-wide text-[var(--text-primary)] md:text-3xl">
          Sahifa topilmadi
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          Bu koordinatalar bo&apos;yicha hech nima yo&apos;q. Sahifa boshqa galaktikaga ko&apos;chgan yoki manzil noto&apos;g&apos;ri kiritilgan bo&apos;lishi mumkin.
        </p>
        <Link
          href="/"
          className="group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold text-[#04121f] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #00E0FF 0%, #00A6FF 55%, #0060FF 100%)", boxShadow: "0 8px 30px rgba(0,150,255,0.32)" }}
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}
