# Frontend Integration Guide

## 🔌 Connecting Your Frontend to the Backend API

This guide shows how to update your HTML/JavaScript files to use the Azure Cosmos DB backend API instead of local storage.

---

## 📋 API Base URL

All API calls should go to:
```
http://localhost:3000/api
```

When deployed to Azure, this will be:
```
https://<your-app-name>.azurewebsites.net/api
```

---

## 🚗 Vehicles API

### Get All Vehicles
```javascript
fetch('http://localhost:3000/api/vehicles')
  .then(response => response.json())
  .then(vehicles => {
    console.log('Vehicles:', vehicles);
    // Update your UI with vehicles
  })
  .catch(error => console.error('Error:', error));
```

### Create New Vehicle
```javascript
const newVehicle = {
  vehicleId: 'vehicle-' + Date.now(),
  make: 'Toyota',
  model: 'Camry',
  licensePlate: 'ABC123',
  year: 2023,
  status: 'active'
};

fetch('http://localhost:3000/api/vehicles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newVehicle)
})
.then(response => response.json())
.then(vehicle => console.log('Vehicle created:', vehicle))
.catch(error => console.error('Error:', error));
```

### Update Vehicle
```javascript
fetch('http://localhost:3000/api/vehicles/vehicle-001', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    vehicleId: 'vehicle-001',
    make: 'Toyota',
    model: 'Camry',
    status: 'maintenance'
  })
})
.then(response => response.json())
.then(vehicle => console.log('Vehicle updated:', vehicle))
.catch(error => console.error('Error:', error));
```

### Delete Vehicle
```javascript
fetch('http://localhost:3000/api/vehicles/vehicle-001', {
  method: 'DELETE'
})
.then(response => response.json())
.then(result => console.log('Vehicle deleted'))
.catch(error => console.error('Error:', error));
```

---

## 👨‍💼 Drivers API

### Get All Drivers
```javascript
fetch('http://localhost:3000/api/drivers')
  .then(response => response.json())
  .then(drivers => console.log('Drivers:', drivers))
  .catch(error => console.error('Error:', error));
```

### Create Driver
```javascript
const newDriver = {
  driverId: 'driver-' + Date.now(),
  name: 'John Doe',
  licenseNumber: 'DL123456',
  phone: '555-1234',
  email: 'john@example.com',
  status: 'active'
};

fetch('http://localhost:3000/api/drivers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newDriver)
})
.then(response => response.json())
.then(driver => console.log('Driver created:', driver))
.catch(error => console.error('Error:', error));
```

---

## ⛽ Fuel Logs API

### Get All Fuel Logs
```javascript
fetch('http://localhost:3000/api/fuel-logs')
  .then(response => response.json())
  .then(logs => console.log('Fuel logs:', logs))
  .catch(error => console.error('Error:', error));
```

### Get Fuel Logs for Specific Vehicle
```javascript
fetch('http://localhost:3000/api/fuel-logs/vehicle-001')
  .then(response => response.json())
  .then(logs => console.log('Vehicle fuel logs:', logs))
  .catch(error => console.error('Error:', error));
```

### Add Fuel Log
```javascript
const fuelLog = {
  vehicleId: 'vehicle-001',
  driverId: 'driver-001',
  date: new Date().toISOString(),
  amount: 50.00,
  quantity: 12.5, // liters or gallons
  cost: 50.00,
  notes: 'Regular maintenance'
};

fetch('http://localhost:3000/api/fuel-logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(fuelLog)
})
.then(response => response.json())
.then(log => console.log('Fuel log created:', log))
.catch(error => console.error('Error:', error));
```

---

## 📊 Mileage Logs API

### Get All Mileage Logs
```javascript
fetch('http://localhost:3000/api/mileage-logs')
  .then(response => response.json())
  .then(logs => console.log('Mileage logs:', logs))
  .catch(error => console.error('Error:', error));
```

### Get Mileage Logs for Specific Vehicle
```javascript
fetch('http://localhost:3000/api/mileage-logs/vehicle-001')
  .then(response => response.json())
  .then(logs => console.log('Vehicle mileage logs:', logs))
  .catch(error => console.error('Error:', error));
```

### Add Mileage Log
```javascript
const mileageLog = {
  vehicleId: 'vehicle-001',
  driverId: 'driver-001',
  date: new Date().toISOString(),
  startMileage: 45000,
  endMileage: 45150,
  distance: 150,
  purpose: 'Client delivery',
  route: 'Downtown to Airport'
};

fetch('http://localhost:3000/api/mileage-logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(mileageLog)
})
.then(response => response.json())
.then(log => console.log('Mileage log created:', log))
.catch(error => console.error('Error:', error));
```

---

## 📅 Reservations API

### Get All Reservations
```javascript
fetch('http://localhost:3000/api/reservations')
  .then(response => response.json())
  .then(reservations => console.log('Reservations:', reservations))
  .catch(error => console.error('Error:', error));
```

### Create Reservation
```javascript
const reservation = {
  reservationId: 'res-' + Date.now(),
  vehicleId: 'vehicle-001',
  driverId: 'driver-001',
  startDate: '2024-09-01T08:00:00Z',
  endDate: '2024-09-01T17:00:00Z',
  purpose: 'Client meeting',
  status: 'confirmed'
};

fetch('http://localhost:3000/api/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reservation)
})
.then(response => response.json())
.then(res => console.log('Reservation created:', res))
.catch(error => console.error('Error:', error));
```

### Update Reservation
```javascript
fetch('http://localhost:3000/api/reservations/res-123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reservationId: 'res-123',
    status: 'completed'
  })
})
.then(response => response.json())
.then(res => console.log('Reservation updated:', res))
.catch(error => console.error('Error:', error));
```

### Delete Reservation
```javascript
fetch('http://localhost:3000/api/reservations/res-123', {
  method: 'DELETE'
})
.then(response => response.json())
.then(result => console.log('Reservation cancelled'))
.catch(error => console.error('Error:', error));
```

---

## 🛠️ Helper Functions

### Reusable API Call Function
```javascript
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Usage:
const vehicles = await apiCall('/api/vehicles');
const newVehicle = await apiCall('/api/vehicles', 'POST', vehicleData);
```

### Error Handling
```javascript
async function safeApiCall(endpoint, method = 'GET', data = null) {
  try {
    return await apiCall(endpoint, method, data);
  } catch (error) {
    console.error('Error:', error.message);
    // Show user-friendly error message
    alert('Failed to complete operation. Please try again.');
    return null;
  }
}
```

---

## 🔄 Migration Steps

### Step 1: Update Your HTML File
Before each form submission or data load operation, update the JavaScript:

**Old way (Local Storage):**
```javascript
function loadVehicles() {
  let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
  displayVehicles(vehicles);
}
```

**New way (API):**
```javascript
async function loadVehicles() {
  const vehicles = await apiCall('/api/vehicles');
  displayVehicles(vehicles);
}
```

### Step 2: Update Form Submissions
**Old way:**
```javascript
document.getElementById('vehicleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const vehicle = {
    vehicleId: Math.random(),
    make: document.getElementById('make').value,
    model: document.getElementById('model').value
  };
  let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
  vehicles.push(vehicle);
  localStorage.setItem('vehicles', JSON.stringify(vehicles));
});
```

**New way:**
```javascript
document.getElementById('vehicleForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const vehicle = {
    vehicleId: 'vehicle-' + Date.now(),
    make: document.getElementById('make').value,
    model: document.getElementById('model').value
  };
  
  try {
    await apiCall('/api/vehicles', 'POST', vehicle);
    loadVehicles(); // Refresh the list
    this.reset();
  } catch (error) {
    alert('Error saving vehicle');
  }
});
```

### Step 3: Test Everything
- Test in browser console
- Use Network tab to see API calls
- Verify data appears in Azure Portal (Cosmos DB)

---

## 📝 Configuration Management

### Development
```javascript
const API_BASE = 'http://localhost:3000/api';
```

### Production (Azure App Service)
```javascript
const API_BASE = 'https://your-app-name.azurewebsites.net/api';
```

Use environment variables in your build process:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

---

## ✅ Testing Checklist

- [ ] Backend server is running
- [ ] All API endpoints respond to GET requests
- [ ] Can create new vehicles/drivers
- [ ] Can update existing records
- [ ] Can delete records
- [ ] Data persists after page refresh
- [ ] Error handling works (try with invalid data)
- [ ] CORS is enabled (requests from frontend work)

---

## 🚀 Next Steps

1. Update your HTML files with API calls
2. Test each endpoint thoroughly
3. Verify data in Azure Portal (Cosmos DB Collections)
4. Commit changes to GitHub
5. Document any custom endpoints you add
6. Prepare handover documentation for IT

---

**Need help?** Refer to the API documentation in `API_DOCUMENTATION.md`
