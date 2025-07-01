const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Account = require('../src/models/Account');
const Transaction = require('../src/models/Transaction');

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ebanking', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Create sample data
const createSampleData = async () => {
    try {
        console.log('🚀 Creating sample data...');

        // Create sample users
        const sampleUsers = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: await bcrypt.hash('password123', 12),
                role: 'user',
                isActive: true
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: await bcrypt.hash('password123', 12),
                role: 'user',
                isActive: true
            },
            {
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@example.com',
                password: await bcrypt.hash('password123', 12),
                role: 'user',
                isActive: false
            }
        ];

        // Insert users (skip if they already exist)
        const users = [];
        for (const userData of sampleUsers) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = await User.create(userData);
                console.log(`✅ Created user: ${user.email}`);
            } else {
                console.log(`⚠️  User already exists: ${user.email}`);
            }
            users.push(user);
        }

        // Create sample accounts
        const sampleAccounts = [
            {
                userId: users[0]._id,
                accountNumber: '1234567890',
                accountType: 'checking',
                balance: 5000.00,
                isActive: true,
                isFrozen: false
            },
            {
                userId: users[0]._id,
                accountNumber: '1234567891',
                accountType: 'savings',
                balance: 15000.00,
                isActive: true,
                isFrozen: false
            },
            {
                userId: users[1]._id,
                accountNumber: '2234567890',
                accountType: 'checking',
                balance: 3200.50,
                isActive: true,
                isFrozen: false
            },
            {
                userId: users[1]._id,
                accountNumber: '2234567891',
                accountType: 'savings',
                balance: 8750.25,
                isActive: true,
                isFrozen: true // This one is frozen
            },
            {
                userId: users[2]._id,
                accountNumber: '3234567890',
                accountType: 'checking',
                balance: 100.00,
                isActive: false,
                isFrozen: false
            }
        ];

        // Insert accounts (skip if they already exist)
        const accounts = [];
        for (const accountData of sampleAccounts) {
            let account = await Account.findOne({ accountNumber: accountData.accountNumber });
            if (!account) {
                account = await Account.create(accountData);
                console.log(`✅ Created account: ${account.accountNumber} for ${users.find(u => u._id.equals(account.userId)).email}`);
            } else {
                console.log(`⚠️  Account already exists: ${account.accountNumber}`);
            }
            accounts.push(account);
        }

        // Create sample transactions
        const sampleTransactions = [
            {
                user: users[0]._id,
                toAccount: accounts[0]._id,
                type: 'deposit',
                amount: 1000.00,
                description: 'Initial deposit',
                status: 'completed',
                balanceAfter: { toAccountBalance: 5000.00 }
            },
            {
                user: users[0]._id,
                fromAccount: accounts[0]._id,
                type: 'withdrawal',
                amount: 200.00,
                description: 'ATM withdrawal',
                status: 'completed',
                balanceAfter: { fromAccountBalance: 4800.00 }
            },
            {
                user: users[0]._id,
                fromAccount: accounts[0]._id,
                toAccount: accounts[1]._id,
                type: 'transfer',
                amount: 500.00,
                description: 'Transfer to savings',
                status: 'completed',
                balanceAfter: {
                    fromAccountBalance: 4300.00,
                    toAccountBalance: 15500.00
                }
            },
            {
                user: users[1]._id,
                toAccount: accounts[2]._id,
                type: 'deposit',
                amount: 2000.00,
                description: 'Salary deposit',
                status: 'completed',
                balanceAfter: { toAccountBalance: 3200.50 }
            },
            {
                user: users[1]._id,
                fromAccount: accounts[2]._id,
                toAccount: accounts[0]._id,
                type: 'transfer',
                amount: 150.00,
                description: 'Payment to John',
                status: 'completed',
                balanceAfter: {
                    fromAccountBalance: 3050.50,
                    toAccountBalance: 4450.00
                }
            },
            {
                user: users[1]._id,
                fromAccount: accounts[2]._id,
                type: 'withdrawal',
                amount: 75.00,
                description: 'Cash withdrawal',
                status: 'failed',
                balanceAfter: { fromAccountBalance: 3200.50 }
            }
        ];

        // Insert transactions (skip if collection is not empty)
        const existingTransactions = await Transaction.countDocuments();
        if (existingTransactions === 0) {
            const transactions = await Transaction.insertMany(sampleTransactions);
            console.log(`✅ Created ${transactions.length} sample transactions`);
        } else {
            console.log(`⚠️  Transactions already exist (${existingTransactions} transactions found)`);
        }

        console.log('\n🎉 Sample data creation completed!');
        console.log('\n📊 Summary:');
        console.log(`👥 Users: ${await User.countDocuments()}`);
        console.log(`🏦 Accounts: ${await Account.countDocuments()}`);
        console.log(`💳 Transactions: ${await Transaction.countDocuments()}`);
        
        console.log('\n🔐 Login credentials:');
        console.log('Regular users:');
        console.log('  john.doe@example.com / password123');
        console.log('  jane.smith@example.com / password123');
        console.log('  mike.johnson@example.com / password123 (inactive)');

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await createSampleData();
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
};

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { createSampleData };
