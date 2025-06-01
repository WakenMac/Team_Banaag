import dotenv from 'dotenv';
import express, {json} from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/router.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(json())
app.use(express.static(path.join(__dirname, '../Frontend_Code/public')));
app.use('/', router);

// ===========================================================
// HTML Traversal
app.get('/', (req, res) => {
    const loginPath = path.join(__dirname, '../Frontend_Code/html/login.html');
    console.log(`Serving login.html from: ${loginPath}`); // Debugging
    res.sendFile(loginPath);
});

app.get('/dashboard', (req, res) => {
    const dashboardPath = path.join(__dirname, '../Frontend_Code/html/dashboard.html');
    console.log(`Serving dashboard.html from: ${dashboardPath}`); // Debugging
    res.sendFile(dashboardPath);
});

app.get('/register', (req, res) => {
    const registerPath = path.join(__dirname, '../Frontend_Code/html/register.html');
    console.log(`Serving register.html from: ${registerPath}`); // Debugging
    res.sendFile(registerPath);
});

app.get('/admins', (req, res) => {
    const adminsPath = path.join(__dirname, '../Frontend_Code/html/subpages/admins.html');
    console.log(`Serving admins.html from: ${adminsPath}`); // Debugging
    res.sendFile(adminsPath);
});

app.get('/inventory', (req, res) => {
    const inventoryPath = path.join(__dirname, '../Frontend_Code/html/subpages/inventory.html');
    console.log(`Serving admins.html from: ${inventoryPath}`); // Debugging
    res.sendFile(inventoryPath);
});

app.get('/chemicals', (req, res) => {
    const chemicalPath = path.join(__dirname, '../Frontend_Code/html/subpages/chemicals.html');
    console.log(`Serving admins.html from: ${chemicalPath}`); // Debugging
    res.sendFile(chemicalPath);
});

app.get('/equipments', (req, res) => {
    const equipmentsPath = path.join(__dirname, '../Frontend_Code/html/subpages/equipments.html');
    console.log(`Serving admins.html from: ${equipmentsPath}`); // Debugging
    res.sendFile(equipmentsPath);
});

app.get('/apparatus', (req, res) => {
    const apparatusPath = path.join(__dirname, '../Frontend_Code/html/subpages/apparatus.html');
    console.log(`Serving admins.html from: ${apparatusPath}`); // Debugging
    res.sendFile(apparatusPath);
});

app.get('/glassware', (req, res) => {
    const glasswarePath = path.join(__dirname, '../Frontend_Code/html/subpages/glassware.html');
    console.log(`Serving admins.html from: ${glasswarePath}`); // Debugging
    res.sendFile(glasswarePath);
});

app.get('/items', (req, res) => {
    const glasswarePath = path.join(__dirname, '../Frontend_Code/html/subpages/items.html');
    console.log(`Serving admins.html from: ${glasswarePath}`); // Debugging
    res.sendFile(glasswarePath);
});

app.get('/location', (req, res) => {
    const locationPath = path.join(__dirname, '../Frontend_Code/html/subpages/location.html');
    console.log(`Serving admins.html from: ${locationPath}`); // Debugging
    res.sendFile(locationPath);
});

app.get('/unitType', (req, res) => {
    const unitTypePath = path.join(__dirname, '../Frontend_Code/html/subpages/unitType.html');
    console.log(`Serving admins.html from: ${unitTypePath}`); // Debugging
    res.sendFile(unitTypePath);
});

app.get('/restocks', (req, res) => {
    const restocksPath = path.join(__dirname, '../Frontend_Code/html/subpages/restocks.html');
    console.log(`Serving admins.html from: ${restocksPath}`); // Debugging
    res.sendFile(restocksPath);
});

app.get('/transactions', (req, res) => {
    const transactionsPath = path.join(__dirname, '../Frontend_Code/html/subpages/transactions.html');
    console.log(`Serving admins.html from: ${transactionsPath}`); // Debugging
    res.sendFile(transactionsPath);
});

app.get('/statistics', (req, res) => {
    const statisticsPath = path.join(__dirname, '../Frontend_Code/html/subpages/statistics.html');
    console.log(`Serving admins.html from: ${statisticsPath}`); // Debugging
    res.sendFile(statisticsPath);
});

// ====================================================
// --- Start the server ---
app.listen(PORT, (error) => {
    if (!error)
        console.log(`Server running on http://localhost:${PORT}`);
    else 
        console.log("Error occurred, server can't start", error);
});