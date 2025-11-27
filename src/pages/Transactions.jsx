import React, { useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Download } from "lucide-react";

// Helper → Convert array → CSV string
const convertToCSV = (arr) => {
  if (!arr.length) return "";

  const headers = Object.keys(arr[0]).join(",");
  const rows = arr
    .map((obj) =>
      Object.values(obj)
        .map((v) => `"${v !== null ? v : ""}"`)
        .join(",")
    )
    .join("\n");

  return `${headers}\n${rows}`;
};

// Helper → Trigger browser download
const downloadCSV = (csvString, fileName) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Transactions = () => {
  const {
    transactions,
    fetchTransactions,
    deleteTransaction,
    totalTransactions,
    loadingTransactions,
  } = useData();

  // Load 100 most recent
  useEffect(() => {
    fetchTransactions(1, 100);
  }, []);

  // ============================
  // EXPORT PAGE DATA (Current Page Only)
  // ============================
  const exportPage = () => {
    const csv = convertToCSV(transactions);
    downloadCSV(csv, "transactions_page.csv");
  };

  // ============================
  // EXPORT ALL (Loads all rows from Supabase)
  // ============================
  const exportAll = async () => {
    const { data, error } = await supabase.from("transactions").select("*");

    if (error) {
      console.error(error);
      return;
    }

    const csv = convertToCSV(data);
    downloadCSV(csv, "transactions_all.csv");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Transactions</h1>
      <p className="text-muted-foreground mb-6">
        Manage and review all financial transactions.
      </p>

      {/* Search + Export Buttons */}
      <div className="flex items-center gap-4 mb-6">

        <Input
          className="max-w-xl"
          placeholder="Search by ID, client, merchant..."
        />

        {/* EXPORT BUTTONS */}
        <div className="flex gap-3 ml-auto">
          {/* Export Page */}
          <Button
            variant="secondary"
            className="rounded-full px-6 flex gap-2 items-center"
            onClick={exportPage}
          >
            <Download className="h-4 w-4" />
            Export Page Data
          </Button>

          {/* Export All */}
          <Button
            variant="outline"
            className="rounded-full px-6 flex gap-2 items-center"
            onClick={exportAll}
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>

        <div className="font-semibold">
          Total: {totalTransactions.toLocaleString()}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Client</th>
              <th className="text-left p-3">Merchant</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">State</th>
              <th className="text-left p-3">ZIP</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Fraud</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loadingTransactions &&
              transactions?.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-3">{tx.id}</td>
                  <td className="p-3">{tx.client_id}</td>
                  <td className="p-3">{tx.merchant_name}</td>
                  <td className="p-3">{tx.merchant_city}</td>
                  <td className="p-3">{tx.merchant_state}</td>
                  <td className="p-3">{tx.zip}</td>

                  <td className="p-3">
                    {Number(tx.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>

                  <td className="p-3">
                    {tx.date
                      ? new Date(tx.date).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>

                  <td className="p-3">
                    {tx.fraud_label === 1 ? (
                      <span className="text-red-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-muted">No</span>
                    )}
                  </td>

                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(tx.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {loadingTransactions && (
          <div className="p-4 text-center text-muted-foreground">
            Loading transactions…
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
