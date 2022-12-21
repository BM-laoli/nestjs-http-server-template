export * from './zkType';

export interface InterServerConfigPathMap {
  [key: string]: string;
}

export interface InterConfigMap {
  Generate: string;
  GetCustomerInfo: string;
  WRedisPath: string;
  ConfigPath: string;
}

export const ZOOKEEPER_CLIENT = Symbol('ZOOKEEPER_CLIENT');

export enum EnumInterInitConfigKey {
  env = 'env',
  port = 'port',
  zkHost = 'zkHost',
}

export interface InterInitConfig {
  [EnumInterInitConfigKey.env]: string | 'DEV' | 'STAGING' | 'PRD';
  [EnumInterInitConfigKey.port]: number;
  [EnumInterInitConfigKey.zkHost]: string;
}
