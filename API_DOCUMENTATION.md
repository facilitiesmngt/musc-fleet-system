# API Documentation - MUSC Fleet Management System

## 📋 Base URL
```
http://localhost:3000/api
```

---

## 🏥 Health Check

### GET `/health`
Check if the API is running and connected to Cosmos DB.

**Request:**
```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "MUSC Fleet Management API is running",
  "timestamp": "2024-08-31T20:00:00.000Z"
}
```

---

## 🚗 Vehicles Endpoints

### GET `/vehicles`
Get all vehicles in the system.

**Request:**
```bash
GET /vehicles
```

**Response (200 OK):**
```json
[
  {
    "id": "vehicle-001",
    "vehicleId": "vehicle-001",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "licensePlate": "ABC123",
    "status": "active"
  }
]
```

### POST `/vehicles`
Create a new vehicle.

**Request:**
```bash
POST /vehicles
Content-Type: application/json

{
  "vehicleId": "vehicle-002",
  "make": "Honda",
  "model": "Civic",
  "year": 2023,
  "licensePlate": "XYZ789",
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "id": "vehicle-002",
  "vehicleId": "vehicle-002",
  "make": "Honda",
  "model": "Civic",
  "year": 2023,
  "licensePlate": "XYZ789",
  "status": "active"
}
```

**Required Fields:**
- `vehicleId` (string, unique)
- `make` (string)
- `model` (string)

**Optional Fields:**
- `year` (number)
- `licensePlate` (string)
- `status` (string: "active", "maintenance", "inactive")

### GET `/vehicles/{vehicleId}`
Get a specific vehicle by ID.

**Request:**
```bash
GET /vehicles/vehicle-001
```

**Response (200 OK):**
```json
{
  "id": "vehicle-001",
  "vehicleId": "vehicle-001",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "licensePlate": "ABC123",
  "status": "active"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Vehicle not found"
}
```

### PUT `/vehicles/{vehicleId}`
Update a vehicle.

**Request:**
```bash
PUT /vehicles/vehicle-001
Content-Type: application/json

{
  "vehicleId": "vehicle-001",
  "make": "Toyota",
  "model": "Camry",
  "status": "maintenance"
}
```

**Response (200 OK):**
```json
{
  "id": "vehicle-001",
  "vehicleId": "vehicle-001",
  "make": "Toyota",
  "model": "Camry",
  "status": "maintenance"
}
```

### DELETE `/vehicles/{vehicleId}`
Delete a vehicle.

**Request:**
```bash
DELETE /vehicles/vehicle-001
```

**Response (200 OK):**
```json
{
  "message": "Vehicle deleted"
}
```

---

## 👨‍💼 Drivers Endpoints

### GET `/drivers`
Get all drivers.

### POST `/drivers`
Create a new driver.

**Request Body:**
```json
{
  "driverId": "driver-001",
  "name": "John Doe",
  "licenseNumber": "DL123456",
  "phone": "555-1234",
  "email": "john@example.com",
  "status": "active"
}
```

### GET `/drivers/{driverId}`
Get a specific driver.

### PUT `/drivers/{driverId}`
Update a driver.

### DELETE `/drivers/{driverId}`
Delete a driver.

---

## ⛽ Fuel Logs Endpoints

### GET `/fuel-logs`
Get all fuel logs.

**Response:**
```json
[
  {
    "id": "fuel-001",
    "vehicleId": "vehicle-001",
    "driverId": "driver-001",
    "date": "2024-08-31T10:30:00Z",
    "amount": 50.00,
    "quantity": 12.5,
    "cost": 50.00,
    "notes": "Regular maintenance"
  }
]
```

### POST `/fuel-logs`
Create a new fuel log.

**Request Body:**
```json
{
  "vehicleId": "vehicle-001",
  "driverId": "driver-001",
  "date": "2024-08-31T10:30:00Z",
  "amount": 50.00,
  "quantity": 12.5,
  "cost": 50.00,
  "notes": "Regular maintenance"
}
```

### GET `/fuel-logs/{vehicleId}`
Get all fuel logs for a specific vehicle.

---

## 📊 Mileage Logs Endpoints

### GET `/mileage-logs`
Get all mileage logs.

### POST `/mileage-logs`
Create a new mileage log.

**Request Body:**
```json
{
  "vehicleId": "vehicle-001",
  "driverId": "driver-001",
  "date": "2024-08-31T08:00:00Z",
  "startMileage": 45000,
  "endMileage": 45150,
  "distance": 150,
  "purpose": "Client delivery",
  "route": "Downtown to Airport"
}
```

### GET `/mileage-logs/{vehicleId}`
Get all mileage logs for a specific vehicle.

---

## 📅 Reservations Endpoints

### GET `/reservations`
Get all reservations.

**Response:**
```json
[
  {
    "id": "res-001",
    "reservationId": "res-001",
    "vehicleId": "vehicle-001",
    "driverId": "driver-001",
    "startDate": "2024-09-01T08:00:00Z",
    "endDate": "2024-09-01T17:00:00Z",
    "purpose": "Client meeting",
    "status": "confirmed"
  }
]
```

### POST `/reservations`
Create a new reservation.

**Request Body:**
```json
{
  "reservationId": "res-002",
  "vehicleId": "vehicle-001",
  "driverId": "driver-001",
  "startDate": "2024-09-02T08:00:00Z",
  "endDate": "2024-09-02T17:00:00Z",
  "purpose": "Team outing",
  "status": "pending"
}
```

### GET `/reservations/{reservationId}`
Get a specific reservation.

### PUT `/reservations/{reservationId}`
Update a reservation.

### DELETE `/reservations/{reservationId}`
Cancel/delete a reservation.

---

## 🔐 Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - API error |

**Error Response Format:**
```json
{
  "error": "Description of what went wrong"
}
```

---

## 📝 Response Headers

All responses include:
```
Content-Type: application/json
CORS-enabled for cross-origin requests
```

---

## 🧪 Testing with cURL

**Get all vehicles:**
```bash
curl http://localhost:3000/api/vehicles
```

**Create a vehicle:**
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "vehicle-999",
    "make": "Toyota",
    "model": "Camry"
  }'
```

**Get specific vehicle:**
```bash
curl http://localhost:3000/api/vehicles/vehicle-001
```

**Update vehicle:**
```bash
curl -X PUT http://localhost:3000/api/vehicles/vehicle-001 \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "vehicle-001",
    "status": "maintenance"
  }'
```

**Delete vehicle:**
```bash
curl -X DELETE http://localhost:3000/api/vehicles/vehicle-001
```

---

## 🔗 Data Relationships

```
Vehicles
  ├── Fuel Logs (by vehicleId)
  ├── Mileage Logs (by vehicleId)
  └── Reservations (by vehicleId)

Drivers
  ├── Fuel Logs (by driverId)
  ├── Mileage Logs (by driverId)
  └── Reservations (by driverId)
```

---

## 📚 Example Workflows

### Add a Vehicle and Log Fuel
```javascript
// 1. Create vehicle
const vehicle = await fetch('/api/vehicles', {
  method: 'POST',
  body: JSON.stringify({
    vehicleId: 'vehicle-new-001',
    make: 'Tesla',
    model: 'Model 3'
  })
}).then(r => r.json());

// 2. Log fuel for that vehicle
const fuelLog = await fetch('/api/fuel-logs', {
  method: 'POST',
  body: JSON.stringify({
    vehicleId: vehicle.vehicleId,
    amount: 60.00,
    quantity: 15,
    date: new Date().toISOString()
  })
}).then(r => r.json());
```

### Reserve a Vehicle
```javascript
const reservation = await fetch('/api/reservations', {
  method: 'POST',
  body: JSON.stringify({
    reservationId: 'res-' + Date.now(),
    vehicleId: 'vehicle-001',
    driverId: 'driver-001',
    startDate: '2024-09-15T09:00:00Z',
    endDate: '2024-09-15T18:00:00Z',
    purpose: 'Airport transfer'
  })
}).then(r => r.json());
```

---

**For more examples, see FRONTEND_INTEGRATION.md**
