export const READ_MAIL_CONFIG = {
  imap: {
    user: process.env.EMAIL as string,
    password: process.env.APP_PASS as string,
    host: 'imap.gmail.com',
    port: 993,
    authTimeout: 10000,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

export const SEND_MAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.APP_PASS as string
  },
};