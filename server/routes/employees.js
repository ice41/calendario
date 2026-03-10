const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../db');

// GET all employees
router.get('/', (req, res) => {
    const data = readData();
    res.json(data.employees);
});

// POST new employee
router.post('/', (req, res) => {
    const data = readData();
    const newEmployee = req.body;

    // Basic validation
    if (!newEmployee.id || !newEmployee.name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for duplicate ID
    if (data.employees.find(e => e.id === newEmployee.id)) {
        return res.status(409).json({ error: 'Employee ID already exists' });
    }

    data.employees.push(newEmployee);

    if (writeData(data)) {
        res.status(201).json(newEmployee);
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// PUT update employee
router.put('/:id', (req, res) => {
    const data = readData();
    const { id } = req.params;
    const updatedEmployee = req.body;

    const index = data.employees.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    data.employees[index] = { ...data.employees[index], ...updatedEmployee };

    if (writeData(data)) {
        res.json(data.employees[index]);
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// DELETE employee
router.delete('/:id', (req, res) => {
    const data = readData();
    const { id } = req.params;

    const initialLength = data.employees.length;
    data.employees = data.employees.filter(e => e.id !== id);

    if (data.employees.length === initialLength) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    // Also remove associated vacations
    data.vacations = data.vacations.filter(v => v.employeeId !== id);

    if (writeData(data)) {
        res.json({ message: 'Employee deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

module.exports = router;
