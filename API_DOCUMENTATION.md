# E-Banking System API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Routes (`/auth`)

### Public Routes (No Authentication Required)

#### POST `/auth/signup`
Register a new user account.
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

#### POST `/auth/login`
Login to an existing account.
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### POST `/auth/forgot-password`
Request password reset email.
```json
{
  "email": "john.doe@example.com"
}
```

#### PATCH `/auth/reset-password/:token`
Reset password using token from email.
```json
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### POST `/auth/verify-email/:token`
Verify email using token from email.

#### POST `/auth/resend-verification`
Resend email verification.
```json
{
  "email": "john.doe@example.com"
}
```

### Protected Routes (Authentication Required)

#### POST `/auth/logout`
Logout current session.

#### GET `/auth/me`
Get current user information.

#### PATCH `/auth/update-password`
Update password for authenticated user.
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

---

## User Routes (`/users`)

All user routes require authentication.

### User Profile Management

#### GET `/users/profile`
Get current user's profile information.

#### PATCH `/users/profile`
Update current user's profile.
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "1234567890",
  "address": {
    "street": "456 Oak St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101"
  }
}
```

#### GET `/users/dashboard`
Get user dashboard with account summaries and recent transactions.

#### GET `/users/transactions`
Get transaction history across all user accounts.
Query parameters: `page`, `limit`, `type`, `startDate`, `endDate`

#### GET `/users/account-statement/:accountId`
Get account statement for specific account.
Query parameters: `startDate`, `endDate`, `limit`, `page`

### Admin Only Routes

#### GET `/users/`
Get all users (admin only).
Query parameters: `page`, `limit`, `role`, `status`

#### GET `/users/:userId`
Get specific user by ID (admin only).

#### PATCH `/users/:userId`
Update any user (admin only).

#### DELETE `/users/:userId`
Delete user (admin only).

#### PATCH `/users/:userId/activate`
Activate user account (admin only).

#### PATCH `/users/:userId/deactivate`
Deactivate user account (admin only).

---

## Account Routes (`/accounts`)

All account routes require authentication.

### Account Management

#### POST `/accounts/`
Create a new account.
```json
{
  "accountType": "checking",
  "initialDeposit": 100
}
```

#### GET `/accounts/`
Get all accounts for current user.

#### GET `/accounts/:accountId`
Get specific account details.

#### PATCH `/accounts/:accountId`
Update account settings.
```json
{
  "overdraftLimit": 500,
  "interestRate": 0.02
}
```

### Account Status Management

#### PATCH `/accounts/:accountId/freeze`
Freeze an account.
```json
{
  "reason": "Security concern"
}
```

#### PATCH `/accounts/:accountId/unfreeze`
Unfreeze an account.

#### DELETE `/accounts/:accountId`
Close an account.
```json
{
  "reason": "Account no longer needed",
  "transferToAccountId": "account_id_for_remaining_balance"
}
```

#### GET `/accounts/:accountId/statement`
Get account statement.
Query parameters: `startDate`, `endDate`, `limit`, `page`

### Admin Only Routes

#### GET `/accounts/admin/all`
Get all accounts (admin only).
Query parameters: `status`, `accountType`, `page`, `limit`

#### PATCH `/accounts/admin/:accountId`
Update any account (admin only).

#### DELETE `/accounts/admin/:accountId/force-close`
Force close any account (admin only).

---

## Transaction Routes (`/transactions`)

All transaction routes require authentication.

### Transaction Operations

#### POST `/transactions/deposit/:accountId`
Deposit money into account.
```json
{
  "amount": 500,
  "description": "Paycheck deposit"
}
```

#### POST `/transactions/withdraw/:accountId`
Withdraw money from account.
```json
{
  "amount": 100,
  "description": "ATM withdrawal"
}
```

#### POST `/transactions/transfer/:fromAccountId`
Transfer money between accounts.
```json
{
  "toAccountNumber": "1234567890",
  "amount": 250,
  "description": "Rent payment"
}
```

### Transaction History

#### GET `/transactions/account/:accountId`
Get transaction history for specific account.
Query parameters: `page`, `limit`, `type`, `startDate`, `endDate`, `minAmount`, `maxAmount`

#### GET `/transactions/user/all`
Get all transactions for current user across all accounts.
Query parameters: `page`, `limit`, `type`, `startDate`, `endDate`

#### GET `/transactions/:transactionId`
Get specific transaction details.

### Admin Only Routes

#### GET `/transactions/admin/all`
Get all transactions (admin only).
Query parameters: `page`, `limit`, `type`, `status`, `startDate`, `endDate`, `accountId`, `userId`

#### PATCH `/transactions/admin/:transactionId/reverse`
Reverse a transaction (admin only).
```json
{
  "reason": "Transaction error"
}
```

---

## Health Check

#### GET `/health`
Check API health status.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "isOperational": true
  }
}
```

## Success Responses

All endpoints return consistent success responses:

```json
{
  "status": "success",
  "message": "Operation description",
  "data": {
    // Response data
  }
}
```

## Authentication

- Include JWT token in Authorization header: `Bearer <token>`
- Or token will be automatically included via httpOnly cookies
- Admin routes require user role to be 'admin'

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Higher limits may apply for authenticated users

## Pagination

Most list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:
```json
{
  "results": 10,
  "totalResults": 150,
  "totalPages": 15,
  "currentPage": 1,
  "data": {
    // Paginated results
  }
}
```
