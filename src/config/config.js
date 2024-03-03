const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5500),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number().default(7),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),
    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number(),
    SMTP_USERNAME: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    EMAIL_FROM: Joi.string(),
    CLOUD_NAME: Joi.string(),
    API_KEY: Joi.string(),
    API_SECRET: Joi.string(),
    STRIPE_KEY: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    url: envVars.DB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    host: envVars.DB_HOST,
    database: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    dialect: envVars.DIALECT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      service: 'gmail',
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  cloudinary: {
    cloudName: envVars.CLOUD_NAME,
    apiKey: envVars.API_KEY,
    apiSecret: envVars.API_SECRET,
  },
  stripe: {
    stripeKey: envVars.STRIPE_KEY,
  },
};
