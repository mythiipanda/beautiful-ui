import type { Metadata } from "next";
import DimeHarness from "@/components/site/DimeHarness";
import styles from "./scrollbars.module.css";

export const metadata: Metadata = {
  title: "Dime — NBA analytics harness",
  description:
    "Dime re-skinned on the Beautiful UI harness: an AI analyst workbench for NBA data.",
};

export default function DimePage() {
  return (
    <div className={styles.scope}>
      <DimeHarness />
    </div>
  );
}
