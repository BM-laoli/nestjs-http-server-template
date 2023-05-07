import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('create')
  create(@Body() body: any) {
    return this.catService.create(body);
  }
}
