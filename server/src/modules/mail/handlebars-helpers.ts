import * as handlebars from 'handlebars';

export function registerHandlebarsHelpers() {
  handlebars.registerHelper('safeString', function (text: string) {
    return new handlebars.SafeString(text);
  });

  handlebars.registerHelper('args', function (args: any) {
    return args.hash;
  });

  handlebars.registerHelper('uppercase', function (str: string) {
    return str.toUpperCase();
  });

  handlebars.registerHelper('lowercase', function (str: string) {
    return str.toLowerCase();
  });

  handlebars.registerHelper('ifEquals', function (arg1: any, arg2: any, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  handlebars.registerHelper('list', function (str: string) {
    return str
      .split(',')
      .map((str) => `<li>${str}</li>`)
      .join('');
  });

  handlebars.registerHelper('log', function (...args: any) {
    console.log(...args);
  });
}
