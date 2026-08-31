const STORAGE_KEY = 'fmphoenix_trip_records';
const ISSUE_KEY = 'fmphoenix_issue_records';

function getTrips() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function getIssues() {
  const raw = localStorage.getItem(ISSUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function createMonthSummary(vehicleTag, year, month) {
  const trips = getTrips().filter(t => {
    if (t.vehicleTag !== vehicleTag || t.status !== 'completed') return false;
    const d = new Date(t.startedAt);
    return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
  });

  return {
    vehicleTag,
    year,
    month,
    trips,
    totalMiles: trips.reduce((sum, t) => sum + ((Number(t.endingOdometer) || 0) - (Number(t.beginningOdometer) || 0)), 0),
    drivers: [...new Set(trips.map(t => t.driverName).filter(Boolean))]
  };
}

function buildMasterReport({ selectedVehicles, year, month, departmentFilter = 'all' }) {
  const trips = getTrips().filter(t => {
    if (!selectedVehicles.includes(t.vehicleTag)) return false;
    if (t.status !== 'completed') return false;
    const d = new Date(t.startedAt);
    if (d.getFullYear() !== Number(year) || (d.getMonth() + 1) !== Number(month)) return false;
    if (departmentFilter !== 'all') {
      const matches = {
        facilities: ['Facilities Maintenance', 'Fleet Garage'].includes(t.jobFunction),
        'clinical-engineering': ['Clinical Engineering'].includes(t.jobFunction),
        utilities: ['Utilities & Medical Gas'].includes(t.jobFunction)
      };
      if (!matches[departmentFilter]) return false;
    }
    return true;
  });

  return trips;
}

function buildPdfWindow(title, rowsHtml, metaHtml) {
  const win = window.open('', '_blank');
  if (!win) return false;

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #0b1f3a; }
          h2 { margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th, td { border: 1px solid #c9d6ea; padding: 7px 8px; text-align: left; }
          th { background: #eef3fa; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        ${metaHtml}
        <table>
          <thead>
            <tr>
              <th>#</th><th>Date</th><th>Driver</th><th>Start Odo</th><th>End Odo</th><th>From</th><th>To</th><th>Job</th><th>Pass.</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  return true;
}

window.fmPhoenixPdf = {
  createMonthSummary,
  buildMasterReport,
  buildPdfWindow
};
