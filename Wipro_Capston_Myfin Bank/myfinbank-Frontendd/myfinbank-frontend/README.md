# MyFinBank — Frontend

## Folder Structure

```
myfinbank-frontend/
│
├── index.html                  ← Landing page (entry point)
│
├── css/
│   └── style.css               ← ALL styles (one unified file)
│
├── js/
│   ├── api.js                  ← ALL backend API calls (SINGLE SOURCE OF TRUTH)
│   ├── ui.js                   ← Shared helpers: toast, loader, formatCurrency, etc.
│   ├── login.js                ← Customer login & register logic
│   ├── dashboard.js            ← Account details, deposit, withdraw, transfer
│   ├── transactions.js         ← Transaction history table
│   ├── loans.js                ← Apply for loan, view my loans
│   ├── investments.js          ← RD and FD investment forms
│   └── admin.js                ← Admin: customer management + loan approvals
│
└── pages/
    ├── login.html              ← Customer login / register
    ├── dashboard.html          ← Customer main page
    ├── transactions.html       ← Transaction history
    ├── loans.html              ← Loan application + my loans
    ├── investments.html        ← RD / FD investment
    ├── emi.html                ← EMI calculator
    ├── admin-login.html        ← Admin login / register
    ├── admin-dashboard.html    ← Admin home with stats
    ├── admin-customers.html    ← CRUD on customers (activate/deactivate)
    └── admin-loans.html        ← Pending loan approvals
```

## Backend Port Map

| Service          | Port |
|------------------|------|
| Eureka Server    | 8761 |
| Customer Service | 8081 |
| Admin Service    | 8082 |
| API Gateway      | 9090 |

**All frontend calls go to port 9090 (API Gateway).** The gateway routes them.

## How to Run

1. Start the Spring Boot microservices in this order:
   - eureka-server
   - admin-service
   - customer-service
   - ApiGateway

2. Open `index.html` in a browser (or use Live Server in VS Code).

## Technology Used

- **HTML5** — page structure
- **CSS3** — styling with CSS variables, grid, flexbox (no framework needed)
- **Vanilla JavaScript (ES6+)** — all logic, no jQuery
- **Fetch API** — for HTTP calls to the backend
- **Google Fonts** — Playfair Display + DM Sans

## Key Concepts for Explanation

### api.js
- One file controls ALL backend communication
- `apiRequest()` is the core function — every other function calls it
- Token stored in `localStorage` after login
- `buildHeaders()` automatically adds `Authorization: Bearer <token>`

### ui.js
- `showToast()` — pop-up notification (success/error)
- `showLoader()` / `hideLoader()` — spinner during API calls
- `guardRoute()` — redirects unauthenticated users to login
- `formatCurrency()` — formats numbers as ₹1,23,456

### Each page JS file
- Calls `guardRoute()` first (security)
- Loads data on `DOMContentLoaded`
- Uses `try/catch` with `showLoader/hideLoader` around every API call
- Calls `showToast()` for success and error feedback
