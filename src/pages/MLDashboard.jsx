import FraudPredictionForm from "@/components/FraudPredictionForm";
import SpendingPredictionForm from "@/components/SpendingPredictionForm";

export default function MLDashboard() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <FraudPredictionForm />
      <SpendingPredictionForm />
    </div>
  );
}
