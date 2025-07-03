
export class Converter {
  static objectToDotNotation = (nestedObj: object, parentKey: string = '') => {
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
        Object.assign(update, Converter.objectToDotNotation(value, dotKey));
      } else {
        update[dotKey] = value;
      }
    }

    return update;
  };
}
