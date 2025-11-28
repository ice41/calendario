const express = require('express');
const cors = require('cors');
const path = require('path');
const employeeRoutes = require('./routes/employees');
const vacationRoutes = require('./routes/vacations');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow all origins for dev, or configure specific origin
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/vacations', vacationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database file: ${path.join(__dirname, 'data', 'database.json')}`);
});
