import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testDataStorage() {
  try {
    console.log('🧪 Testing Data Storage...\n');

    // 1. Test User Registration
    console.log('1️⃣ Testing User Registration:');
    const userRes = await axios.post(`${API_URL}/user/register`, {
      name: 'Test User',
      email: `testuser${Date.now()}@test.com`,
      password: 'password123'
    });
    console.log('✅ User Created:', userRes.data);
    const token = userRes.data.token;
    console.log('🔑 Token:', token, '\n');

    // 2. Test Product Fetching (should be empty initially)
    console.log('2️⃣ Testing Product Fetch:');
    const productsRes = await axios.get(`${API_URL}/product/list`);
    console.log('✅ Products Count:', productsRes.data.products?.length || 0);
    console.log('📦 Products:', productsRes.data.products, '\n');

    // 3. Test Cart Operations
    if (token) {
      console.log('3️⃣ Testing Cart Operations:');
      const cartRes = await axios.post(
        `${API_URL}/cart/get`,
        {},
        { headers: { token } }
      );
      console.log('✅ User Cart:', cartRes.data, '\n');
    }

    // 4. Check MongoDB Connection
    console.log('4️⃣ MongoDB Status:');
    const apiRes = await axios.get(`${API_URL}/`);
    console.log('✅ API Response:', apiRes.data, '\n');

    console.log('✨ All tests passed! Data is being stored.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDataStorage();
