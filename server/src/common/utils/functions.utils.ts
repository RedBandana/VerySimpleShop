import * as fs from 'fs';

export function generateRandomNumber(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export function emailValidator(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

export function getBaseDomain(url: string) {
  if (!url) return;

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.host;
  const parts = hostname.split('.');
  const baseDomain = parts.length > 2 ? parts.slice(-2).join('.') : hostname;

  if (!baseDomain.includes('localhost')) return baseDomain;

  return "";
}

export function getSourceDirectory(): string {
  const cwd = process.cwd();
  const srcPath = cwd + '/src';
  const srcExists = fs.existsSync(srcPath);

  if (srcExists) {
    return srcPath;
  }

  const distPath = cwd + '/dist';
  const distExists = fs.existsSync(distPath);
  if (distExists) {
    return distPath;
  }

  return cwd;
}


export function objectToDotNotation(nestedObj: object, parentKey: string = '') {
  if (
    nestedObj === null ||
    typeof nestedObj !== 'object' ||
    nestedObj instanceof Array ||
    nestedObj instanceof Date
  ) {
    throw new Error('First argument must be an object.');
  }

  const update = {};
  for (const [key, value] of Object.entries(nestedObj)) {
    const dotKey = parentKey ? `${parentKey}.${key}` : key;
    if (value !== null && typeof value === 'object' && !(value instanceof Array || value instanceof Date)) {
      Object.assign(update, objectToDotNotation(value, dotKey));
    } else {
      update[dotKey] = value;
    }
  }

  return update;
};

export function formatResponse(payload: any) {
  const transform = (obj: any) => {
    delete obj.password;
    return obj;
  };

  if (Array.isArray(payload)) {
    return payload.map((item) => transform(item));
  } else if (payload && typeof payload === 'object') {
    return transform(payload);
  } else {
    return payload;
  }
}
