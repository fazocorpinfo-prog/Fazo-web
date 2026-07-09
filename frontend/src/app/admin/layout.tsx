import type { Metadata } from "next";
import "./admin.css";
import { Starfield } from "@/components/admin/Starfield";

export const metadata: Metadata = {
  title: "FAZO Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <Starfield />
      <div className="admin-ambient" aria-hidden />
      <div className="admin-noise" aria-hidden />
      {children}
    </div>
  );
}
