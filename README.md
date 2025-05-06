# eCommerce App — Frontend
This is the React frontend for the eCommerce platform. Users can add items to cart, checkout, and view available discounts. Admins can generate discount codes and view user stats.

# Tech Stack
React + TypeScript

Material UI

Axios

React Router

# Features
Item listing from backend

Add to cart and checkout flow

Discount code application (every Nth order)

Admin dashboard (generate discount, view user stats)

# Folder Structure
```bash
frontend/
├── pages/
│   ├── HomePage.tsx     # Item list + add to cart
│   ├── CartPage.tsx     # Cart view + checkout
│   └── AdminPage.tsx    # Admin features
├── utils/
│   ├── api.tsx          # Axios api helper
│   ├── helper.tsx       # Get and set current user
└── App.tsx              # Routes
└── types
│   ├── types.tsx        # Contains all the types
```

# Start Frontend
```bash
npm install
npm run dev
## Routes
/ — Home (items list)

/cart — Cart and checkout

/admin — Admin dashboard
```

# Notes
User is stored in localStorage under userId

Cart is stored on the backend per user