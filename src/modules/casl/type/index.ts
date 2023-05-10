import { AppAbility } from '../casAbility.factory';

export enum Action {
  Manage = 'manage', //属于 CASL关键字 表示什么操作都可以
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

// 这个处理函数同时支持 使用 callback / Class 来处理 权限
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
