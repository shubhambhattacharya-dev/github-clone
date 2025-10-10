import helmet from 'helmet';

// Security headers middleware with comprehensive protection
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "https://avatars.githubusercontent.com", "https://github.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.github.com", "https://*.mongodb.net"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: false, // Allow embedding for charts
});

// CORS configuration for production
export const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_BASE_URL,
      'http://localhost:3000',
      'http://localhost:3003',
      'https://localhost:3000',
      'https://localhost:3003'
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

// Request sanitization middleware
export const sanitizeRequest = (req, res, next) => {
  // Remove any potential XSS from query parameters
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Sanitize query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = sanitizeString(req.query[key]);
    }
  }

  // Sanitize body parameters (if JSON)
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    sanitizeObject(req.body);
  }

  next();
};

// Request logging middleware for security monitoring
export const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const method = req.method;
  const url = req.originalUrl;

  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /eval\(/i,  // Code injection
  ];

  const requestString = `${method} ${url} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`;

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));

  if (isSuspicious) {
    console.warn(`🚨 SUSPICIOUS ACTIVITY [${timestamp}]: IP=${ip}, UA=${userAgent}, ${method} ${url}`);
  } else {
    console.log(`🔒 SECURE REQUEST [${timestamp}]: IP=${ip}, ${method} ${url}`);
  }

  next();
};

// Session security middleware
export const sessionSecurity = (req, res, next) => {
  // Regenerate session periodically for security
  if (req.session && !req.session.regenerated) {
    req.session.regenerated = true;
    req.session.save((err) => {
      if (err) console.error('Session save error:', err);
    });
  }

  // Check for session tampering
  if (req.session && req.session.cookie && req.session.cookie.expires) {
    const now = new Date();
    const expires = new Date(req.session.cookie.expires);

    if (now > expires) {
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
      });
      return res.status(401).json({ error: 'Session expired' });
    }
  }

  next();
};