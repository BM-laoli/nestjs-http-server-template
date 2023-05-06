import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CarModule } from '../src/car/car.module';
import { CarService } from '../src/car/car.service';

describe('Car', () => {
  let app: INestApplication;
  const carService = { findAll: () => 'findAll' };
  // const carService = new CarService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarModule],
    })
      .overrideProvider(CarService)
      .useClass(CarService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET findAll`, () => {
    return request(app.getHttpServer())
      .get('/car/findAll')
      .expect(200)
      .expect(carService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
