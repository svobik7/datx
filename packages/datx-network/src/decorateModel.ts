import { PureCollection, PureModel } from 'datx';
import { IRawModel, META_FIELD, setMeta } from 'datx-utils';

// import { flattenModel, removeModel, saveModel } from './helpers/model';
import { getModelClassRefs } from './helpers/utils';
import { IRequestOptions } from './interfaces/IRequestOptions';
import { INetworkModel } from './interfaces/INetworkModel';
import { NetworkPipeline } from './NetworkPipeline';

const HYDRATIZATION_KEYS = ['networkPersisted'];

export function decorateModel(BaseClass: typeof PureModel): typeof PureModel {
  class NetworkModel extends BaseClass {
    /**
     * Should the autogenerated ID be sent to the server when creating a record
     *
     * @static
     * @type {boolean}
     * @memberOf Record
     */
    public static useAutogeneratedIds: boolean = BaseClass['useAutogeneratedIds'] || false;

    public static network?: NetworkPipeline;

    /**
     * Endpoint for API requests if there is no self link
     *
     * @static
     * @type {string|() => string}
     * @memberOf Record
     */
    public static endpoint: string | (() => string);

    public static getAutoId(): string {
      return super.getAutoId().toString();
    }

    constructor(rawData: IRawModel | IRecord = {}, collection?: PureCollection) {
      let data = rawData;

      if (rawData && 'type' in rawData && ('attributes' in rawData || 'relationships' in rawData)) {
        const classRefs = getModelClassRefs(BaseClass);

        data = flattenModel(classRefs, rawData as IRecord);
      }
      super(data, collection);

      const modelMeta = data?.[META_FIELD] || {};

      HYDRATIZATION_KEYS.forEach((key) => {
        if (key in modelMeta) {
          setMeta(this, key, modelMeta[key]);
        }
      });
    }

    public save(options?: IRequestOptions): Promise<INetworkModel> {
      return saveModel((this as unknown) as INetworkModel, options);
    }

    public destroy(options?: IRequestOptions): Promise<void> {
      return removeModel(this, options);
    }
  }

  return NetworkModel as typeof PureModel;
}
