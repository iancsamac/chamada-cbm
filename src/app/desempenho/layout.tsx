import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Desempenho CFSD",
    description: "Desempenho CFSD",
  };

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}