import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Eye, Users as UsersIcon, CreditCard } from 'lucide-react';
import { mockUsers, mockTransactions } from '@/data/mockData';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const userResults = query ? mockUsers.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.id.toLowerCase().includes(query)
  ) : [];

  const transactionResults = query ? mockTransactions.filter(t =>
    t.id.toLowerCase().includes(query) ||
    t.userName.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.merchant.toLowerCase().includes(query) ||
    String(t.amount).includes(query)
  ) : [];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          Search Results
        </h1>
        <p className="text-muted-foreground mt-2">
          Showing results for: <span className="font-semibold text-primary">"{query}"</span>
        </p>
      </div>

      {(userResults.length === 0 && transactionResults.length === 0) && (
          <Card>
              <CardContent className="text-center py-16">
                  <p className="text-lg text-muted-foreground">No results found for your query.</p>
              </CardContent>
          </Card>
      )}

      {userResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-purple-500" />
              Users ({userResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userResults.map(user => (
                  <TableRow key={user.id} className="hover:bg-accent">
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-semibold">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Link to={`/users/${user.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {transactionResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              Transactions ({transactionResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionResults.map(t => (
                  <TableRow key={t.id} className={t.isFraud ? 'bg-red-500/10' : ''}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.merchant}</TableCell>
                    <TableCell>{t.userName}</TableCell>
                    <TableCell className="font-semibold">${t.amount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>
                      {t.isFraud ? <Badge variant="destructive">Fraud</Badge> : <Badge variant="secondary">Clean</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </motion.div>
  );
}

export default SearchResults;