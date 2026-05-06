const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunareddy',
    database: 'sms_db'
};

(async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');
        
        const [tables] = await connection.query("SHOW TABLES");
        console.log('Tables:', tables.map(t => Object.values(t)[0]));
        
        const [dbCheck] = await connection.query("SELECT DATABASE()");
        console.log('Current DB:', dbCheck[0]['DATABASE()']);
        
        await connection.end();
    } catch (err) {
        console.error('❌ Connection Error:', err.message);
    }
})();
