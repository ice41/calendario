const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure database file exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ employees: [], vacations: [] }, null, 2));
}

function readData() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { employees: [], vacations: [] };
    }
}

function writeData(data) {
    try {
        // Create backup before writing
        // const backupPath = `${DB_PATH}.bak`;
        // fs.copyFileSync(DB_PATH, backupPath);

        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

module.exports = {
    readData,
    writeData
};
