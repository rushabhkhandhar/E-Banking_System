const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: function() {
            return this.type !== 'deposit';
        }
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: function() {
            return this.type !== 'withdrawal' && this.type !== 'fee';
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Transaction must be associated with a user']
    },
    type: {
        type: String,
        enum: ['transfer', 'deposit', 'withdrawal', 'payment', 'fee', 'interest', 'refund', 'reversal'],
        required: [true, 'Transaction type is required']
    },
    amount: {
        type: Number,
        required: [true, 'Transaction amount is required'],
        min: [0.01, 'Transaction amount must be greater than 0']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
    },
    description: {
        type: String,
        required: [true, 'Transaction description is required'],
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    reference: {
        type: String,
        maxlength: [50, 'Reference cannot exceed 50 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled', 'processing'],
        default: 'pending'
    },
    category: {
        type: String,
        enum: [
            'food_dining', 'shopping', 'entertainment', 'transportation', 
            'bills_utilities', 'healthcare', 'education', 'travel', 
            'investment', 'savings', 'charity', 'other'
        ],
        default: 'other'
    },
    balanceAfter: {
        fromAccountBalance: Number,
        toAccountBalance: Number
    },
    fees: {
        type: Number,
        default: 0,
        min: [0, 'Fees cannot be negative']
    },
    exchangeRate: {
        type: Number,
        default: 1,
        min: [0, 'Exchange rate must be positive']
    },
    scheduledDate: {
        type: Date
    },
    processedDate: {
        type: Date
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringConfig: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        nextExecutionDate: Date,
        endDate: Date,
        executionCount: {
            type: Number,
            default: 0
        },
        maxExecutions: Number
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        deviceId: String,
        location: {
            latitude: Number,
            longitude: Number,
            city: String,
            country: String
        }
    },
    failureReason: String,
    reversalTransactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    parentTransactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency || 'USD'
    }).format(this.amount);
});

// Virtual to check if transaction is reversible
transactionSchema.virtual('isReversible').get(function() {
    const reversibleTypes = ['transfer', 'payment'];
    const timeLimit = 24 * 60 * 60 * 1000; // 24 hours
    const timeSinceCreation = Date.now() - this.createdAt.getTime();
    
    return reversibleTypes.includes(this.type) && 
           this.status === 'completed' && 
           timeSinceCreation <= timeLimit &&
           !this.reversalTransactionId;
});

// Virtual for transaction direction (for a specific account)
transactionSchema.virtual('getDirection').get(function() {
    return function(accountId) {
        if (this.fromAccount && this.fromAccount.toString() === accountId.toString()) {
            return 'outgoing';
        } else if (this.toAccount && this.toAccount.toString() === accountId.toString()) {
            return 'incoming';
        }
        return 'unknown';
    }.bind(this);
});

// Pre-save middleware to set processed date when status changes to completed
transactionSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'completed' && !this.processedDate) {
        this.processedDate = new Date();
    }
    next();
});

// Pre-save middleware to validate transaction logic
transactionSchema.pre('save', function(next) {
    // Validate that fromAccount and toAccount are different for transfers
    if (this.type === 'transfer' && 
        this.fromAccount && this.toAccount && 
        this.fromAccount.toString() === this.toAccount.toString()) {
        return next(new Error('Cannot transfer to the same account'));
    }
    
    // Set scheduled date to current time if not provided and not recurring
    if (!this.scheduledDate && !this.isRecurring) {
        this.scheduledDate = new Date();
    }
    
    next();
});

// Static method to get transaction summary for an account
transactionSchema.statics.getAccountSummary = async function(accountId, startDate, endDate) {
    const matchStage = {
        $or: [
            { fromAccount: accountId },
            { toAccount: accountId }
        ],
        status: 'completed'
    };
    
    if (startDate && endDate) {
        matchStage.processedDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    
    const summary = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalIncoming: {
                    $sum: {
                        $cond: [
                            { $eq: ['$toAccount', accountId] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalOutgoing: {
                    $sum: {
                        $cond: [
                            { $eq: ['$fromAccount', accountId] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalFees: { $sum: '$fees' }
            }
        }
    ]);
    
    return summary.length > 0 ? summary[0] : {
        totalTransactions: 0,
        totalIncoming: 0,
        totalOutgoing: 0,
        totalFees: 0
    };
};

// Static method to get transactions by category
transactionSchema.statics.getTransactionsByCategory = async function(userId, startDate, endDate) {
    const matchStage = {
        user: userId,
        status: 'completed'
    };
    
    if (startDate && endDate) {
        matchStage.processedDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    
    return await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                transactionCount: { $sum: 1 }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);
};

// Instance method to create reversal transaction
transactionSchema.methods.createReversal = async function(reason) {
    if (!this.isReversible) {
        throw new Error('Transaction is not reversible');
    }
    
    const reversalData = {
        fromAccount: this.toAccount,
        toAccount: this.fromAccount,
        user: this.user,
        type: 'refund',
        amount: this.amount,
        currency: this.currency,
        description: `Reversal: ${this.description}`,
        reference: `REV-${this.reference || this._id}`,
        parentTransactionId: this._id,
        metadata: {
            reversalReason: reason
        }
    };
    
    const Transaction = this.constructor;
    const reversalTransaction = new Transaction(reversalData);
    await reversalTransaction.save();
    
    // Mark original transaction as reversed
    this.reversalTransactionId = reversalTransaction._id;
    await this.save();
    
    return reversalTransaction;
};

// Indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ fromAccount: 1, createdAt: -1 });
transactionSchema.index({ toAccount: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ scheduledDate: 1 });
transactionSchema.index({ processedDate: 1 });
transactionSchema.index({ 'recurringConfig.nextExecutionDate': 1 }, { sparse: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
