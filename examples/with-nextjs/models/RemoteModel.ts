import { IModelConstructor, Model } from 'datx';
import { IJsonapiModel, jsonapi } from 'datx-jsonapi';

// defines related remote model type used in polymorphic relations
export type IRelatedRemoteModel = {
  title: string;
  perex: string;
  content: string;
};

// defines remote model constructor
export type IRemoteModelConstructor<T> = IModelConstructor<
  T & Model & IJsonapiModel
>;

// defines remote model
export type IRemoteModel<T> = T & Model & IJsonapiModel;

// remote model
class RemoteModel extends jsonapi(Model) {}

// exports
export { RemoteModel };
