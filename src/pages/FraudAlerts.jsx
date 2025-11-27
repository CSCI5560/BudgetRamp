import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// ------------------------------
// HELPERS
// ------------------------------
const formatCurrency = (num) =>
  num ? `$${Number(num).toLocaleString()}` : "$0.00";

const formatDate = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ------------------------------
// RULE-BASED ALERT ENGINE
// ------------------------------
function classifyAlert(tx) {
  if (tx.amount > 10000) return "Critical";
  if (tx.amount > 5000) return "Moderate";
  if (!tx.client_id || !tx.card_id || !tx.merchant_city) return "Moderate";
  return "Low";
}

// ------------------------------
// MAIN COMPONENT
// ------------------------------
export default function FraudAlerts() {
  const [transactions, setTransactions] = useState([]);
  const { toast } = useToast();

  // --------------------------
  // LOAD DATA
  // --------------------------
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setTransactions(data || []);
    };

    loadData();
  }, []);

  // --------------------------
  // FLAG TRANSACTIONS
  // --------------------------
  const flagged = useMemo(() => {
    return transactions
      .map((t) => ({
        ...t,
        alert_level: classifyAlert(t),
      }))
      .filter((t) => t.alert_level !== "Low");
  }, [transactions]);

  const criticalCount = flagged.filter((t) => t.alert_level === "Critical").length;
  const moderateCount = flagged.filter((t) => t.alert_level === "Moderate").length;

  // --------------------------
  // EXPORT CSV
  // --------------------------
  const handleExport = () => {
    if (flagged.length === 0) {
      toast({ title: "No alerts to export" });
      return;
    }

    const exportData = flagged.map((t) => ({
      id: t.id,
      client_id: t.client_id,
      amount: t.amount,
      merchant_city: t.merchant_city,
      status: t.alert_level,
      date: t.date,
    }));

    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData
      .map((row) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvContent =
      `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "fraud_alerts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Export successful" });
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Fraud Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and investigate suspicious transactions using rule-based detection.
          </p>
        </div>

        <Button onClick={handleExport} className="rounded-full">
          <Download className="mr-2 h-4 w-4" />
          Export Alerts
        </Button>
      </div>

      {/* RULE EXPLANATION CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-400" />
            How Fraud Detection Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>The system uses simple rule-based checks to identify suspicious transactions:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Critical:</strong> Amount greater than $10,000</li>
            <li><strong>Moderate:</strong> Amount greater than $5,000</li>
            <li><strong>Moderate:</strong> Missing required fields such as client ID, card ID, or merchant city</li>
            <li><strong>Low:</strong> Normal transactions (not shown in alerts)</li>
          </ul>
          <p>This is 100% rule-based classification.</p>
        </CardContent>
      </Card>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{criticalCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderate Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">{moderateCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* FLAGGED TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Flagged Transactions ({flagged.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {flagged.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {flagged.map((t) => (
                    <TableRow key={t.id} className="hover:bg-destructive/10">
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.client_id || "—"}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell>{formatDate(t.date)}</TableCell>
                      <TableCell>{t.merchant_city || "—"}</TableCell>
                      <TableCell>
                        {t.alert_level === "Critical" && (
                          <Badge variant="destructive">Critical</Badge>
                        )}
                        {t.alert_level === "Moderate" && (
                          <Badge className="bg-yellow-400 text-black">
                            Moderate
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No suspicious transactions found.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
