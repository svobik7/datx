import { extendObservable } from 'mobx';

/**
 * Map a single item or an array of items
 *
 * @export
 * @template T
 * @template U
 * @param {(T|Array<T>)} data Data to iterate over
 * @param {(item: T) => U} fn Function called for every data item
 * @returns {(U|Array<U>|null)} Return value of the callback function
 */
export function mapItems<T, U>(data: Array<T>, fn: (item: T) => U): Array<U>;
export function mapItems<T, U>(data: T, fn: (item: T) => U): U|null;
export function mapItems<T, U>(data: T|Array<T>, fn: (item: T) => U): U|Array<U>|null {
  if (data instanceof Array) {
    // tslint:disable-next-line:no-unnecessary-callback-wrapper
    return data.map((item) => fn(item));
  }

  return data === null ? null : fn(data);
}

/**
 * Flatten a 2D array to a single array
 *
 * @export
 * @template T
 * @param {Array<Array<T>|T>} data Arrays to flatten
 * @returns {Array<T>} Flattened array
 */
export function flatten<T>(data: Array<Array<T>|T>): Array<T> {
  return ([] as Array<T>).concat(...data);
}

/**
 * Check if the given variable is an array with at least one falsy value
 *
 * @export
 * @param {any} value A variable to check
 * @returns {boolean} The given variable is an array with at least one falsy value
 */
export function isFalsyArray(value: any): boolean {
  return value instanceof Array && !value.every(Boolean);
}

function undefinedGetter(): any {
  return undefined;
}

function defaultSetter() {
  throw new Error('The setter is not defined for this property');
}

/**
 * Add a computed property to an observable object
 *
 * @export
 * @param {object} obj Observable object
 * @param {string} key Property to add
 * @param {() => any} getter Getter function
 * @param {(value: any) => void} [setter] Setter function
 */
export function assignComputed<T = any>(
  obj: object,
  key: string,
  getter: () => T = undefinedGetter,
  setter: (value: T) => void = defaultSetter,
) {
  const admin = Symbol.for('datx administration');
  if (!obj.hasOwnProperty(admin)) {
    Object.defineProperty(obj, admin, {
      configurable: false,
      enumerable: false,
      value: { },
    });
  }

  obj[admin][`get__${key}`] = getter;
  obj[admin][`set__${key}`] = setter;

  if (!obj.hasOwnProperty(key)) {
    extendObservable(obj, {
      get [key]() {
        return obj[admin][`get__${key}`]();
      },
      set [key](val: any) {
        if (setter) {
          obj[admin][`set__${key}`](val);
        }
      },
    });
  }
}

export function error(...args: Array<any>) {
  // tslint:disable-next-line:no-console
  console.error(`[datx error]`, ...args);
}

export function warn(...args: Array<any>) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    return;
  }

  // tslint:disable-next-line:no-console
  console.warn(`[datx warning]`, ...args);
}

export function deprecated(...args: Array<any>) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    return;
  }

  // tslint:disable-next-line:no-console
  console.warn(`[datx deprecated]`, ...args);
}

export function info(...args: Array<any>) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    return;
  }

  // tslint:disable-next-line:no-console
  console.info(`[datx info]`, ...args);
}
