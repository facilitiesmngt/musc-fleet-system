const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Azure Cosmos DB Configuration
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || "fleet-management";

let cosmosClient;
let database;
let containers = {};

// Initialize Cosmos DB
async function initializeCosmosDB() {
  try {
    cosmosClient = new CosmosClient({ endpoint, key });
    
    // Create or get database
    const { database: db } = await cosmosClient.databases.createIfNotExists({
      id: databaseId
    });
    database = db;

    // Create containers if they don't exist
    const containerConfigs = [
      { id: "vehicles", partitionKey: "/vehicleId" },
      { id: "drivers", partitionKey: "/driverId" },
      { id: "fuel-logs", partitionKey: "/vehicleId" },
      { id: "mileage-logs", partitionKey: "/vehicleId" },
      { id: "reservations", partitionKey: "/reservationId" },
      { id: "users", partitionKey: "/userId" }
    ];

    for (const config of containerConfigs) {
      const { container } = await database.containers.createIfNotExists(config);
      containers[config.id] = container;
    }

    console.log("✅ Cosmos DB initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Cosmos DB:", error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MUSC Fleet Management API is running',
    timestamp: new Date().toISOString()
  });
});

// ===== VEHICLES ENDPOINTS =====
app.get('/api/vehicles', async (req, res) => {
  try {
    const { resources: vehicles } = await containers.vehicles.items.query("SELECT * FROM c").fetchAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const vehicle = { ...req.body, id: req.body.vehicleId };
    const { resource } = await containers.vehicles.items.create(vehicle);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vehicles/:vehicleId', async (req, res) => {
  try {
    const { resource } = await containers.vehicles.item(req.params.vehicleId, req.params.vehicleId).read();
    res.json(resource);
  } catch (error) {
    res.status(404).json({ error: 'Vehicle not found' });
  }
});

app.put('/api/vehicles/:vehicleId', async (req, res) => {
  try {
    const { resource } = await containers.vehicles.item(req.params.vehicleId, req.params.vehicleId).replace(req.body);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vehicles/:vehicleId', async (req, res) => {
  try {
    await containers.vehicles.item(req.params.vehicleId, req.params.vehicleId).delete();
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DRIVERS ENDPOINTS =====
app.get('/api/drivers', async (req, res) => {
  try {
    const { resources: drivers } = await containers.drivers.items.query("SELECT * FROM c").fetchAll();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const driver = { ...req.body, id: req.body.driverId };
    const { resource } = await containers.drivers.items.create(driver);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/drivers/:driverId', async (req, res) => {
  try {
    const { resource } = await containers.drivers.item(req.params.driverId, req.params.driverId).read();
    res.json(resource);
  } catch (error) {
    res.status(404).json({ error: 'Driver not found' });
  }
});

app.put('/api/drivers/:driverId', async (req, res) => {
  try {
    const { resource } = await containers.drivers.item(req.params.driverId, req.params.driverId).replace(req.body);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/drivers/:driverId', async (req, res) => {
  try {
    await containers.drivers.item(req.params.driverId, req.params.driverId).delete();
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== FUEL LOGS ENDPOINTS =====
app.get('/api/fuel-logs', async (req, res) => {
  try {
    const { resources: fuelLogs } = await containers["fuel-logs"].items.query("SELECT * FROM c").fetchAll();
    res.json(fuelLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fuel-logs', async (req, res) => {
  try {
    const fuelLog = { ...req.body, id: req.body.fuelLogId || `fuel-${Date.now()}` };
    const { resource } = await containers["fuel-logs"].items.create(fuelLog);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fuel-logs/:vehicleId', async (req, res) => {
  try {
    const query = `SELECT * FROM c WHERE c.vehicleId = @vehicleId`;
    const { resources } = await containers["fuel-logs"].items.query(query, {
      parameters: [{ name: "@vehicleId", value: req.params.vehicleId }]
    }).fetchAll();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== MILEAGE LOGS ENDPOINTS =====
// UPDATE Mileage Log
app.put('/api/mileage-logs/:id', async (req, res) => {
  try {
    const updatedLog = req.body;

    const { resource } = await containers["mileage-logs"]
      .item(req.params.id, updatedLog.vehicleId)
      .replace(updatedLog);

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Mileage Log
app.delete('/api/mileage-logs/:id/:vehicleId', async (req, res) => {
  try {
    await containers["mileage-logs"]
      .item(req.params.id, req.params.vehicleId)
      .delete();

    res.json({
      success: true,
      message: "Mileage log deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== RESERVATIONS ENDPOINTS =====
app.get('/api/reservations', async (req, res) => {
  try {
    const { resources: reservations } = await containers.reservations.items.query("SELECT * FROM c").fetchAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = { ...req.body, id: req.body.reservationId };
    const { resource } = await containers.reservations.items.create(reservation);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reservations/:reservationId', async (req, res) => {
  try {
    const { resource } = await containers.reservations.item(req.params.reservationId, req.params.reservationId).read();
    res.json(resource);
  } catch (error) {
    res.status(404).json({ error: 'Reservation not found' });
  }
});

app.put('/api/reservations/:reservationId', async (req, res) => {
  try {
    const { resource } = await containers.reservations.item(req.params.reservationId, req.params.reservationId).replace(req.body);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reservations/:reservationId', async (req, res) => {
  try {
    await containers.reservations.item(req.params.reservationId, req.params.reservationId).delete();
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  await initializeCosmosDB();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 MUSC Fleet Management API running on http://localhost:${PORT}`);
    console.log(`📊 Cosmos DB Database: ${databaseId}`);
    console.log(`\n📡 Available endpoints:`);
    console.log(`   GET    /api/health`);
    console.log(`   GET    /api/vehicles`);
    console.log(`   POST   /api/vehicles`);
    console.log(`   GET    /api/drivers`);
    console.log(`   POST   /api/drivers`);
    console.log(`   GET    /api/fuel-logs`);
    console.log(`   POST   /api/fuel-logs`);
    console.log(`   GET    /api/mileage-logs`);
    console.log(`   POST   /api/mileage-logs`);
    console.log(`   GET    /api/reservations`);
    console.log(`   POST   /api/reservations\n`);
  });
}

startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
