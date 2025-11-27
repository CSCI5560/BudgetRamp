import { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";

/**
 * Hook responsibilities:
 * 1. Load ML stats from Supabase (fraud_accuracy, rmse, recall etc.)
 * 2. Make the dashboard stable (never undefined errors)
 * 3. DO NOT load ONNX models inside dashboard — Vite cannot load WASM here
 */
export default function useMLModels() {
  const [mlStats, setMLStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMLStats();
  }, []);

  /** --------------------------
   *  LOAD ML STATS FROM SUPABASE
   * -------------------------- */
  async function loadMLStats() {
    try {
      // table: ml_stats
      // columns: fraud_accuracy, fraud_recall, spending_rmse, updated_at
      const { data, error } = await supabase
        .from("ml_stats")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      setMLStats(data?.[0] || null);
    } catch (err) {
      console.error("Failed to load ML stats:", err);
      setMLStats(null);
    } finally {
      setLoading(false);
    }
  }

  /** --------------------------
   *  OPTIONAL: REFRESH STATS
   * -------------------------- */
  async function refreshStats() {
    setLoading(true);
    await loadMLStats();
  }

  return {
    mlStats,
    loading,
    refreshStats,
  };
}
