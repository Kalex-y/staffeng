import type { Metadata } from "next";
import EngineersClient from "./EngineersClient";

export const metadata: Metadata = {
  title: "Browse Engineers — staffeng.co",
  description: "Browse vetted staff engineers available for contract and full-time work.",
};

export default function EngineersPage() {
  return <EngineersClient />;
}
