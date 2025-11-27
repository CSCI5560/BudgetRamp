import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, MapPin } from 'lucide-react';
import { users, cards, transactions, formatCurrency, formatTimestamp } from '@/data/newData';

function UserProfile() {
  const { userId } = useParams();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested user profile could not be found.</p>
          <Link to="/users">
            <Button className="mt-4 rounded-full">Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userCards = cards.filter(c => c.client_id === userId);
  const userTransactions = transactions
    .filter(t => t.client_id === userId)
    .slice(0, 100);

  const maskCardNumber = (number) => `**** **** **** ${number.slice(-4)}`;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <Link to="/users">
          <Button variant="outline" size="icon" className="flex items-center gap-2 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">{user.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <InfoItem label="Gender" value={user.gender} />
            <InfoItem label="Current Age" value={user.current_age} />
            <InfoItem label="Retirement Age" value={user.retirement_age} />
            <InfoItem label="Birth Year" value={user.birth_year} />
            <InfoItem label="Credit Score" value={user.credit_score} />
            <InfoItem label="Num Credit Cards" value={user.num_credit_cards} />
            <InfoItem label="Yearly Income" value={formatCurrency(user.yearly_income)} />
            <InfoItem label="Total Debt" value={formatCurrency(user.total_debt)} />
            <InfoItem label="Per Capita Income" value={formatCurrency(user.per_capita_income)} />
            <div className="col-span-2 md:col-span-3 lg:col-span-4">
              <InfoItem label="Address" value={user.address} icon={<MapPin className="h-4 w-4 text-muted-foreground" />} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Linked Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Number</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Has Chip</TableHead>
                  <TableHead>On Dark Web</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCards.map(card => (
                  <TableRow key={card.id} className="hover:bg-accent">
                    <TableCell className="font-mono">{maskCardNumber(card.card_number)}</TableCell>
                    <TableCell>{card.card_brand}</TableCell>
                    <TableCell>{card.card_type}</TableCell>
                    <TableCell>{card.expires}</TableCell>
                    <TableCell>{formatCurrency(card.credit_limit)}</TableCell>
                    <TableCell>
                      <Badge variant={card.has_chip ? 'default' : 'secondary'}>{card.has_chip ? 'Yes' : 'No'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={card.card_on_dark_web ? 'destructive' : 'secondary'}>{card.card_on_dark_web ? 'Yes' : 'No'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Recent Transactions
          </CardTitle>
          <CardDescription>Last 100 transactions for this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Fraud</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className={transaction.fraud_label === 1 ? 'hover:bg-destructive/10' : 'hover:bg-accent'}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{formatTimestamp(transaction.date)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.fraud_label === 1 ? 'destructive' : 'outline'}>
                        {transaction.fraud_label === 1 ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-1">{icon}</div>}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default UserProfile;