import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { toast } = useToast();

  // ===============================
  // STATES
  // ===============================
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [cards, setCards] = useState([]);
  const [mccList, setMccList] = useState([]);

  // ===============================
  // LOAD STATIC TABLES: CARDS + MCC
  // ===============================
  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [
          { data: cardsData },
          { data: mccData },
        ] = await Promise.all([
          supabase.from("cards").select("*"),
          supabase.from("mcc").select("mcc, description").order("description"),
        ]);

        setCards(cardsData || []);
        setMccList(mccData || []);
      } catch (err) {
        toast({
          title: "Static Load Error",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    loadStatic();
  }, [toast]);

  // ===============================
  // USERS (PAGINATED)
  // ===============================
  const fetchUsers = async (page = 1, limit = 100) => {
    try {
      setLoadingUsers(true);
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id");

      if (error) throw error;

      setUsers(data || []);
      setTotalUsers(count || 0);
    } catch (err) {
      toast({
        title: "Users Load Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load users immediately so dropdown works
  useEffect(() => {
    fetchUsers(1, 100);
  }, []);

  // ===============================
  // TRANSACTIONS (PAGINATED)
  // ===============================
  const fetchTransactions = async (page = 1, limit = 100) => {
    try {
      setLoadingTransactions(true);

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("date", { ascending: false });

      if (error) throw error;

      // ⭐ CLEAN & NORMALIZE
      const cleaned = (data || []).map((t) => ({
        ...t,
        mcc: t.mcc ? String(t.mcc) : "",
        merchant_name: t.merchant_name || "",
        merchant_city: t.merchant_city || "",
        merchant_state: t.merchant_state || "",
      }));

      setTransactions(cleaned);
      setTotalTransactions(count || 0);
    } catch (err) {
      toast({
        title: "Transactions Load Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1, 100);
  }, []);

  // ===============================
  // ADD TRANSACTION
  // ===============================
  const addTransaction = useCallback(
    async (tx) => {
      try {
        const { error } = await supabase.from("transactions").insert(tx);
        if (error) throw error;

        await fetchTransactions(1, 100);

        toast({
          title: "Transaction Added",
          description: "New transaction stored successfully.",
        });
      } catch (err) {
        toast({
          title: "Add Transaction Error",
          description: err.message,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // ===============================
  // DELETE TRANSACTION
  // ===============================
  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id);

        if (error) throw error;

        await fetchTransactions(1, 100);

        toast({ title: "Transaction Deleted" });
      } catch (err) {
        toast({
          title: "Delete Error",
          description: err.message,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return (
    <DataContext.Provider
      value={{
        // Users
        users,
        totalUsers,
        loadingUsers,
        fetchUsers,

        // Transactions
        transactions,
        totalTransactions,
        loadingTransactions,
        fetchTransactions,

        // Static tables
        cards,
        mccList,

        // Mutations
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
