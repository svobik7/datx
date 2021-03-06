import { IDictionary, IRawModel } from 'datx-utils';

import { PureCollection } from '../PureCollection';
import { PureModel } from '../PureModel';
import { IIdentifier } from './IIdentifier';
import { IType } from './IType';

export interface IMetaMixin<T extends PureModel = PureModel> {
  meta: {
    collection?: PureCollection;
    id: IIdentifier;
    original?: T;
    refs: IDictionary<IIdentifier | Array<IIdentifier>>;
    snapshot: IRawModel;
    type: IType;
  };
}
