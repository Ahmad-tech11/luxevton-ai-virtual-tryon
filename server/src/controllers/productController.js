const Product = require('../../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/AppError');

const getProducts = asyncHandler(async (req, res) => {
  const {
    gender, category, search, sort,
    minPrice, maxPrice, season, featured,
    size, color, page = 1, limit = 24
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 24), 100);

  let query = { isActive: true };

  if (gender) query.gender = gender;
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (season) query.season = season;

  if (size) {
    query.sizes = { $in: size.split(',') };
  }

  if (color) {
    query['colors.name'] = { $regex: color, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { categoryOrder: 1, createdAt: -1 };
  switch (sort) {
    case 'price_asc': sortOption = { price: 1 }; break;
    case 'price_desc': sortOption = { price: -1 }; break;
    case 'newest': sortOption = { categoryOrder: 1, createdAt: -1 }; break;
    case 'rating': sortOption = { rating: -1 }; break;
    case 'popular': sortOption = { numReviews: -1 }; break;
    default: break;
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
    limit: limitNum,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
});

const getCategories = asyncHandler(async (req, res) => {
  const { gender } = req.query;
  const match = { isActive: true };
  if (gender) match.gender = gender;

  const categories = await Product.aggregate([
    { $match: match },
    {
      $group: {
        _id: { category: '$category', gender: '$gender' },
        count: { $sum: 1 },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        gender: '$_id.gender',
        count: 1,
        minPrice: 1,
        maxPrice: 1,
      },
    },
    { $sort: { gender: 1, category: 1 } },
  ]);

  res.json({ success: true, categories });
});

module.exports = { getProducts, getProduct, getCategories };