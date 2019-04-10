import { validate as doValidation, ValidationError } from 'class-validator';
import { IModelConstructor, Model } from 'datx';
import { IJsonapiModel, jsonapi } from 'datx-jsonapi';

/**
 * Defines Remote Model constructor type following DatX rules
 * - useful for passing model type to DatX views/collections
 * @see https://github.com/infinum/datx/wiki/View
 */
export type IRemoteModelConstructor<T = {}> = IModelConstructor<
  IRemoteModel<T>
>;

/**
 * Defines Remote Model interface type following DatX rules
 * - enhances Remote Model with given generic type
 * - useful for specify polymorphic relations
 * @see https://github.com/infinum/datx/wiki/Model
 */
export type IRemoteModel<T = {}> = T & Model & IJsonapiModel;

/**
 * Defines Remote Model base class following DatX rules
 * - useful to store common remote models methods
 * - every model which interacts with remote api should inherits this class
 * @see https://github.com/infinum/datx/wiki/Model
 */
export class RemoteModel extends jsonapi(Model) implements IRemoteModel {
  /**
   * Validation errors
   */
  private errors: ValidationError[] = [];

  /**
   * Validation callback
   */
  async validate(): Promise<ValidationError[]> {
    console.log(this);
    return doValidation(this).then(errors => {
      this.errors = errors;
      console.log(this, errors);
      return errors;
    });
  }
}
