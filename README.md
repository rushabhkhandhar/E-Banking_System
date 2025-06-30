# E-Banking System - MERN Stack

A comprehensive E-Banking System built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to manage their banking operations securely.

## 🚀 Features

### User Authentication & Management
- ✅ User Registration (Name, Email, Password, Account Type)
- ✅ Secure Login (JWT-based authentication)
- ✅ Logout & Session Handling
- ✅ Profile Management (Update Name, Password)

### Dashboard
- ✅ View Account Details (User Info, Balance, Account Type)
- ✅ Quick Access to Deposit, Withdraw, Transfer

### Transactions
- ✅ Deposit Money
- ✅ Withdraw Money (Ensures sufficient balance)
- ✅ Fund Transfer (Transfer to other accounts)
- ✅ Transaction History (View transactions with filters)

### Security Features
- ✅ Password Hashing (bcrypt.js)
- ✅ JWT Authentication (Token-based login)
- ✅ Validation & Error Handling

### Admin Panel (Optional)
- ✅ View Users & Transactions
- ✅ Manage Deposits & Withdrawals

## 🛠️ Tech Stack

### Frontend
- **React.js** (with Vite)
- **Bootstrap** for UI styling
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt.js** for password hashing
- **CORS** for cross-origin requests

### Database
- **MongoDB** (Mongoose ORM)

### API Testing
- **Postman**

## 📁 Project Structure

```
E-Banking_System/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main App component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Banking_System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ebanking
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer funds
- `GET /api/transactions/history` - Get transaction history

### Account
- `GET /api/account/balance` - Get account balance
- `GET /api/account/details` - Get account details

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Input validation and sanitization
- CORS protection
- Rate limiting on sensitive endpoints

## 🧪 Testing

Run the API tests using Postman:
1. Import the Postman collection (if available)
2. Set up environment variables
3. Run the test suite

## 👨‍💻 Author

**Rushbah Khandhar**

## 📄 License

This project is created for educational purposes as a minor project demonstrating MERN stack implementation.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For any queries or support, please contact [your-email@example.com]
