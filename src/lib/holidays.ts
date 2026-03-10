import { addDays, getDate, getMonth, getYear, isSameDay } from 'date-fns';

export interface Holiday {
    date: Date;
    name: string;
    isNational: boolean;
}

// Calculate Easter date using Gauss algorithm
function getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month, day);
}

export function getHolidays(year: number): Holiday[] {
    const easter = getEasterDate(year);

    const fixedHolidays = [
        { date: new Date(year, 0, 1), name: 'Ano Novo' },
        { date: new Date(year, 3, 25), name: 'Dia da Liberdade' },
        { date: new Date(year, 4, 1), name: 'Dia do Trabalhador' },
        { date: new Date(year, 5, 10), name: 'Dia de Portugal' },
        { date: new Date(year, 7, 15), name: 'Assunção de Nossa Senhora' },
        { date: new Date(year, 9, 5), name: 'Implantação da República' },
        { date: new Date(year, 10, 1), name: 'Dia de Todos os Santos' },
        { date: new Date(year, 11, 1), name: 'Restauração da Independência' },
        { date: new Date(year, 11, 8), name: 'Imaculada Conceição' },
        { date: new Date(year, 11, 25), name: 'Natal' },
    ];

    const mobileHolidays = [
        { date: addDays(easter, -2), name: 'Sexta-feira Santa' },
        { date: easter, name: 'Páscoa' },
        { date: addDays(easter, 60), name: 'Corpo de Deus' },
    ];

    return [
        ...fixedHolidays,
        ...mobileHolidays
    ].map(h => ({ ...h, isNational: true })).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function isHoliday(date: Date): Holiday | undefined {
    const year = getYear(date);
    const holidays = getHolidays(year);
    return holidays.find(h => isSameDay(h.date, date));
}
