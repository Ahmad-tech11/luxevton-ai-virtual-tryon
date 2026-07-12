export const MENU_DATA = {
  men: {
    label: 'Men',
    categories: [
      { slug: 't-shirts', label: 'T-Shirts' },
      { slug: 'polo-shirts', label: 'Polo Shirts' },
      { slug: 'casual-shirts', label: 'Casual Shirts' },
      { slug: 'formal-shirts', label: 'Formal Shirts' },
      { slug: 'jeans', label: 'Jeans' },
      { slug: 'pants', label: 'Pants & Trousers' },
      { slug: 'hoodies', label: 'Hoodies' },
      { slug: 'sweaters', label: 'Sweaters' },
      { slug: 'jackets', label: 'Jackets' },
      { slug: 'formal-coats', label: 'Formal Coats' },
      { slug: 'kurta-shalwar-kameez', label: 'Kurta / Shalwar Kameez' },
      { slug: 'waistcoats', label: 'Waistcoats' },
    ],
  },
  women: {
    label: 'Women',
    categories: [
      { slug: 'lawn-collection', label: 'Lawn Collection' },
      { slug: 'formal-wear', label: 'Formal Wear' },
      { slug: 'party-wear', label: 'Party Wear' },
      { slug: 'luxury-pret', label: 'Luxury Pret' },
      { slug: 'bridal-wear', label: 'Bridal Wear' },
      { slug: 'shalwar-kameez', label: 'Shalwar Kameez' },
      { slug: 'maxi-dresses', label: 'Maxi Dresses' },
      { slug: 'winter-long-coats', label: 'Winter Long Coats' },
      { slug: 'gharara-sharara', label: 'Gharara / Sharara' },
    ],
  },
  kids: {
    label: 'Kids',
    categories: [
      { slug: 'boys-casual-wear', label: 'Boys Casual Wear' },
      { slug: 'boys-pent-coat', label: 'Boys Pent Coat' },
      { slug: 'boys-eastern-wear', label: 'Boys Eastern Wear' },
      { slug: 'boys-party-wear', label: 'Boys Party Wear' },
      { slug: 'girls-casual-frocks', label: 'Girls Casual Frocks' },
      { slug: 'girls-fancy-frocks', label: 'Girls Fancy Frocks' },
      { slug: 'girls-party-wear', label: 'Girls Party Wear' },
      { slug: 'girls-eastern-wear', label: 'Girls Eastern Wear' },
      { slug: 'girls-traditional-dresses', label: 'Girls Traditional Dresses' },
      { slug: 'girls-eid-collection', label: 'Girls Eid Collection' },
    ],
  },
};

export const formatPrice = (price) => {
  return `PKR ${price?.toLocaleString('en-PK') || '0'}`;
};

export const getDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export const formatCategoryName = (slug) => {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
