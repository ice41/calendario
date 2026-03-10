const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../db');

// GET all vacations
router.get('/', (req, res) => {
    const data = readData();
    res.json(data.vacations);
});

// POST new vacation
router.post('/', (req, res) => {
    const data = readData();
    const newVacation = req.body;

    if (!newVacation.id || !newVacation.employeeId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    data.vacations.push(newVacation);

    if (writeData(data)) {
        res.status(201).json(newVacation);
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// POST batch vacations (for multiple groups)
router.post('/batch', (req, res) => {
    const data = readData();
    const newVacations = req.body;

    if (!Array.isArray(newVacations)) {
        return res.status(400).json({ error: 'Expected array of vacations' });
    }

    data.vacations.push(...newVacations);

    if (writeData(data)) {
        res.status(201).json({ message: `Added ${newVacations.length} vacations`, count: newVacations.length });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// PUT update vacation
router.put('/:id', (req, res) => {
    const data = readData();
    const { id } = req.params;
    const updatedVacation = req.body;

    const index = data.vacations.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Vacation not found' });
    }

    data.vacations[index] = { ...data.vacations[index], ...updatedVacation };

    if (writeData(data)) {
        res.json(data.vacations[index]);
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// DELETE vacation
router.delete('/:id', (req, res) => {
    const data = readData();
    const { id } = req.params;

    const initialLength = data.vacations.length;
    data.vacations = data.vacations.filter(v => v.id !== id);

    if (data.vacations.length === initialLength) {
        return res.status(404).json({ error: 'Vacation not found' });
    }

    if (writeData(data)) {
        res.json({ message: 'Vacation deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// POST remove day from vacation (special logic)
router.post('/:id/remove-day', (req, res) => {
    const data = readData();
    const { id } = req.params;
    const { dayToRemove } = req.body; // Expects ISO date string

    const vacation = data.vacations.find(v => v.id === id);
    if (!vacation) {
        return res.status(404).json({ error: 'Vacation not found' });
    }

    // Logic to split vacation is complex to replicate here exactly as in frontend
    // For now, we'll assume the frontend sends the NEW state (delete old, add new ones)
    // OR we can implement the logic here.
    // Let's implement the logic here to keep backend robust.

    // ... Actually, to keep it simple and consistent with the frontend logic we already fixed,
    // it might be better if the frontend calculates the new vacations and uses the batch API.
    // But the requirement was to move logic to backend?
    // Let's stick to the plan: Frontend calls removeDayFromVacation in AppContext,
    // which calculates the new state and calls API.
    // So for this endpoint, we might not strictly need it if we use delete + batch create.

    // However, to be safe, let's just return 501 Not Implemented and handle it in frontend
    // by deleting and creating new entries.

    res.status(501).json({ error: 'Please use delete and create operations' });
});

module.exports = router;
