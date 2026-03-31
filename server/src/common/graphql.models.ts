import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@ObjectType()
export class CategoryModel {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class ShopModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class ProductModel {
  @Field()
  id: string;

  @Field()
  shopId: string;

  @Field()
  categoryId: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string | null;

  @Field(() => CategoryModel)
  category: CategoryModel;
}

@ObjectType()
export class OrderItemModel {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Float)
  productPrice: number;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class OrderModel {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field(() => Float)
  total: number;

  @Field()
  createdAt: Date;

  @Field(() => [OrderItemModel])
  items: OrderItemModel[];
}

@ObjectType()
export class ProductsPageModel {
  @Field(() => [ProductModel])
  items: ProductModel[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class CartItemModel {
  @Field()
  productId: string;

  @Field({ nullable: true })
  productName?: string;

  @Field(() => Float, { nullable: true })
  productPrice?: number;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class ReorderResultModel {
  @Field(() => [CartItemModel])
  items: CartItemModel[];
}

@ObjectType()
export class AuthTokenModel {
  @Field()
  token: string;

  @Field()
  expiresAt: Date;
}

@InputType()
export class ProductFiltersInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shopId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  categoryIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  pageSize?: number;
}

@InputType()
export class OrderItemInput {
  @Field()
  @IsString()
  productId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}

@InputType()
export class CheckoutInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  address: string;

  @Field(() => [OrderItemInput])
  @ArrayMinSize(1)
  items: OrderItemInput[];
}
