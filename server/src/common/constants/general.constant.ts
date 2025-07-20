import 'dotenv/config';
import { Language } from '../enums/language.enum';

export const RANDOM_PASSWORD_LENGTH = 8;
export const PASSWORD_SALT = 12;
export const TOKEN_DURATION_DAYS = 7;
export const SESSION_DURATION_DAYS = 7;
export const SESSION_COOKIE_NAME = 'sessionToken';
export const APP_USER_SESSION_DURATION_YEARS = 100;

export const DEFAULT_PAGE = 1;
export const DEFAULT_COUNT = 10;
export const DEFAULT_LANGUAGE = Language.ENGLISH;
export const DEFAULT_MAIL_PORT = 587;

export const WEBSITE_URL = process.env.FRONTEND_URL;
export const MAX_FILES_AMOUNT = 10;

export const DEFAULT_DOCUMENT_URL = 'https://res.cloudinary.com/dis2drnqz/image/upload/v1739115026/documents/templates/BC-fiche-assiduite.pdf';
export const NO_IMAGE_URL = "/assets/no-image.jpg";

