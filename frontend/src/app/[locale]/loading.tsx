import { CosmicLoader } from "@/components/ui/CosmicLoader";

export default function LocaleLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <CosmicLoader size={42} />
        <p className="text-xs tracking-[0.2em] text-[var(--text-secondary)]">LOADING</p>
      </div>
    </div>
  );
}
