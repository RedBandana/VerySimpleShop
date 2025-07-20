import * as handlebars from 'handlebars';
import { ICartItem } from '../carts/schemas/cart-item.schema';
import { CartUtils } from '../carts/cart.utils';

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

  handlebars.registerHelper('cartItemList', function (cartItems: ICartItem[]) {
    return cartItems
      .map((item) => `
      <div style="display: flex; gap: 6px">
        <img style="width: 75px; height: 75px;" src="${CartUtils.getItemImageUrl(item)}" />
        <div style="display: flex; flex-direction: column; gap: 6px">
          <div style="
              width: 300px; display: -webkit-box; line-clamp: 2; -webkit-line-clamp: 2;
              -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;
          ">
            ${CartUtils.getFullName(item)}
          </div>
          <strong>$${CartUtils.getItemPrice(item).toFixed(2)} x ${item.quantity} = $${(CartUtils.getFullItemPrice(item)).toFixed(2)}</strong>
        </div>
      </div>
      `)
      .join('');
  });

  handlebars.registerHelper('log', function (...args: any) {
    console.log(...args);
  });
}
