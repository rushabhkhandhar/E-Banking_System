const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createSendToken } = require('../middleware/auth');

const signup = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        passwordConfirm,
        dateOfBirth,
        address
    } = req.body;

    // Check if password and passwordConfirm match
    if (password !== passwordConfirm) {
        return next(new AppError('Password and password confirmation do not match', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
    });

    if (existingUser) {
        return next(new AppError('User with this email or phone number already exists', 400));
    }

    // Create new user
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        dateOfBirth,
        address
    });

    // Generate unique account number for default account
    let accountNumber;
    let isUnique = false;
    
    while (!isUnique) {
        accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        const existingAcct = await Account.findOne({ accountNumber });
        if (!existingAcct) isUnique = true;
    }

    // Create default checking account for new user
    const defaultAccount = await Account.create({
        userId: newUser._id,
        accountNumber,
        accountType: 'checking',
        balance: 0,
        currency: 'USD'
    });

    // Generate email verification token (in a real app, you'd send an email)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    await newUser.save({ validateBeforeSave: false });

    // Log the user in by sending JWT
    createSendToken(newUser, 201, res, 'User registered successfully! Please verify your email.');
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    // Check if account is locked
    if (user && user.isLocked) {
        return next(new AppError('Account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
    }

    // Check password
    if (!user || !(await user.correctPassword(password, user.password))) {
        // If user exists, increment login attempts
        if (user) {
            await user.incLoginAttempts();
        }
        return next(new AppError('Incorrect email or password', 401));
    }

    // Check if user account is active
    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // 3) Reset login attempts and update last login
    if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
    }
    
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res, 'Logged in successfully!');
});

const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully!'
    });
};

const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email (in a real app)
    // For demo purposes, we'll just return the token
    res.status(200).json({
        status: 'success',
        message: 'Password reset token sent to email!',
        resetToken: resetToken // In production, this would be sent via email
    });
});

const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    const { password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
        return next(new AppError('Password and password confirmation do not match', 400));
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user (handled by pre-save middleware)

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res, 'Password reset successful!');
});

const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is incorrect.', 401));
    }

    // 3) Check if new password and confirmation match
    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Password and password confirmation do not match', 400));
    }

    // 4) If so, update password
    user.password = req.body.password;
    await user.save();

    // 5) Log user in, send JWT
    createSendToken(user, 200, res, 'Password updated successfully!');
});

const verifyEmail = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken: hashedToken
    });

    // 2) If token is valid, verify the email
    if (!user) {
        return next(new AppError('Token is invalid', 400));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully!'
    });
});

const resendVerificationEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide your email address', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return next(new AppError('No user found with that email address', 404));
    }

    if (user.isEmailVerified) {
        return next(new AppError('Email is already verified', 400));
    }

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');

    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email
    // const verifyURL = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verifyToken}`;
    // await sendEmail({
    //     email: user.email,
    //     subject: 'Email Verification (valid for 24 hours)',
    //     message: `Please verify your email by clicking: ${verifyURL}`
    // });

    res.status(200).json({
        status: 'success',
        message: 'Verification email sent! Please check your inbox.'
    });
});

const getMe = catchAsync(async (req, res, next) => {
    // Get user accounts
    const accounts = await Account.find({ user: req.user.id, isActive: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
            accounts
        }
    });
});

module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail,
    resendVerificationEmail,
    getMe
};
