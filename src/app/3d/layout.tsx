import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Career Journey & Driving Experience | Keerthan Nandigama",
  description:
    "Interactive 3D driving journey through Keerthan Nandigama's engineering career: Stony Brook University, NeoGrowth FinTech, CARS24 high-performance raceway, and Amazon AWS cloud engineering.",
};

export default function ThreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
