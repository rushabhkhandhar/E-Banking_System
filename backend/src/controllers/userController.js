const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const accounts = await Account.find({ userId: req.user.id, isActive: true });

    res.status(200).json({
        status: 'success',
        data: {
            user,
            accounts
        }
    });
});

const updateProfile = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password updates. Please use /updatePassword.', 400)
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
        req.body,
        'firstName',
        'lastName',
        'phone',
        'address'
    );

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully!',
        data: {
            user: updatedUser
        }
    });
});

const deleteProfile = catchAsync(async (req, res, next) => {
    // Check if user has any active accounts with balance
    const accounts = await Account.find({ 
        userId: req.user.id, 
        isActive: true,
        balance: { $gt: 0 }
    });

    if (accounts.length > 0) {
        return next(
            new AppError('Cannot delete account with active balances. Please transfer or withdraw all funds first.', 400)
        );
    }

    // Deactivate user instead of deleting
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    // Deactivate all user accounts
    await Account.updateMany(
        { userId: req.user.id },
        { isActive: false }
    );

    res.status(204).json({
        status: 'success',
        message: 'Account deactivated successfully',
        data: null
    });
});

const deleteUserProfile = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if user has any active accounts with balance
    const accounts = await Account.find({ 
        userId: userId, 
        isActive: true,
        balance: { $gt: 0 }
    });

    if (accounts.length > 0) {
        return next(
            new AppError('Cannot delete user with active balances. Please transfer or withdraw all funds first.', 400)
        );
    }

    // Deactivate user instead of deleting
    await User.findByIdAndUpdate(userId, { isActive: false });

    // Deactivate all user accounts
    await Account.updateMany(
        { userId: userId },
        { isActive: false }
    );

    res.status(200).json({
        status: 'success',
        message: 'User account deactivated successfully',
        data: null
    });
});

const getDashboard = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // Get user accounts
    const accounts = await Account.find({ userId: userId, isActive: true });

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce((sum, account) => {
        if (account.accountType === 'credit') {
            return sum + account.availableBalance;
        }
        return sum + account.balance;
    }, 0);

    // Get recent transactions (last 10)
    const recentTransactions = await Transaction.find({
        $or: [
            { fromAccount: { $in: accounts.map(acc => acc._id) } },
            { toAccount: { $in: accounts.map(acc => acc._id) } }
        ],
        status: 'completed'
    })
    .populate('fromAccount', 'accountNumber accountType')
    .populate('toAccount', 'accountNumber accountType')
    .sort({ processedDate: -1 })
    .limit(10);

    // Get transaction summary for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyTransactions = await Transaction.find({
        user: userId,
        status: 'completed',
        processedDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    });

    const monthlySpending = monthlyTransactions
        .filter(t => t.fromAccount && accounts.some(acc => acc._id.toString() === t.fromAccount.toString()))
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = monthlyTransactions
        .filter(t => t.toAccount && accounts.some(acc => acc._id.toString() === t.toAccount.toString()))
        .reduce((sum, t) => sum + t.amount, 0);

    // Get spending by category for current month
    const spendingByCategory = await Transaction.getTransactionsByCategory(
        userId,
        startOfMonth,
        endOfMonth
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
            accounts,
            summary: {
                totalBalance,
                accountCount: accounts.length,
                monthlySpending,
                monthlyIncome,
                recentTransactionCount: recentTransactions.length
            },
            recentTransactions,
            spendingByCategory
        }
    });
});

const getTransactionHistory = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const {
        page = 1,
        limit = 20,
        accountId,
        type,
        category,
        startDate,
        endDate,
        minAmount,
        maxAmount
    } = req.query;

    // Build query
    const query = { user: userId, status: 'completed' };

    // Filter by account
    if (accountId) {
        // Verify the account belongs to the user
        const account = await Account.findOne({ _id: accountId, userId: userId });
        if (!account) {
            return next(new AppError('Account not found', 404));
        }
        query.$or = [
            { fromAccount: accountId },
            { toAccount: accountId }
        ];
    } else {
        // Get all user accounts
        const userAccounts = await Account.find({ userId: userId, isActive: true });
        const accountIds = userAccounts.map(acc => acc._id);
        query.$or = [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ];
    }

    // Filter by transaction type
    if (type) {
        query.type = type;
    }

    // Filter by category
    if (category) {
        query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
        query.processedDate = {};
        if (startDate) query.processedDate.$gte = new Date(startDate);
        if (endDate) query.processedDate.$lte = new Date(endDate);
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = parseFloat(minAmount);
        if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
        .populate('fromAccount', 'accountNumber accountType maskedAccountNumber')
        .populate('toAccount', 'accountNumber accountType maskedAccountNumber')
        .sort({ processedDate: -1 })
        .skip(skip)
        .limit(limit * 1);

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        pagination: {
            page: page * 1,
            limit: limit * 1,
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            transactions
        }
    });
});

const getAccountStatement = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify the account belongs to the user
    const account = await Account.findOne({ 
        _id: accountId, 
        user: req.user.id 
    }).populate('user', 'firstName lastName email');

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Set default date range (last 30 days if not provided)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get transactions for the account within date range
    const transactions = await Transaction.find({
        $or: [
            { fromAccount: accountId },
            { toAccount: accountId }
        ],
        status: 'completed',
        processedDate: {
            $gte: start,
            $lte: end
        }
    })
    .populate('fromAccount', 'accountNumber accountType')
    .populate('toAccount', 'accountNumber accountType')
    .sort({ processedDate: 1 });

    // Calculate summary
    const summary = await Transaction.getAccountSummary(accountId, start, end);

    res.status(200).json({
        status: 'success',
        data: {
            account,
            statement: {
                period: {
                    startDate: start,
                    endDate: end
                },
                summary,
                transactions
            }
        }
    });
});

// Admin only routes
const getAllUsers = catchAsync(async (req, res, next) => {
    const {
        page = 1,
        limit = 20,
        isActive,
        role,
        search
    } = req.query;

    // Build query
    const query = {};
    
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }
    
    if (role) {
        query.role = role;
    }
    
    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit * 1);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: users.length,
        pagination: {
            page: page * 1,
            limit: limit * 1,
            total,
            pages: Math.ceil(total / limit)
        },
        data: {
            users
        }
    });
});

const getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const accounts = await Account.find({ userId: user._id });

    res.status(200).json({
        status: 'success',
        data: {
            user,
            accounts
        }
    });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isActive },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            user
        }
    });
});

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    deleteUserProfile,
    getDashboard,
    getTransactionHistory,
    getAccountStatement,
    getAllUsers,
    getUserById,
    updateUserStatus
};
