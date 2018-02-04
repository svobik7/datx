import {PureCollection} from '../PureCollection';
import {PureModel} from '../PureModel';

/**
 * Check if a class is of a certain type
 *
 * @export
 * @param {Function} obj Class to check
 * @param {Function} type Type to check
 * @returns {boolean} Class is of the given type
 */
// tslint:disable-next-line:ban-types
function isOfType<T>(obj: T, type: T): true;
function isOfType<T>(obj: any, type: T): false;
function isOfType<T>(obj: any, type: T) {
  let model = obj;
  while (model) {
    if (model === type) {
      return true;
    }
    model = Object.getPrototypeOf(model);
  }
  return false;
}

/**
 * Check if a class is a model
 *
 * @export
 * @param {any} obj Class to check
 * @returns {boolean} Class is a model
 */
export function isModel(obj: typeof PureModel): true;
export function isModel(obj: any): false;
export function isModel(obj: any) {
  return isOfType(obj, PureModel);
}

/**
 * Check if a class is a collection
 *
 * @export
 * @param {any} obj Class to check
 * @returns {boolean} Class is a collection
 */
export function isCollection(obj: typeof PureCollection): true;
export function isCollection(obj: any): false;
export function isCollection(obj: any) {
  return isOfType(obj, PureCollection);
}
