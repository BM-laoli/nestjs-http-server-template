import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entiry';
import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  Ability,
  ExtractSubjectType,
} from '@casl/ability';
import { Article } from './entity/article.entiry';
import { Action } from './type';

type Subjects = InferSubjects<typeof Article | typeof User> | 'all';
// all 为 CASL 关键子，表示任何对象

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Article, { authorId: user.id });
    cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
