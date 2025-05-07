import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

const config = {
  env: process.env.ENV || 'development',
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    url: process.env.SERVER_URL || 'http://localhost:4000',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:3000',
  }
};

if (config.env === 'development') {
  console.log('Server configuration loaded:', {
    env: config.env,
    port: config.server.port,
    databaseConnected: !!config.database.url,
    jwtConfigured: !!config.auth.jwtSecret
  });
}


export default config;