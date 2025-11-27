import { useState } from "react";
import { useSpendingPrediction } from "@/hooks/useSpendingPrediction";

export default function SpendingPredictionForm() {
  const { loading, result, error, predictSpending } = useSpendingPrediction();

  const [form, setForm] = useState({
    age: "",
    income: "",
    avg_monthly_spend: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    predictSpending({
      age: Number(form.age),
      income: Number(form.income),
      avg_monthly_spend: Number(form.avg_monthly_spend),
    });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-xl text-white max-w-lg">
      <h2 className="text-xl font-bold mb-4">Spending Predictor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          name="income"
          placeholder="Income"
          value={form.income}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          name="avg_monthly_spend"
          placeholder="Avg Monthly Spend"
          value={form.avg_monthly_spend}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-green-600 hover:bg-green-700"
        >
          {loading ? "Predicting..." : "Predict Spending"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p>Predicted Spending: <strong>${result.predicted_spending.toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  );
}
