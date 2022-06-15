import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface JSONQuery extends DataQuery {
  location: { label: string; index: number };
  asset: { label: string; index: number };
  value: { label: string; index: number };
  parameterString: string;
  labelsField: string;
  uriPathExtension: string;
}

export const defaultQuery: Partial<JSONQuery> = {
  location: { label: '', index: 0 },
  asset: { label: '', index: 0 },
  value: { label: '', index: 0 },
  parameterString: '',
  labelsField: '',
  uriPathExtension: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface JSONQueryOptions extends DataSourceJsonData {
  customerId: string;
  apiPath: string;
  serverURL: string;
  apiKey: string;
  apiKeyConfigured: boolean;

  // Variables to store the last query
  lastLocationIndex: number;
  lastAssetIndex: number;
  lastValueIndex: number;
}

export const defaultOptions: Partial<JSONQueryOptions> = {
  customerId: 'factoryinsight',
  apiPath: '/api/v1',
  apiKey: '',
  apiKeyConfigured: false,
};

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
