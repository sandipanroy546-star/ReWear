require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n✅ ReWear server running on http://localhost:${PORT}`);
        console.log(`   Frontend: http://localhost:${PORT}/index.html`);
        console.log(`   API Base: http://localhost:${PORT}/api\n`);
    });
});
