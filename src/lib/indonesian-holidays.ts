// Indonesian National Holidays for 2024-2027
// Source: https://publicholidays.co.id/

export interface IndonesianHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  nameId: string; // Indonesian name
}

const holidays: IndonesianHoliday[] = [
  // 2024
  { date: '2024-01-01', name: "New Year's Day", nameId: 'Tahun Baru Masehi' },
  { date: '2024-02-08', name: 'Isra Mi\'raj', nameId: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2024-02-10', name: 'Chinese New Year', nameId: 'Tahun Baru Imlek' },
  { date: '2024-03-11', name: 'Nyepi Day', nameId: 'Hari Raya Nyepi' },
  { date: '2024-03-29', name: 'Good Friday', nameId: 'Wafat Isa Almasih' },
  { date: '2024-03-31', name: 'Easter Sunday', nameId: 'Hari Raya Paskah' },
  { date: '2024-04-10', name: 'Eid al-Fitr', nameId: 'Hari Raya Idul Fitri' },
  { date: '2024-04-11', name: 'Eid al-Fitr Holiday', nameId: 'Hari Raya Idul Fitri' },
  { date: '2024-05-01', name: 'Labour Day', nameId: 'Hari Buruh Internasional' },
  { date: '2024-05-09', name: 'Ascension of Jesus', nameId: 'Kenaikan Isa Almasih' },
  { date: '2024-05-23', name: 'Vesak Day', nameId: 'Hari Raya Waisak' },
  { date: '2024-06-01', name: 'Pancasila Day', nameId: 'Hari Lahir Pancasila' },
  { date: '2024-06-17', name: 'Eid al-Adha', nameId: 'Hari Raya Idul Adha' },
  { date: '2024-07-07', name: 'Islamic New Year', nameId: 'Tahun Baru Islam' },
  { date: '2024-08-17', name: 'Independence Day', nameId: 'Hari Kemerdekaan RI' },
  { date: '2024-09-16', name: 'Prophet Muhammad\'s Birthday', nameId: 'Maulid Nabi Muhammad SAW' },
  { date: '2024-12-25', name: 'Christmas Day', nameId: 'Hari Raya Natal' },

  // 2025
  { date: '2025-01-01', name: "New Year's Day", nameId: 'Tahun Baru Masehi' },
  { date: '2025-01-27', name: 'Isra Mi\'raj', nameId: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2025-01-29', name: 'Chinese New Year', nameId: 'Tahun Baru Imlek' },
  { date: '2025-03-29', name: 'Nyepi Day', nameId: 'Hari Raya Nyepi' },
  { date: '2025-03-31', name: 'Eid al-Fitr', nameId: 'Hari Raya Idul Fitri' },
  { date: '2025-04-01', name: 'Eid al-Fitr Holiday', nameId: 'Hari Raya Idul Fitri' },
  { date: '2025-04-18', name: 'Good Friday', nameId: 'Wafat Isa Almasih' },
  { date: '2025-04-20', name: 'Easter Sunday', nameId: 'Hari Raya Paskah' },
  { date: '2025-05-01', name: 'Labour Day', nameId: 'Hari Buruh Internasional' },
  { date: '2025-05-12', name: 'Vesak Day', nameId: 'Hari Raya Waisak' },
  { date: '2025-05-29', name: 'Ascension of Jesus', nameId: 'Kenaikan Isa Almasih' },
  { date: '2025-06-01', name: 'Pancasila Day', nameId: 'Hari Lahir Pancasila' },
  { date: '2025-06-06', name: 'Eid al-Adha', nameId: 'Hari Raya Idul Adha' },
  { date: '2025-06-27', name: 'Islamic New Year', nameId: 'Tahun Baru Islam' },
  { date: '2025-08-17', name: 'Independence Day', nameId: 'Hari Kemerdekaan RI' },
  { date: '2025-09-05', name: 'Prophet Muhammad\'s Birthday', nameId: 'Maulid Nabi Muhammad SAW' },
  { date: '2025-12-25', name: 'Christmas Day', nameId: 'Hari Raya Natal' },

  // 2026
  { date: '2026-01-01', name: "New Year's Day", nameId: 'Tahun Baru Masehi' },
  { date: '2026-01-17', name: 'Isra Mi\'raj', nameId: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2026-02-17', name: 'Chinese New Year', nameId: 'Tahun Baru Imlek' },
  { date: '2026-03-19', name: 'Nyepi Day', nameId: 'Hari Raya Nyepi' },
  { date: '2026-03-20', name: 'Eid al-Fitr', nameId: 'Hari Raya Idul Fitri' },
  { date: '2026-03-21', name: 'Eid al-Fitr Holiday', nameId: 'Hari Raya Idul Fitri' },
  { date: '2026-04-03', name: 'Good Friday', nameId: 'Wafat Isa Almasih' },
  { date: '2026-04-05', name: 'Easter Sunday', nameId: 'Hari Raya Paskah' },
  { date: '2026-05-01', name: 'Labour Day', nameId: 'Hari Buruh Internasional' },
  { date: '2026-05-14', name: 'Ascension of Jesus', nameId: 'Kenaikan Isa Almasih' },
  { date: '2026-05-27', name: 'Eid al-Adha', nameId: 'Hari Raya Idul Adha' },
  { date: '2026-06-01', name: 'Pancasila Day', nameId: 'Hari Lahir Pancasila' },
  { date: '2026-06-01', name: 'Vesak Day', nameId: 'Hari Raya Waisak' },
  { date: '2026-06-16', name: 'Islamic New Year', nameId: 'Tahun Baru Islam' },
  { date: '2026-08-17', name: 'Independence Day', nameId: 'Hari Kemerdekaan RI' },
  { date: '2026-08-25', name: 'Prophet Muhammad\'s Birthday', nameId: 'Maulid Nabi Muhammad SAW' },
  { date: '2026-12-25', name: 'Christmas Day', nameId: 'Hari Raya Natal' },

  // 2027
  { date: '2027-01-01', name: "New Year's Day", nameId: 'Tahun Baru Masehi' },
  { date: '2027-01-06', name: 'Isra Mi\'raj', nameId: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2027-02-06', name: 'Chinese New Year', nameId: 'Tahun Baru Imlek' },
  { date: '2027-03-09', name: 'Nyepi Day', nameId: 'Hari Raya Nyepi' },
  { date: '2027-03-10', name: 'Eid al-Fitr', nameId: 'Hari Raya Idul Fitri' },
  { date: '2027-03-11', name: 'Eid al-Fitr Holiday', nameId: 'Hari Raya Idul Fitri' },
  { date: '2027-03-26', name: 'Good Friday', nameId: 'Wafat Isa Almasih' },
  { date: '2027-03-28', name: 'Easter Sunday', nameId: 'Hari Raya Paskah' },
  { date: '2027-05-01', name: 'Labour Day', nameId: 'Hari Buruh Internasional' },
  { date: '2027-05-06', name: 'Ascension of Jesus', nameId: 'Kenaikan Isa Almasih' },
  { date: '2027-05-16', name: 'Eid al-Adha', nameId: 'Hari Raya Idul Adha' },
  { date: '2027-05-20', name: 'Vesak Day', nameId: 'Hari Raya Waisak' },
  { date: '2027-06-01', name: 'Pancasila Day', nameId: 'Hari Lahir Pancasila' },
  { date: '2027-06-06', name: 'Islamic New Year', nameId: 'Tahun Baru Islam' },
  { date: '2027-08-15', name: 'Prophet Muhammad\'s Birthday', nameId: 'Maulid Nabi Muhammad SAW' },
  { date: '2027-08-17', name: 'Independence Day', nameId: 'Hari Kemerdekaan RI' },
  { date: '2027-12-25', name: 'Christmas Day', nameId: 'Hari Raya Natal' },
];

export const getIndonesianHolidays = (): IndonesianHoliday[] => holidays;

export const getHolidaysForMonth = (year: number, month: number): IndonesianHoliday[] => {
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  return holidays.filter(h => h.date.startsWith(prefix));
};

export const getHolidayForDate = (date: Date): IndonesianHoliday | undefined => {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.find(h => h.date === dateStr);
};

export const isHoliday = (date: Date): boolean => {
  return !!getHolidayForDate(date);
};
