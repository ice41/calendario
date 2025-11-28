const API_URL = 'http://localhost:3001/api';

export async function fetchEmployees() {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
}

export async function createEmployee(employee: any) {
    const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
}

export async function updateEmployee(employee: any) {
    const response = await fetch(`${API_URL}/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
}

export async function deleteEmployee(id: string) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return response.json();
}

export async function fetchVacations() {
    const response = await fetch(`${API_URL}/vacations`);
    if (!response.ok) throw new Error('Failed to fetch vacations');
    return response.json();
}

export async function createVacation(vacation: any) {
    const response = await fetch(`${API_URL}/vacations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacation),
    });
    if (!response.ok) throw new Error('Failed to create vacation');
    return response.json();
}

export async function createVacationsBatch(vacations: any[]) {
    const response = await fetch(`${API_URL}/vacations/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacations),
    });
    if (!response.ok) throw new Error('Failed to create vacations batch');
    return response.json();
}

export async function updateVacation(vacation: any) {
    const response = await fetch(`${API_URL}/vacations/${vacation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacation),
    });
    if (!response.ok) throw new Error('Failed to update vacation');
    return response.json();
}

export async function deleteVacation(id: string) {
    const response = await fetch(`${API_URL}/vacations/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vacation');
    return response.json();
}
