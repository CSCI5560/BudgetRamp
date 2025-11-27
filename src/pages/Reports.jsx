import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Download, TrendingUp, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { supabase } from "@/lib/customSupabaseClient";

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

export default function Reports() {
  const [reportType, setReportType] = useState("category");
  const [timeRange, setTimeRange] = useState("all");

  const { toast } = useToast();
  const { theme } = useTheme();

  const [dbTransactions, setDbTransactions] = useState([]);

  // ----------------------------------------------------
  // LOAD LAST 500 TRANSACTIONS FROM SUPABASE
  // ----------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .limit(500);

      if (!error && data) {
        setDbTransactions(data);
      }
    }
    fetchData();
  }, []);

  // Auto-categorize merchants if no category exists
  const autoCategorize = (merchant) => {
    if (!merchant) return "Other";

    const m = merchant.toLowerCase();

    if (m.includes("walmart")) return "Retail";
    if (m.includes("amazon")) return "Online Shopping";
    if (m.includes("shell") || m.includes("chevron")) return "Gas";
    if (m.includes("mcdonald") || m.includes("burger") || m.includes("kfc"))
      return "Fast Food";
    if (m.includes("hospital") || m.includes("clinic")) return "Healthcare";

    return "Other";
  };

  // ----------------------------------------------------
  // TIME RANGE FILTER
  // ----------------------------------------------------
  const transactions = useMemo(() => {
    if (timeRange === "all") return dbTransactions;

    const now = new Date();
    const monthsAgo = {
      "3months": 3,
      "6months": 6,
      "12months": 12,
      ytd: now.getMonth(),
    }[timeRange];

    const cutoff = new Date();
    if (timeRange === "ytd") {
      cutoff.setMonth(0, 1);
      cutoff.setHours(0, 0, 0, 0);
    } else {
      cutoff.setMonth(now.getMonth() - monthsAgo);
    }

    return dbTransactions.filter((t) => new Date(t.date) >= cutoff);
  }, [dbTransactions, timeRange]);

  // ----------------------------------------------------
  // CATEGORY SPENDING
  // ----------------------------------------------------
  const spendingByCategory = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      const category = t.category || autoCategorize(t.merchant_name);
      map[category] = (map[category] || 0) + Number(t.amount || 0);
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      }));
  }, [transactions]);

  // ----------------------------------------------------
  // MONTHLY SPENDING FOR LAST 12 MONTHS
  // ----------------------------------------------------
  const monthlySpendingData = useMemo(() => {
    const arr = Array(12)
      .fill(null)
      .map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          name: d.toLocaleString("default", { month: "short" }),
          year: d.getFullYear(),
          amount: 0,
        };
      })
      .reverse();

    transactions.forEach((txn) => {
      const d = new Date(txn.date);
      const month = d.toLocaleString("default", { month: "short" });
      const year = d.getFullYear();

      const bucket = arr.find((m) => m.name === month && m.year === year);
      if (bucket) bucket.amount += Number(txn.amount || 0);
    });

    return arr;
  }, [transactions]);

  // ----------------------------------------------------
  // CSV EXPORT
  // ----------------------------------------------------
  const downloadCSV = (data, filename) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((r) =>
        Object.values(r)
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([headers + "\n" + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename + ".csv";
    a.click();

    toast({ title: "CSV exported", description: "Your download has started." });
  };

  // ----------------------------------------------------
  // PDF EXPORT
  // ----------------------------------------------------
  const handlePDF = () => {
    const doc = new jsPDF();

    let title, head, body;

    if (reportType === "category") {
      title = "Spending by Category";
      head = [["Category", "Amount"]];
      body = spendingByCategory.map((c) => [
        c.name,
        "$" + c.value.toLocaleString(),
      ]);
    } else if (reportType === "monthly") {
      title = "Monthly Spending";
      head = [["Month", "Amount"]];
      body = monthlySpendingData.map((m) => [
        `${m.name} ${m.year}`,
        "$" + m.amount.toLocaleString(),
      ]);
    } else {
      title = "All Transactions";
      head = [["ID", "Client", "Merchant", "Amount", "Date", "Fraud"]];
      body = transactions.map((t) => [
        t.id,
        t.client_id,
        t.merchant_name,
        "$" + Number(t.amount).toLocaleString(),
        new Date(t.date).toLocaleString(),
        t.fraud_label === 1 ? "Yes" : "No",
      ]);
    }

    doc.text(title, 14, 15);
    autoTable(doc, { head, body, startY: 25 });
    doc.save(title + ".pdf");

    toast({ title: "PDF exported", description: "File downloaded." });
  };

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#0f172a" : "white",
    color: theme === "dark" ? "white" : "black",
  };

  // ----------------------------------------------------
  // REPORT SECTIONS
  // ----------------------------------------------------
  const CategoryReport = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="text-indigo-500 h-5 w-5" />
          Spending by Category
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PIE CHART */}
          <div className="h-96">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="h-96">
            <ResponsiveContainer>
              <BarChart data={spendingByCategory.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value">
                  {spendingByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MonthlyReport = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Monthly Spending Trends
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CombinedReport = () => (
    <>
      <CategoryReport />
      <MonthlyReport />
    </>
  );

  const reportView = () => {
    if (reportType === "category") return <CategoryReport />;
    if (reportType === "monthly") return <MonthlyReport />;
    return <CombinedReport />;
  };

  // ----------------------------------------------------
  // MAIN UI
  // ----------------------------------------------------
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Analytics generated using the latest 500 real transactions.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Spending by Category</SelectItem>
                  <SelectItem value="monthly">Monthly Trends</SelectItem>
                  <SelectItem value="combined">Combined Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-3">
              <Button
                className="rounded-full bg-green-600 hover:bg-green-700"
                onClick={() =>
                  downloadCSV(transactions, "transactions_export")
                }
              >
                <Download className="h-4 w-4" /> CSV
              </Button>

              <Button
                variant="outline"
                className="rounded-full"
                onClick={handlePDF}
              >
                <Download className="h-4 w-4" /> PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportView()}
    </motion.div>
  );
}
