
import { faker } from '@faker-js/faker';

// --- Base Data Generation ---

// MCC Codes
export const mcc_codes = [
  { mcc: 5411, description: 'Grocery Stores' },
  { mcc: 5812, description: 'Eating Places, Restaurants' },
  { mcc: 4511, description: 'Airlines' },
  { mcc: 5541, description: 'Service Stations' },
  { mcc: 5912, description: 'Drug Stores and Pharmacies' },
  { mcc: 7999, description: 'Recreation Services' },
  { mcc: 5311, description: 'Department Stores' },
  { mcc: 5941, description: 'Sporting Goods Stores' },
  { mcc: 4121, description: 'Taxicabs and Limousines' },
  { mcc: 5814, description: 'Fast Food Restaurants' },
  { mcc: 5651, description: 'Family Clothing Stores' },
  { mcc: 7011, description: 'Hotels, Motels, and Resorts' },
  { mcc: 5977, description: 'Cosmetic Stores' },
  { mcc: 5942, description: 'Book Stores' },
  { mcc: 8062, description: 'Hospitals' },
];

const mccMap = new Map(mcc_codes.map(code => [code.mcc, code.description]));

// Users
let users_data = Array.from({ length: 20 }, (_, i) => {
  const id = `C${1001 + i}`;
  const birth_year = faker.number.int({ min: 1950, max: 2000 });
  const current_age = new Date().getFullYear() - birth_year;
  const yearly_income = parseFloat(faker.finance.amount({ min: 45000, max: 150000, dec: 2 }));
  return {
    id,
    current_age,
    retirement_age: faker.number.int({ min: 60, max: 75 }),
    birth_year,
    birth_month: faker.number.int({ min: 1, max: 12 }),
    gender: faker.person.sex(),
    address: faker.location.streetAddress(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    per_capita_income: yearly_income * 0.7 + parseFloat(faker.finance.amount({ min: -5000, max: 5000, dec: 2 })),
    yearly_income: yearly_income,
    total_debt: parseFloat(faker.finance.amount({ min: 0, max: 200000, dec: 2 })),
    credit_score: faker.number.int({ min: 300, max: 850 }),
    num_credit_cards: faker.number.int({ min: 1, max: 8 }),
  };
});
export let users = users_data;

// Cards
let cards_data = users_data.flatMap(user => 
  Array.from({ length: user.num_credit_cards }, (_, i) => ({
    id: `CARD-${user.id}-${i + 1}`,
    client_id: user.id,
    card_brand: faker.helpers.arrayElement(['Visa', 'Mastercard', 'Amex', 'Discover']),
    card_type: faker.helpers.arrayElement(['Credit', 'Debit']),
    card_number: faker.finance.creditCardNumber(),
    expires: faker.date.future({ years: 5 }).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit' }),
    cvv: faker.finance.creditCardCVV(),
    has_chip: faker.datatype.boolean(),
    num_cards_issued: faker.number.int({ min: 1, max: 5 }),
    credit_limit: parseFloat(faker.finance.amount({ min: 500, max: 25000, dec: 0 })),
    acct_open_date: faker.date.past({ years: 10 }),
    year_pin_last_changed: faker.date.past({ years: 4 }).getFullYear(),
    card_on_dark_web: faker.datatype.boolean({ probability: 0.1 }),
  }))
);
export let cards = cards_data;

// Transactions and Fraud Labels
const raw_transactions = [];
export const fraud_labels = [];

for (let i = 0; i < 500; i++) {
  const card = faker.helpers.arrayElement(cards_data);
  const isFraud = faker.datatype.boolean({ probability: 0.05 });
  const txn_id = `TXN${10000 + i}`;
  
  if (card) {
      raw_transactions.push({
        id: txn_id,
        date: faker.date.recent({ days: 365 }),
        client_id: card.client_id,
        card_id: card.id,
        amount: parseFloat(faker.finance.amount({ min: 5, max: 2500, dec: 2 })),
        use_chip: faker.helpers.arrayElement(['Swipe', 'Chip', 'Online']),
        merchant_id: `M${faker.number.int({ min: 100, max: 999 })}`,
        merchant_name: faker.company.name(),
        merchant_city: faker.location.city(),
        merchant_state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        mcc: faker.helpers.arrayElement(mcc_codes).mcc,
        errors: isFraud ? faker.helpers.arrayElement(['', 'Bad CVV', 'Bad PIN', 'Bad Expiry']) : '',
      });

      fraud_labels.push({
        txn_id,
        fraud_label: isFraud ? 1 : 0,
      });
  }
}

const fraudMap = new Map(fraud_labels.map(label => [label.txn_id, label.fraud_label]));

// --- Combined and Processed Data ---

let transactions_data = raw_transactions.map(txn => {
  const fraud_label = fraudMap.get(txn.id) || 0;
  return {
    ...txn,
    fraud_label,
    category: mccMap.get(txn.mcc) || 'Unknown',
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

export let transactions = transactions_data;

export const addTransaction = (newTransaction, currentTransactions) => {
  const mcc = mcc_codes.find(code => code.description === newTransaction.category)?.mcc || null;
  const fullTransaction = {
    ...newTransaction,
    id: `TXN${Date.now()}`,
    merchant_id: `M${faker.number.int({ min: 100, max: 999 })}`,
    mcc,
    fraud_label: 0,
  };

  const updatedTransactions = [fullTransaction, ...currentTransactions];
  transactions_data = updatedTransactions; // keep mock in sync
  return updatedTransactions;
};

export const deleteTransaction = (transactionId, currentTransactions) => {
  const updatedTransactions = currentTransactions.filter(t => t.id !== transactionId);
  transactions_data = updatedTransactions; // keep mock in sync
  return updatedTransactions;
};

export const addUser = (newUser, currentUsers) => {
    const id = `C${1000 + currentUsers.length + 1}`;
    const current_age = new Date().getFullYear() - newUser.birth_year;
    const fullUser = {
        ...newUser,
        id,
        current_age,
        birth_month: faker.number.int({ min: 1, max: 12 }),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        num_credit_cards: 0,
    };
    const updatedUsers = [fullUser, ...currentUsers];
    users_data = updatedUsers; // keep mock in sync
    return { user: fullUser, users: updatedUsers };
};

export const addCard = (clientId, newCard, currentCards, currentUsers) => {
    const cardId = `CARD-${clientId}-${Date.now()}`;
    const fullCard = {
        ...newCard,
        id: cardId,
        client_id: clientId,
        cvv: faker.finance.creditCardCVV(),
        acct_open_date: new Date(),
        year_pin_last_changed: new Date().getFullYear(),
    };
    const updatedCards = [fullCard, ...currentCards];
    cards_data = updatedCards;
    
    const updatedUsers = currentUsers.map(u => {
        if (u.id === clientId) {
            const num_credit_cards = (u.num_credit_cards || 0) + 1;
            return { ...u, num_credit_cards };
        }
        return u;
    });
    users_data = updatedUsers;

    return { updatedCards, updatedUsers };
};


// --- Utility Functions ---

export const formatCurrency = (amount) => {
  const number = Number(amount);
  if (isNaN(number)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

export const formatTimestamp = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
