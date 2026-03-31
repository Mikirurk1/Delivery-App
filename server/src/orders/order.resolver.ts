import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CheckoutInput,
  OrderModel,
  ReorderResultModel,
} from '../common/graphql.models';
import { requireAuth, type AuthContext } from '../auth/auth.util';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderModel])
  async orders(
    @Context() context: AuthContext,
    @Args('email', { nullable: true }) email?: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('orderId', { nullable: true }) orderId?: string,
  ) {
    requireAuth(context);
    return this.orderService.history(email, phone, orderId);
  }

  @Mutation(() => OrderModel)
  async checkout(
    @Context() context: AuthContext,
    @Args('input') input: CheckoutInput,
  ) {
    requireAuth(context);
    return this.orderService.checkout(input);
  }

  @Mutation(() => ReorderResultModel)
  async reorder(
    @Context() context: AuthContext,
    @Args('orderId') orderId: string,
  ) {
    requireAuth(context);
    return this.orderService.reorder(orderId);
  }
}
