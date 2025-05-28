
const express = require('express');
const app = express();
const PORT = 3000;

const adminRoutes = require('./routes/router') // Imports the routes for the router
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Admin API Backend!</h1><p>Access admin routes via /api/admin</p>')
})

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});