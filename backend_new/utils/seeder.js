/**
 * ReWear Database Seeder
 * Seeds users that match the hardcoded listing cards in the HTML pages
 * and creates corresponding listing documents in MongoDB.
 *
 * Run with: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Listing = require('../models/Listing');
const SwapRequest = require('../models/SwapRequest');
const Notification = require('../models/Notification');

// ─── Seed Data ────────────────────────────────────────────────────────────────
const usersData = [
    { name: 'You',      email: 'you@rewear.com',      password: 'password123' },
    { name: 'Sarah J.', email: 'sarah@rewear.com',     password: 'password123' },
    { name: 'Mike R.',  email: 'mike@rewear.com',      password: 'password123' },
    { name: 'Aman T.',  email: 'aman@rewear.com',      password: 'password123' },
    { name: 'Priya K.', email: 'priya@rewear.com',     password: 'password123' },
    { name: 'David L.', email: 'david@rewear.com',     password: 'password123' },
    { name: 'Neha S.',  email: 'neha@rewear.com',      password: 'password123' },
    { name: 'Komal P.', email: 'komal@rewear.com',     password: 'password123' },
    { name: 'Rahul M.', email: 'rahul@rewear.com',     password: 'password123' },
    { name: 'Levi',     email: 'levi@rewear.com',      password: 'password123' },
    { name: 'Zara',     email: 'zara@rewear.com',      password: 'password123' },
    { name: 'HnM',      email: 'hnm@rewear.com',       password: 'password123' },
    { name: 'Nike',     email: 'nike@rewear.com',       password: 'password123' },
    { name: 'Wildcraft', email: 'wildcraft@rewear.com',password: 'password123' },
    { name: 'Uniqlo',   email: 'uniqlo@rewear.com',    password: 'password123' },
];

// listings[i].ownerName must match a user name above
const listingsData = [
    // ─── listing.html cards ───────────────────────────────────────────────────
    {
        title: 'Vintage Floral Dress',
        description: 'Beautiful vintage floral dress in excellent condition.',
        category: "Women's Wear",
        size: 'M',
        condition: 'Like New',
        image: 'assets2/womens1.avif',
        price: 'Rs. 545',
        ownerName: 'Sarah J.',
        location: 'Mumbai',
    },
    {
        title: 'Denim Jacket',
        description: 'Classic denim jacket, lightly worn.',
        category: "Women's Wear",
        size: 'S',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 680',
        ownerName: 'Mike R.',
        location: 'Delhi',
    },
    {
        title: 'Adidas Classic Sneakers',
        description: 'Iconic Adidas sneakers, barely used.',
        category: 'Footwear',
        size: '8',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 1,200',
        ownerName: 'Aman T.',
        location: 'Bangalore',
    },
    {
        title: 'Leather Backpack',
        description: 'Genuine leather backpack, good condition.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 950',
        ownerName: 'Priya K.',
        location: 'Pune',
    },
    {
        title: 'Olive Green Hoodie',
        description: 'Cozy and stylish olive green hoodie.',
        category: "Men's Wear",
        size: 'L',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 720',
        ownerName: 'David L.',
        location: 'Chennai',
    },
    {
        title: 'Ray-Ban Sunglasses',
        description: 'Authentic Ray-Ban sunglasses with case.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 1,450',
        ownerName: 'Neha S.',
        location: 'Hyderabad',
    },
    {
        title: "Women's Handbag",
        description: 'Elegant womens handbag, like new.',
        category: "Women's Wear",
        size: 'One Size',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 890',
        ownerName: 'Komal P.',
        location: 'Mumbai',
    },
    {
        title: 'Vans Old Skool',
        description: 'Classic Vans Old Skool sneakers in great shape.',
        category: 'Footwear',
        size: '9',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400',
        price: 'Rs. 1,100',
        ownerName: 'Rahul M.',
        location: 'Pune',
    },
    // ─── index.html popular listings ──────────────────────────────────────────
    {
        title: 'Denim Jacket',
        description: "Levi's iconic denim jacket.",
        category: 'Winter Wear',
        size: 'M',
        condition: 'Good',
        image: 'assets/denim_jacket.png',
        price: 'Rs. 80',
        ownerName: 'Levi',
        location: 'Mumbai',
    },
    {
        title: 'Hoodie',
        description: 'Zara pink hoodie, lightly worn.',
        category: 'Winter Wear',
        size: 'L',
        condition: 'Good',
        image: 'assets/pink_hoodie.png',
        price: 'Rs. 70',
        ownerName: 'Zara',
        location: 'Delhi',
    },
    {
        title: 'Floral Dress',
        description: 'H&M floral dress, great for summer.',
        category: "Women's Wear",
        size: 'S',
        condition: 'Like New',
        image: 'assets/floral_dress.png',
        price: 'Rs. 60',
        ownerName: 'HnM',
        location: 'Bangalore',
    },
    {
        title: 'Sneakers',
        description: 'Nike white sneakers, like new.',
        category: 'Footwear',
        size: '42',
        condition: 'Like New',
        image: 'assets/white_sneakers.png',
        price: 'Rs. 90',
        ownerName: 'Nike',
        location: 'Pune',
    },
    {
        title: 'Bagpack',
        description: 'Wildcraft brown backpack, good quality.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Good',
        image: 'assets/brown_bagpack.png',
        price: 'Rs. 50',
        ownerName: 'Wildcraft',
        location: 'Chennai',
    },
    {
        title: 'Shirt',
        description: 'Uniqlo olive green shirt.',
        category: "Men's Wear",
        size: 'M',
        condition: 'Good',
        image: 'assets/olive_green_shirt.png',
        price: 'Rs. 40',
        ownerName: 'Uniqlo',
        location: 'Hyderabad',
    },
    // ─── category_men page cards ──────────────────────────────────────────────
    {
        title: 'Oversized T-Shirt',
        description: 'Trendy oversized t-shirt.',
        category: "Men's Wear",
        size: 'XL',
        condition: 'Like New',
        image: 'assets2/oversized_t_shirt.png',
        price: 'Rs. 350',
        ownerName: 'Aman T.',
        location: 'Delhi',
    },
    {
        title: 'Black Jeans',
        description: 'Classic black slim-fit jeans.',
        category: "Men's Wear",
        size: '32',
        condition: 'Good',
        image: 'assets2/black_jeans.png',
        price: 'Rs. 600',
        ownerName: 'Rahul M.',
        location: 'Mumbai',
    },
    {
        title: 'Olive Green Shirt',
        description: 'Casual olive green shirt.',
        category: "Men's Wear",
        size: 'M',
        condition: 'Good',
        image: 'assets2/olive_green_shirt.png',
        price: 'Rs. 280',
        ownerName: 'David L.',
        location: 'Pune',
    },
    {
        title: 'T-Shirt',
        description: 'Plain white t-shirt.',
        category: "Men's Wear",
        size: 'L',
        condition: 'Good',
        image: 'assets2/t_shirt.png',
        price: 'Rs. 200',
        ownerName: 'Mike R.',
        location: 'Bangalore',
    },
    {
        title: 'White Jeans',
        description: 'Stylish white jeans.',
        category: "Men's Wear",
        size: '30',
        condition: 'Like New',
        image: 'assets2/white_jeans.png',
        price: 'Rs. 750',
        ownerName: 'Aman T.',
        location: 'Chennai',
    },
    // ─── category_jacket page ─────────────────────────────────────────────────
    {
        title: 'Denim Jacket',
        description: 'Classic denim jacket.',
        category: 'Winter Wear',
        size: 'M',
        condition: 'Good',
        image: 'assets2/denim_jacket.png',
        price: 'Rs. 800',
        ownerName: 'Mike R.',
        location: 'Delhi',
    },
    {
        title: 'Jacket 1',
        description: 'Winter jacket.',
        category: 'Winter Wear',
        size: 'L',
        condition: 'Good',
        image: 'assets2/jacket1.png',
        price: 'Rs. 950',
        ownerName: 'David L.',
        location: 'Mumbai',
    },
    {
        title: 'Jacket 2',
        description: 'Stylish winter jacket.',
        category: 'Winter Wear',
        size: 'M',
        condition: 'Like New',
        image: 'assets2/jacket2.png',
        price: 'Rs. 1,100',
        ownerName: 'Sarah J.',
        location: 'Bangalore',
    },
    {
        title: 'Jacket 3',
        description: 'Warm winter jacket.',
        category: 'Winter Wear',
        size: 'S',
        condition: 'Good',
        image: 'assets2/jacket3.png',
        price: 'Rs. 850',
        ownerName: 'Neha S.',
        location: 'Hyderabad',
    },
    // ─── category_shoes page ──────────────────────────────────────────────────
    {
        title: 'Shoe 1',
        description: 'Stylish running shoes.',
        category: 'Footwear',
        size: '9',
        condition: 'Good',
        image: 'assets2/shoe1.png',
        price: 'Rs. 900',
        ownerName: 'Rahul M.',
        location: 'Mumbai',
    },
    {
        title: 'Shoe 2',
        description: 'Casual canvas shoes.',
        category: 'Footwear',
        size: '8',
        condition: 'Good',
        image: 'assets2/shoe2.png',
        price: 'Rs. 600',
        ownerName: 'Aman T.',
        location: 'Delhi',
    },
    {
        title: 'Shoe 3',
        description: 'Classic leather shoes.',
        category: 'Footwear',
        size: '10',
        condition: 'Like New',
        image: 'assets2/shoe3.png',
        price: 'Rs. 1,200',
        ownerName: 'Priya K.',
        location: 'Pune',
    },
    {
        title: 'Shoe 4',
        description: 'Sporty sneakers.',
        category: 'Footwear',
        size: '7',
        condition: 'Good',
        image: 'assets2/shoe4.png',
        price: 'Rs. 700',
        ownerName: 'Komal P.',
        location: 'Chennai',
    },
    {
        title: 'Shoe 5',
        description: 'Lightweight running shoes.',
        category: 'Footwear',
        size: '9',
        condition: 'Good',
        image: 'assets2/shoe5.png',
        price: 'Rs. 850',
        ownerName: 'Sarah J.',
        location: 'Bangalore',
    },
    {
        title: 'Shoe 6',
        description: 'Elegant formal shoes.',
        category: 'Footwear',
        size: '41',
        condition: 'Like New',
        image: 'assets2/shoe6.png',
        price: 'Rs. 1,500',
        ownerName: 'David L.',
        location: 'Mumbai',
    },
    // ─── category_accessories page ────────────────────────────────────────────
    {
        title: 'Smart Watch',
        description: 'Feature-rich smartwatch.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Like New',
        image: 'assets2/smart_watch.png',
        price: 'Rs. 2,500',
        ownerName: 'Neha S.',
        location: 'Hyderabad',
    },
    {
        title: 'Accessories 1',
        description: 'Fashion accessory.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Good',
        image: 'assets2/accessories1.png',
        price: 'Rs. 400',
        ownerName: 'Komal P.',
        location: 'Mumbai',
    },
    {
        title: 'Accessories 2',
        description: 'Trendy fashion piece.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Good',
        image: 'assets2/accessories2.png',
        price: 'Rs. 350',
        ownerName: 'Priya K.',
        location: 'Delhi',
    },
    {
        title: 'Accessories 3',
        description: 'Stylish accessory.',
        category: 'Accessories',
        size: 'One Size',
        condition: 'Like New',
        image: 'assets2/accessories3.png',
        price: 'Rs. 500',
        ownerName: 'Sarah J.',
        location: 'Pune',
    },
    // ─── category_kids page ───────────────────────────────────────────────────
    {
        title: 'Kid 1',
        description: "Kids wear item.",
        category: "Kids' Wear",
        size: '4-5Y',
        condition: 'Good',
        image: 'assets2/kid1.png',
        price: 'Rs. 250',
        ownerName: 'Priya K.',
        location: 'Mumbai',
    },
    {
        title: 'Kid 2',
        description: "Kids wear item.",
        category: "Kids' Wear",
        size: '6-7Y',
        condition: 'Like New',
        image: 'assets2/Kid2.png',
        price: 'Rs. 300',
        ownerName: 'Sarah J.',
        location: 'Delhi',
    },
    {
        title: 'Kid 3',
        description: "Kids wear item.",
        category: "Kids' Wear",
        size: '3-4Y',
        condition: 'Good',
        image: 'assets2/kid3.png',
        price: 'Rs. 200',
        ownerName: 'Komal P.',
        location: 'Bangalore',
    },
    {
        title: 'Kid 4',
        description: "Kids wear item.",
        category: "Kids' Wear",
        size: '5-6Y',
        condition: 'Good',
        image: 'assets2/kid4.png',
        price: 'Rs. 280',
        ownerName: 'Neha S.',
        location: 'Pune',
    },
    {
        title: 'Kid 5',
        description: "Kids wear item.",
        category: "Kids' Wear",
        size: '7-8Y',
        condition: 'Like New',
        image: 'assets2/kid5.png',
        price: 'Rs. 320',
        ownerName: 'Rahul M.',
        location: 'Chennai',
    },
    // ─── Women's wear detail page ─────────────────────────────────────────────
    {
        title: 'Vintage Floral Dress',
        description: 'Beautiful vintage dress.',
        category: "Women's Wear",
        size: 'M',
        condition: 'Like New',
        image: 'assets2/womens1.avif',
        price: 'Rs. 545',
        ownerName: 'Sarah J.',
        location: 'Mumbai',
    },
    {
        title: 'Casual Winter Jacket',
        description: 'Warm and stylish winter jacket.',
        category: "Women's Wear",
        size: 'S',
        condition: 'Good',
        image: 'assets2/womens2.avif',
        price: 'Rs. 800',
        ownerName: 'Mike R.',
        location: 'Delhi',
    },
    {
        title: 'Womens Wear 3',
        description: "Women's wear item.",
        category: "Women's Wear",
        size: 'M',
        condition: 'Good',
        image: 'assets2/womens3.avif',
        price: 'Rs. 450',
        ownerName: 'Priya K.',
        location: 'Bangalore',
    },
    {
        title: 'Womens Wear 4',
        description: "Women's wear item.",
        category: "Women's Wear",
        size: 'L',
        condition: 'Like New',
        image: 'assets2/womens4.png',
        price: 'Rs. 650',
        ownerName: 'Komal P.',
        location: 'Pune',
    },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
const seed = async () => {
    await connectDB();

    console.log('\n🌱 Clearing existing data...');
    await SwapRequest.deleteMany({});
    await Notification.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Seeding users...');
    const createdUsers = await User.insertMany(
        usersData.map(u => ({ name: u.name, email: u.email, password: u.password }))
    );

    // Build a name→_id map
    const userMap = {};
    for (const u of createdUsers) {
        userMap[u.name] = u._id;
    }

    console.log('🏷️  Hashing user passwords...');
    // Trigger pre-save hooks to hash passwords
    for (const rawUser of usersData) {
        const dbUser = await User.findById(userMap[rawUser.name]);
        if (dbUser) {
            dbUser.password = rawUser.password; // re-assign plain text so pre-save hashes it
            await dbUser.save();
        }
    }

    console.log('📦 Seeding listings...');
    const listingDocs = listingsData.map(l => ({
        title: l.title,
        description: l.description,
        category: l.category,
        size: l.size,
        condition: l.condition,
        image: l.image,
        price: l.price,
        ownerId: userMap[l.ownerName] || userMap['You'],
        location: l.location,
        status: 'available',
    }));

    await Listing.insertMany(listingDocs);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   Users created  : ${usersData.length}`);
    console.log(`   Listings created: ${listingDocs.length}`);
    console.log('\n📋 Login credentials (all use password: password123):');
    usersData.forEach(u => console.log(`   ${u.name} → ${u.email}`));
    console.log('\n');
    process.exit(0);
};

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
