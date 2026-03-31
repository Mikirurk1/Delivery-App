import { Args, Context, Float, Query, Resolver } from '@nestjs/graphql';
import { ShopService } from './shop.service';
import { requireAuth, type AuthContext } from '../auth/auth.util';
import { ShopModel } from '../common/graphql.models';

@Resolver(() => ShopModel)
export class ShopResolver {
  constructor(private readonly shopService: ShopService) {}

  @Query(() => [ShopModel])
  async shops(
    @Context() context: AuthContext,
    @Args('ratingMin', { type: () => Float, nullable: true })
    ratingMin?: number,
    @Args('ratingMax', { type: () => Float, nullable: true })
    ratingMax?: number,
  ) {
    requireAuth(context);
    return this.shopService.findAll(ratingMin, ratingMax);
  }
}
