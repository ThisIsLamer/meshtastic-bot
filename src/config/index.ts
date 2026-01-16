import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  meshmonitor: {
    domain: process.env.MESHMONITOR_DOMAIN || 'XXXXXXXXXXXXXXXXXXXXX',
    token: process.env.MESHMONITOR_TOKEN || 'XXXXXXXXXXXXXXXXXXXXX',
    channel: Number(process.env.MESHMONITOR_CHANNEL || '')
  },
  rschs: {
    domain: process.env.RSCHS_DOMAIN,
    replace: (() => {
      const match = process.env.RSCHS_REPLACE?.match(/\/(.*)\/([gimuy]*)/);
      return match ? new RegExp(match[1], match[2]) : /(?:)/;
    })()
  }
};