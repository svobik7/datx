import { getModelType, IType, PureCollection, PureModel } from 'datx';
import { IDictionary } from 'datx-utils';

import { URL_REGEX } from '../consts';
import { ParamArrayType } from '../enums/ParamArrayType';
import { IFilters } from '../interfaces/IFilters';
import { IHeaders } from '../interfaces/IHeaders';
import { IJsonapiModel } from '../interfaces/IJsonapiModel';
import { IRequestOptions } from '../interfaces/IRequestOptions';
import { IRequest } from '../interfaces/JsonApi';
import { config } from '../NetworkUtils';
import { getValue } from './utils';

export function prepareQuery(
  type: IType,
  id?: number|string,
  data?: IRequest,
  options?: IRequestOptions,
  collection?: PureCollection,
  model?: IJsonapiModel,
): {
  url: string;
  data?: object;
  headers: IHeaders;
} {
  let queryModel: typeof PureModel | IJsonapiModel | undefined = model;
  if (!queryModel && collection) {
    const staticCollection = collection.constructor as typeof PureCollection;
    queryModel = staticCollection.types.filter((item) => item.type === type)[0];
  }
  const path: string = queryModel
    ? (getValue<string>(queryModel['endpoint']) || queryModel['baseUrl'] || getModelType(queryModel))
    : type;

  const url: string = id ? `${path}/${id}` : `${path}`;

  return buildUrl(url, data, options);
}

export function buildUrl(url: string, data?: IRequest, options?: IRequestOptions) {
  const headers: IDictionary<string> = (options && options.headers) || { };

  const params: Array<string> = [
    ...prepareFilters((options && options.filter) || { }),
    ...prepareSort(options && options.sort),
    ...prepareIncludes(options && options.include),
    ...prepareFields((options && options.fields) || { }),
    ...prepareRawParams((options && options.params) || []),
  ];

  const baseUrl: string = appendParams(prefixUrl(url), params);

  return { data, headers, url: baseUrl };
}

function prepareFilters(filters: IFilters): Array<string> {
  return parametrize(filters).map((item) => `filter[${item.key}]=${item.value}`);
}

function prepareSort(sort?: string|Array<string>): Array<string> {
  return sort ? [`sort=${sort}`] : [];
}

function prepareIncludes(include?: string|Array<string>): Array<string> {
  return include ? [`include=${include}`] : [];
}

function prepareFields(fields: IDictionary<string|Array<string>>): Array<string> {
  const list: Array<string> = [];

  Object.keys(fields).forEach((key) => {
    list.push(`fields[${key}]=${fields[key]}`);
  });

  return list;
}

function prepareRawParams(params: Array<{ key: string; value: string }|string>): Array<string> {
  return params.map((param) => {
    if (typeof param === 'string') {
      return param;
    }

    return `${param.key}=${param.value}`;
  });
}

function prefixUrl(url: string) {
  if (URL_REGEX.test(url)) {
    return url;
  }

  return `${config.baseUrl}${url}`;
}

function appendParams(url: string, params: Array<string>): string {
  let newUrl = url;
  if (params.length) {
    const separator = newUrl.indexOf('?') === -1 ? '?' : '&';
    newUrl += separator + params.join('&');
  }

  return newUrl;
}

function parametrize(params: object, scope: string = '') {
  const list: Array<{ key: string; value: string }> = [];

  Object.keys(params).forEach((key) => {
    if (params[key] instanceof Array) {
      if (config.paramArrayType === ParamArrayType.OBJECT_PATH) {
        list.push(...parametrize(params[key], `${key}.`));
      } else if (config.paramArrayType === ParamArrayType.COMMA_SEPARATED) {
        list.push({ key: `${scope}${key}`, value: params[key].join(',') });
      } else if (config.paramArrayType === ParamArrayType.MULTIPLE_PARAMS) {
        list.push(...params[key].map((param) => ({ key: `${scope}${key}`, value: param })));
      } else if (config.paramArrayType === ParamArrayType.PARAM_ARRAY) {
        list.push(...params[key].map((param) => ({ key: `${scope}${key}][`, value: param })));
      }
    } else if (typeof params[key] === 'object') {
      list.push(...parametrize(params[key], `${key}.`));
    } else {
      list.push({ key: `${scope}${key}`, value: params[key] });
    }
  });

  return list;
}