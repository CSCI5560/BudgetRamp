import { useState } from "react";
import { useFraudPrediction } from "@/hooks/useFraudPrediction";

export default function FraudPredictionForm() {
  const { loading, result, error, predictFraud } = useFraudPrediction();

  const [form, setForm] = useState({
    amount: "",
    hour: "",
    mcc: "",
    zip: "",
    method: "Swipe",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    predictFraud({
      amount: Number(form.amount),
      hour: Number(form.hour),
      mcc: Number(form.mcc),
      zip: form.zip,
      method: form.method,
    });
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-xl text-white max-w-lg">
      <h2 className="text-xl font-bold mb-4">Fraud Probability Predictor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          name="hour"
          placeholder="Hour (0–23)"
          value={form.hour}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          name="mcc"
          placeholder="MCC (e.g., 5311)"
          value={form.mcc}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          name="zip"
          placeholder="ZIP Code"
          value={form.zip}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        />

        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option>Swipe</option>
          <option>Chip</option>
          <option>Online</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Predicting..." : "Predict Fraud"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p>Fraud Probability: <strong>{(result.fraud_probability * 100).toFixed(2)}%</strong></p>
          <p>Status: <strong>{result.fraud_label === 1 ? "Fraudulent" : "Normal"}</strong></p>
        </div>
      )}
    </div>
  );
}
