import {
  CacheInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppAbility, CaslAbilityFactory } from './casAbility.factory';
import { User } from './entity/user.entiry';
import { Action, IPolicyHandler } from './type';
import { log } from 'console';
import { PoliciesGuard } from './gourd/Policies.guard';
import { CheckPolicies } from './decorator/CheckPolicies.decorator';
import { Article } from './entity/article.entiry';

class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Article);
  }
}

@Controller('casl')
export class CASLController {
  constructor(private caslAbility: CaslAbilityFactory) {}

  // 简单的集成到Nest中直接使用 API
  @Get('t1')
  async t1() {
    const use = new User({
      id: 0,
      isAdmin: false,
    });
    const ability = this.caslAbility.createForUser(use);
    if (ability.can(Action.Read, 'all')) {
      log('2');
    }
  }

  // 但是好像不够优雅？我们能不能做成 1 例子中这样 RBAC 装饰器呢？当然可以 可以结合 自定义装饰器 和 自定义Guard实现
  @Get('t2')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Article))
  t2() {
    log('验证成功');
    return 0;
  }

  // 如果用类请使用 (不推荐)
  @Get('t3')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadArticlePolicyHandler()) // 注意这里必须New 他不能 自动注入，如果要做 你需要实现 ModuleRef
  // 文档在这里 https://docs.nestjs.com/fundamentals/module-ref
  t3() {
    log('验证成功');
    return 0;
  }
}
