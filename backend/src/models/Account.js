const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Account must belong to a user']
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        length: [12, 'Account number must be exactly 12 digits']
    },
    accountType: {
        type: String,
        enum: ['checking', 'savings', 'credit'],
        required: [true, 'Account type is required'],
        default: 'checking'
    },
    balance: {
        type: Number,
        required: [true, 'Account balance is required'],
        default: 0,
        min: [0, 'Balance cannot be negative for checking and savings accounts']
    },
    creditLimit: {
        type: Number,
        default: 0,
        min: [0, 'Credit limit cannot be negative']
    },
    availableBalance: {
        type: Number,
        default: function() {
            return this.accountType === 'credit' ? this.creditLimit + this.balance : this.balance;
        }
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    overdraftProtection: {
        type: Boolean,
        default: false
    },
    overdraftLimit: {
        type: Number,
        default: 0,
        min: [0, 'Overdraft limit cannot be negative']
    },
    interestRate: {
        type: Number,
        default: 0,
        min: [0, 'Interest rate cannot be negative'],
        max: [100, 'Interest rate cannot exceed 100%']
    },
    minimumBalance: {
        type: Number,
        default: 0,
        min: [0, 'Minimum balance cannot be negative']
    },
    monthlyMaintenanceFee: {
        type: Number,
        default: 0,
        min: [0, 'Monthly maintenance fee cannot be negative']
    },
    lastStatementDate: {
        type: Date,
        default: Date.now
    },
    nextStatementDate: {
        type: Date,
        default: function() {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return nextMonth;
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for formatted account number (XXXX-XXXX-XXXX)
accountSchema.virtual('formattedAccountNumber').get(function() {
    if (this.accountNumber && this.accountNumber.length === 12) {
        return this.accountNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return this.accountNumber;
});

// Virtual for masked account number (****-****-1234)
accountSchema.virtual('maskedAccountNumber').get(function() {
    if (this.accountNumber && this.accountNumber.length === 12) {
        const lastFour = this.accountNumber.slice(-4);
        return `****-****-${lastFour}`;
    }
    return this.accountNumber;
});

// Virtual to calculate available balance for credit accounts
accountSchema.virtual('calculatedAvailableBalance').get(function() {
    if (this.accountType === 'credit') {
        return this.creditLimit + this.balance; // balance will be negative for credit accounts
    }
    return this.balance;
});

// Pre-save middleware to generate account number
accountSchema.pre('save', async function(next) {
    if (!this.accountNumber) {
        // Generate a unique 12-digit account number
        let accountNumber;
        let isUnique = false;
        
        while (!isUnique) {
            // Generate random 12-digit number
            accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            
            // Check if this account number already exists
            const existingAccount = await this.constructor.findOne({ accountNumber });
            if (!existingAccount) {
                isUnique = true;
            }
        }
        
        this.accountNumber = accountNumber;
    }
    
    // Update available balance
    if (this.accountType === 'credit') {
        this.availableBalance = this.creditLimit + this.balance;
    } else {
        this.availableBalance = this.balance;
    }
    
    next();
});

// Pre-save middleware to validate balance constraints
accountSchema.pre('save', function(next) {
    // For checking and savings accounts, balance cannot be negative unless overdraft is enabled
    if ((this.accountType === 'checking' || this.accountType === 'savings') && 
        this.balance < 0 && !this.overdraftProtection) {
        return next(new Error('Balance cannot be negative without overdraft protection'));
    }
    
    // Check overdraft limit
    if (this.overdraftProtection && this.balance < -this.overdraftLimit) {
        return next(new Error('Balance cannot exceed overdraft limit'));
    }
    
    // For credit accounts, balance should not exceed credit limit (balance is negative spending)
    if (this.accountType === 'credit' && Math.abs(this.balance) > this.creditLimit) {
        return next(new Error('Credit balance cannot exceed credit limit'));
    }
    
    next();
});

// Instance method to check if transaction is allowed
accountSchema.methods.canWithdraw = function(amount) {
    if (!this.isActive || this.isFrozen) {
        return { allowed: false, reason: 'Account is not active or is frozen' };
    }
    
    if (this.accountType === 'credit') {
        const newBalance = this.balance - amount;
        if (Math.abs(newBalance) > this.creditLimit) {
            return { allowed: false, reason: 'Insufficient credit limit' };
        }
    } else {
        const newBalance = this.balance - amount;
        if (newBalance < 0 && !this.overdraftProtection) {
            return { allowed: false, reason: 'Insufficient funds' };
        }
        if (this.overdraftProtection && newBalance < -this.overdraftLimit) {
            return { allowed: false, reason: 'Overdraft limit exceeded' };
        }
    }
    
    return { allowed: true };
};

// Instance method to update balance
accountSchema.methods.updateBalance = async function(amount, type = 'debit') {
    if (type === 'credit') {
        this.balance += amount;
    } else {
        this.balance -= amount;
    }
    
    // Update available balance
    if (this.accountType === 'credit') {
        this.availableBalance = this.creditLimit + this.balance;
    } else {
        this.availableBalance = this.balance;
    }
    
    return await this.save();
};

// Indexes for better query performance
accountSchema.index({ user: 1 });
accountSchema.index({ accountNumber: 1 });
accountSchema.index({ accountType: 1 });
accountSchema.index({ isActive: 1 });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
