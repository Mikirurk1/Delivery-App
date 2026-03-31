import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import type { Request } from 'express';
import { PrismaService } from './prisma/prisma.service';
import { AuthResolver } from './auth/auth.resolver';
import { readAuthUserFromAuthorizationHeader } from './auth/jwt';
import { ShopResolver } from './shops/shop.resolver';
import { ProductResolver } from './products/product.resolver';
import { OrderResolver } from './orders/order.resolver';
import { ShopService } from './shops/shop.service';
import { ProductService } from './products/product.service';
import { OrderService } from './orders/order.service';

const PUBLIC_CODES = new Set([
  'BAD_USER_INPUT',
  'NOT_FOUND',
  'UNAUTHENTICATED',
  'FORBIDDEN',
]);

function defaultErrorIdByCode(code: string): string {
  if (code === 'BAD_USER_INPUT') return 'BAD_USER_INPUT';
  if (code === 'NOT_FOUND') return 'NOT_FOUND';
  if (code === 'UNAUTHENTICATED') return 'UNAUTHENTICATED';
  if (code === 'FORBIDDEN') return 'FORBIDDEN';
  return 'SERVER_INTERNAL_ERROR';
}

function formatSafeGraphQLError(
  formattedError: GraphQLFormattedError,
  error: GraphQLError,
): GraphQLFormattedError {
  const extensions = formattedError.extensions ?? {};
  const code =
    typeof extensions.code === 'string'
      ? extensions.code
      : 'INTERNAL_SERVER_ERROR';
  const errorId =
    typeof extensions.errorId === 'string' ? extensions.errorId : undefined;

  if (PUBLIC_CODES.has(code)) {
    return {
      ...formattedError,
      extensions: {
        ...extensions,
        code,
        errorId: errorId ?? defaultErrorIdByCode(code),
      },
    };
  }

  // Never expose internal implementation details (Prisma/Nest stack messages) to clients.
  return {
    message: 'Unexpected server error',
    locations: error.locations,
    path: error.path,
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      errorId: 'SERVER_INTERNAL_ERROR',
    },
  };
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      formatError: formatSafeGraphQLError,
      context: ({ req }: { req: Request }) => ({
        user: readAuthUserFromAuthorizationHeader(req.headers.authorization),
      }),
    }),
  ],
  providers: [
    PrismaService,
    AuthResolver,
    ShopResolver,
    ProductResolver,
    OrderResolver,
    ShopService,
    ProductService,
    OrderService,
  ],
})
export class AppModule {}
