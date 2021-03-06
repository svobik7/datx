import { DEFAULT_TYPE, IRawModel } from 'datx-utils';
import { extendObservable } from 'mobx';

import { PatchType } from './enums/PatchType';
import { initModel } from './helpers/model/init';
import { endAction, startAction } from './helpers/patch';
import { IIdentifier } from './interfaces/IIdentifier';
import { IType } from './interfaces/IType';
import { PureCollection } from './PureCollection';

// tslint:disable-next-line:no-unnecessary-class
export class PureModel {
  /**
   * Model type used for serialization
   *
   * @static
   * @type {IType}
   * @memberof Model
   */
  public static type: IType = DEFAULT_TYPE;

  /**
   * Current autoincrement value used for automatic id generation
   *
   * @static
   * @type {IIdentifier}
   * @memberof Model
   */
  public static autoIdValue: IIdentifier = 0;

  public static enableAutoId: boolean = true;

  /**
   * Function used to preprocess the model input data. Called during the model initialization
   *
   * @static
   * @param {object} data Input data
   * @param {PureCollection} [collection] The collection the new model will belong to
   * @returns Target model data
   * @memberof Model
   */
  public static preprocess(data: object, _collection?: PureCollection) {
    return data;
  }

  /**
   * Method used for generating of automatic model ids
   *
   * @static
   * @returns {IIdentifier} A new model id
   * @memberof Model
   */
  public static getAutoId(): IIdentifier {
    return typeof this.autoIdValue === 'number' ? --this.autoIdValue : this.autoIdValue;
  }

  public static toJSON() {
    return this.type;
  }

  protected static __datxInitProps?: () => void;

  constructor(rawData: IRawModel = { }, collection?: PureCollection) {
    const staticClass = this.constructor as typeof PureModel;
    if (staticClass.__datxInitProps) {
      staticClass.__datxInitProps();
    }

    startAction(this);
    extendObservable(this, { });
    initModel(this, rawData, collection);
    endAction(this, PatchType.CRATE);
  }
}
