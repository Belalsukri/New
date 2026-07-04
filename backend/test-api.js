async function testAdd() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'belalsukari@gmail.com', password: '123456' })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Token obtained.');

        const res = await fetch('http://localhost:5000/api/stores/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'API Test Store ' + Date.now(),
                ownerEmail: 'belalsukari@gmail.com',
                description: 'Test',
                address: 'Test'
            })
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testAdd();
