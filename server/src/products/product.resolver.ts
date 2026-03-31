import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import {
  CategoryModel,
  ProductFiltersInput,
  ProductsPageModel,
} from '../common/graphql.models';
import { requireAuth, type AuthContext } from '../auth/auth.util';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [CategoryModel])
  async categories(@Context() context: AuthContext) {
    requireAuth(context);
    return this.productService.categories();
  }

  @Query(() => ProductsPageModel)
  async products(
    @Context() context: AuthContext,
    @Args('filters') filters: ProductFiltersInput,
  ) {
    requireAuth(context);
    return this.productService.findPage(filters);
  }
}
