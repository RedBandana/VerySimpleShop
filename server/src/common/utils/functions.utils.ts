import * as fs from 'fs';

export function emailValidator(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

export function getBaseDomain(url: string) {
  if (!url) {
    return;
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.host;
  const parts = hostname.split('.');
  const baseDomain = parts.length > 2 ? parts.slice(-2).join('.') : hostname;

  if (!baseDomain.includes('localhost')) {
    return baseDomain;
  }
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

