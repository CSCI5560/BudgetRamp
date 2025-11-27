import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { formatCurrency } from '@/data/newData';
import { Search, ChevronDown, ChevronUp, Loader2, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Users() {
  const { users, loading, totalUsers, fetchUsers } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [incomeFilter, setIncomeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        user.id.toLowerCase().includes(term) ||
        (user.address && user.address.toLowerCase().includes(term)) ||
        (user.gender && user.gender.toLowerCase().includes(term));

      if (incomeFilter === 'below30') return user.per_capita_income < 30000 && matchesSearch;
      if (incomeFilter === '30to60') return user.per_capita_income >= 30000 && user.per_capita_income <= 60000 && matchesSearch;
      if (incomeFilter === 'above60') return user.per_capita_income > 60000 && matchesSearch;

      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, searchTerm, sortConfig, incomeFilter]);

  const exportPDF = async (mode) => {
    let exportData = [];

    if (mode === 'all') {
      const { data } = await supabase.from('users').select('*').order('id');
      exportData = data;
    } else {
      exportData = filteredAndSortedUsers;
    }

    const doc = new jsPDF();
    doc.text('BudgetRamp - User Report', 14, 10);

    autoTable(doc, {
      head: [['ID', 'Gender', 'Age', 'Credit Score', 'Per Capita Income', 'Yearly Income', 'Cards']],
      body: exportData.map((u) => [
        u.id,
        u.gender,
        u.current_age,
        u.credit_score,
        `$${u.per_capita_income?.toLocaleString()}`,
        `$${u.yearly_income?.toLocaleString()}`,
        u.num_credit_cards,
      ]),
      startY: 20,
    });

    doc.save(`BudgetRamp_Users_${mode}.pdf`);
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="h-4 w-4 inline ml-1" />
      : <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Browse and manage user profiles.</p>
        </div>
      </div>

      {/* Search / Filters / Export */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by User ID, Address, Gender..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={incomeFilter}
              onChange={(e) => setIncomeFilter(e.target.value)}
              className="border p-2 rounded bg-background"
            >
              <option value="all">All Income Levels</option>
              <option value="below30">Below $30,000</option>
              <option value="30to60">$30,000 - $60,000</option>
              <option value="above60">Above $60,000</option>
            </select>

            <Button onClick={() => exportPDF('page')}>
              <FileDown className="h-4 w-4 mr-2" /> Export Page Data
            </Button>
            <Button variant="outline" onClick={() => exportPDF('all')}>
              <FileDown className="h-4 w-4 mr-2" /> Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List ({filteredAndSortedUsers.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('id')} className="cursor-pointer">User ID <SortIndicator columnKey="id" /></TableHead>
                <TableHead onClick={() => handleSort('gender')} className="cursor-pointer">Gender <SortIndicator columnKey="gender" /></TableHead>
                <TableHead onClick={() => handleSort('current_age')} className="cursor-pointer">Age <SortIndicator columnKey="current_age" /></TableHead>
                <TableHead onClick={() => handleSort('credit_score')} className="cursor-pointer">Credit Score <SortIndicator columnKey="credit_score" /></TableHead>
                <TableHead onClick={() => handleSort('per_capita_income')} className="cursor-pointer">Per Capita Income <SortIndicator columnKey="per_capita_income" /></TableHead>
                <TableHead onClick={() => handleSort('yearly_income')} className="cursor-pointer">Yearly Income <SortIndicator columnKey="yearly_income" /></TableHead>
                <TableHead onClick={() => handleSort('num_credit_cards')} className="cursor-pointer text-center">Cards <SortIndicator columnKey="num_credit_cards" /></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-accent cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell><Badge>{user.gender}</Badge></TableCell>
                    <TableCell>{user.current_age}</TableCell>
                    <TableCell>
                      <Badge variant={user.credit_score > 700 ? 'default' : 'destructive'}>
                        {user.credit_score}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(user.per_capita_income)}</TableCell>

                    {/* FIXED ALIGNMENT HERE */}
                    <TableCell>{formatCurrency(user.yearly_income)}</TableCell>

                    <TableCell className="text-center">{user.num_credit_cards}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border rounded bg-background"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page <strong>{currentPage}</strong> of <strong>{Math.ceil(totalUsers / pageSize)}</strong>
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default Users;
