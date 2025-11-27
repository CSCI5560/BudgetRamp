import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, AlertTriangle, Users } from "lucide-react";

import { supabase } from "@/lib/customSupabaseClient";
import { useTheme } from "@/contexts/ThemeContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6"];

export default function Dashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [mccTable, setMccTable] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30D");

  // ---------------------------------------------------------
  // LOAD THE LAST 500 TRANSACTIONS + USERS + MCC
  // ---------------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: tx } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .limit(500);

      setTransactions(tx || []);

      const { data: mcc } = await supabase.from("mcc").select("*");
      setMccTable(mcc || []);

      const { data: userData } = await supabase.from("users").select("*");
      setUsers(userData || []);

      setLoading(false);
    }

    load();
  }, []);

  // ---------------------------------------------------------
  // FILTER BY DATE RANGE
  // ---------------------------------------------------------
  const filteredTx = useMemo(() => {
    if (!transactions.length) return [];

    const today = new Date();

    const ranges = {
      "30D": 30,
      "90D": 90,
      "6M": 180,
      YTD: "YTD",
      ALL: "ALL"
    };

    const selected = ranges[range];

    return transactions.filter((t) => {
      const d = new Date(t.date);

      if (selected === "ALL") return true;
      if (selected === "YTD") {
        return d.getFullYear() === today.getFullYear();
      }

      const diff =
        (today - d) / (1000 * 60 * 60 * 24); // days difference
      return diff <= selected;
    });
  }, [transactions, range]);

  // ---------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------
  const totalRevenue = useMemo(
    () => filteredTx.reduce((s, t) => s + Number(t.amount || 0), 0),
    [filteredTx]
  );

  const fraudCount = useMemo(
    () =>
      filteredTx.filter((t) => t.fraud_label === 1).length,
    [filteredTx]
  );

  // ---------------------------------------------------------
  // PIE CHART: SPENDING BY MERCHANT
  // ---------------------------------------------------------
  const spendingByMerchant = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      const m = t.merchant_name?.trim() || "Unknown";
      map[m] = (map[m] || 0) + Number(t.amount || 0);
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTx]);

  // ---------------------------------------------------------
  // 30-DAY REVENUE CHART
  // ---------------------------------------------------------
  const revenue30 = useMemo(() => {
    const days = {};

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }

    filteredTx.forEach((t) => {
      const key = new Date(t.date).toISOString().split("T")[0];
      if (days[key] !== undefined) {
        days[key] += Number(t.amount);
      }
    });

    return Object.keys(days).map((d) => ({
      date: d.slice(5), // show MM-DD
      amount: days[d]
    }));
  }, [filteredTx]);

  // ---------------------------------------------------------
  // MONTHLY SPENDING (Last 6 months)
  // ---------------------------------------------------------
  const monthly = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      map[key] = (map[key] || 0) + Number(t.amount);
    });

    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .slice(-6);
  }, [filteredTx]);

  // ---------------------------------------------------------
  // FRAUD ANOMALY DETECTION
  // ---------------------------------------------------------
  const anomalyThreshold = useMemo(() => {
    if (!filteredTx.length) return Infinity;

    const amounts = filteredTx.map((t) => Number(t.amount));
    amounts.sort((a, b) => a - b);

    const mid = Math.floor(amounts.length / 2);
    const median =
      amounts.length % 2
        ? amounts[mid]
        : (amounts[mid - 1] + amounts[mid]) / 2;

    return median * 3; // unusual if > 3× median
  }, [filteredTx]);

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#0f172a" : "white",
    color: theme === "dark" ? "white" : "black",
    borderRadius: "0.75rem",
    padding: "6px 10px"
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  // ---------------------------------------------------------
  // UI RENDER
  // ---------------------------------------------------------
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* ---------------------------------------------------------
          DATE RANGE SELECTOR (Segment Buttons)
      --------------------------------------------------------- */}
      <div className="flex gap-2 justify-end mb-0">
        {["30D", "90D", "6M", "YTD", "ALL"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-sm border ${
              range === r
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* TOP CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate("/transactions")} className="cursor-pointer">
          <CardHeader className="flex justify-between">
            <CardTitle>Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTx.length}</div>
          </CardContent>
        </Card>

        <Card onClick={() => navigate("/fraud-alerts")} className="cursor-pointer">
          <CardHeader className="flex justify-between">
            <CardTitle>Fraud Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {fraudCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Active Users</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* ---------------------------------------------------------
          REVENUE 30-DAY CHART
      --------------------------------------------------------- */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue30}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="amount" stroke="#22d3ee" fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------------------------------------
          PIE + MONTHLY SPENDING
      --------------------------------------------------------- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Spending by Merchant</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingByMerchant}
                      innerRadius={60}
                      outerRadius={95}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: $${value.toLocaleString()}`
                      }
                      labelLine={true}
                    >
                      {spendingByMerchant.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Spending */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="amount" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ---------------------------------------------------------
          RECENT TRANSACTIONS TABLE
      --------------------------------------------------------- */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>ZIP</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fraud</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTx.slice(0, 5).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.client_id}</TableCell>
                    <TableCell>{t.merchant_name}</TableCell>
                    <TableCell>{t.merchant_city}</TableCell>
                    <TableCell>{t.merchant_state}</TableCell>
                    <TableCell>{t.zip}</TableCell>

                    <TableCell
                      className={
                        Number(t.amount) > anomalyThreshold
                          ? "text-red-500 font-bold"
                          : ""
                      }
                    >
                      ${Number(t.amount).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {new Date(t.date).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {t.fraud_label === 1 ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
