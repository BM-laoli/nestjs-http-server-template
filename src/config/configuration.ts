// 默认会合并 根目录下的.env文件 process.env 不会覆盖
export default () => ({
  env: process.env.ENV,
  port: process.env.APP_PROT,
  zkHost: process.env.ZK_HOST,
});
