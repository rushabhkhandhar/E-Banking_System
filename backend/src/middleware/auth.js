const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

// Generate JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Create and send token response
const createSendToken = (user, statusCode, res, message = 'Success') => {
    const token = signToken(user._id);
    
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            user
        }
    });
};

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id).select('+loginAttempts +lockUntil');
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        // 4) Check if user is active
        if (!currentUser.isActive) {
            return res.status(401).json({
                status: 'fail',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // 5) Check if user account is locked
        if (currentUser.isLocked) {
            return res.status(423).json({
                status: 'fail',
                message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
            });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid token. Please log in again!'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Your token has expired! Please log in again.'
            });
        }
        
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong during authentication'
        });
    }
};

// Restrict to certain roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Check if user is logged in (for conditional rendering)
const isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const currentUser = await User.findById(decoded.id);
            
            if (currentUser && currentUser.isActive) {
                req.user = currentUser;
                return next();
            }
        }
    } catch (error) {
        // If there's an error, just continue without setting req.user
    }
    next();
};

// Rate limiting for sensitive operations
const createRateLimiter = (windowMs, max, message) => {
    const attempts = new Map();
    
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean old entries
        for (const [ip, timestamps] of attempts.entries()) {
            attempts.set(ip, timestamps.filter(time => time > windowStart));
            if (attempts.get(ip).length === 0) {
                attempts.delete(ip);
            }
        }
        
        // Check current IP
        const ipAttempts = attempts.get(key) || [];
        
        if (ipAttempts.length >= max) {
            return res.status(429).json({
                status: 'fail',
                message: message || 'Too many requests, please try again later.'
            });
        }
        
        // Add current attempt
        ipAttempts.push(now);
        attempts.set(key, ipAttempts);
        
        next();
    };
};

// Specific rate limiters
const loginLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many login attempts, please try again in 15 minutes.'
);

const transactionLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    10, // 10 transactions
    'Too many transactions, please wait a minute before trying again.'
);

module.exports = {
    signToken,
    createSendToken,
    protect,
    restrictTo,
    isLoggedIn,
    loginLimiter,
    transactionLimiter
};
