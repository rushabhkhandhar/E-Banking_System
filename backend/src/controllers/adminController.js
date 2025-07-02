const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get system dashboard statistics
exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get basic counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAccounts = await Account.countDocuments({ isActive: true }); // Only count active accounts
    const activeAccounts = await Account.countDocuments({ isActive: true });
    const frozenAccounts = await Account.countDocuments({ isFrozen: true, isActive: true }); // Only count frozen accounts that are still active
    const closedAccounts = await Account.countDocuments({ isActive: false });

    // Get transaction statistics
    const transactionStats = await Transaction.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalVolume: { $sum: '$amount' },
                avgTransactionAmount: { $avg: '$amount' },
                totalDeposits: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0]
                    }
                },
                totalWithdrawals: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0]
                    }
                },
                totalTransfers: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'transfer'] }, '$amount', 0]
                    }
                },
                depositCount: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'deposit'] }, 1, 0]
                    }
                },
                withdrawalCount: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'withdrawal'] }, 1, 0]
                    }
                },
                transferCount: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'transfer'] }, 1, 0]
                    }
                }
            }
        }
    ]);

    // Get account balance statistics
    const accountStats = await Account.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: null,
                totalBalance: { $sum: '$balance' },
                avgBalance: { $avg: '$balance' },
                maxBalance: { $max: '$balance' },
                minBalance: { $min: '$balance' }
            }
        }
    ]);

    // Get recent user registrations
    const recentUsers = await User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt isActive');

    // Get daily transaction trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrends = await Transaction.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    }
                },
                count: { $sum: 1 },
                volume: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.date': 1 } }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            userStats: {
                totalUsers,
                recentUsers
            },
            accountStats: {
                totalAccounts,
                activeAccounts,
                frozenAccounts,
                closedAccounts,
                balanceStats: accountStats[0] || {
                    totalBalance: 0,
                    avgBalance: 0,
                    maxBalance: 0,
                    minBalance: 0
                }
            },
            transactionStats: transactionStats[0] || {
                totalTransactions: 0,
                totalVolume: 0,
                avgTransactionAmount: 0,
                totalDeposits: 0,
                totalWithdrawals: 0,
                totalTransfers: 0,
                depositCount: 0,
                withdrawalCount: 0,
                transferCount: 0
            },
            trends: {
                dailyTransactions: dailyTrends
            }
        }
    });
});

// Get all users with pagination and filters
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const {
        page = 1,
        limit = 20,
        search,
        isActive,
        isEmailVerified,
        role = 'user'
    } = req.query;

    // Build query
    const query = { role };

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    if (isEmailVerified !== undefined) {
        query.isEmailVerified = isEmailVerified === 'true';
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .select('-password -passwordResetToken -emailVerificationToken -__v')
        .populate({
            path: 'accounts',
            select: 'accountNumber accountType balance isActive isFrozen'
        });

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: users.length,
        totalResults: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: parseInt(page),
        data: {
            users
        }
    });
});

// Get user details with accounts and recent transactions
exports.getUserDetails = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId)
        .select('-password -passwordResetToken -emailVerificationToken -__v');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Get user's accounts
    const accounts = await Account.find({ userId })
        .select('-__v');

    // Get recent transactions for user's accounts
    const accountIds = accounts.map(acc => acc._id);
    const recentTransactions = await Transaction.find({
        $or: [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('fromAccount', 'accountNumber')
    .populate('toAccount', 'accountNumber')
    .select('-__v');

    // Get user's transaction statistics
    const transactionStats = await Transaction.aggregate([
        {
            $match: {
                $or: [
                    { fromAccount: { $in: accountIds } },
                    { toAccount: { $in: accountIds } }
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalVolume: { $sum: '$amount' },
                depositCount: {
                    $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, 1, 0] }
                },
                withdrawalCount: {
                    $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, 1, 0] }
                },
                transferCount: {
                    $sum: { $cond: [{ $eq: ['$type', 'transfer'] }, 1, 0] }
                }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            user,
            accounts,
            recentTransactions,
            stats: transactionStats[0] || {
                totalTransactions: 0,
                totalVolume: 0,
                depositCount: 0,
                withdrawalCount: 0,
                transferCount: 0
            }
        }
    });
});

// Freeze/Unfreeze user account
exports.toggleAccountFreeze = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { freeze, reason } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    const updatedAccount = await Account.findByIdAndUpdate(
        accountId,
        { 
            isFrozen: freeze,
            ...(freeze && { freezeReason: reason })
        },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: `Account ${freeze ? 'frozen' : 'unfrozen'} successfully`,
        data: {
            account: updatedAccount
        }
    });
});

// Activate/Deactivate user
exports.toggleUserStatus = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { isActive, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.role === 'admin') {
        return next(new AppError('Cannot modify admin user status', 403));
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
            isActive,
            ...(reason && { statusChangeReason: reason })
        },
        { new: true }
    ).select('-password -passwordResetToken -emailVerificationToken');

    // Also update all user's accounts
    if (!isActive) {
        await Account.updateMany(
            { userId },
            { isFrozen: true, freezeReason: reason || 'User account deactivated' }
        );
    }

    res.status(200).json({
        status: 'success',
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            user: updatedUser
        }
    });
});

// Manual deposit/withdrawal for admin
exports.manualDeposit = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { amount, description = 'Manual admin deposit', reason } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    // Find account
    const account = await Account.findById(accountId);
    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Check if account is active
    if (!account.isActive) {
        return next(new AppError('Cannot perform transactions on a closed account', 400));
    }

    // Check if account is frozen
    if (account.isFrozen) {
        return next(new AppError('Cannot perform transactions on a frozen account', 400));
    }

    // Update account balance and create transaction record
    const updatedAccount = await Account.findByIdAndUpdate(
        accountId,
        { $inc: { balance: amount } },
        { new: true }
    );

    // Create transaction record
    const newTransaction = await Transaction.create({
        user: account.userId,
        toAccount: accountId,
        type: 'deposit',
        amount,
        description: `${description} - Admin: ${req.user.firstName} ${req.user.lastName}`,
        balanceAfter: {
            toAccountBalance: updatedAccount.balance
        },
        status: 'completed',
        metadata: {
            adminUserId: req.user.id,
            adminReason: reason
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Manual deposit successful',
        data: {
            transaction: newTransaction,
            newBalance: updatedAccount.balance
        }
    });
});

exports.manualWithdrawal = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { amount, description = 'Manual admin withdrawal', reason } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    // Find account
    const account = await Account.findById(accountId);
    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Check if account is active
    if (!account.isActive) {
        return next(new AppError('Cannot perform transactions on a closed account', 400));
    }

    // Check if account is frozen
    if (account.isFrozen) {
        return next(new AppError('Cannot perform transactions on a frozen account', 400));
    }

    // Check if account has sufficient balance (admin can override)
    if (account.balance < amount) {
        return next(new AppError('Insufficient funds in account', 400));
    }

    // Update account balance and create transaction record
    const updatedAccount = await Account.findByIdAndUpdate(
        accountId,
        { $inc: { balance: -amount } },
        { new: true }
    );

    // Create transaction record
    const newTransaction = await Transaction.create({
        user: account.userId,
        fromAccount: accountId,
        type: 'withdrawal',
        amount,
        description: `${description} - Admin: ${req.user.firstName} ${req.user.lastName}`,
        balanceAfter: {
            fromAccountBalance: updatedAccount.balance
        },
        status: 'completed',
        metadata: {
            adminUserId: req.user.id,
            adminReason: reason
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Manual withdrawal successful',
        data: {
            transaction: newTransaction,
            newBalance: updatedAccount.balance
        }
    });
});

// Get all accounts (Admin only)
exports.getAllAccounts = catchAsync(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 50, 
        accountType, 
        isActive, 
        isFrozen,
        showClosed = 'false',
        sortBy = 'createdAt',
        order = 'desc'
    } = req.query;

    // Build query - By default, only show active accounts unless specifically requested
    const query = {};
    if (accountType) query.accountType = accountType;
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    } else if (showClosed === 'true') {
        // If specifically requesting to show closed accounts, don't filter by isActive
    } else {
        // Default to showing only active accounts
        query.isActive = true;
    }
    if (isFrozen !== undefined) query.isFrozen = isFrozen === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const accounts = await Account.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip(skip)
        .populate('userId', 'firstName lastName email phone')
        .select('-__v');

    const totalAccounts = await Account.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        totalResults: totalAccounts,
        totalPages: Math.ceil(totalAccounts / limit),
        currentPage: parseInt(page),
        data: {
            accounts
        }
    });
});

// Update account details (Admin only)
exports.updateAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { accountType, overdraftLimit, isActive, isFrozen } = req.body;

    const allowedUpdates = { accountType, overdraftLimit, isActive, isFrozen };
    const updates = {};
    
    // Only include provided fields
    Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] !== undefined) {
            updates[key] = allowedUpdates[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new AppError('No valid update fields provided', 400));
    }

    const account = await Account.findByIdAndUpdate(
        accountId,
        updates,
        { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Account updated successfully',
        data: {
            account
        }
    });
});

// Force close account (Admin only)
exports.forceCloseAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { reason, forceClose = false } = req.body;

    if (!reason) {
        return next(new AppError('Reason for account closure is required', 400));
    }

    const account = await Account.findById(accountId);
    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    if (!account.isActive) {
        return next(new AppError('Account is already closed', 400));
    }

    // Allow admin to force close accounts with positive balance if forceClose is true
    if (account.balance > 0 && !forceClose) {
        return next(new AppError(`Cannot close account with positive balance of $${account.balance.toFixed(2)}. Please withdraw funds first or use force close option.`, 400));
    }

    // Close the account
    const closedAccount = await Account.findByIdAndUpdate(
        accountId,
        { 
            isActive: false,
            closedAt: new Date(),
            closureReason: reason,
            closedBy: req.user.id,
            ...(account.balance > 0 && { finalBalance: account.balance })
        },
        { new: true }
    ).populate('userId', 'firstName lastName email');

    res.status(200).json({
        status: 'success',
        message: 'Account closed successfully',
        data: {
            account: closedAccount
        }
    });
});

// Delete user profile (Admin only)
exports.deleteUserProfile = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { reason = 'Administrative deletion' } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if user has active accounts
    const activeAccounts = await Account.find({ 
        userId: userId, 
        isActive: true 
    });

    if (activeAccounts.length > 0) {
        return next(new AppError('Cannot delete user with active accounts. Please close all accounts first.', 400));
    }

    // Check if user has positive balances
    const accountsWithBalance = await Account.find({ 
        userId: userId, 
        balance: { $gt: 0 } 
    });

    if (accountsWithBalance.length > 0) {
        return next(new AppError('Cannot delete user with accounts that have positive balances.', 400));
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Also delete all their accounts (which should be empty/closed)
    await Account.deleteMany({ userId: userId });

    res.status(200).json({
        status: 'success',
        message: 'User profile and associated accounts deleted successfully',
        data: {
            deletedUserId: userId,
            reason: reason,
            deletedBy: req.user.id,
            deletedAt: new Date()
        }
    });
});
