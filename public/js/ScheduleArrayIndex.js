const scheduleData = [
  {
    id: 'sc-table1',
    rows: [
      ['Trip Number', 'Designated Time'],
      ['AE101', '6:00 AM'],
      ['AE102', '7:30 AM'],
      ['AE103', '9:30 AM'],
      ['AE104', '11:00 AM'],
      ['AE105', '1:00 PM'],
      ['AE106', '2:30 PM'],
      ['AE107', '3:30 PM'],
      ['AE108', '5:10 PM'],
      ['AE109', '6:15 PM'],
      ['AE110', '7:45 PM'],
      ['Pick-up Point', 'Yuchengco Bldg.' ],
    ],
  },
  {
    id: 'sc-table2',
    rows: [
      ['Trip Number', 'Designated Time'],
      ['AE151', '5:45 AM'],
      ['AE152', '6:15 AM'],
      ['AE153', '7:00 AM'],
      ['AE154', '8:00 AM'],
      ['AE155', '9:00 AM'],
      ['AE156', '11:00 AM'],
      ['AE157', '1:00 PM'],
      ['AE158', '2:30 PM'],
      ['AE159', '3:30 PM'],
      ['AE160', '5:10 PM'],
      ['AE161', '6:15 PM'],
      ['AE162', '7:45 PM'],
      ['Pick-up Point', 'East Canopy MMR' ],
    ],
  },
  {
    id: 'sc-table3',
    rows: [
      ['DLSU Laguna to Laguna Central', 'Laguna Central to DLSU Laguna'],
      ['9:00 AM', '6:00 AM'],
      ['11:30 AM', '6:30 AM'],
      ['4:45 PM', '7:00 AM'],
      ['5:10 PM', '12:15 PM'],
      ['5:30 PM', '1:00 PM'],
      ['6:00 PM', '3:00 PM'],
      ['6:30 PM', '3:30 PM'],
      ['7:00 PM', ''],
      ['7:45 PM', ''],
      ['Pick-up Point', 'Laguna Central' ],
    ],
  },
  {
    id: 'sc-table4',
    rows: [
      ['DLSU Laguna to Pavilion', 'Pavilion to DLSU Laguna'],
      ['4:45 PM', '5:30 AM'],
      ['5:10 PM', '6:00 AM'],
      ['5:30 PM', '6:30 AM'],
      ['6:00 PM', '7:00 AM'],
      ['7:45 PM', ''],
      ['Pick-up Point', 'Shell Pavilion'],
    ],
  },
  {
    id: 'sc-table5',
    rows: [
      ['DLSU Laguna to Carmona', 'Carmona to DLSU Laguna'],
      ['4:45 PM', '6:30 AM'],
      ['5:10 PM', ''],
      ['5:30 PM', ''],
      ['6:00 PM', ''],
      ['7:45 PM', ''],
      ['Pick-up Points', 'Carmona Covered Walk'],
      ['7-Eleven Sto. Tomas', 'Malamig Terminal'],
    ],
  },
  {
    id: 'sc-table6',
    rows: [
      ['DLSU Laguna to Waltermart', 'Waltermart to DLSU Laguna'],
      ['4:45 PM', '6:30 AM'],
      ['5:10 PM', '7:00 AM' ],
      ['5:30 PM', ''],
      ['6:00 PM', ''],
      ['7:45 PM', ''],
      ['Pick-up Points', 'Caltex Waltermart'],
    ],
  },
  {
    id: 'sc-table7',
    rows: [
      ['DLSU Laguna to Paseo', 'Paseo to DLSU Laguna'],
      ['12:10 PM', '7:00 AM'],
    ],
  },
  {
    id: 'sc-table8',
    rows: [
      ['DLSU Laguna to Carmona', 'Carmona to DLSU Laguna'],
      ['12:10 PM', '7:00 AM'],
    ],
  },
  {
    id: 'sc-table9',
    rows: [
      ['DLSU Laguna to Waltermart', 'Waltermart to DLSU Laguna'],
      ['12:10 PM', '7:00 AM'],
    ],
  },
];

scheduleData.forEach(({ id, rows }) => {
  const table = document.getElementById(id);
  if (table) {
    rows.forEach((row, rowIndex) => {
      const newRow = document.createElement('tr');
      row.forEach((cellData, cellIndex) => {
        const cell = document.createElement('td');
        cell.textContent = cellData;
        newRow.appendChild(cell);
      });
      newRow.classList.add(rowIndex % 2 === 0 ? 'even-row' : 'odd-row');
      table.appendChild(newRow);
    });
    table.classList.add('schedule-table');
  }
});
