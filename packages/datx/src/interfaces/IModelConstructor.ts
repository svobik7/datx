import {PureModel} from '../PureModel';
import {IDictionary} from './IDictionary';
import {IIdentifier} from './IIdentifier';
import {IRawModel} from './IRawModel';

export interface IModelConstructor<T = PureModel> {
  type: string;
  autoIdValue: number ;

  new(data?: IRawModel): T;

  preprocess(data: object): object;
  getAutoId(): IIdentifier;
  toJSON(): IIdentifier;
}