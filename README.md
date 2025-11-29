

# **BudgetRamp – Financial Transaction Monitoring & Fraud Detection System**

BudgetRamp is a full-stack financial monitoring platform designed for real-time transaction tracking, user and card management, MCC (Merchant Category Code) mapping, and ML-based fraud detection.
It combines a modern **React + Tailwind + ShadCN** frontend with a **Supabase (PostgreSQL)** backend and an integrated ML fraud-scoring pipeline.

---

## **Features**

### **Core Application**

* Transaction creation, listing, filtering & deletion
* User and card management
* MCC description mapping
* Fraud alert system & visual fraud tagging
* CSV export for financial reports
* Real-time updates powered by Supabase
* Fully responsive UI (React + Vite + Tailwind + ShadCN)

### **ML Fraud Detection**

* Integrated machine learning classifier
* Predictive fraud scoring on new transactions
* Predictions stored in Supabase `fraud` table
* “Full Transactions View” merges all tables & predictions for display

### **Database (Supabase)**

Includes:

* `users`
* `cards`
* `transactions`
* `fraud`
* `mcc`
* `full_transactions` (SQL VIEW joining all data)

---

## **System Architecture**

### **Frontend (React + Vite + Tailwind + ShadCN UI)**

* React components and pages
* Context API for global state management
* Dynamic dashboard widgets
* REST interactions through Supabase client
* Toast notifications, modals & loaders

### **Backend (Supabase)**

Supabase provides:

* PostgreSQL database
* Auto-generated REST API
* Authentication (optional)
* Row-Level Security (disabled for this admin dataset)
* Edge Functions (optional)
* SQL Views (full_transactions)

### **Machine Learning Layer**

* Python model trained on financial datasets
* Model exported as `.pkl`
* Fraud predictions pushed to Supabase
* Real-time risk scoring in UI

---

## **Database Schema Overview**

### **users**

| Column     | Type |
| ---------- | ---- |
| id         | text |
| first_name | text |
| last_name  | text |
| email      | text |

### **cards**

| Column             | Type |
| ------------------ | ---- |
| id                 | text |
| client_id          | text |
| card_brand         | text |
| card_number        | text |
| card_number_masked | text |

### **transactions**

| Column         | Type      |
| -------------- | --------- |
| id             | bigint    |
| client_id      | text      |
| card_id        | text      |
| date           | timestamp |
| amount         | int       |
| use_chip       | text      |
| merchant_name  | text      |
| merchant_city  | text      |
| merchant_state | text      |
| zip            | text      |
| mcc            | bigint    |
| errors         | text      |

### **fraud**

| Column     | Type   |
| ---------- | ------ |
| id         | bigint |
| txn_id     | bigint |
| prediction | int    |

### **mcc**

| Column      | Type   |
| ----------- | ------ |
| mcc         | bigint |
| description | text   |

---

## **🔍 SQL View: full_transactions**

Joins:

* `transactions`
* `fraud`
* `cards`
* `users`
* `mcc`

Used by the frontend to fetch everything at once:

```sql
SELECT *
FROM transactions t
LEFT JOIN fraud f ON t.id = f.txn_id
LEFT JOIN cards c ON t.card_id = c.id
LEFT JOIN users u ON t.client_id = u.id
LEFT JOIN mcc m ON t.mcc = m.mcc;
```

---

## **🔌 Supabase Integration**

### **Fetch Full Transactions**

```js
const { data } = await supabase.from("full_transactions").select("*");
```

### **Insert Transaction**

```js
await supabase.from("transactions").insert(newTransaction);
```

### **Delete Transaction**

```js
await supabase.from("transactions").delete().eq("id", id);
```

### **Get MCC Codes**

```js
await supabase.from("mcc").select("mcc, description");
```

---

## **React Frontend Structure**

### **Context Providers**

* `DataContext` → transactions, users, cards, mcc
* `ThemeContext` → dark/light mode
* `NotificationContext` → alerts/toasts
* `AuthContext` (optional)

### **Pages**

* Dashboard
* Transactions
* Users
* Fraud Alerts
* Reports

### **Key Components**

* `AddTransactionForm.jsx`
* `TransactionTable.jsx`
* `FraudAlertBadge.jsx`
* `UserTable.jsx`
* `MCCSelector.jsx`
* `Navbar / Sidebar`

---

## **User Flow**

1. App loads global data via `DataContext`
2. User views dashboard with KPIs
3. Transactions page loads merged `full_transactions` view
4. User adds a transaction
5. ML model scores it (fraud/legit)
6. Prediction inserted into `fraud` table
7. UI updates automatically
8. Fraud alert panel displays high-risk events

---

## **ML Fraud Detection Pipeline**

### **Steps**

1. Load cleaned Kaggle credit card dataset
2. Train classifier (RandomForest / XGBoost)
3. Export as `model.pkl`
4. Inference script receives a transaction → returns prediction
5. Insert into Supabase `fraud` table
6. Frontend reads prediction in real-time

---

## **Installation & Setup**

### **Clone Repository**

```bash
git clone https://github.com/yourusername/BudgetRamp.git
cd BudgetRamp
```

### **Install Dependencies**

```bash
npm install
```

### **Start Server**

```bash
npm run dev
```

---

## **Folder Structure**

```
/src
  /components
  /contexts
  /pages
  /lib
  /data
  App.jsx
  main.jsx

/database
  schema.sql
  seed.sql

/ml
  model.pkl
  predict.py

public
README.md
```

---

## **Future Improvements**

* Role-based access control (RBAC)
* Enhanced fraud explanation (SHAP or LIME)
* Advanced analytics dashboards
* Merchant profiles & risk scoring
* Retraining pipeline for ML model



---

## **Contributors**

* **Ahmeed Yinusa** — Full-Stack Developer
* **Haoyuan Wang** - Frontend Developer
* **Xin Yin** - Database Manager

