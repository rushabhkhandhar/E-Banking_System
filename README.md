# E-Banking System

A comprehensive, production-ready E-Banking System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system provides secure banking operations with user authentication, account management, and transaction processing.

## 🚀 Features

### 🔐 Authentication & Security
- User registration with email verification
- Secure JWT-based authentication
- Password reset functionality
- Role-based access control (User/Admin)
- Rate limiting and security middleware

### 💳 Account Management
- Create multiple account types (Checking, Savings, Credit)
- View account details and balances
- Update account information
- Freeze/unfreeze accounts
- Account closure with balance transfer
- Account statements and history

### 💰 Transaction Operations
- Deposit money with limits and validation
- Withdraw money with balance checks
- Transfer funds between accounts
- Transaction history with filtering
- Real-time balance updates
- Transaction reversal (Admin)

### 🛡️ Admin Panel
- Manage all users and accounts
- Force account operations
- View all transactions across the system
- User management and analytics
- System monitoring and controls

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Frontend (Ready for development)
- **React.js** - Frontend framework
- **Vite** - Build tool
- **Bootstrap** - UI framework

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Forgot password
- `PATCH /api/v1/auth/reset-password/:token` - Reset password

### User Management
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update user profile
- `DELETE /api/v1/users/me` - Delete user account

### Account Management
- `POST /api/v1/accounts` - Create new account
- `GET /api/v1/accounts` - Get user accounts
- `GET /api/v1/accounts/:id` - Get account details
- `PATCH /api/v1/accounts/:id` - Update account
- `PATCH /api/v1/accounts/:id/freeze` - Freeze account
- `PATCH /api/v1/accounts/:id/unfreeze` - Unfreeze account
- `DELETE /api/v1/accounts/:id` - Close account

### Transactions
- `POST /api/v1/transactions/deposit/:accountId` - Deposit money
- `POST /api/v1/transactions/withdraw/:accountId` - Withdraw money
- `POST /api/v1/transactions/transfer/:fromAccountId` - Transfer funds
- `GET /api/v1/transactions/account/:accountId` - Get transaction history
- `GET /api/v1/transactions/user` - Get all user transactions

### Admin Routes
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/accounts` - Get all accounts
- `GET /api/v1/admin/transactions` - Get all transactions
- `PATCH /api/v1/admin/users/:id` - Update user (admin)
- `DELETE /api/v1/admin/accounts/:id/force-close` - Force close account

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/E-Banking_System.git
   cd E-Banking_System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ebanking
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=7d
   EMAIL_FROM=noreply@ebanking.com
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   ```

5. **Frontend Setup** (Optional)
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### 🧪 Testing with Postman

Import the included Postman collection `E-Banking_System_API_Collection_Complete.json` to test all API endpoints.

## 📁 Project Structure

```
E-Banking_System/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── config/             # Configuration files
│   └── package.json
├── frontend/               # React frontend (ready for development)
├── E-Banking_System_API_Collection_Complete.json  # Postman collection
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- MongoDB injection protection

## 🎯 Business Logic

- Account balance validation
- Transaction limits and checks
- Overdraft protection
- Account freeze/unfreeze functionality
- Atomic transactions for transfers
- Comprehensive error handling

## 📈 Future Enhancements

- [ ] Frontend React application
- [ ] Real-time notifications
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Two-factor authentication
- [ ] Automated testing suite
- [ ] CI/CD pipeline

## 👨‍💻 Developer

**Rushabh Khandhar**
- Portfolio: [Your Portfolio]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

⭐ **Star this repository if you found it helpful!**

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
