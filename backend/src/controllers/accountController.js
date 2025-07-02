const Account = require('../models/Account');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create a new account
exports.createAccount = catchAsync(async (req, res, next) => {
    const { accountType, initialDeposit = 0 } = req.body;
    
    // Validate account type
    const validTypes = ['checking', 'savings', 'business'];
    if (!validTypes.includes(accountType)) {
        return next(new AppError('Invalid account type. Must be checking, savings, or business', 400));
    }

    // Check if user already has this type of account
    const existingAccount = await Account.findOne({
        userId: req.user.id,
        accountType,
        isActive: true
    });

    if (existingAccount) {
        return next(new AppError(`You already have an active ${accountType} account`, 400));
    }

    // Generate unique account number
    let accountNumber;
    let isUnique = false;
    
    while (!isUnique) {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existingAcct = await Account.findOne({ accountNumber });
        if (!existingAcct) isUnique = true;
    }

    // Create the account
    const account = await Account.create({
        userId: req.user.id,
        accountNumber,
        accountType,
        balance: initialDeposit,
        currency: 'USD'
    });

    // If there's an initial deposit, create a transaction record
    if (initialDeposit > 0) {
        await Transaction.create({
            user: req.user.id,
            toAccount: account._id,
            type: 'deposit',
            amount: initialDeposit,
            description: 'Initial deposit - Account opening',
            balanceAfter: {
                toAccountBalance: initialDeposit
            },
            status: 'completed'
        });
    }

    res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: {
            account: {
                id: account._id,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                currency: account.currency,
                status: account.status,
                createdAt: account.createdAt
            }
        }
    });
});

// Get all accounts for the current user
exports.getMyAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Account.find({
        userId: req.user.id,
        isActive: true
    }).select('-__v');

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: {
            accounts
        }
    });
});

// Get all accounts available for transfer (all accounts in database)
exports.getTransferableAccounts = catchAsync(async (req, res, next) => {
    // Get ALL active accounts in the database
    const accounts = await Account.find({
        isActive: true // Only include active accounts
    })
        .populate('userId', 'firstName lastName')
        .select('accountNumber accountType userId balance')
        .sort('accountNumber');

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: {
            accounts
        }
    });
});

// Get a specific account by ID
exports.getAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;

    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id
    }).select('-__v');

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            account
        }
    });
});

// Update account settings
exports.updateAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const allowedUpdates = ['overdraftLimit', 'interestRate', 'overdraftProtection', 'description'];
    
    // Filter out non-allowed updates
    const updates = {};
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new AppError('No valid updates provided', 400));
    }

    const account = await Account.findOneAndUpdate(
        { _id: accountId, userId: req.user.id },
        updates,
        { new: true, runValidators: true }
    ).select('-__v');

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

// Freeze account
exports.freezeAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { reason } = req.body;

    const account = await Account.findOneAndUpdate(
        { _id: accountId, userId: req.user.id, isActive: true, isFrozen: false },
        { 
            isFrozen: true,
            lastStatusChange: new Date(),
            statusChangeReason: reason || 'Account frozen by user request'
        },
        { new: true }
    ).select('-__v');

    if (!account) {
        return next(new AppError('Active account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Account frozen successfully',
        data: {
            account
        }
    });
});

// Unfreeze account
exports.unfreezeAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;

    const account = await Account.findOneAndUpdate(
        { _id: accountId, userId: req.user.id, isActive: true, isFrozen: true },
        { 
            isFrozen: false,
            lastStatusChange: new Date(),
            statusChangeReason: 'Account unfrozen by user request'
        },
        { new: true }
    ).select('-__v');

    if (!account) {
        return next(new AppError('Frozen account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Account unfrozen successfully',
        data: {
            account
        }
    });
});

// Close account
exports.closeAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { reason, transferToAccountId } = req.body;

    // Validate accountId format
    if (!accountId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new AppError('Invalid account ID format', 400));
    }

    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id,
        isActive: true
    });

    if (!account) {
        return next(new AppError('Account not found or already closed', 404));
    }

    // Check if account has balance
    if (account.balance > 0) {
        if (!transferToAccountId) {
            return next(new AppError('Account has balance. Please specify transferToAccountId to transfer remaining funds', 400));
        }

        // Validate transferToAccountId format
        if (!transferToAccountId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new AppError('Invalid transfer account ID format', 400));
        }

        // Verify transfer account exists and belongs to user
        const transferAccount = await Account.findOne({
            _id: transferToAccountId,
            userId: req.user.id,
            isActive: true
        });

        if (!transferAccount) {
            return next(new AppError('Transfer account not found or not active', 404));
        }

        if (transferAccount._id.toString() === account._id.toString()) {
            return next(new AppError('Cannot transfer to the same account', 400));
        }

        // Transfer balance
        const transferAmount = account.balance;
        
        // Start transaction session for atomicity
        const session = await Account.startSession();
        await session.withTransaction(async () => {
            // Deduct from source account
            await Account.findByIdAndUpdate(
                account._id,
                { 
                    $inc: { balance: -transferAmount },
                    isActive: false,
                    lastStatusChange: new Date(),
                    statusChangeReason: reason || 'Account closed by user request'
                },
                { session }
            );

            // Add to destination account
            await Account.findByIdAndUpdate(
                transferAccount._id,
                { $inc: { balance: transferAmount } },
                { session }
            );

            // Create transaction record for the balance transfer
            await Transaction.create([{
                user: req.user.id,
                fromAccount: account._id,
                toAccount: transferAccount._id,
                type: 'transfer',
                amount: transferAmount,
                description: `Account closure - balance transfer from ${account.accountNumber} to ${transferAccount.accountNumber}`,
                balanceAfter: {
                    fromAccountBalance: 0,
                    toAccountBalance: transferAccount.balance + transferAmount
                },
                status: 'completed'
            }], { session });
        });
        await session.endSession();
    } else {
        // No balance to transfer, just close the account
        await Account.findByIdAndUpdate(account._id, {
            isActive: false,
            lastStatusChange: new Date(),
            statusChangeReason: reason || 'Account closed by user request'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Account closed successfully',
        data: {
            message: account.balance > 0 
                ? `Account closed and remaining balance of $${account.balance} transferred to account ${transferToAccountId}`
                : 'Account closed successfully'
        }
    });
});

// Get account statement
exports.getAccountStatement = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    // Verify account belongs to user
    const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id
    });

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    // Build query for transactions
    const query = { accountId };
    
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .select('-__v');

    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        totalResults: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: page,
        data: {
            account: {
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                currentBalance: account.balance,
                currency: account.currency
            },
            transactions,
            summary: {
                statementPeriod: {
                    from: startDate || 'Beginning',
                    to: endDate || 'Present'
                }
            }
        }
    });
});

// Admin only - Get all accounts
exports.getAllAccounts = catchAsync(async (req, res, next) => {
    const { status, accountType, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (accountType) query.accountType = accountType;

    const skip = (page - 1) * limit;
    
    const accounts = await Account.find(query)
        .populate('userId', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .select('-__v');

    const totalAccounts = await Account.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        totalResults: totalAccounts,
        totalPages: Math.ceil(totalAccounts / limit),
        currentPage: page,
        data: {
            accounts
        }
    });
});

// Admin only - Force close account
exports.forceCloseAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const { reason } = req.body;

    const account = await Account.findByIdAndUpdate(
        accountId,
        {
            status: 'closed',
            lastStatusChange: new Date(),
            statusChangeReason: reason || 'Account closed by administrator'
        },
        { new: true }
    ).populate('userId', 'firstName lastName email');

    if (!account) {
        return next(new AppError('Account not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Account force closed successfully',
        data: {
            account
        }
    });
});

// Admin only - Update any account
exports.adminUpdateAccount = catchAsync(async (req, res, next) => {
    const { accountId } = req.params;
    const allowedUpdates = ['status', 'overdraftLimit', 'interestRate', 'statusChangeReason'];
    
    // Filter out non-allowed updates
    const updates = {};
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new AppError('No valid updates provided', 400));
    }

    if (updates.status) {
        updates.lastStatusChange = new Date();
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
