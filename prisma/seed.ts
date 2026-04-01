import { PrismaClient } from '../generated/prisma/client/client';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

async function main() {
  console.log('🏁 Starting SuperAdmin Seed...');

  /**
   * 1. PERMISSIONS
   */
  const resources = ['users', 'roles', 'permissions'];

  const actions = ['create', 'read', 'update', 'delete', 'manage'];

  const allPermissions = await Promise.all(
    resources.flatMap((resource) =>
      actions.map(async (action) => {
        const name = `${resource}:${action}`;
        const code = `${resource}_${action}`;

        return prisma.permission.upsert({
          where: { code },
          update: {},
          create: {
            id: uuidv7(),
            name,
            code,
            resource,
            action,
          },
        });
      }),
    ),
  );

  console.log(`🔑 Created ${allPermissions.length} permissions.`);

  /**
   * 2. ROLE (SUPER ADMIN)
   */
  const adminRole = await prisma.role.upsert({
    where: { code: 'SUPER_ADMIN' },
    update: {
      permissions: {
        deleteMany: {},
        create: allPermissions.map((p) => ({
          permissionId: p.id,
        })),
      },
    },
    create: {
      id: uuidv7(),
      name: 'SUPER_ADMIN',
      code: 'SUPER_ADMIN',
      type: 'SUPER_ADMIN',
      permissions: {
        create: allPermissions.map((p) => ({
          permissionId: p.id,
        })),
      },
    },
  });

  console.log('🛡️ SUPER_ADMIN role created.');

  /**
   * 3. USER
   */
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@ess.gov.et' },
    update: {
      id: adminRole.id,
    },
    create: {
      id: uuidv7(),
      email: 'admin@ess.gov.et',
      username: 'superadmin',
      password: hashedPassword,
      isActive: true,
      roleId: adminRole.id,
      refreshToken: null,
    },
  });

  console.log('👤 SuperAdmin created.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
