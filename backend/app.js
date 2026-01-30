require('dotenv').config();
const express = require('express');
const app = express();

// Trust proxy for Render/proxies to make rate limiting work correctly
app.set('trust proxy', 1);
const Cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorMiddleware');
const ErrorResponse = require('./utils/ErrorResponse');
const mongoSanitize = require('express-mongo-sanitize');
const xssFilters = require('xss-filters');
const AuthRoute = require('./routes/userAuth');
const HostAuth = require("./routes/hostsAuth");
const ProductRoute = require("./routes/products");
const userProducts = require("./routes/userProducts");
const userAddress = require("./routes/userAddress");
const authRoutes = require("./routes/auth");
const verificationRoutes = require("./routes/verification");

// CORS Configuration - MUST be FIRST, before helmet
app.use(Cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Authorization'],
    optionsSuccessStatus: 200
}));

// Security Headers - Configure to allow CORS
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// Logging
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express 5 Compatibility: Redefine req.query and req.params for sanitization
// Express 5 makes these read-only getters by default.
app.use((req, res, next) => {
    const query = req.query;
    const params = req.params;
    Object.defineProperty(req, 'query', {
        value: { ...query },
        writable: true,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(req, 'params', {
        value: { ...params },
        writable: true,
        enumerable: true,
        configurable: true
    });
    next();
});

// Input Sanitization - Must be after body parser and compatibility fix
// Re-enabling mongoSanitize
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized ${key} in request`);
    }
})); // Prevent MongoDB injection

// Custom XSS Sanitization Middleware for Express 5
const cleanXSS = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') return xssFilters.inHTMLData(obj).trim();
        return obj;
    }

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                cleanXSS(obj[key]);
            } else if (typeof obj[key] === 'string') {
                obj[key] = xssFilters.inHTMLData(obj[key]).trim();
            }
        }
    }
    return obj;
};

app.use((req, res, next) => {
    if (req.body) cleanXSS(req.body);
    if (req.query) cleanXSS(req.query);
    if (req.params) cleanXSS(req.params);
    next();
});

// Routes
app.use("/api/v1/auth", authRoutes); // Auth routes (refresh, logout)
app.use("/api/v1/auth", verificationRoutes); // Verification routes
app.use("/api/v1/user/auth", AuthRoute);
app.use("/api/v1/host/auth", HostAuth);
app.use("/api/v1/payment", require("./routes/payment")); // Payment routes
app.use("/api/v1/user/orders", require("./routes/userOrders")); // User order management
app.use("/api/v1/host/orders", require("./routes/sellerOrders")); // Seller order management
app.use("/api/v1/host/analytics", require("./routes/analytics")); // Seller analytics
app.use("/api/v1", require("./routes/reviews")); // Review routes
app.use("/api/v1", ProductRoute);
app.use("/api/v1/user", userProducts);
app.use("/api/v1/address", userAddress);
app.use("/api/v1/host/bulk", require("./routes/bulkOperations"));
app.use("/api/v1/ai", require("./routes/ai"));
app.use("/api/v1/consultations", require("./routes/consultations"));



async function Main() {
    await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,              // Max 10 connections in pool
        minPoolSize: 2,                // Keep at least 2 connections alive
        socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
        serverSelectionTimeoutMS: 5000, // Timeout server selection after 5s
        family: 4                      // Use IPv4
    });

    // Aggressive cleanup: Drop all unique indexes on 'users' and 'hosts' collections except _id and email
    try {
        const db = mongoose.connection.db;
        const targetCollections = ['users', 'hosts'];

        for (const collName of targetCollections) {
            const collections = await db.listCollections({ name: collName }).toArray();
            if (collections.length > 0) {
                const indexes = await db.collection(collName).indexes();
                for (const index of indexes) {
                    // Drop if it's unique and NOT the primary key or email index
                    if (index.unique && index.name !== '_id_' && index.name !== 'email_1') {
                        await db.collection(collName).dropIndex(index.name);
                        console.log(`Successfully dropped problematic unique index from ${collName}: ${index.name}`);
                    }
                }
            }
        }
    } catch (err) {
        console.log("Note: MongoDB index cleanup skipped or not required", err.message);
    }
}

Main().then(() => console.log("Database is connected with connection pooling")).catch((err) => console.log(err));

app.get('/api/v1/', (req, res) => {
    res.send("root");
});



// Initialize Cron Jobs
require('./jobs/inventoryMonitor');

app.get('/api/v1/admin/run-stock-check', async (req, res) => {
    const { runInventoryCheck } = require('./jobs/inventoryMonitor');
    await runInventoryCheck();
    res.json({ message: "Stock check triggered successfully" });
});

// Global Error Handler (Must be after routes)
app.use(errorHandler);

const http = require('http');
const server = http.createServer(app);
const { init } = require('./utils/socket');

// Initialize Socket.io
init(server);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});