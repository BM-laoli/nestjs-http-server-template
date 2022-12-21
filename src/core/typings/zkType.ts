export interface InterZKConfigNest {
  mysql: {
    host: string;
    prot: number;
    name: string;
    pwd: string;
    lib: string;
  };
  redis: {
    host: string;
    prot: number;
    pwd: string;
    family: number;
    db: number;
  };
  uploads: {
    prefix: number;
    dir: string;
  };
  auth: {
    secret: string;
  };
}

export enum EnumZkConfigPath {
  'nest' = '/nest',
}
