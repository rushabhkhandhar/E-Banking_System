const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Deposit money into account
exports.deposit = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { amount, description = 'Cash deposit' } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    if (amount > 50000) {
        return next(new AppError('Single deposit cannot exceed $50,000', 400));
    }

    // Find and verify account
    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id,
        isActive: true
    });

    if (!account) {
        return next(new AppError('Active account not found', 404));
    }

    // Update account balance and create transaction record
    try {
        // Update account balance
        const updatedAccount = await Account.findByIdAndUpdate(
            accountId,
            { $inc: { balance: amount } },
            { new: true }
        );

        // Create transaction record
        const newTransaction = await Transaction.create({
            user: req.user.id,
            toAccount: accountId,
            type: 'deposit',
            amount,
            description,
            balanceAfter: {
                toAccountBalance: updatedAccount.balance
            },
            status: 'completed'
        });

        res.status(200).json({
            status: 'success',
            message: 'Deposit successful',
            data: {
                transaction: {
                    id: newTransaction._id,
                    type: newTransaction.type,
                    amount: newTransaction.amount,
                    description: newTransaction.description,
                    balanceAfter: newTransaction.balanceAfter,
                    createdAt: newTransaction.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Deposit transaction error:', error);
        return next(new AppError('Transaction failed. Please try again.', 500));
    }
});

// Withdraw money from account
exports.withdraw = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { amount, description = 'Cash withdrawal' } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    if (amount > 10000) {
        return next(new AppError('Single withdrawal cannot exceed $10,000', 400));
    }

    // Find and verify account
    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id,
        isActive: true,
        isFrozen: false
    });

    if (!account) {
        return next(new AppError('Active account not found', 404));
    }

    // Check sufficient balance (including overdraft if applicable)
    const availableBalance = account.balance + (account.overdraftLimit || 0);
    if (amount > availableBalance) {
        return next(new AppError('Insufficient funds', 400));
    }

    // Update account balance and create transaction record
    try {
        // Update account balance
        const updatedAccount = await Account.findByIdAndUpdate(
            accountId,
            { $inc: { balance: -amount } },
            { new: true }
        );

        // Create transaction record  
        const newTransaction = await Transaction.create({
            user: req.user.id,
            fromAccount: accountId,
            type: 'withdrawal',
            amount: amount, // Store as positive amount
            description,
            balanceAfter: {
                fromAccountBalance: updatedAccount.balance
            },
            status: 'completed'
        });

        res.status(200).json({
            status: 'success',
            message: 'Withdrawal successful',
            data: {
                transaction: {
                    id: newTransaction._id,
                    type: newTransaction.type,
                    amount: newTransaction.amount, // Already positive
                    description: newTransaction.description,
                    balanceAfter: newTransaction.balanceAfter,
                    createdAt: newTransaction.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Withdrawal transaction error:', error);
        return next(new AppError('Transaction failed. Please try again.', 500));
    }
});

// Transfer money between accounts
exports.transfer = catchAsync(async (req, res, next) => {
    const { fromAccountId } = req.params;
    const { toAccountNumber, amount, description = 'Transfer' } = req.body;

    console.log('Transfer request:', { fromAccountId, toAccountNumber, amount, description, userId: req.user.id });

    // Validate input
    if (!toAccountNumber) {
        return next(new AppError('Destination account number is required', 400));
    }

    if (!amount || amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
    }

    if (amount > 25000) {
        return next(new AppError('Single transfer cannot exceed $25,000', 400));
    }

    // Find source account
    const fromAccount = await Account.findOne({
        _id: fromAccountId,
        userId: req.user.id,
        isActive: true,
        isFrozen: false
    });

    if (!fromAccount) {
        return next(new AppError('Source account not found or inactive', 404));
    }

    // Find destination account
    const toAccount = await Account.findOne({
        accountNumber: toAccountNumber,
        isActive: true,
        isFrozen: false
    });

    if (!toAccount) {
        return next(new AppError('Destination account not found or inactive', 404));
    }

    // Prevent self-transfer
    if (fromAccount._id.toString() === toAccount._id.toString()) {
        return next(new AppError('Cannot transfer to the same account', 400));
    }

    // Check sufficient balance
    const availableBalance = fromAccount.balance + (fromAccount.overdraftLimit || 0);
    if (amount > availableBalance) {
        return next(new AppError('Insufficient funds', 400));
    }

    // Get recipient details for transaction description
    const recipientUser = await User.findById(toAccount.userId).select('firstName lastName');

    // Use transaction session for atomicity
    const session = await Account.startSession();
    let transferTransaction;

    try {
        await session.withTransaction(async () => {
            // Update source account
            const updatedFromAccount = await Account.findByIdAndUpdate(
                fromAccountId,
                { 
                    $inc: { balance: -amount },
                    lastTransaction: new Date()
                },
                { new: true, session }
            );

            // Update destination account
            const updatedToAccount = await Account.findByIdAndUpdate(
                toAccount._id,
                { 
                    $inc: { balance: amount },
                    lastTransaction: new Date()
                },
                { new: true, session }
            );

            console.log('Account balances updated:', { 
                fromAccountBalance: updatedFromAccount.balance, 
                toAccountBalance: updatedToAccount.balance 
            });

            // Create single transaction record following the model
            transferTransaction = await Transaction.create([{
                fromAccount: fromAccount._id,
                toAccount: toAccount._id,
                user: req.user.id,
                type: 'transfer',
                amount: amount, // Store positive amount
                description: `${description} to ${recipientUser.firstName} ${recipientUser.lastName} (${toAccountNumber})`,
                balanceAfter: {
                    fromAccountBalance: updatedFromAccount.balance,
                    toAccountBalance: updatedToAccount.balance
                },
                status: 'completed'
            }], { session });

            transferTransaction = transferTransaction[0];
            console.log('Transfer transaction created:', transferTransaction);
        });
    } catch (error) {
        console.error('Transfer error:', error);
        return next(new AppError('Transfer failed. Please try again.', 500));
    } finally {
        await session.endSession();
    }

    res.status(200).json({
        status: 'success',
        message: 'Transfer successful',
        data: {
            transaction: {
                id: transferTransaction._id,
                type: transferTransaction.type,
                amount: amount,
                description: transferTransaction.description,
                balanceAfter: transferTransaction.balanceAfter,
                recipient: {
                    name: `${recipientUser.firstName} ${recipientUser.lastName}`,
                    accountNumber: toAccountNumber
                },
                createdAt: transferTransaction.createdAt
            }
        }
    });
});

// Get transaction history for an account
exports.getTransactionHistory = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { 
        page = 1, 
        limit = 20, 
        type, 
        startDate, 
        endDate,
        minAmount,
        maxAmount 
    } = req.query;

    // Verify account belongs to user
    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id
    });

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Build query - find transactions where this account is either fromAccount or toAccount
    const query = {
        $or: [
            { fromAccount: accountId },
            { toAccount: accountId }
        ]
    };

    if (type) {
        query.type = type;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = parseFloat(minAmount);
        if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .populate('fromAccount', 'accountNumber')
        .populate('toAccount', 'accountNumber')
        .populate('user', 'firstName lastName')
        .select('-__v');

    const totalTransactions = await Transaction.countDocuments(query);

    // Calculate summary statistics
    const summaryPipeline = [
        { $match: query },
        {
            $group: {
                _id: null,
                totalDeposits: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'deposit'] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalWithdrawals: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'withdrawal'] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalTransfersOut: {
                    $sum: {
                        $cond: [
                            { $and: [
                                { $eq: ['$type', 'transfer'] },
                                { $eq: ['$fromAccount', new mongoose.Types.ObjectId(accountId)] }
                            ]},
                            '$amount',
                            0
                        ]
                    }
                },
                totalTransfersIn: {
                    $sum: {
                        $cond: [
                            { $and: [
                                { $eq: ['$type', 'transfer'] },
                                { $eq: ['$toAccount', new mongoose.Types.ObjectId(accountId)] }
                            ]},
                            '$amount',
                            0
                        ]
                    }
                }
            }
        }
    ];

    const summary = await Transaction.aggregate(summaryPipeline);

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        totalResults: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: parseInt(page),
        data: {
            account: {
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                currentBalance: account.balance
            },
            transactions,
            summary: summary[0] || {
                totalDeposits: 0,
                totalWithdrawals: 0,
                totalTransfersOut: 0,
                totalTransfersIn: 0
            }
        }
    });
});

// Get all transactions for user (across all accounts)
exports.getAllUserTransactions = catchAsync(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        type, 
        startDate, 
        endDate 
    } = req.query;

    // Get all user's accounts
    const userAccounts = await Account.find({
        userId: req.user.id
    }).select('_id accountNumber accountType');

    const accountIds = userAccounts.map(acc => acc._id);

    // Build query - find transactions where user's accounts are involved
    const query = {
        $or: [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ]
    };

    if (type) {
        query.type = type;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .populate('fromAccount', 'accountNumber accountType')
        .populate('toAccount', 'accountNumber accountType')
        .populate('user', 'firstName lastName')
        .select('-__v');

    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        totalResults: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: parseInt(page),
        data: {
            transactions,
            accounts: userAccounts
        }
    });
});

// Get transaction by ID
exports.getTransaction = catchAsync(async (req, res, next) => {
    const { transactionId } = req.params;

    // Get user's accounts to verify transaction belongs to user
    const userAccounts = await Account.find({
        userId: req.user.id
    }).select('_id');

    const accountIds = userAccounts.map(acc => acc._id);

    const transaction = await Transaction.findOne({
        _id: transactionId,
        $or: [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ]
    })
    .populate('fromAccount', 'accountNumber accountType')
    .populate('toAccount', 'accountNumber accountType')
    .populate('user', 'firstName lastName')
    .select('-__v');

    if (!transaction) {
        return next(new AppError('Transaction not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            transaction
        }
    });
});

// Admin only - Get all transactions
exports.getAllTransactions = catchAsync(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 50, 
        type, 
        status,
        startDate, 
        endDate,
        accountId,
        userId 
    } = req.query;

    // Build query
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    
    // Handle accountId filtering
    if (accountId) {
        query.$or = [
            { fromAccount: accountId },
            { toAccount: accountId }
        ];
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // If userId is provided, get accounts for that user
    if (userId) {
        const userAccounts = await Account.find({ userId }).select('_id');
        const accountIds = userAccounts.map(acc => acc._id);
        query.$or = [
            { fromAccount: { $in: accountIds } },
            { toAccount: { $in: accountIds } }
        ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .populate({
            path: 'fromAccount',
            select: 'accountNumber accountType userId',
            populate: {
                path: 'userId',
                select: 'firstName lastName email'
            }
        })
        .populate({
            path: 'toAccount',
            select: 'accountNumber accountType userId',
            populate: {
                path: 'userId',
                select: 'firstName lastName email'
            }
        })
        .populate('user', 'firstName lastName email')
        .select('-__v');

    const totalTransactions = await Transaction.countDocuments(query);

    // Get summary statistics
    const summaryPipeline = [
        { $match: query },
        {
            $group: {
                _id: null,
                totalVolume: { $sum: { $abs: '$amount' } },
                totalCount: { $sum: 1 },
                avgAmount: { $avg: { $abs: '$amount' } }
            }
        }
    ];

    const summary = await Transaction.aggregate(summaryPipeline);

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        totalResults: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: parseInt(page),
        data: {
            transactions,
            summary: summary[0] || {
                totalVolume: 0,
                totalCount: 0,
                avgAmount: 0
            }
        }
    });
});

// Admin only - Reverse transaction (for errors)
exports.reverseTransaction = catchAsync(async (req, res, next) => {
    const { transactionId } = req.params;
    const { reason } = req.body;

    // Find the original transaction
    const originalTransaction = await Transaction.findById(transactionId)
        .populate('fromAccount')
        .populate('toAccount');

    if (!originalTransaction) {
        return next(new AppError('Transaction not found', 404));
    }

    if (originalTransaction.status === 'reversed') {
        return next(new AppError('Transaction has already been reversed', 400));
    }

    if (originalTransaction.status !== 'completed') {
        return next(new AppError('Can only reverse completed transactions', 400));
    }

    // Use transaction session for atomicity
    const session = await Account.startSession();

    try {
        await session.withTransaction(async () => {
            if (originalTransaction.type === 'transfer') {
                // Reverse transfer: reverse both accounts
                if (originalTransaction.fromAccount) {
                    await Account.findByIdAndUpdate(
                        originalTransaction.fromAccount._id,
                        { $inc: { balance: originalTransaction.amount } },
                        { session }
                    );
                }
                
                if (originalTransaction.toAccount) {
                    await Account.findByIdAndUpdate(
                        originalTransaction.toAccount._id,
                        { $inc: { balance: -originalTransaction.amount } },
                        { session }
                    );
                }
            } else if (originalTransaction.type === 'deposit') {
                // Reverse deposit
                await Account.findByIdAndUpdate(
                    originalTransaction.toAccount._id,
                    { $inc: { balance: -originalTransaction.amount } },
                    { session }
                );
            } else if (originalTransaction.type === 'withdrawal') {
                // Reverse withdrawal
                await Account.findByIdAndUpdate(
                    originalTransaction.fromAccount._id,
                    { $inc: { balance: originalTransaction.amount } },
                    { session }
                );
            }

            // Mark original transaction as reversed
            await Transaction.findByIdAndUpdate(
                transactionId,
                { 
                    status: 'reversed',
                    reversalReason: reason || 'Administrative reversal'
                },
                { session }
            );

            // Create reversal transaction record
            let reversalData = {
                user: originalTransaction.user,
                amount: originalTransaction.amount,
                description: `Reversal of transaction ${transactionId} - ${reason || 'Administrative reversal'}`,
                status: 'completed'
            };

            // Add appropriate account fields and type based on original transaction type
            if (originalTransaction.type === 'deposit') {
                // For deposit reversal, create a withdrawal from the account that received the deposit
                reversalData.type = 'withdrawal';
                reversalData.fromAccount = originalTransaction.toAccount._id;
            } else if (originalTransaction.type === 'withdrawal') {
                // For withdrawal reversal, create a deposit to the account that originally sent the withdrawal
                reversalData.type = 'deposit';
                reversalData.toAccount = originalTransaction.fromAccount._id;
            } else if (originalTransaction.type === 'transfer') {
                // For transfer reversal, create a reverse transfer
                reversalData.type = 'transfer';
                reversalData.fromAccount = originalTransaction.toAccount._id;
                reversalData.toAccount = originalTransaction.fromAccount._id;
            }

            await Transaction.create([reversalData], { session });
        });
    } catch (error) {
        console.error('Transaction reversal error:', error);
        return next(new AppError('Transaction reversal failed. Please try again.', 500));
    } finally {
        await session.endSession();
    }

    res.status(200).json({
        status: 'success',
        message: 'Transaction reversed successfully',
        data: {
            originalTransactionId: transactionId,
            reversalReason: reason || 'Administrative reversal'
        }
    });
});
