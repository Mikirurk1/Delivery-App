import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ratingMin?: number, ratingMax?: number) {
    return this.prisma.shop.findMany({
      where: {
        rating:
          ratingMin !== undefined || ratingMax !== undefined
            ? {
                gte: ratingMin,
                lte: ratingMax,
              }
            : undefined,
      },
      orderBy: { name: 'asc' },
    });
  }
}
