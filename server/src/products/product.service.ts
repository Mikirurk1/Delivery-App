import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductFiltersInput } from '../common/graphql.models';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async categories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findPage(filters: ProductFiltersInput) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(30, Math.max(1, filters.pageSize ?? 10));
    const where: Prisma.ProductWhereInput = {
      shopId: filters.shopId,
      categoryId:
        filters.categoryIds && filters.categoryIds.length
          ? { in: filters.categoryIds }
          : undefined,
    };

    const orderBy = this.resolveSort(filters.sortBy);
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  private resolveSort(
    sortBy?: string,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sortBy) {
      case 'PRICE_ASC':
        return [{ price: 'asc' }];
      case 'PRICE_DESC':
        return [{ price: 'desc' }];
      case 'NAME_ASC':
        return [{ name: 'asc' }];
      default:
        return [{ name: 'asc' }];
    }
  }
}
