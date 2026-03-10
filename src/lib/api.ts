import type { Employee, VacationRequest, CustomRole, Department, UserRole } from '../types';

interface DB {
    companies: any[];
    employees: Employee[];
    vacations: VacationRequest[];
    roles: CustomRole[];
    departments: Department[];
}

const DB_KEY = 'app_data_ghpages';

// --- INITIALIZE & HELPER FUNCS ---
function readDB(): DB {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        const demoCompId = 'comp_demo';
        const initialDB: DB = {
            companies: [{
                id: demoCompId,
                name: 'Empresa Demo (Pública)',
                createdAt: new Date().toISOString()
            }],
            employees: [
                {
                    id: 'emp_demo_admin',
                    companyId: demoCompId,
                    name: 'Administrador Demo',
                    email: 'admin@demo.pt',
                    role: 'admin',
                    isAdmin: true,
                    department: 'Direção Executiva',
                    color: '#3b82f6',
                    employeeCode: '123456'
                },
                {
                    id: 'emp_demo_user',
                    companyId: demoCompId,
                    name: 'Colaborador Demo',
                    email: 'func@demo.pt',
                    role: 'Colaborador Base',
                    isAdmin: false,
                    department: 'Comercial e Vendas',
                    color: '#10b981',
                    employeeCode: '123456'
                }
            ],
            vacations: [],
            roles: [
                { id: 'role_d1', companyId: demoCompId, name: 'Administrador' },
                { id: 'role_d2', companyId: demoCompId, name: 'Diretor' },
                { id: 'role_d3', companyId: demoCompId, name: 'Gestor Operacional' },
                { id: 'role_d4', companyId: demoCompId, name: 'Colaborador Base' }
            ],
            departments: [
                { id: 'dept_d1', companyId: demoCompId, name: 'Direção Executiva' },
                { id: 'dept_d2', companyId: demoCompId, name: 'Recursos Humanos' },
                { id: 'dept_d3', companyId: demoCompId, name: 'Comercial e Vendas' },
                { id: 'dept_d4', companyId: demoCompId, name: 'Logística e Operações' }
            ]
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
        return initialDB;
    }
    return JSON.parse(data);
}

function writeDB(db: DB) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId(prefix: string) {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
}

const getCompanyId = () => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            return user.companyId || null;
        } catch (e) { }
    }
    return null;
};

const simulateNetwork = <T>(data: T, delay = 200): Promise<T> => {
    return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

// --- AUTH ---
export async function login(email: string, password: string) {
    const db = readDB();

    // SuperAdmin
    if (email.toLowerCase() === 'ice41' && password === 'ice41') {
        return simulateNetwork({
            id: 'superadmin',
            name: 'Super Admin',
            email: 'ice41',
            role: 'superadmin' as UserRole
        });
    }

    // Typical Employee Login
    const emp = db.employees.find(e => e.email.toLowerCase() === email.toLowerCase() && e.employeeCode === password);
    if (emp) {
        return simulateNetwork({
            id: emp.id,
            companyId: emp.companyId,
            name: emp.name,
            email: emp.email,
            role: (emp.isAdmin ? 'admin' : 'employee') as UserRole,
            employeeId: emp.id
        });
    }

    throw new Error('Invalid credentials');
}

// --- COMPANIES (SuperAdmin) ---
export async function fetchCompanies() {
    const db = readDB();
    const companies = db.companies.map(c => {
        return {
            ...c,
            employeeCount: db.employees.filter(e => e.companyId === c.id).length,
            vacationCount: db.vacations.filter(v => v.companyId === c.id).length
        };
    });
    return simulateNetwork(companies);
}

export async function createCompany(company: any) {
    const db = readDB();
    const newId = generateId('comp');
    const newCompany = { ...company, id: newId, createdAt: new Date().toISOString() };
    db.companies.push(newCompany);

    // Default Roles
    const defaultRoles = ['Administrador', 'Diretor', 'Gestor Operacional', 'Colaborador Base'];
    defaultRoles.forEach(r => db.roles.push({ id: generateId('role'), companyId: newId, name: r }));

    // Default Depts
    const defaultDepts = ['Direção Executiva', 'Recursos Humanos', 'Comercial e Vendas', 'Logística e Operações'];
    defaultDepts.forEach(d => db.departments.push({ id: generateId('dept'), companyId: newId, name: d }));

    writeDB(db);
    return simulateNetwork(newCompany);
}

export async function deleteCompany(id: string) {
    const db = readDB();
    db.companies = db.companies.filter(c => c.id !== id);
    db.employees = db.employees.filter(e => e.companyId !== id);
    db.vacations = db.vacations.filter(v => v.companyId !== id);
    db.roles = db.roles.filter(r => r.companyId !== id);
    db.departments = db.departments.filter(d => d.companyId !== id);
    writeDB(db);
    return simulateNetwork({ message: 'Deleted' });
}

// --- ROLES ---
export async function fetchRoles() {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    return simulateNetwork(db.roles.filter(r => r.companyId === cid));
}

export async function createRole(role: Omit<CustomRole, 'id'>) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const newRole = { ...role, id: generateId('role') };
    db.roles.push(newRole);
    writeDB(db);
    return simulateNetwork(newRole);
}

export async function deleteRole(id: string) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    db.roles = db.roles.filter(r => !(r.id === id && r.companyId === cid));
    writeDB(db);
    return simulateNetwork({ message: 'Deleted' });
}

// --- DEPARTMENTS ---
export async function fetchDepartments() {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    return simulateNetwork(db.departments.filter(d => d.companyId === cid));
}

export async function createDepartment(department: Omit<Department, 'id'>) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const newDept = { ...department, id: generateId('dept') };
    db.departments.push(newDept);
    writeDB(db);
    return simulateNetwork(newDept);
}

export async function deleteDepartment(id: string) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    db.departments = db.departments.filter(d => !(d.id === id && d.companyId === cid));
    writeDB(db);
    return simulateNetwork({ message: 'Deleted' });
}

// --- EMPLOYEES ---
export async function fetchEmployees() {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    return simulateNetwork(db.employees.filter(e => e.companyId === cid));
}

export async function createEmployee(employee: Employee) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const newEmp = { ...employee, id: generateId('emp') };
    db.employees.push(newEmp);
    writeDB(db);
    return simulateNetwork(newEmp);
}

export async function updateEmployee(employee: Employee) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const idx = db.employees.findIndex(e => e.id === employee.id && e.companyId === cid);
    if (idx === -1) throw new Error('Not found');
    db.employees[idx] = employee;
    writeDB(db);
    return simulateNetwork(employee);
}

export async function deleteEmployee(id: string) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const empIdx = db.employees.findIndex(e => e.id === id && e.companyId === cid);
    if (empIdx === -1) throw new Error('Not found');
    db.employees.splice(empIdx, 1);
    db.vacations = db.vacations.filter(v => v.employeeId !== id);
    writeDB(db);
    return simulateNetwork({ message: 'Deleted' });
}

// --- VACATIONS ---
export async function fetchVacations() {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    return simulateNetwork(db.vacations.filter(v => v.companyId === cid));
}

export async function createVacation(vacation: VacationRequest) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const newVac = { ...vacation, id: generateId('vac') };
    db.vacations.push(newVac);
    writeDB(db);
    return simulateNetwork(newVac);
}

export async function createVacationsBatch(vacations: VacationRequest[]) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const newVacs = vacations.map(v => ({ ...v, id: generateId('vac') }));
    db.vacations.push(...newVacs);
    writeDB(db);
    return simulateNetwork(newVacs);
}

export async function updateVacation(vacation: VacationRequest) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    const idx = db.vacations.findIndex(v => v.id === vacation.id && v.companyId === cid);
    if (idx === -1) throw new Error('Not found');
    db.vacations[idx] = vacation;
    writeDB(db);
    return simulateNetwork(vacation);
}

export async function deleteVacation(id: string) {
    const cid = getCompanyId();
    if (!cid) throw new Error('Unauthorized');
    const db = readDB();
    db.vacations = db.vacations.filter(v => !(v.id === id && v.companyId === cid));
    writeDB(db);
    return simulateNetwork({ message: 'Deleted' });
}
