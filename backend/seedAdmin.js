require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
    name: 'Admin',
    email: 'admin@movieapp.com',
    password: 'admin123',
    role: 'admin',
};

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log('✓ Connected to MongoDB');

        const existing = await User.findOne({ email: ADMIN.email });
        if (existing) {
            console.log(`⚠ Admin already exists: ${ADMIN.email}`);
            process.exit(0);
        }

        const admin = new User(ADMIN);
        await admin.save();

        console.log('\n✓ Admin user created successfully!');
        console.log(`  Email   : ${ADMIN.email}`);
        console.log(`  Password: ${ADMIN.password}`);
        console.log(`  Role    : ${admin.role}\n`);
        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
})();
