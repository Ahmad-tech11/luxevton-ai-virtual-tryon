const axios = require('axios');

async function testOrder() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/orders', {
      products: [{ productId: '663cb64e83f5c71b69f69741', title: 'Test', price: 100, quantity: 1 }],
      totalPrice: 100,
      shippingAddress: { fullName: 'Test', phone: '123', address: '123', city: 'Lahore', email: 'test@example.com' }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}

testOrder();
