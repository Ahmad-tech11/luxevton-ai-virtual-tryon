const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123456', 10);
    const adminUser = await User.create({
      name: 'Admin Luxe',
      email: 'admin@luxevton.com',
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully.');

    // Pakistani Premium Products Data
    const products = [
      // --- MEN ---
      {
        title: 'Premium Raw Silk Shalwar Kameez',
        description: 'An elegant, classic raw silk shalwar kameez in deep navy. Perfect for traditional wear and semi-formal events. Tailored for a modern smart fit while maintaining cultural heritage.',
        category: 'traditional-wear',
        gender: 'men',
        images: [
          'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800',
          'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=800'
        ],
        price: 120.00,
        originalPrice: 150.00,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 50,
        rating: 4.8,
        numReviews: 32,
        tryOnEnabled: true,
        featured: true,
      },
      {
        title: 'Embroidered Velvet Prince Coat',
        description: 'Luxurious black velvet prince coat with intricate golden thread embroidery on the collar and buttons. A majestic choice for groomsmen or formal wedding events.',
        category: 'groom-wear',
        gender: 'men',
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
          'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800'
        ],
        price: 250.00,
        originalPrice: 300.00,
        sizes: ['M', 'L', 'XL'],
        stock: 15,
        rating: 5.0,
        numReviews: 12,
        tryOnEnabled: true,
        featured: true,
      },
      {
        title: 'Classic White Boski Kurta',
        description: 'Authentic Boski silk kurta in pristine white. The quintessential traditional wear for Jumuah, Eid, and casual family gatherings. Extremely breathable and elegant.',
        category: 'casual-wear',
        gender: 'men',
        images: [
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800',
          'https://images.unsplash.com/photo-1620012253295-c15bc3a6f444?q=80&w=800'
        ],
        price: 85.00,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 100,
        rating: 4.6,
        numReviews: 54,
        tryOnEnabled: true,
        featured: false,
      },
      {
        title: 'Charcoal Grey Three-Piece Suit',
        description: 'A finely tailored charcoal grey three-piece suit for formal corporate events and modern wedding receptions. Features a slim-fit waistcoat and tailored trousers.',
        category: 'formal-wear',
        gender: 'men',
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
          'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800'
        ],
        price: 180.00,
        originalPrice: 220.00,
        sizes: ['M', 'L', 'XL'],
        stock: 25,
        rating: 4.9,
        numReviews: 21,
        tryOnEnabled: true,
        featured: false,
      },
      
      // --- WOMEN ---
      {
        title: 'Bridal Red Heavily Embroidered Lehenga',
        description: 'An absolutely stunning traditional red bridal lehenga. Fully hand-embellished with zari, dabka, and stones. Comes with a heavy net dupatta and raw silk choli.',
        category: 'bridal-wear',
        gender: 'women',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800',
          'https://images.unsplash.com/photo-1583391733958-d25e77b4128c?q=80&w=800'
        ],
        price: 890.00,
        sizes: ['S', 'M', 'L'],
        stock: 5,
        rating: 5.0,
        numReviews: 8,
        tryOnEnabled: true,
        featured: true,
      },
      {
        title: 'Pastel Chiffon Anarkali Suit',
        description: 'A modest and flowing pastel pink Anarkali suit. Made from pure crinkle chiffon with delicate silver embroidery. Perfect for formal dinners and engagement parties.',
        category: 'party-wear',
        gender: 'women',
        images: [
          'https://images.unsplash.com/photo-1583391265517-35bbdad0fc20?q=80&w=800',
          'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800'
        ],
        price: 145.00,
        originalPrice: 180.00,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stock: 30,
        rating: 4.7,
        numReviews: 45,
        tryOnEnabled: true,
        featured: true,
      },
      {
        title: 'Printed Lawn 3-Piece Suit',
        description: 'The everyday staple for Pakistani women. A vibrant floral printed lawn suit with a matching chiffon dupatta and dyed cotton trousers. Highly comfortable for summer.',
        category: 'casual-wear',
        gender: 'women',
        images: [
          'https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?q=80&w=800',
          'https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?q=80&w=800'
        ],
        price: 45.00,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 120,
        rating: 4.5,
        numReviews: 112,
        tryOnEnabled: true,
        featured: false,
      },
      {
        title: 'Velvet Winter Shawl Collection Suit',
        description: 'A luxurious deep maroon velvet shirt paired with a heavily embroidered micro-velvet shawl and raw silk trousers. The ultimate elegant winter formal wear.',
        category: 'winter-collection',
        gender: 'women',
        images: [
          'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800', // Reusing placeholder for demo
          'https://images.unsplash.com/photo-1583391733958-d25e77b4128c?q=80&w=800'
        ],
        price: 195.00,
        sizes: ['S', 'M', 'L'],
        stock: 20,
        rating: 4.9,
        numReviews: 28,
        tryOnEnabled: true,
        featured: false,
      }
    ];

    await Product.insertMany(products);
    console.log('Pakistani Premium Products seeded successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
