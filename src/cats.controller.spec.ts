import { Test } from '@nestjs/testing';
import { CarController } from './car/car.controller';
import { CarService } from './car/car.service';

describe('CarController', () => {
  let catsController: CarController;
  let catsService: CarService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    // compile
    // 这个方法初始化一个模块和它的依赖(和传统应用中从main.ts文件使用NestFactory.create()方法类似)，并返回一个准备用于测试的模块。

    catsService = await moduleRef.resolve(CarService);
    catsController = await moduleRef.resolve(CarController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = 'findAll';
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      const value = await catsController.findAll();
      console.log(value);

      expect(value).toBe(result);
    });
  });
});
