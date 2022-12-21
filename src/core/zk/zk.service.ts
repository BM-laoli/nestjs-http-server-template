import { Inject, Injectable } from '@nestjs/common';
import { ZOOKEEPER_CLIENT } from '../typings';

@Injectable()
export class ZKService {
  constructor(
    @Inject(ZOOKEEPER_CLIENT)
    private readonly client: any,
  ) {}

  // 设置一个缓存 每 5 分支刷一次 configService，如果有更新就自动刷一次 ? 需要这么做吗？

  getChildren = (path) => {
    return new Promise((resolve, reject) => {
      this.client.getChildren(path, (error, children, stat) => {
        if (error) {
          reject(error);
        } else {
          resolve((children || []).sort());
        }
      });
    });
  };

  getData = (path) => {
    return new Promise((resolve, reject) => {
      this.client.getData(path, (error, data, stat) => {
        if (error) {
          reject(error);
        } else {
          resolve(data ? data.toString() : '');
        }
      });
    });
  };

  getDataWithJSON = async <T>(path): Promise<T> => {
    const res = (await this.getData(path)) as any;
    return JSON.parse(res);
  };
}
