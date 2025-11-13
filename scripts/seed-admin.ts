import { UserModel } from '../src/lib/db/user.model';
import { UserRole } from '../src/lib/db/schema';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const existingAdmin = await UserModel.findByEmail('admin@dns.com');
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@dns.com');
      return;
    }

    // Create admin user
    const admin = await UserModel.create({
      name: 'System Administrator',
      email: 'admin@dns.com',
      mobile: '+1234567890',
      password: '123456',
      role: UserRole.ADMIN,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@dns.com');
    console.log('Password: 123456');
    console.log('Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
