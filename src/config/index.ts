import * as joi from '@hapi/joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

// validating environment variables
const envVarsSchema = joi
  .object({
    PORT: joi.number().default('5030'),
    NODE_ENV: joi
      .string()
      .allow(['development', 'production', 'qa', 'staging'])
      .required(),
    DEVELOPMENT_START_COMMAND: joi.string().default('yarn start:dev'),
    LOG_LEVEL: joi
      .string()
      .allow(['error', 'warning', 'info', 'debug', 'silly'])
      .default('silly'),

    JWT_SECRET_KEY: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

    // APP Details
    APP_DESCRIPTION: joi.string().required(),
    APP_TITLE: joi.string().required(),

    // database config
    PGHOST: joi.string().required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
    PGPORT: joi.number().port().required().default(5432),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),

    // Firebase/Firestore
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
    GOOGLE_SCOPE: joi.string().required(),
    UPLOADS_DIR: joi.string().required(),
    AVATAR_UPLOAD_DEST: joi.string().required(),
    ANNOUNCEMENTS_UPLOAD_DEST: joi.string().required(),
    ALLOWED_IMAGES: joi.string().required(),
    ALLOWED_DOCS: joi.string().required(),
    API_VERSION: joi.string().required(),
    API_PREFIX: joi.string().required(),
    REDIS_PORT: joi.number().default('6379'),
    REDIS_DB_INDEX: joi.number().default('0'),
    REDIS_HOST: joi.string(),
    WELCOME_EMAIL_SUBJECT: joi.string().default('Welcome Email'),
    FRONTEND_URL: joi.string().required(),
    EMAIL_FROM: joi.string().required(),
    UPLOADS_TASK_DIR: joi.string().required(),
    UPLOADS_JOB_DIR: joi.string().required(),
    FRONTEND_CONFIRM_ACC_URL: joi.string().required(),
    JUDICIARY_URL: joi.string().required(),
    JUDICIARY_BEARER_TOKEN: joi.string().required(),
    JUDICIARY_COOKIE: joi.string().required(),
    JUDICIARY_CLIENT_NAME: joi.string().required(),
    JUDICIARY_CLIENT_ALIAS: joi.string().required(),
    EMAIL_GROUP: joi.string().required(),
    EMAIL_UNSUBSCRIPTION: joi.string().required(),
    JOB_SENT_SUBJECT: joi.string().required(),
    JOB_FEEDBACK_SUBJECT: joi.string().required(),
    JUDICIARY_RSYNC_DIRECTORY: joi.string().required(),
    ENABLE_JUDICIARY_POLLING: joi.boolean().default(false),
    REVIEW_EMAIL_SUBJECT: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  url: envVars.APP_URL,
  port: envVars.APP_PORT,
  logLevel: envVars.LOG_LEVEL,
  frontEndUrl: envVars.FRONTEND_URL,
  frontEndConfirmAccUrl: `${envVars.FRONTEND_URL}/${envVars.FRONTEND_CONFIRM_ACC_URL}`,
  app: {
    title: envVars.APP_TITLE,
    description: envVars.APP_DESCRIPTION,
  },
  jwt: {
    secret: envVars.JWT_SECRET_KEY,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  db: {
    host: envVars.PGHOST,
    username: envVars.PGUSER,
    password: envVars.PGPASSWORD,
    name: envVars.PGDATABASE,
    port: Number.parseInt(envVars.PGPORT, 2),
    logging: envVars.DATABASE_LOGGING,
  },
  isDevelopment:
    envVars.NODE_ENV === 'test' || envVars.NODE_ENV === 'development',
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    secret: envVars.GOOGLE_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    scope: envVars.GOOGLE_SCOPE.split(' '),
  },
  uploads: {
    allowedImages: envVars.ALLOWED_IMAGES,
    allowedDocs: envVars.ALLOWED_DOCS,
    uploadDir: envVars.UPLOADS_DIR,
    jobsUploadDir: `${envVars.UPLOADS_DIR}/${envVars.UPLOADS_JOB_DIR}`,
    tasksUploadDir: `${envVars.UPLOADS_DIR}/${envVars.UPLOADS_JOB_DIR}/${envVars.UPLOADS_TASK_DIR}`,
    avatarDir: `${envVars.UPLOADS_DIR}/${envVars.AVATAR_UPLOAD_DEST}`,
    announcementAttachmentDir: `${envVars.UPLOADS_DIR}/${envVars.ANNOUNCEMENTS_UPLOAD_DEST}`,
  },
  api: {
    prefix: envVars.API_PREFIX,
    version: envVars.API_VERSION,
    url: `${envVars.API_PREFIX}/${envVars.API_VERSION}`,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    username: envVars.REDIS_USER,
    password: envVars.REDIS_PASS,
    dbIndex: envVars.REDIS_DB_INDEX,
  },
  mail: {
    defaultFrom: envVars.EMAIL_FROM,
    apiKey: envVars.MAILGUN_API_KEY,
    domain: envVars.MAILGUN_DOMAIN,
    welcomeEmailSubject: envVars.WELCOME_EMAIL_SUBJECT,
    adminGroup: envVars.EMAIL_GROUP,
    jobSentSubject: envVars.JOB_SENT_SUBJECT,
    jobFeedbackSubject: envVars.JOB_FEEDBACK_SUBJECT,
    unsubscriptionEmail: envVars.EMAIL_UNSUBSCRIPTION,
    reviewEmailSubject: envVars.REVIEW_EMAIL_SUBJECT,
  },
  judiciary: {
    url: envVars.JUDICIARY_URL,
    token: envVars.JUDICIARY_BEARER_TOKEN,
    cookie: envVars.JUDICIARY_COOKIE,
    clientName: envVars.JUDICIARY_CLIENT_NAME,
    clientAlias: envVars.JUDICIARY_CLIENT_ALIAS,
    rsyncDirectory: envVars.JUDICIARY_RSYNC_DIRECTORY,
    pollingEnabled: envVars.ENABLE_JUDICIARY_POLLING,
  },
};
