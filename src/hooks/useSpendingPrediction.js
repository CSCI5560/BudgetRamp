import { useState } from "react";
import { runMLTask } from "@/lib/mlApi";

export function useSpendingPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function predictSpending(input) {
    try {
      setLoading(true);
      setError(null);

      const res = await runMLTask("spend", input);
      setResult(res);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, error, predictSpending };
}
