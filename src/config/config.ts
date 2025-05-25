// API endpoints configuration
export const API_URL = process.env.APP_CONFIG_IP_ROOT || 'http://localhost:3456';

// Application configuration
export const APP_CONFIG = {
  VERSION: process.env.APP_CONFIG_APP_VERSION,
  PRIMARY_COLOR: process.env.APP_CONFIG_PRIMARY_COLOR,
  SCHOOL_INFO: {
    NAME: process.env.APP_CONFIG_TEN_TRUONG,
    SHORT_NAME: process.env.APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH,
    PREFIX: process.env.APP_CONFIG_TIEN_TO_TRUONG,
    PARENT_ORG: process.env.APP_CONFIG_CO_QUAN_CHU_QUAN,
  }
};
