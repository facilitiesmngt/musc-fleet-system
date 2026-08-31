$html = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FM Phoenix - Fleet Management System</title>
  <style>
    :root {
      --navy: #0a2d4d;
      --blue: #1a5b8c;
      --gold: #f5b93a;
      --orange: #ef7d2d;
      --red: #b3282f;
      --slate: #4e6278;
      --line: #dfe7f0;
      --panel: #f7f9fc;
      --white: #ffffff;
      --bg: linear-gradient(135deg, #edf3fb 0%, #f7f9fc 100%);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; font-family: "Segoe UI", Tahoma, sans-serif; background: var(--bg); color: var(--navy);
    }
    a, button, input, select, textarea { font: inherit; }
    .login-shell { min-height: 100vh; display: grid; grid-template-columns: 1.4fr .9fr; }
    .brand-panel {
      position: relative; padding: 42px 54px; background: linear-gradient(135deg, rgba(10,45,77,0.98), rgba(17,77,121,0.96));
      color: white; overflow: hidden;
    }
    .brand-panel::after {
      content: ""; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
    }
    .brand-inner { position: relative; z-index: 1; max-width: 680px; }
    .brand-top { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
    .phoenix-mark {
      width: 80px; height: 80px; border-radius: 20px; display: grid; place-items: center;
      background: linear-gradient(135deg, rgba(245,185,58,0.28), rgba(239,125,45,0.18));
      border: 1px solid rgba(255,255,255,0.2);
    }
    .phoenix-mark::before {
      content: ""; width: 42px; height: 42px; display: block; background: linear-gradient(135deg, #f8d265, #ef7d2d 55%, #b3282f);
      clip-path: polygon(50% 0%, 85% 20%, 100% 56%, 80% 90%, 50% 100%, 20% 90%, 0% 56%, 15% 20%);
      transform: rotate(8deg); box-shadow: 0 10px 24px rgba(245,185,58,0.45);
    }
    .brand-title { margin: 0; font-size: 1.2rem; letter-spacing: 0.12em; text-transform: uppercase; }
    .brand-tagline {
      margin: 0 0 16px; font-size: clamp(1.5rem, 2.2vw, 2.1rem); font-weight: 800; letter-spacing: 0.03em; color: #f9d879; font-style: italic;
    }
    .department-name { font-size: clamp(2rem, 3vw, 3.6rem); line-height: 1.08; margin: 0 0 8px; font-weight: 800; }
    .brand-sub { max-width: 620px; font-size: 1.08rem; color: rgba(255,255,255,0.88); line-height: 1.6; }
    .brand-cta { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 12px; }
    .primary-btn, .ghost-btn, .secondary-btn, .utility-btn {
      border: none; border-radius: 12px; padding: 12px 18px; cursor: pointer; font-weight: 700;
      transition: transform 0.2s ease;
    }
    .primary-btn { background: linear-gradient(135deg, var(--gold), var(--orange)); color: #14253d; }
    .ghost-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: white; }
    .secondary-btn { background: #eef4fb; color: var(--navy); border: 1px solid #d8e2ee; }
    .utility-btn { background: rgba(26,91,140,0.08); color: var(--navy); border: 1px solid rgba(26,91,140,0.18); }
    .primary-btn:hover, .ghost-btn:hover, .secondary-btn:hover, .utility-btn:hover { transform: translateY(-1px); }
    .login-panel { display: flex; align-items: center; justify-content: center; padding: 36px 32px; background: rgba(255,255,255,0.7); }
    .login-card { width: min(420px, 100%); background: rgba(255,255,255,0.94); border: 1px solid rgba(26,91,140,0.15); border-radius: 26px; padding: 30px; box-shadow: 0 28px 60px rgba(10,45,77,0.12); }
    .login-card h2 { margin: 0 0 8px; color: var(--navy); font-size: 2rem; }
    .login-card p { margin: 0 0 18px; color: var(--slate); line-height: 1.5; }
    .field { margin-bottom: 16px; }
    .field label { display: block; margin-bottom: 8px; color: var(--navy); font-weight: 700; font-size: 0.8rem; letter-spacing: 0.04em; text-transform: uppercase; }
    .field input { width: 100%; box-sizing: border-box; border: 1px solid var(--line); border-radius: 12px; background: #f9fbfe; padding: 13px 14px; font-size: 0.98rem; }
    .field-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 8px 0 18px; font-size: 0.82rem; color: var(--slate); }
    .check-row { display: flex; align-items: center; gap: 8px; }
    .linkish { color: var(--blue); font-weight: 700; cursor: pointer; }
    .otp-banner { margin-top: 14px; padding: 10px 12px; border-radius: 10px; background: rgba(93,166,218,0.08); border: 1px solid rgba(26,91,140,0.12); display: none; }
    .otp-banner.visible { display: block; }
    .button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
    .app-shell { display: none; min-height: 100vh; background: var(--bg); }
    .app-shell.visible { display: block; }
    .app-header { background: linear-gradient(135deg, var(--navy) 0%, #103f69 100%); color: white; padding: 20px 32px 18px; }
    .app-header-row { max-width: 1480px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .brand-mini { display: flex; align-items: center; gap: 14px; }
    .brand-mini-mark {
      width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg, var(--gold), var(--orange));
      position: relative; box-shadow: 0 10px 18px rgba(245,185,58,0.2);
    }
    .brand-mini-mark::before {
      content: ""; width: 22px; height: 22px; display: block; background: rgba(255,255,255,0.94);
      clip-path: polygon(50% 0%, 88% 30%, 100% 58%, 76% 100%, 50% 90%, 24% 100%, 0% 58%, 12% 30%); transform: rotate(8deg);
    }
    .brand-mini-title { display: block; font-size: 1rem; font-weight: 800; letter-spacing: 0.03em; }
    .brand-mini-sub { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.72); letter-spacing: 0.08em; text-transform: uppercase; }
    .app-header-meta { display: flex; align-items: center; gap: 16px; color: rgba(255,255,255,0.82); font-size: 0.85rem; }
    .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #31d08b; margin-right: 8px; }
    .app-content { max-width: 1480px; margin: 0 auto; padding: 26px 28px 100px; }
    .department-banner { background: linear-gradient(135deg, rgba(26,91,140,0.1), rgba(245,185,58,0.08)); border: 1px solid rgba(26,91,140,0.16); border-radius: 22px; padding: 22px 24px; display: flex; justify-content: space-between; gap: 18px; align-items: center; margin-bottom: 22px; }
    .department-banner strong { display: block; margin-bottom: 6px; font-size: 1.18rem; }
    .department-banner span { color: var(--slate); font-size: 0.9rem; }
    .page-tag { background: rgba(245,185,58,0.14); border: 1px solid rgba(245,185,58,0.28); color: #7a4d05; border-radius: 999px; padding: 8px 12px; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; margin-bottom: 22px; }
    .stat-panel { background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,253,0.96)); border: 1px solid var(--line); border-radius: 18px; padding: 18px; box-shadow: 0 14px 28px rgba(17,30,53,0.04); }
    .stat-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate); font-weight: 800; }
    .stat-value { font-size: clamp(1.7rem,2vw,2.5rem); font-weight: 900; margin: 10px 0 6px; }
    .stat-trend { font-size: 0.8rem; color: #1d7f53; font-weight: 700; }
    .content-stack { display: grid; grid-template-columns: 1.3fr .7fr; gap: 22px; margin-bottom: 20px; }
    .card { background: rgba(255,255,255,0.96); border: 1px solid var(--line); border-radius: 22px; padding: 22px; box-shadow: 0 14px 28px rgba(17,30,53,0.04); }
    .card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; }
    .card-head h3 { margin: 0; color: var(--navy); font-size: 1.2rem; }
    .tiny-badge { border-radius: 999px; padding: 7px 10px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .badge-success { background: rgba(49,208,139,0.12); color: #156b4a; }
    .badge-warning { background: rgba(245,185,58,0.12); color: #7a4d05; }
    .feature-list { display: grid; gap: 14px; }
    .feature-row { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border: 1px solid var(--line); background: var(--panel); border-radius: 14px; }
    .feature-icon { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, rgba(26,91,140,0.12), rgba(245,185,58,0.18)); color: var(--blue); font-weight: 900; }
    .feature-copy strong { display: block; color: var(--navy); margin-bottom: 4px; }
    .feature-copy span { color: var(--slate); font-size: 0.86rem; }
    .dept-info-box { display: grid; gap: 14px; }
    .dept-info-box p { margin: 0; line-height: 1.7; color: var(--slate); }
    .contact-list { display: grid; gap: 8px; }
    .contact-line { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; color: var(--navy); font-weight: 700; }
    .muted { color: var(--slate); }
    .tab-content { display: none; margin-top: 18px; }
    .tab-content.active { display: block; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .data-table th, .data-table td { border: 1px solid var(--line); padding: 10px 12px; text-align: left; }
    .data-table th { background: #f3f6fa; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 8px; }
    .form-field label { font-size: 0.8rem; font-weight: 800; color: var(--navy); letter-spacing: 0.04em; text-transform: uppercase; }
    .form-field input, .form-field select, .form-field textarea { border: 1px solid var(--line); border-radius: 12px; background: #f9fbfe; padding: 12px 14px; color: var(--navy); }
    .form-field textarea { min-height: 110px; resize: vertical; }
    .bottom-nav { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); width: min(1240px, calc(100% - 30px)); background: rgba(10,45,77,0.96); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 8px 10px; box-shadow: 0 28px 48px rgba(10,45,77,0.26); z-index: 30; }
    .bottom-nav-inner { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px; }
    .nav-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); border-radius: 12px; text-align: center; padding: 11px 8px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.04em; text-decoration: none; }
    .nav-pill.active, .nav-pill:hover { background: linear-gradient(135deg, rgba(245,185,58,0.22), rgba(239,125,45,0.14)); border-color: rgba(245,185,58,0.42); color: white; }
    @media (max-width: 980px) { .login-shell { grid-template-columns: 1fr; } .brand-panel { padding-bottom: 30px; } .dashboard-grid, .content-stack, .form-grid { grid-template-columns: 1fr; } .bottom-nav-inner { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  </style>
</head>
<body>
  <div class="login-shell" id="loginShell">
    <div class="brand-panel">
      <div class="brand-inner">
        <div class="brand-top">
          <div class="phoenix-mark" aria-hidden="true"></div>
          <div>
            <h1 class="brand-title">FM Phoenix</h1>
          </div>
        </div>
        <p class="brand-tagline">Leaving the Old Trail. Igniting the New Drive</p>
        <div>
          <h2 class="department-name">Department of Facilities Management</h2>
          <p class="brand-sub">Engineering &amp; Facilities Department</p>
        </div>
        <div style="margin-top: 30px; max-width: 680px;">
          <p class="brand-sub">The Engineering and Facilities Unit is here 24 hours a day, seven days a week providing support services for the Medical University of South Carolina. We manage a wide range of maintenance and improvement activities for existing University and Clinical facilities, oversee all aspects of renovation and new construction, and provide leadership in sustainability which includes recycling and waste stream reduction, utilities management, and planned renewal.</p>
        </div>
        <div class="brand-cta">
          <button class="primary-btn" type="button" onclick="document.getElementById('email').focus()">Access Portal</button>
          <button class="ghost-btn" type="button" onclick="generateOtp()">Request OTP</button>
        </div>
      </div>
    </div>

    <div class="login-panel">
      <div class="login-card">
        <h2>Sign In</h2>
        <p>Welcome back to the fleet operations portal. Use your MUSC email and secure PIN to continue.</p>
        <div class="field">
          <label for="email">Email Address</label>
          <input id="email" type="email" placeholder="name@musc.edu" />
        </div>
        <div class="field">
          <label for="password">Password / PIN</label>
          <input id="password" type="password" placeholder="Enter 4-digit PIN" maxlength="4" />
        </div>
        <div class="field-row">
          <label class="check-row"><input type="checkbox" checked /> Remember me</label>
          <span class="linkish" onclick="forgotPassword()">Forgot Password?</span>
        </div>
        <button class="primary-btn" style="width:100%;" type="button" id="loginButton">Login</button>
        <div class="otp-banner" id="otpMessage"></div>
        <div class="field" style="margin-top:16px;">
          <label for="otpCode">OTP (Outlook verification)</label>
          <input id="otpCode" type="text" placeholder="Enter OTP received via Outlook" maxlength="6" />
        </div>
        <div class="button-row" style="margin-top:0;">
          <button class="utility-btn" type="button" onclick="generateOtp()">Send OTP</button>
          <button class="secondary-btn" type="button" onclick="verifyOtp()">Verify OTP</button>
        </div>
      </div>
    </div>
  </div>

  <div class="app-shell" id="appShell">
    <header class="app-header">
      <div class="app-header-row">
        <div class="brand-mini">
          <div class="brand-mini-mark" aria-hidden="true"></div>
          <div>
            <span class="brand-mini-title">FM Phoenix</span>
            <span class="brand-mini-sub">Fleet Management System</span>
          </div>
        </div>
        <div class="app-header-meta">
          <span><span class="status-dot"></span>System online</span>
          <span>Admin / Technician</span>
        </div>
      </div>
    </header>

    <div class="app-content">
      <div class="department-banner">
        <div>
          <strong>Department of Facilities Management</strong>
          <span>E &amp; F - Engineering and Facilities Department</span>
        </div>
        <div class="page-tag">Operations Dashboard</div>
      </div>

      <div class="dashboard-grid">
        <div class="stat-panel"><span class="stat-label">Active on-road</span><div class="stat-value">42</div><div class="stat-trend">+4.2% vs last week</div></div>
        <div class="stat-panel"><span class="stat-label">Booked / reserved</span><div class="stat-value">08</div><div class="stat-trend">Priority assignments</div></div>
        <div class="stat-panel"><span class="stat-label">Currently in use</span><div class="stat-value">17</div><div class="stat-trend">Average utilization 74%</div></div>
        <div class="stat-panel"><span class="stat-label">Inactive / maintenance</span><div class="stat-value">03</div><div class="stat-trend">1 release pending</div></div>
      </div>

      <div class="content-stack">
        <div class="card">
          <div class="card-head"><h3>Department Snapshot</h3><span class="tiny-badge badge-success">Operational</span></div>
          <div class="feature-list">
            <div class="feature-row"><div class="feature-icon">01</div><div class="feature-copy"><strong>Vehicle &amp; Asset Management</strong><span>Fleet inventory, assignment status, and utilization readiness.</span></div></div>
            <div class="feature-row"><div class="feature-icon">02</div><div class="feature-copy"><strong>Mileage Log Management</strong><span>Trip capture, odometer tracking, and drive usage review.</span></div></div>
            <div class="feature-row"><div class="feature-icon">03</div><div class="feature-copy"><strong>Fuel Management</strong><span>Receipts, gallons consumed, and cost analysis.</span></div></div>
            <div class="feature-row"><div class="feature-icon">04</div><div class="feature-copy"><strong>Service &amp; Repair Requests</strong><span>Dispatch, defect review, and maintenance follow-up.</span></div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h3>Department Overview</h3><span class="tiny-badge badge-warning">24/7 Support</span></div>
          <div class="dept-info-box">
            <p>The Engineering and Facilities Unit is here 24 hours a day, seven days a week providing support services for the Medical University of South Carolina. We manage a wide range of maintenance and improvement activities for existing University and Clinical facilities, oversee all aspects of renovation and new construction, and provide leadership in sustainability.</p>
            <div class="contact-list">
              <div class="contact-line">Emergency: <span class="muted">843-792-4119 | 843-792-5600</span></div>
              <div class="contact-line">Address: <span class="muted">97 Jonathan Lucas St, Charleston, SC 29425</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-content active" id="dashboardTab">
        <div class="card">
          <div class="card-head"><h3>Operational Summary</h3><span class="tiny-badge badge-success">Live</span></div>
          <div class="form-grid">
            <div class="form-field"><label>Mission status</label><input type="text" value="Fleet operations on schedule" /></div>
            <div class="form-field"><label>Service level</label><input type="text" value="96.4% available" /></div>
            <div class="form-field"><label>Top issue</label><input type="text" value="Hydraulic maintenance review" /></div>
            <div class="form-field"><label>Next inspection</label><input type="text" value="2 days" /></div>
          </div>
          <div class="button-row">
            <button class="primary-btn" type="button">Review &amp; Save</button>
            <button class="utility-btn" type="button">Back</button>
          </div>
        </div>
      </div>

      <div class="tab-content" id="assetManagementTab">
        <div class="card">
          <div class="card-head"><h3>Vehicle / Asset Management</h3><span class="tiny-badge badge-warning">Asset review</span></div>
          <table class="data-table">
            <thead><tr><th>Vehicle ID</th><th>Asset Type</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>V-104</td><td>Ford Transit Van</td><td>Transit Services</td><td>Active</td><td><button class="utility-btn" type="button">Review</button></td></tr>
              <tr><td>SC12</td><td>Kubota Utility RTV</td><td>Facilities Maintenance</td><td>Maintenance</td><td><button class="utility-btn" type="button">Review</button></td></tr>
            </tbody>
          </table>
          <div class="button-row"><button class="primary-btn" type="button">Submit</button><button class="utility-btn" type="button">Back</button></div>
        </div>
      </div>

      <div class="tab-content" id="mileageLogsManagementTab">
        <div class="card">
          <div class="card-head"><h3>Mileage Log Management</h3><span class="tiny-badge badge-success">Tracked</span></div>
          <div class="form-grid">
            <div class="form-field"><label>Date</label><input type="date" value="2026-08-31" /></div>
            <div class="form-field"><label>Driver / Operator</label><input type="text" value="J. Smith" /></div>
            <div class="form-field"><label>Vehicle Unit</label><select><option>V-104 Transit Van</option><option>SC12 Utility RTV</option></select></div>
            <div class="form-field"><label>Trip Miles</label><input type="text" value="18.4" /></div>
            <div class="form-field"><label>Starting Location</label><input type="text" value="Facilities Garage" /></div>
            <div class="form-field"><label>Destination</label><input type="text" value="MUSC Main Campus" /></div>
          </div>
          <div class="button-row"><button class="primary-btn" type="button">Next</button><button class="utility-btn" type="button">Review &amp; Save</button><button class="utility-btn" type="button">Back</button></div>
        </div>
      </div>

      <div class="tab-content" id="fuelManagementTab">
        <div class="card">
          <div class="card-head"><h3>Fuel Management</h3><span class="tiny-badge badge-success">Audit-ready</span></div>
          <div class="form-grid">
            <div class="form-field"><label>Fuel receipt ID</label><input type="text" value="FUEL-2411" /></div>
            <div class="form-field"><label>Station</label><input type="text" value="MUSC Fuel Point" /></div>
            <div class="form-field"><label>Gallons</label><input type="text" value="21.8" /></div>
            <div class="form-field"><label>Total amount</label><input type="text" value="$83.42" /></div>
          </div>
          <div class="button-row"><button class="primary-btn" type="button">Review &amp; Submit</button><button class="utility-btn" type="button">Back</button></div>
        </div>
      </div>

      <div class="tab-content" id="serviceRepairTab">
        <div class="card">
          <div class="card-head"><h3>Service &amp; Repair Request</h3><span class="tiny-badge badge-warning">Open tickets</span></div>
          <div class="form-grid">
            <div class="form-field"><label>Vehicle</label><select><option>SC12 Utility RTV</option><option>V-104 Transit Van</option></select></div>
            <div class="form-field"><label>Priority</label><select><option>Medium</option><option>High / Emergency</option></select></div>
            <div class="form-field" style="grid-column: 1 / -1;"><label>Problem description</label><textarea>Hydraulic fluid leak observed during daily inspection.</textarea></div>
          </div>
          <div class="button-row"><button class="primary-btn" type="button">Submit</button><button class="utility-btn" type="button">Back</button></div>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <a href="#" class="nav-pill active" data-target="dashboardTab">Dashboard</a>
        <a href="#" class="nav-pill" data-target="assetManagementTab">Vehicle &amp; Asset</a>
        <a href="#" class="nav-pill" data-target="mileageLogsManagementTab">Mileage Logs</a>
        <a href="#" class="nav-pill" data-target="fuelManagementTab">Fuel Management</a>
        <a href="#" class="nav-pill" data-target="serviceRepairTab">Service &amp; Repair</a>
        <a href="#" class="nav-pill" data-target="dashboardTab">Reports</a>
        <a href="#" class="nav-pill" data-target="dashboardTab">Admin</a>
        <a href="#" class="nav-pill" data-target="dashboardTab">Settings</a>
      </div>
    </nav>
  </div>

  <script>
    const loginShell = document.getElementById('loginShell');
    const appShell = document.getElementById('appShell');
    function generateOtp() {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const msg = document.getElementById('otpMessage');
      msg.textContent = 'OTP sent to your Outlook email: ' + otp + ' (demo value for testing)';
      msg.classList.add('visible');
      document.getElementById('otpCode').value = otp;
    }
    function forgotPassword() {
      alert('Password reset instructions will be sent to your MUSC Outlook email address.');
    }
    function verifyOtp() {
      const val = document.getElementById('otpCode').value.trim();
      if (!val) { alert('Please enter the OTP code from Outlook.'); return; }
      alert('OTP verified successfully.');
    }
    document.getElementById('loginButton').addEventListener('click', function () {
      const email = document.getElementById('email').value.trim();
      const pin = document.getElementById('password').value.trim();
      if (!email || !pin) { alert('Please enter your MUSC email and password/PIN.'); return; }
      loginShell.style.display = 'none';
      appShell.classList.add('visible');
    });
    document.querySelectorAll('.nav-pill').forEach((pill) => {
      pill.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelectorAll('.nav-pill').forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        const target = this.dataset.target;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        const tab = document.getElementById(target);
        if (tab) tab.classList.add('active');
      });
    });
  </script>
</body>
</html>
'@

[System.IO.File]::WriteAllText('C:\Users\Deep Panchal\Desktop\musc-fleet-system\index.html', $html, [System.Text.UTF8Encoding]::new($false))
