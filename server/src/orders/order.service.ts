import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutInput, OrderItemInput } from '../common/graphql.models';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async history(email?: string, phone?: string, orderId?: string) {
    if (orderId) {
      this.assertValidOrderId(orderId);
      try {
        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order) {
          throw new GraphQLError('Order not found', {
            extensions: {
              code: 'NOT_FOUND',
              errorId: 'ORDERS_NOT_FOUND',
            },
          });
        }
        return [order];
      } catch (error) {
        this.rethrowKnownOrderIdError(error);
        throw error;
      }
    }

    // UI allows searching by either email OR phone.
    if (!email && !phone) {
      return [];
    }

    return this.prisma.order.findMany({
      where: {
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkout(input: CheckoutInput) {
    if (!input.items.length) {
      throw new GraphQLError('Cart is empty', {
        extensions: {
          code: 'BAD_USER_INPUT',
          errorId: 'CHECKOUT_CART_EMPTY',
        },
      });
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: input.items.map((item) => item.productId) } },
    });
    const map = new Map(products.map((p) => [p.id, p]));
    const normalizedItems = this.normalizeItems(input.items);

    const orderItems = normalizedItems.map((item) => {
      const product = map.get(item.productId);
      if (!product) {
        throw new GraphQLError(`Product ${item.productId} not found`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            errorId: 'CHECKOUT_PRODUCT_NOT_FOUND',
          },
        });
      }

      return {
        productId: item.productId,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        email: input.email,
        phone: input.phone,
        address: input.address,
        total,
        items: { create: orderItems },
      },
      include: { items: true },
    });
  }

  async reorder(orderId: string) {
    this.assertValidOrderId(orderId);
    let order: {
      items: {
        productId: string;
        productName: string;
        productPrice: number;
        quantity: number;
      }[];
    } | null = null;
    try {
      order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
    } catch (error) {
      this.rethrowKnownOrderIdError(error);
      throw error;
    }
    if (!order) {
      throw new GraphQLError('Order not found', {
        extensions: {
          code: 'NOT_FOUND',
          errorId: 'ORDERS_NOT_FOUND',
        },
      });
    }

    return {
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
      })),
    };
  }

  private normalizeItems(items: OrderItemInput[]) {
    const quantityByProduct = new Map<string, number>();
    for (const item of items) {
      if (item.quantity <= 0) continue;
      quantityByProduct.set(
        item.productId,
        (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }
    return Array.from(quantityByProduct.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );
  }

  private assertValidOrderId(orderId: string) {
    if (!/^[a-fA-F0-9]{24}$/.test(orderId)) {
      throw new GraphQLError('Invalid order ID format', {
        extensions: {
          code: 'BAD_USER_INPUT',
          errorId: 'ORDERS_INVALID_ID',
        },
      });
    }
  }

  private rethrowKnownOrderIdError(error: unknown) {
    const rawMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: unknown }).message
        : undefined;
    const message = typeof rawMessage === 'string' ? rawMessage : '';

    if (message.includes('Malformed ObjectID')) {
      throw new GraphQLError('Invalid order ID format', {
        extensions: {
          code: 'BAD_USER_INPUT',
          errorId: 'ORDERS_INVALID_ID',
        },
      });
    }
  }
}
