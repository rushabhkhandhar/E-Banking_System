# E-Banking System

A comprehensive, production-ready E-Banking System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system provides secure banking operations with user authentication, account management, transaction processing, and a complete admin panel with modern glassmorphism UI design.

## Features

### User Features
- **Authentication & Security**
  - User registration and secure login
  - JWT-based authentication with protected routes
  - Password change functionality
  - Profile management with real-time updates
  - Role-based access control (User/Admin)

- **Account Management**
  - Create multiple account types (Checking, Savings, Credit)
  - View account details, balances, and status
  - Modern dashboard with account overview cards
  - Real-time balance updates

- **Transaction Operations**
  - Deposit money with validation
  - Withdraw money with balance checks
  - Transfer funds between accounts
  - Complete transaction history with filtering
  - Real-time transaction updates

- **Modern UI/UX**
  - Glassmorphism design with JPMorgan blue palette
  - Responsive design for all screen sizes
  - Professional dashboard with data visualization
  - Clean and intuitive user interface

### Admin Features
- **Comprehensive Admin Dashboard**
  - Tabbed interface for User, Account, and Transaction management
  - Real-time data updates across all sections
  - Bulk operations and advanced filtering

- **User Management**
  - View all users with detailed information
  - Create new users with role assignment
  - Update user profiles and roles
  - Delete users with confirmation dialogs

- **Account Management**
  - View all accounts across the system
  - Create accounts for any user
  - Update account details and balances
  - Freeze/unfreeze accounts
  - Force close accounts with proper validation

- **Transaction Management**
  - View all transactions system-wide
  - Manual transaction creation for any account
  - Transaction reversal capabilities
  - Advanced filtering and search options

## Technology Stack

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

### Frontend
- **React.js** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with glassmorphism effects
- **Responsive Design** - Mobile-first approach

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password

### User Operations
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete user account

### Account Management
- `POST /api/accounts` - Create new account
- `GET /api/accounts` - Get user accounts
- `GET /api/accounts/:id` - Get account details
- `PUT /api/accounts/:id` - Update account information
- `PUT /api/accounts/:id/freeze` - Freeze account
- `PUT /api/accounts/:id/unfreeze` - Unfreeze account
- `DELETE /api/accounts/:id` - Close account

### Transaction Operations
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer funds between accounts
- `GET /api/transactions/user` - Get user transaction history
- `GET /api/transactions/account/:accountId` - Get account-specific transactions

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update any user
- `DELETE /api/admin/users/:id` - Delete any user
- `GET /api/admin/accounts` - Get all accounts
- `POST /api/admin/accounts` - Create account for any user
- `PUT /api/admin/accounts/:id` - Update any account
- `DELETE /api/admin/accounts/:id` - Force close any account
- `GET /api/admin/transactions` - Get all transactions
- `POST /api/admin/transactions` - Create manual transaction
- `PUT /api/admin/transactions/:id/reverse` - Reverse transaction

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rushabhkhandhar/E-Banking_System.git
   cd E-Banking_System
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ebanking
   JWT_SECRET=your-secure-jwt-secret-key
   JWT_EXPIRES_IN=7d
   ```

5. **Start the Application**
   
   **Backend Server (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend Application (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Default Admin Access
- **Admin Login:** Use the admin credentials created during backend setup
- **Admin Dashboard:** Access via the "Admin" link in the navigation bar
- **Admin URL:** http://localhost:5173/admin/login

## Project Structure

```
E-Banking_System/
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # Layout components (Navbar, etc.)
│   │   │   └── ui/               # UI components
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin-specific pages
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── Accounts.jsx      # Account management
│   │   │   ├── Transactions.jsx  # Transaction history
│   │   │   ├── Profile.jsx       # User profile
│   │   │   └── About.jsx         # About page
│   │   ├── services/             # API service layers
│   │   │   ├── api.js            # User API calls
│   │   │   └── adminAPI.js       # Admin API calls
│   │   ├── routes/               # Routing configuration
│   │   │   └── AppRoutes.jsx     # Main route definitions
│   │   ├── utils/                # Utility functions
│   │   └── App.jsx               # Main application component
│   ├── public/                   # Static assets
│   └── package.json              # Frontend dependencies
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── accountController.js
│   │   │   ├── transactionController.js
│   │   │   └── adminController.js
│   │   ├── models/               # Database models
│   │   │   ├── User.js
│   │   │   ├── Account.js
│   │   │   └── Transaction.js
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── accountRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── adminAuth.js
│   │   ├── utils/                # Utility functions
│   │   └── server.js             # Application entry point
│   ├── config/                   # Configuration files
│   └── package.json              # Backend dependencies
└── README.md                     # Project documentation
```

## User Interface Features

### Design System
- **JPMorgan Blue Palette** - Professional corporate branding
- **Glassmorphism Effects** - Modern, translucent design elements
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Accessibility** - WCAG compliant design patterns

### User Pages
- **Dashboard** - Overview of accounts, recent transactions, and quick actions
- **Accounts** - Detailed account management with balance tracking
- **Transactions** - Complete transaction history with filtering and search
- **Profile** - User profile management with password change functionality
- **About** - Static informational page about the banking system

### Admin Interface
- **Admin Login** - Secure admin authentication with role verification
- **Admin Dashboard** - Comprehensive management interface with:
  - User Management Tab - Create, read, update, delete users
  - Account Management Tab - Manage all accounts system-wide
  - Transaction Management Tab - View, create, and reverse transactions
  - Real-time data updates and confirmation dialogs

## Security Features

### Authentication & Authorization
- JWT-based authentication with secure token handling
- Role-based access control (User/Admin)
- Protected routes with automatic redirects
- Session management with token expiration

### Data Security
- Password hashing with bcrypt
- Input validation and sanitization
- MongoDB injection protection
- CORS configuration for cross-origin requests
- Helmet security headers

### Business Logic Security
- Account balance validation before transactions
- Transaction limits and overdraft protection
- Account freeze/unfreeze functionality
- Atomic operations for fund transfers
- Comprehensive error handling and logging

## Usage Instructions

### For Regular Users
1. **Registration/Login** - Create account or login with credentials
2. **Dashboard** - View account overview and recent activity
3. **Account Management** - Create new accounts, view balances
4. **Transactions** - Deposit, withdraw, transfer funds
5. **Profile** - Update personal information and change password

### For Administrators
1. **Admin Login** - Access via /admin/login with admin credentials
2. **User Management** - Create, update, delete user accounts
3. **Account Operations** - Manage all accounts, freeze/unfreeze
4. **Transaction Control** - View all transactions, create manual entries, reverse transactions
5. **System Monitoring** - Real-time oversight of all banking operations

## Development Features

### Code Quality
- Modern ES6+ JavaScript syntax
- Component-based React architecture
- RESTful API design patterns
- Comprehensive error handling
- Clean code principles and organization

### Performance
- Optimized React components with proper state management
- Efficient database queries with Mongoose
- Lazy loading and code splitting ready
- Responsive design with minimal CSS framework dependency

### Maintainability
- Modular code structure
- Centralized API service layers
- Reusable UI components
- Consistent naming conventions
- Comprehensive documentation

## Testing and API Documentation

### API Testing with Postman
- Import the included Postman collection for comprehensive API testing
- Environment variables for easy endpoint configuration
- Pre-configured requests for all authentication, user, account, and admin operations
- Test cases for both success and error scenarios

### Frontend Testing
- Manual testing through the web interface
- Real-time validation of all CRUD operations
- Cross-browser compatibility testing
- Responsive design testing across devices

## Deployment Considerations

### Environment Variables
Ensure all production environment variables are properly configured:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, unique secret for production
- `PORT` - Production port configuration

### Database Setup
- MongoDB Atlas for cloud deployment
- Proper indexing for performance optimization
- Regular backup strategies
- Connection pooling for high availability

### Frontend Build
```bash
cd frontend
npm run build
```
- Optimized production build
- Static file serving configuration
- CDN integration ready

## Contributing

### Development Guidelines
1. Follow existing code structure and naming conventions
2. Implement proper error handling for all operations
3. Maintain responsive design principles
4. Test all changes across user and admin interfaces
5. Update documentation for any new features

### Code Standards
- Use modern JavaScript ES6+ features
- Implement proper React hooks and state management
- Follow RESTful API design principles
- Maintain clean, readable code with comments
- Ensure proper security practices

## Support and Maintenance

### Known Features
- Complete user authentication and authorization
- Full CRUD operations for users, accounts, and transactions
- Admin panel with comprehensive management capabilities
- Modern, responsive UI with glassmorphism design
- Real-time data updates and validation
- Secure API endpoints with proper error handling


