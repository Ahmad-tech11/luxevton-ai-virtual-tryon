// Generates product data programmatically with flat-lay / clothes-only images
// using actual local images from the public folder for MEN, WOMEN, and KIDS.

const MEN_BRANDS = ['Cougar', 'Zellbury', 'J.', 'Outfitters'];
const WOMEN_BRANDS = ['Sapphire', 'Khaadi', 'Saya', 'Zellbury', 'J.', 'Outfitters'];
const KIDS_BRANDS = ['Khaadi', 'Zellbury', 'Outfitters'];

const getBrand = (gender) => {
  if (gender === 'men') return MEN_BRANDS[Math.floor(Math.random() * MEN_BRANDS.length)];
  if (gender === 'women') return WOMEN_BRANDS[Math.floor(Math.random() * WOMEN_BRANDS.length)];
  return KIDS_BRANDS[Math.floor(Math.random() * KIDS_BRANDS.length)];
};

// MEN local images mapping
const LOCAL_MEN_IMAGES = {
  't-shirts': ['T-shirt1.jpg','T-shirt2.jpg','T-shirt3.jpg','T-shirt4.jpg','T-shirt5.jpg','T-shirt6.jpg','T-shirt7.jpg','T-shirt8.jpg','T-shirt9.jpg','T-shirt10.jpg','T-shirt11.jpg','T-shirt12.jpg','T-shirt13.jpg','T-shirt14.jpg','T-shirt15.jpg','T-shirt16.jpg','T-shirt17.jpg','T-shirt18.jpg'],
  'polo-shirts': ['polo1.jpg','polo2.jpg','polo3.jpg','polo4.jpg','polo5.jpg','polo6.jpg','polo7.jpg','polo8.jpg','polo9.jpg','polo10.jpg','polo11.jpg','polo12.jpg','polo13.jpg','polo14.jpg','polo15.jpg','polo16.jpg','polo17.jpg'],
  'casual-shirts': ['casual-shirt1.jpg','casual-shirt2.jpg','casual-shirt3.jpg','casual-shirt4.jpg','casual-shirt5.jpg','casual-shirt6.jpg','casual-shirt7.jpg','casual-shirt8.jpg','casual-shirt9.jpg','casual-shirt10.jpg','casual-shirt11.jpg','casual-shirt12.jpg','casual-shirt13.jpg','casual-shirt14.jpg','casual-shirt15.jpg','casual-shirt16.jpg'],
  'formal-shirts': ['formal1.jpg','formal2.jpg','formal3.jpg','formal4.jpg','formal5.jpg','formal6.jpg','formal7.jpg','formal8.jpg','formal9.jpg','formal10.jpg','formal11.jpg','formal12.jpg','formal13.jpg','formal14.jpg','formal15.jpg'],
  'jeans': ['jeans1.jpg','jeans2.jpg','jeans3.jpg','jeans4.jpg','jeans5.jpg','jeans6.jpg','jeans7.jpg','jeans8.jpg','jeans9.jpg','jeans10.jpg'],
  'pants': ['pants and trousers1.jpg','pants and trousers2.jpg','pants and trousers3.jpg','pants and trousers4.jpg','pants and trousers5.jpg','pants and trousers6.jpg','pants and trousers7.jpg','pants and trousers8.jpg','pants and trousers9.jpg','pants and trousers10.jpg','pants and trousers11.jpg','pants and trousers12.jpg','pants and trousers13.jpg','pants and trousers14.jpg','pants and trousers15.jpg','pants and trousers16.jpg','pants and trousers17.jpg'],
  'hoodies': ['hoodies1.jpg','hoodies2.jpg','hoodies3.jpg','hoodies4.jpg','hoodies5.jpg','hoodies6.jpg','hoodies7.jpg','hoodies8.jpg','hoodies9.jpg','hoodies10.jpg','hoodies11.jpg','hoodies12.jpg'],
  'sweaters': ['sweaters1.jpg','sweaters2.jpg','sweaters3.jpg','sweaters4.jpg','sweaters5.jpg','sweaters6.jpg','sweaters7.jpg','sweaters8.jpg','sweaters9.jpg','sweaters10.jpg','sweaters11.jpg','sweaters12.jpg','sweaters13.jpg','sweaters14.jpg','sweaters15.jpg','sweaters16.jpg','sweaters17.jpg'],
  'jackets': ['jacket1.jpg','jacket2.jpg','jacket3.jpg','jacket4.jpg','jacket5.jpg','jacket6.jpg','jacket7.jpg','jacket8.jpg','jacket9.jpg','jacket10.jpg','jacket11.jpg','jacket12.jpg','jacket13.jpg','jacket14.jpg','jacket15.jpg'],
  'formal-coats': ['coat1.jpg','coat2.jpg','coat3.jpg','coat4.jpg','coat5.jpg','coat6.jpg','coat7.jpg','coat8.jpg','coat9.jpg','coat10.jpg','coat11.jpg','coat12.jpg','coat13.jpg','coat14.jpg','coat15.jpg','coat16.jpg'],
  'kurta-shalwar-kameez': ['kurta1.jpg','kurta2.jpg','kurta3.jpg','kurta6.jpg','kurta7.jpg','kurta8.jpg','kurta9.jpg','kurta10.jpg','kurta shalwar-qameez4.jpg','kurta shalwar-qameez5.jpg'],
  'waistcoats': ['waistcoat1.jpg','waistcoat2.jpg','waistcoat3.jpg','waistcoat4.jpg','waistcoat5.jpg','waistcoat6.jpg','waistcoat7.jpg','waistcoat8.jpg','waistcoat9.jpg','waistcoat10.jpg','waistcoat11.jpg','waistcoat12.jpg','waistcoat13.jpg'],
};

// WOMEN local images mapping
const LOCAL_WOMEN_IMAGES = {
  'bridal-wear': ['bridal-wear1.jpg','bridal-wear2.jpg','bridal-wear3.jpg','bridal-wear4.jpg','bridal-wear5.jpg','bridal-wear6.jpg','bridal-wear7.jpg','bridal-wear8.jpg','bridal-wear9.jpg','bridal-wear10.jpg','bridal-wear11.jpg','bridal-wear12.jpg','bridal-wear13.jpg','bridal-wear14.jpg','bridal-wear15.jpg','bridal-wear16.jpg','bridal-wear17.jpg','bridal-wear18.jpg'],
  'formal-wear': ['formal1.jpg','formal2.jpg','formal3.jpg','formal4.jpg','formal5.jpg','formal6.jpg','formal7.jpg','formal8.jpg'],
  'gharara-sharara': ['gharara-sharara1.jpg','gharara-sharara2.jpg','gharara-sharara3.jpg','gharara-sharara4.jpg','gharara-sharara5.jpg','gharara-sharara6.jpg','gharara-sharara7.jpg','gharara-sharara8.jpg','gharara-sharara9.jpg','gharara-sharara10.jpg','gharara-sharara11.jpg'],
  'lawn-collection': ['lawn1.jpg','lawn2.jpg','lawn3.jpg','lawn4.jpg','lawn5.jpg','lawn6.jpg','lawn7.jpg','lawn8.jpg','lawn9.jpg','lawn10.jpg','lawn11.jpg','lawn12.jpg','lawn13.jpg','lawn14.jpg','lawn15.jpg'],
  'winter-long-coats': ['long-coat1.jpg','long-coat2.jpg','long-coat3.jpg','long-coat4.jpg','long-coat5.jpg','long-coat6.jpg','long-coat7.jpg','long-coat8.jpg','long-coat9.jpg','long-coat10.jpg'],
  'luxury-pret': ['luxury1.jpg','luxury2.jpg','luxury3.jpg','luxury4.jpg','luxury5.jpg','luxury6.jpg','luxury7.jpg','luxury8.jpg','luxury9.jpg','luxury10.jpg'],
  'maxi-dresses': ['maxi1.jpg','maxi2.jpg','maxi3.jpg','maxi4.jpg','maxi5.jpg','maxi6.jpg','maxi7.jpg','maxi8.jpg'],
  'party-wear': ['party-wear1.jpg','party-wear2.jpg','party-wear3.jpg','party-wear4.jpg','party-wear5.jpg','party-wear6.jpg','party-wear7.jpg','party-wear8.jpg','party-wear9.jpg','party-wear10.jpg','party-wear11.jpg','party-wear12.jpg','party-wear13.jpg','party-wear14.jpg','party-wear15.jpg'],
  'shalwar-kameez': ['shalwar-qameez1.jpg','shalwar-qameez2.jpg','shalwar-qameez3.jpg','shalwar-qameez4.jpg','shalwar-qameez5.jpg','shalwar-qameez6.jpg','shalwar-qameez7.jpg'],
};

// KIDS local images mapping
const LOCAL_KIDS_IMAGES = {
  'boys-casual-wear': ['boys1.jpg', 'boys2.jpg', 'boys3.jpg', 'boys4.jpg', 'boys5.jpg', 'boys6.jpg', 'boys7.jpg', 'boys8.jpg', 'boys9.jpg', 'boys10.jpg', 'boys16.jpg', 'boys17.jpg', 'boys18.jpg', 'boys19.jpg', 'boys20.jpg'],
  'boys-pent-coat': ['boys11.jpg', 'boys12.jpg', 'boys13.jpg', 'boys14.jpg', 'boys15.jpg'],
  'boys-eastern-wear': ['boys21.jpg', 'boys22.jpg', 'boys23.jpg', 'boys24.jpg', 'boys25.jpg'],
  'boys-party-wear': ['boys26.jpg', 'boys27.jpg', 'boys28.jpg', 'boys29.jpg', 'boys30.jpg'],
  'girls-casual-frocks': ['girls.jpg', 'girls1.jpg', 'girls2.jpg', 'girls3.jpg'],
  'girls-fancy-frocks': ['girls4.jpg', 'girls5.jpg', 'girls6.jpg', 'girls7.jpg'],
  'girls-party-wear': ['girls8.jpg', 'girls9.jpg', 'girls10.jpg', 'girls111.jpg'],
  'girls-eastern-wear': ['girls12.jpg', 'girls13.jpg', 'girls14.jpg', 'girls15.jpg'],
  'girls-traditional-dresses': ['girls16.jpg', 'girls17.jpg', 'girls18.jpg', 'girls19.jpg'],
  'girls-eid-collection': ['girls20.jpg', 'girls21.jpg', 'girls22.jpg'],
};

const MEN_CATS = {
  't-shirts': {
    names: ['Premium Cotton Tee','Athletic Performance Tee','Striped Casual Tee','Graphic Print Tee','V-Neck Essential Tee','Oversized Street Tee','Crew Neck Basic Tee','Color Block Tee','Henley Neck Tee','Muscle Fit Tee','Drop Shoulder Tee','Vintage Wash Tee','Contrast Trim Tee','Acid Wash Tee','Embroidered Logo Tee','Textured Knit Tee','Raglan Sleeve Tee','Pocket Detail Tee'],
    base: 1499, fabric:'Cotton', season:'summer'
  },
  'polo-shirts': {
    names: ['Classic Pique Polo','Slim-Fit Polo','Luxury Embroidered Polo','Contrast Collar Polo','Performance Polo','Tipped Collar Polo','Zip Neck Polo','Striped Polo Shirt','Textured Polo','Long Sleeve Polo','Button-Down Polo','Color Block Polo','Jacquard Polo','Mercerized Cotton Polo','Ottoman Rib Polo','Printed Polo','Waffle Knit Polo'],
    base: 2499, fabric:'Pique Cotton', season:'summer'
  },
  'casual-shirts': {
    names: ['Linen Casual Shirt','Oxford Button-Down','Chambray Denim Shirt','Mandarin Collar Shirt','Flannel Check Shirt','Twill Casual Shirt','Dobby Pattern Shirt','Camp Collar Shirt','Brushed Cotton Shirt','Plaid Casual Shirt','Printed Resort Shirt','Corduroy Shirt','Poplin Casual Shirt','Utility Pocket Shirt','Stretch Slim Shirt','Washed Denim Shirt'],
    base: 2999, fabric:'Cotton Blend', season:'all-season'
  },
  'formal-shirts': {
    names: ['Premium Dress Shirt','Slim-Fit Formal','French Cuff Shirt','Dobby Weave Formal','Pin Stripe Formal Shirt','Herringbone Dress Shirt','Tuxedo Formal Shirt','Spread Collar Formal','Egyptian Cotton Dress Shirt','Micro Check Formal','Sateen Finish Shirt','Club Collar Formal','Tab Collar Dress Shirt','Cutaway Collar Shirt','Classic Fit Dress Shirt'],
    base: 3499, fabric:'Egyptian Cotton', season:'all-season'
  },
  'jeans': {
    names: ['Slim-Fit Stretch Jeans','Classic Straight Jeans','Tapered Fit Jeans','Relaxed Fit Jeans','Skinny Black Jeans','Bootcut Wash Jeans','Ripped Slim Jeans','Selvedge Denim Jeans','Loose Fit Comfort Jeans','Dark Indigo Jeans'],
    base: 3499, fabric:'Stretch Denim', season:'all-season'
  },
  'pants': {
    names: ['Cotton Chinos','Formal Trousers','Cargo Pants','Linen Pants','Slim Fit Chinos','Pleated Dress Trousers','Jogger Pants','Tapered Cargo Pants','Wool Blend Trousers','Corduroy Pants','Cropped Ankle Pants','Tech Stretch Pants','Drawstring Linen Pants','Flat Front Trousers','Wide Leg Pants','Utility Work Pants','Twill Regular Pants'],
    base: 2999, fabric:'Cotton', season:'all-season'
  },
  'hoodies': {
    names: ['Classic Pullover Hoodie','Zip-Up Hoodie','Oversized Hoodie','Fleece Lined Hoodie','Tech Fleece Hoodie','Graphic Print Hoodie','Half-Zip Hoodie','Cropped Hoodie','Heavyweight Hoodie','Color Block Hoodie','Washed Cotton Hoodie','Kangaroo Pocket Hoodie'],
    base: 3999, fabric:'Fleece', season:'winter'
  },
  'sweaters': {
    names: ['Cashmere Blend Sweater','Cable Knit Sweater','V-Neck Wool Sweater','Cardigan Sweater','Turtleneck Sweater','Crew Neck Merino Sweater','Fair Isle Sweater','Quarter Zip Sweater','Ribbed Knit Sweater','Mockneck Sweater','Textured Knit Pullover','Chunky Knit Sweater','Waffle Stitch Sweater','Shawl Collar Cardigan','Lambswool V-Neck','Zip Through Cardigan','Intarsia Pattern Sweater'],
    base: 4499, fabric:'Wool Blend', season:'winter'
  },
  'jackets': {
    names: ['Premium Leather Jacket','Quilted Bomber','Denim Jacket','Windbreaker Jacket','Biker Leather Jacket','Varsity Jacket','Puffer Jacket','Harrington Jacket','Field Jacket','Coach Jacket','Suede Jacket','Fleece Jacket','Rain Shell Jacket','Trucker Denim Jacket','Shearling Collar Jacket'],
    base: 5999, fabric:'Mixed', season:'winter'
  },
  'formal-coats': {
    names: ['Wool Blend Topcoat','Classic Trench Coat','Double Breasted Overcoat','Winter Dress Coat','Premium Tailored Coat','Cashmere Overcoat','Chester Coat','Peak Lapel Overcoat','Belted Trench Coat','Herringbone Coat','Slim Fit Topcoat','Crombie Coat','Mac Coat','Camel Hair Coat','Pea Coat','Tweed Overcoat'],
    base: 12999, fabric:'Wool Blend', season:'winter'
  },
  'kurta-shalwar-kameez': {
    names: ['Premium Silk Shalwar Kameez','Classic Boski Kurta','Embroidered Kurta Pajama','Cotton Jute Kurta','Wash N Wear Kurta','Latha Kurta Set','Jacquard Kurta','Printed Lawn Kurta','Festive Embroidered Kurta','Designer Kurta Set'],
    base: 4999, fabric:'Mixed', season:'all-season'
  },
  'waistcoats': {
    names: ['Embroidered Waistcoat','Velvet Prince Coat','Formal Waistcoat','Jamawar Waistcoat','Silk Brocade Waistcoat','Nehru Jacket','Tweed Waistcoat','Quilted Gilet','Double Breasted Waistcoat','Suede Waistcoat','Herringbone Waistcoat','Paisley Waistcoat','Classic Wool Waistcoat'],
    base: 5999, fabric:'Silk Blend', season:'winter'
  },
};

const WOMEN_CATS = {
  'lawn-collection': {
    names: ['Premium Lawn 3-Piece','Embroidered Lawn Suit','Digital Print Lawn','Chiffon Dupatta Lawn','Jacquard Lawn Suit','Printed Lawn 2-Piece','Swiss Lawn Embroidered','Cambric Lawn Suit','Voile Lawn 3-Piece','Luxury Lawn Collection','Schiffli Lawn Suit','Block Print Lawn','Brochia Lawn Set','Lace Detail Lawn Suit','Premium Printed Lawn'],
    base: 4499, fabric:'Lawn', season:'summer'
  },
  'formal-wear': {
    names: ['Chiffon Formal Suit','Embroidered Velvet Suit','Organza Formal Dress','Silk Formal Set','Net Embroidered Suit','Brocade Formal Dress','Tissue Silk Formal','Raw Silk Formal Suit'],
    base: 8999, fabric:'Chiffon', season:'all-season'
  },
  'party-wear': {
    names: ['Organza Party Dress','Pastel Anarkali','Sequin Party Suit','Embellished Gown','Peplum Party Set','Net Embroidered Party Suit','Silk Party Dress','Chiffon Party Ensemble','Velvet Party Wear','Tissue Organza Party Set','Crystal Studded Gown','Mirror Work Party Suit','Embroidered Cape Dress','Layered Tulle Gown','Metallic Thread Party Wear'],
    base: 12999, fabric:'Organza', season:'all-season'
  },
  'luxury-pret': {
    names: ['Designer Luxury Suit','Crystal Embellished Pret','Silk Luxury Set','Premium Pret Ensemble','Couture Pret Dress','Hand Painted Pret','Zari Work Luxury','Velvet Luxury Pret','Organza Luxury Set','Pearl Embellished Pret'],
    base: 18999, fabric:'Silk', season:'all-season'
  },
  'bridal-wear': {
    names: ['Bridal Red Lehenga','Gold Maxi Bridal','Walima White Dress','Nikkah Gharara','Barat Ensemble','Walima Tail Gown','Royal Crimson Bridal Set','Pastel Pink Bridal Lehenga','Emerald Green Bridal Suit','Ivory Walima Gown','Peach Net Bridal Dress','Maroon Velvet Bridal','Rose Gold Bridal Ensemble','Champagne Bridal Maxi','Ruby Embellished Bridal','Burgundy Bridal Lehenga','Pearl White Bridal Set','Coral Bridal Sharara'],
    base: 45999, fabric:'Raw Silk / Net', season:'all-season'
  },
  'shalwar-kameez': {
    names: ['Cambric Shalwar Kameez','Khaddar Suit','Wash N Wear Set','Printed Shalwar Kameez','Plain Stitched Suit','Cotton Shalwar Kameez','Lawn Shalwar Kameez'],
    base: 3999, fabric:'Cambric / Cotton', season:'all-season'
  },
  'maxi-dresses': {
    names: ['Floral Maxi Dress','Embroidered Maxi','Silk Maxi Gown','Cotton Maxi Dress','Chiffon Layered Maxi','Georgette Maxi Dress','Printed Maxi Gown','Net Overlay Maxi'],
    base: 6999, fabric:'Georgette', season:'summer'
  },
  'winter-long-coats': {
    names: ['Wool Long Coat','Classic Trench Coat','Double Breasted Overcoat','Premium Winter Coat','Tailored Long Coat','Belted Wool Coat','Faux Fur Collar Coat','Cashmere Blend Coat','Herringbone Long Coat','Quilted Long Coat'],
    base: 14999, fabric:'Wool Blend', season:'winter'
  },
  'gharara-sharara': {
    names: ['Embroidered Sharara Set','Festive Sharara','Silk Gharara Set','Party Sharara','Bridal Gharara Style','Net Embroidered Gharara','Velvet Sharara Set','Cotton Silk Gharara','Chiffon Sharara Suit','Organza Gharara Dress','Jamawar Sharara Set'],
    base: 16999, fabric:'Jamawar', season:'all-season'
  },
};

const KIDS_CATS = {
  'boys-casual-wear': { names: ['Boys Cotton Tee Set', 'Boys Denim Overalls', 'Kids Casual Jogger Suit', 'Boys Graphic T-Shirt', 'Boys Embroidered Kurta', 'Kids Festive Kurta Shalwar', 'Boys Classic Boski Suit', 'Boys Wash N Wear Kurta', 'Boys Quilted Jacket', 'Kids Puffer Vest', 'Boys Fleece Hoodie', 'Boys Winter Sweater', 'Boys Polo Tee', 'Boys Cargo Shorts Set', 'Boys Striped Henley'], base: 1499, fabric: 'Mixed', season: 'all-season' },
  'boys-pent-coat': { names: ['Boys 3-Piece Pent Coat', 'Kids Formal Suit', 'Boys Velvet Dinner Jacket', 'Boys Mini Tuxedo', 'Boys Classic Blazer Set'], base: 5999, fabric: 'Wool Blend', season: 'winter' },
  'boys-eastern-wear': { names: ['Boys Premium Sherwani', 'Kids Fancy Eastern Suit', 'Boys Pathani Suit', 'Boys Prince Coat', 'Boys Embroidered Kurta Set'], base: 4999, fabric: 'Silk Blend', season: 'all-season' },
  'boys-party-wear': { names: ['Boys Festive Waistcoat', 'Kids Party Outfit', 'Boys Designer Suit', 'Boys Embellished Kurta', 'Boys Velvet Party Set'], base: 3499, fabric: 'Mixed', season: 'all-season' },
  'girls-casual-frocks': { names: ['Girls Floral Cotton Frock', 'Kids Summer Dress', 'Girls Polka Dot Frock', 'Girls Daily Wear Dress'], base: 1499, fabric: 'Cotton', season: 'summer' },
  'girls-fancy-frocks': { names: ['Girls Organza Fancy Frock', 'Kids Tulle Party Dress', 'Girls Net Embroidered Frock', 'Girls Designer Dress'], base: 3999, fabric: 'Net/Organza', season: 'all-season' },
  'girls-party-wear': { names: ['Girls Festive Lehenga', 'Kids Party Sharara', 'Girls Sequence Gown', 'Girls Embellished Party Suit'], base: 4599, fabric: 'Silk/Net', season: 'all-season' },
  'girls-eastern-wear': { names: ['Girls Shalwar Kameez', 'Kids Eastern Kurti Set', 'Girls Printed Lawn Suit', 'Girls Traditional 2-Piece'], base: 2499, fabric: 'Cotton/Lawn', season: 'all-season' },
  'girls-traditional-dresses': { names: ['Girls Sindhi Embroidery Dress', 'Kids Traditional Gharara', 'Girls Phulkari Suit', 'Girls Heritage Dress'], base: 3299, fabric: 'Mixed', season: 'all-season' },
  'girls-eid-collection': { names: ['Girls Special Eid Frock', 'Kids Festive Sharara Set', 'Girls Luxury Eid Dress'], base: 5999, fabric: 'Premium Silk', season: 'summer' },
};

const COLORS = [
  [{name:'Black',hex:'#000000'},{name:'White',hex:'#FFFFFF'}],
  [{name:'Navy',hex:'#000080'},{name:'Grey',hex:'#808080'}],
  [{name:'Beige',hex:'#F5F5DC'},{name:'Olive',hex:'#808000'}],
  [{name:'Maroon',hex:'#800000'},{name:'Cream',hex:'#FFFDD0'}],
  [{name:'Royal Blue',hex:'#4169E1'},{name:'Charcoal',hex:'#36454F'}],
];

const SIZES_MAP = { men: ['S','M','L','XL','XXL'], women: ['XS','S','M','L','XL'], kids: ['2-3Y','4-5Y','6-7Y','8-9Y','10-12Y'] };

function getImages(gender, category, index) {
  if (gender === 'men') {
    const images = LOCAL_MEN_IMAGES[category] || [];
    if (images.length === 0) return ['/placeholder.jpg', '/placeholder.jpg'];
    const idx1 = index % images.length;
    const idx2 = (index + 1) % images.length;
    return [`/images/products/men/${images[idx1]}`, `/images/products/men/${images[idx2]}`];
  } else if (gender === 'women') {
    const images = LOCAL_WOMEN_IMAGES[category] || [];
    if (images.length === 0) return ['/placeholder.jpg', '/placeholder.jpg'];
    const idx1 = index % images.length;
    const idx2 = (index + 1) % images.length;
    return [`/images/products/women/${images[idx1]}`, `/images/products/women/${images[idx2]}`];
  } else {
    // Kids local images
    const images = LOCAL_KIDS_IMAGES[category] || [];
    if (images.length === 0) return ['/placeholder.jpg', '/placeholder.jpg'];
    const idx1 = index % images.length;
    const idx2 = (index + 1) % images.length;
    return [`/images/products/kids/${images[idx1]}`, `/images/products/kids/${images[idx2]}`];
  }
}

function generateProducts(categories, gender) {
  const products = [];
  
  Object.entries(categories).forEach(([cat, data], catIndex) => {
    data.names.forEach((name, i) => {
      // Special override: If category is specific to a brand from user instructions
      let brand = getBrand(gender);
      if (cat === 't-shirts' || cat === 'polo-shirts' || cat === 'jackets') brand = 'Cougar';
      if (cat === 'lawn-collection' || cat === 'ready-to-wear') brand = 'Sapphire';
      if (cat === 'bridal-wear') brand = 'Sapphire';
      
      // Kids brand overrides
      if (gender === 'kids') {
        if (cat.includes('boys')) brand = 'Outfitters';
        if (cat.includes('girls') && cat.includes('frock')) brand = 'Khaadi';
        if (cat.includes('girls') && cat.includes('eid')) brand = 'Zellbury';
      }

      const title = `${brand} ${name}`;
      const priceVar = Math.floor(Math.random() * 500) - 200;
      const price = data.base + priceVar + (i * 300);
      const hasDiscount = Math.random() > 0.5;
      
      products.push({
        title,
        description: `Authentic ${brand} premium quality ${name.toLowerCase()} from the latest ${cat.replace(/-/g,' ')} collection. Crafted with the finest ${data.fabric || 'fabric'}. Photographed in clean flat-lay style perfectly suited for ${gender}.`,
        category: cat,
        gender,
        images: getImages(gender, cat, i),
        fabric: data.fabric || '',
        season: data.season || 'all-season',
        price,
        originalPrice: hasDiscount ? Math.round(price * 1.3) : undefined,
        sizes: SIZES_MAP[gender] || SIZES_MAP.men,
        colors: COLORS[i % COLORS.length],
        stock: 20 + Math.floor(Math.random() * 80),
        rating: +(4 + Math.random() * 0.9).toFixed(1),
        numReviews: 20 + Math.floor(Math.random() * 200),
        featured: i === 0,
        tryOnEnabled: true,
        isNewArrival: i < 2,
        isActive: true,
        categoryOrder: catIndex,
      });
    });
  });
  return products;
}

module.exports = { MEN_CATS, WOMEN_CATS, KIDS_CATS, generateProducts };
