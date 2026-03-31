import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();

  const shops = await prisma.$transaction(
    [
      { name: 'Burger Hub', rating: 4.8 },
      { name: 'Pizza Town', rating: 4.4 },
      { name: 'Sushi Place', rating: 4.1 },
      { name: 'Green Bowl', rating: 3.8 },
      { name: 'Taco Point', rating: 4.6 },
      { name: 'Sweet Corner', rating: 3.5 },
    ].map((shop) => prisma.shop.create({ data: shop })),
  );

  const categories = await prisma.$transaction(
    ['Burgers', 'Pizza', 'Sushi', 'Salads', 'Drinks', 'Desserts', 'Tacos'].map(
      (name) => prisma.category.create({ data: { name } }),
    ),
  );

  const categoryMap = new Map(categories.map((category) => [category.name, category]));
  const catalog: Array<{
    shopName: string;
    basePrice: number;
    items: Array<{ name: string; category: string; delta: number }>;
  }> = [
    {
      shopName: 'Burger Hub',
      basePrice: 8.2,
      items: [
        { name: 'Classic Beef Burger', category: 'Burgers', delta: 0 },
        { name: 'Double Cheese Burger', category: 'Burgers', delta: 1.8 },
        { name: 'Bacon Smash Burger', category: 'Burgers', delta: 2.4 },
        { name: 'Loaded Fries', category: 'Desserts', delta: -1.4 },
        { name: 'Cola Zero', category: 'Drinks', delta: -3.2 },
      ],
    },
    {
      shopName: 'Pizza Town',
      basePrice: 9.4,
      items: [
        { name: 'Pepperoni Pizza', category: 'Pizza', delta: 0 },
        { name: 'BBQ Chicken Pizza', category: 'Pizza', delta: 1.6 },
        { name: 'Four Cheese Pizza', category: 'Pizza', delta: 1.2 },
        { name: 'Caesar Salad', category: 'Salads', delta: -2.4 },
        { name: 'Lemonade', category: 'Drinks', delta: -4.2 },
      ],
    },
    {
      shopName: 'Sushi Place',
      basePrice: 10.6,
      items: [
        { name: 'Salmon Roll', category: 'Sushi', delta: 0 },
        { name: 'California Roll', category: 'Sushi', delta: -0.6 },
        { name: 'Spicy Tuna Roll', category: 'Sushi', delta: 0.9 },
        { name: 'Miso Soup', category: 'Drinks', delta: -5.1 },
        { name: 'Mochi Set', category: 'Desserts', delta: -3.2 },
      ],
    },
    {
      shopName: 'Green Bowl',
      basePrice: 7.6,
      items: [
        { name: 'Greek Salad', category: 'Salads', delta: 0 },
        { name: 'Quinoa Bowl', category: 'Salads', delta: 1.3 },
        { name: 'Falafel Wrap', category: 'Salads', delta: 0.6 },
        { name: 'Fresh Orange Juice', category: 'Drinks', delta: -2.8 },
        { name: 'Protein Smoothie', category: 'Drinks', delta: -1.5 },
      ],
    },
    {
      shopName: 'Taco Point',
      basePrice: 8.8,
      items: [
        { name: 'Chicken Taco', category: 'Tacos', delta: 0 },
        { name: 'Beef Taco', category: 'Tacos', delta: 0.7 },
        { name: 'Veggie Taco', category: 'Tacos', delta: -0.4 },
        { name: 'Nachos Supreme', category: 'Desserts', delta: 1.8 },
        { name: 'Iced Tea', category: 'Drinks', delta: -3.7 },
      ],
    },
    {
      shopName: 'Sweet Corner',
      basePrice: 6.9,
      items: [
        { name: 'Chocolate Brownie', category: 'Desserts', delta: 0 },
        { name: 'Cheesecake Slice', category: 'Desserts', delta: 0.8 },
        { name: 'Cinnamon Roll', category: 'Desserts', delta: 0.5 },
        { name: 'Berry Milkshake', category: 'Drinks', delta: 1.9 },
        { name: 'Vanilla Latte', category: 'Drinks', delta: 0.9 },
      ],
    },
  ];

  const shopMap = new Map(shops.map((shop) => [shop.name, shop]));
  const productData = catalog.flatMap(({ shopName, items, basePrice }) => {
    const shop = shopMap.get(shopName);
    if (!shop) return [];

    return Array.from({ length: 6 }).flatMap((_, repeatIdx) =>
      items.map((item, idx) => {
        const category = categoryMap.get(item.category);
        if (!category) return null;

        const suffix = repeatIdx === 0 ? '' : ` #${repeatIdx + 1}`;
        return {
          shopId: shop.id,
          categoryId: category.id,
          name: `${item.name}${suffix}`,
          price: Number((basePrice + item.delta + repeatIdx * 0.35 + idx * 0.12).toFixed(2)),
          imageUrl: null,
        };
      }),
    ).filter((item): item is NonNullable<typeof item> => Boolean(item));
  });

  for (const chunk of chunkArray(productData, 30)) {
    await prisma.product.createMany({ data: chunk });
  }

  const sampleProducts = await prisma.product.findMany({
    take: 18,
    orderBy: [{ shopId: 'asc' }, { name: 'asc' }],
  });
  const [aliceEmail, alicePhone] = ['alice@example.com', '+1 (555) 111-2222'];
  const [bobEmail, bobPhone] = ['bob@example.com', '+1 (555) 333-4444'];

  await prisma.order.create({
    data: {
      email: aliceEmail,
      phone: alicePhone,
      address: '101 Main St, Test City',
      total: computeTotal(sampleProducts.slice(0, 3), [1, 2, 1]),
      createdAt: new Date('2026-03-12T10:15:00.000Z'),
      items: {
        create: buildOrderItems(sampleProducts.slice(0, 3), [1, 2, 1]),
      },
    },
  });
  await prisma.order.create({
    data: {
      email: aliceEmail,
      phone: alicePhone,
      address: '101 Main St, Test City',
      total: computeTotal(sampleProducts.slice(3, 7), [1, 1, 2, 1]),
      createdAt: new Date('2026-03-20T18:45:00.000Z'),
      items: {
        create: buildOrderItems(sampleProducts.slice(3, 7), [1, 1, 2, 1]),
      },
    },
  });
  await prisma.order.create({
    data: {
      email: bobEmail,
      phone: bobPhone,
      address: '202 Oak Ave, Demo Town',
      total: computeTotal(sampleProducts.slice(8, 12), [2, 1, 1, 3]),
      createdAt: new Date('2026-03-25T13:20:00.000Z'),
      items: {
        create: buildOrderItems(sampleProducts.slice(8, 12), [2, 1, 1, 3]),
      },
    },
  });

  console.log(`Seed completed: ${shops.length} shops, ${categories.length} categories, ${productData.length} products, 3 orders`);
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function buildOrderItems(
  products: Array<{ id: string; name: string; price: number }>,
  quantities: number[],
) {
  return products.map((product, idx) => ({
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    quantity: quantities[idx] ?? 1,
  }));
}

function computeTotal(
  products: Array<{ price: number }>,
  quantities: number[],
): number {
  return Number(
    products
      .reduce((sum, product, idx) => sum + product.price * (quantities[idx] ?? 1), 0)
      .toFixed(2),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
