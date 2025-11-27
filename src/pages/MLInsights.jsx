import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useMLModels from "@/hooks/useMLModels";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/newData";

export default function MLInsights() {
  const { transactions } = useData();
  const { loading, predictFraud, predictSpending } = useMLModels();

  const [fraudResult, setFraudResult] = useState(null);
  const [spendResult, setSpendResult] = useState(null);
  const [sampleAmount, setSampleAmount] = useState("");

  // Predict fraud on a sample transaction
  const runFraudExample = async () => {
    if (!transactions.length) return;

    const t = transactions[0];

    const features = [
      Number(t.amount),
      new Date(t.date).getHours(),
      Number(t.mcc || 0),
      Number(t.zip || 0),
      t.use_chip === "Online" ? 1 : 0,
      t.use_chip === "Chip" ? 1 : 0,
      t.use_chip === "Swipe" ? 1 : 0,
    ];

    const prob = await predictFraud(features);
    setFraudResult(prob.toFixed(3));
  };

  // Predict spending from a sample amount
  const runSpendingExample = async () => {
    const amt = Number(sampleAmount);
    if (!amt) return;

    const features = [amt, 12, 5411, 12345, 0, 0, 1];

    const pred = await predictSpending(features);
    setSpendResult(formatCurrency(pred));
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold">ML Insights</h1>
      <p className="text-muted-foreground">
        Machine Learning predictions powered by ONNX models.
      </p>

      {loading ? (
        <p>Loading ML models...</p>
      ) : (
        <>
          {/* Fraud Model Test */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Prediction Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={runFraudExample}>Run Fraud Prediction</Button>
              {fraudResult && (
                <p className="mt-4 text-lg">
                  Fraud Probability: <strong>{fraudResult}</strong>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Spending Prediction */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="Enter amount..."
                value={sampleAmount}
                onChange={(e) => setSampleAmount(e.target.value)}
              />
              <Button className="mt-3" onClick={runSpendingExample}>
                Predict Spending
              </Button>

              {spendResult && (
                <p className="mt-4 text-lg">
                  Expected Spending: <strong>{spendResult}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
