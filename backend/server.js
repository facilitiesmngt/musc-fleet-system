'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
const COSMOS_KEY = process.env.COSMOS_KEY;

// Keep the existing database name to avoid accidentally creating
// a second database.
const DATABASE_ID =
  process.env.COSMOS_DATABASE || 'fleet-management';

// ============================================================
// BASIC VALIDATION
// ============================================================

if (!COSMOS_ENDPOINT) {
  console.error('❌ COSMOS_ENDPOINT is missing from environment variables.');
  process.exit(1);
}

if (!COSMOS_KEY) {
  console.error('❌ COSMOS_KEY is missing from environment variables.');
  process.exit(1);
}

// ============================================================
// EXPRESS APPLICATION
// ============================================================

const appInstance = app;

// JSON body parser
appInstance.use(
  express.json({
    limit: '5mb'
  })
);

// URL encoded body parser
appInstance.use(
  express.urlencoded({
    extended: true,
    limit: '5mb'
  })
);

// CORS
//
// Development: allow all origins.
// Production: set ALLOWED_ORIGINS in Azure/environment variables.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean)
  : [];

appInstance.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and local tools.
      if (!origin) {
        return callback(null, true);
      }

      // Development mode.
      if (NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // Production with no configured restrictions.
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('CORS policy blocked this request.')
      );
    }
  })
);

// ============================================================
// AZURE COSMOS DB
// ============================================================

let cosmosClient = null;
let database = null;

const containers = {};

// ============================================================
// COSMOS CONTAINER CONFIGURATION
// ============================================================
//
// DO NOT rename these containers unless we intentionally perform
// a database migration.
//
// Database:
// fleet-management
//
// Containers:
// vehicles
// drivers
// fuel-logs
// mileage-logs
// reservations
// users
// ============================================================

const CONTAINER_CONFIGS = [
  {
    key: 'vehicles',
    id: 'vehicles',
    partitionKey: '/vehicleId'
  },
  {
    key: 'drivers',
    id: 'drivers',
    partitionKey: '/driverId'
  },
  {
    key: 'fuelLogs',
    id: 'fuel-logs',
    partitionKey: '/vehicleId'
  },
  {
    key: 'mileageLogs',
    id: 'mileage-logs',
    partitionKey: '/vehicleId'
  },
  {
    key: 'reservations',
    id: 'reservations',
    partitionKey: '/reservationId'
  },
  {
    key: 'users',
    id: 'users',
    partitionKey: '/userId'
  }
];

// ============================================================
// INITIALIZE COSMOS DB
// ============================================================

async function initializeCosmosDB() {
  console.log('');
  console.log('============================================================');
  console.log(' M USC FLEET MANAGEMENT SYSTEM');
  console.log(' Azure Cosmos DB Initialization');
  console.log('============================================================');

  try {
    cosmosClient = new CosmosClient({
      endpoint: COSMOS_ENDPOINT,
      key: COSMOS_KEY
    });

    // Create database if it does not exist.
    const databaseResponse =
      await cosmosClient.databases.createIfNotExists({
        id: DATABASE_ID
      });

    database = databaseResponse.database;

    console.log(`✅ Database: ${DATABASE_ID}`);

    // Create/get all containers.
    for (const config of CONTAINER_CONFIGS) {
      const containerResponse =
        await database.containers.createIfNotExists({
          id: config.id,
          partitionKey: {
            paths: [config.partitionKey]
          }
        });

      containers[config.key] = containerResponse.container;

      console.log(
        `   ✓ ${config.id} → ${config.partitionKey}`
      );
    }

    console.log('');
    console.log('✅ Cosmos DB initialized successfully.');
    console.log('============================================================');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ COSMOS DB INITIALIZATION FAILED');
    console.error('------------------------------------------------------------');
    console.error(error.message);
    console.error('------------------------------------------------------------');
    console.error('');

    process.exit(1);
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function createId(prefix) {
  return `${prefix}-${uuidv4()}`;
}

function now() {
  return new Date().toISOString();
}

function cleanString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

function isMissing(value) {
  return (
    value === undefined ||
    value === null ||
    cleanString(value) === ''
  );
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function sendError(res, status, message, details = null) {
  const response = {
    success: false,
    error: message
  };

  if (
    NODE_ENV !== 'production' &&
    details
  ) {
    response.details = details;
  }

  return res.status(status).json(response);
}

function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

// ============================================================
// HEALTH CHECK
// ============================================================

appInstance.get('/api/health', async (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'MUSC Fleet Management API',
    environment: NODE_ENV,
    database: DATABASE_ID,
    timestamp: now()
  });
});

// ============================================================
// ROOT API
// ============================================================

appInstance.get('/api', (req, res) => {
  res.json({
    success: true,
    application: 'MUSC Fleet Management System',
    version: '1.0.0',
    environment: NODE_ENV,
    database: DATABASE_ID,
    endpoints: {
      health: '/api/health',
      vehicles: '/api/vehicles',
      drivers: '/api/drivers',
      fuelLogs: '/api/fuel-logs',
      mileageLogs: '/api/mileage-logs',
      reservations: '/api/reservations'
    }
  });
});

// ============================================================
// VEHICLES
// ============================================================

// GET ALL VEHICLES
appInstance.get('/api/vehicles', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.vehicleId'
    };

    const { resources } =
      await containers.vehicles.items
        .query(querySpec)
        .fetchAll();

    return sendSuccess(res, resources);

  } catch (error) {
    console.error('GET /api/vehicles:', error);
    return sendError(
      res,
      500,
      'Unable to retrieve vehicles.',
      error.message
    );
  }
});

// GET ONE VEHICLE
appInstance.get(
  '/api/vehicles/:vehicleId',
  async (req, res) => {
    const vehicleId = cleanString(req.params.vehicleId);

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'Vehicle ID is required.'
      );
    }

    try {
      const { resource } =
        await containers.vehicles
          .item(vehicleId, vehicleId)
          .read();

      if (!resource) {
        return sendError(
          res,
          404,
          'Vehicle not found.'
        );
      }

      return sendSuccess(res, resource);

    } catch (error) {
      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Vehicle not found.'
        );
      }

      console.error(
        `GET /api/vehicles/${vehicleId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve vehicle.',
        error.message
      );
    }
  }
);

// CREATE VEHICLE
appInstance.post('/api/vehicles', async (req, res) => {
  const vehicleId = cleanString(req.body.vehicleId);

  if (!vehicleId) {
    return sendError(
      res,
      400,
      'vehicleId is required.'
    );
  }

  try {
    const vehicle = {
      ...req.body,
      id: vehicleId,
      vehicleId,
      createdAt: now(),
      updatedAt: now()
    };

    const { resource } =
      await containers.vehicles.items.create(vehicle);

    return sendSuccess(res, resource, 201);

  } catch (error) {
    console.error('POST /api/vehicles:', error);

    return sendError(
      res,
      500,
      'Unable to create vehicle.',
      error.message
    );
  }
});

// UPDATE VEHICLE
appInstance.put(
  '/api/vehicles/:vehicleId',
  async (req, res) => {
    const vehicleId = cleanString(req.params.vehicleId);

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'Vehicle ID is required.'
      );
    }

    try {
      const { resource: existingVehicle } =
        await containers.vehicles
          .item(vehicleId, vehicleId)
          .read();

      if (!existingVehicle) {
        return sendError(
          res,
          404,
          'Vehicle not found.'
        );
      }

      const updatedVehicle = {
        ...existingVehicle,
        ...req.body,
        id: vehicleId,
        vehicleId,
        updatedAt: now()
      };

      const { resource } =
        await containers.vehicles
          .item(vehicleId, vehicleId)
          .replace(updatedVehicle);

      return sendSuccess(res, resource);

    } catch (error) {
      console.error(
        `PUT /api/vehicles/${vehicleId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to update vehicle.',
        error.message
      );
    }
  }
);

// DELETE VEHICLE
appInstance.delete(
  '/api/vehicles/:vehicleId',
  async (req, res) => {
    const vehicleId = cleanString(req.params.vehicleId);

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'Vehicle ID is required.'
      );
    }

    try {
      await containers.vehicles
        .item(vehicleId, vehicleId)
        .delete();

      return sendSuccess(res, {
        message: 'Vehicle deleted successfully.',
        vehicleId
      });

    } catch (error) {
      console.error(
        `DELETE /api/vehicles/${vehicleId}:`,
        error
      );

      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Vehicle not found.'
        );
      }

      return sendError(
        res,
        500,
        'Unable to delete vehicle.',
        error.message
      );
    }
  }
);

// ============================================================
// DRIVERS
// ============================================================

// GET ALL DRIVERS
appInstance.get('/api/drivers', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.driverId'
    };

    const { resources } =
      await containers.drivers.items
        .query(querySpec)
        .fetchAll();

    return sendSuccess(res, resources);

  } catch (error) {
    console.error('GET /api/drivers:', error);

    return sendError(
      res,
      500,
      'Unable to retrieve drivers.',
      error.message
    );
  }
});

// GET ONE DRIVER
appInstance.get(
  '/api/drivers/:driverId',
  async (req, res) => {
    const driverId = cleanString(req.params.driverId);

    if (!driverId) {
      return sendError(
        res,
        400,
        'Driver ID is required.'
      );
    }

    try {
      const { resource } =
        await containers.drivers
          .item(driverId, driverId)
          .read();

      if (!resource) {
        return sendError(
          res,
          404,
          'Driver not found.'
        );
      }

      return sendSuccess(res, resource);

    } catch (error) {
      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Driver not found.'
        );
      }

      console.error(
        `GET /api/drivers/${driverId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve driver.',
        error.message
      );
    }
  }
);

// CREATE DRIVER
appInstance.post('/api/drivers', async (req, res) => {
  const driverId = cleanString(req.body.driverId);

  if (!driverId) {
    return sendError(
      res,
      400,
      'driverId is required.'
    );
  }

  try {
    const driver = {
      ...req.body,
      id: driverId,
      driverId,
      createdAt: now(),
      updatedAt: now()
    };

    const { resource } =
      await containers.drivers.items.create(driver);

    return sendSuccess(res, resource, 201);

  } catch (error) {
    console.error('POST /api/drivers:', error);

    return sendError(
      res,
      500,
      'Unable to create driver.',
      error.message
    );
  }
});

// UPDATE DRIVER
appInstance.put(
  '/api/drivers/:driverId',
  async (req, res) => {
    const driverId = cleanString(req.params.driverId);

    if (!driverId) {
      return sendError(
        res,
        400,
        'Driver ID is required.'
      );
    }

    try {
      const { resource: existingDriver } =
        await containers.drivers
          .item(driverId, driverId)
          .read();

      if (!existingDriver) {
        return sendError(
          res,
          404,
          'Driver not found.'
        );
      }

      const updatedDriver = {
        ...existingDriver,
        ...req.body,
        id: driverId,
        driverId,
        updatedAt: now()
      };

      const { resource } =
        await containers.drivers
          .item(driverId, driverId)
          .replace(updatedDriver);

      return sendSuccess(res, resource);

    } catch (error) {
      console.error(
        `PUT /api/drivers/${driverId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to update driver.',
        error.message
      );
    }
  }
);

// DELETE DRIVER
appInstance.delete(
  '/api/drivers/:driverId',
  async (req, res) => {
    const driverId = cleanString(req.params.driverId);

    if (!driverId) {
      return sendError(
        res,
        400,
        'Driver ID is required.'
      );
    }

    try {
      await containers.drivers
        .item(driverId, driverId)
        .delete();

      return sendSuccess(res, {
        message: 'Driver deleted successfully.',
        driverId
      });

    } catch (error) {
      console.error(
        `DELETE /api/drivers/${driverId}:`,
        error
      );

      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Driver not found.'
        );
      }

      return sendError(
        res,
        500,
        'Unable to delete driver.',
        error.message
      );
    }
  }
);

// ============================================================
// FUEL LOGS
// ============================================================

// GET ALL FUEL LOGS
appInstance.get('/api/fuel-logs', async (req, res) => {
  try {
    const querySpec = {
      query: `
        SELECT * FROM c
        ORDER BY c.createdAt DESC
      `
    };

    const { resources } =
      await containers.fuelLogs.items
        .query(querySpec)
        .fetchAll();

    return sendSuccess(res, resources);

  } catch (error) {
    console.error('GET /api/fuel-logs:', error);

    return sendError(
      res,
      500,
      'Unable to retrieve fuel logs.',
      error.message
    );
  }
});

// GET FUEL LOGS BY VEHICLE
appInstance.get(
  '/api/fuel-logs/vehicle/:vehicleId',
  async (req, res) => {
    const vehicleId = cleanString(req.params.vehicleId);

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'Vehicle ID is required.'
      );
    }

    try {
      const querySpec = {
        query: `
          SELECT * FROM c
          WHERE c.vehicleId = @vehicleId
          ORDER BY c.createdAt DESC
        `,
        parameters: [
          {
            name: '@vehicleId',
            value: vehicleId
          }
        ]
      };

      const { resources } =
        await containers.fuelLogs.items
          .query(querySpec)
          .fetchAll();

      return sendSuccess(res, resources);

    } catch (error) {
      console.error(
        `GET /api/fuel-logs/vehicle/${vehicleId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve vehicle fuel logs.',
        error.message
      );
    }
  }
);

// CREATE FUEL LOG
appInstance.post('/api/fuel-logs', async (req, res) => {
  const vehicleId = cleanString(req.body.vehicleId);

  if (!vehicleId) {
    return sendError(
      res,
      400,
      'vehicleId is required.'
    );
  }

  try {
    const gallons = parseNumber(req.body.gallons);
    const totalAmount = parseNumber(req.body.totalAmount);

    if (
      req.body.gallons !== undefined &&
      gallons === null
    ) {
      return sendError(
        res,
        400,
        'Gallons must be a valid number.'
      );
    }

    if (
      req.body.totalAmount !== undefined &&
      totalAmount === null
    ) {
      return sendError(
        res,
        400,
        'Total amount must be a valid number.'
      );
    }

    const fuelLog = {
      ...req.body,
      id: cleanString(req.body.fuelLogId) ||
        createId('fuel'),
      vehicleId,
      gallons,
      totalAmount,
      createdAt: now(),
      updatedAt: now()
    };

    const { resource } =
      await containers.fuelLogs.items.create(
        fuelLog
      );

    return sendSuccess(res, resource, 201);

  } catch (error) {
    console.error('POST /api/fuel-logs:', error);

    return sendError(
      res,
      500,
      'Unable to create fuel log.',
      error.message
    );
  }
});

// ============================================================
// MILEAGE LOGS
// ============================================================
//
// IMPORTANT:
// This is the main source of truth for vehicle trip/mileage data.
//
// driver.html
// mileage-log-management.html
// records.html
// PDF reports
//
// will ultimately use this same data.
// ============================================================

// GET ALL MILEAGE LOGS
appInstance.get(
  '/api/mileage-logs',
  async (req, res) => {
    try {
      const querySpec = {
        query: `
          SELECT * FROM c
          ORDER BY c.tripDate DESC, c.createdAt DESC
        `
      };

      const { resources } =
        await containers.mileageLogs.items
          .query(querySpec)
          .fetchAll();

      return sendSuccess(res, resources);

    } catch (error) {
      console.error(
        'GET /api/mileage-logs:',
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve mileage logs.',
        error.message
      );
    }
  }
);

// GET MILEAGE LOGS BY VEHICLE
appInstance.get(
  '/api/mileage-logs/vehicle/:vehicleId',
  async (req, res) => {
    const vehicleId = cleanString(req.params.vehicleId);

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'Vehicle ID is required.'
      );
    }

    try {
      const querySpec = {
        query: `
          SELECT * FROM c
          WHERE c.vehicleId = @vehicleId
          ORDER BY c.tripDate DESC, c.createdAt DESC
        `,
        parameters: [
          {
            name: '@vehicleId',
            value: vehicleId
          }
        ]
      };

      const { resources } =
        await containers.mileageLogs.items
          .query(querySpec)
          .fetchAll();

      return sendSuccess(res, resources);

    } catch (error) {
      console.error(
        `GET /api/mileage-logs/vehicle/${vehicleId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve mileage logs for vehicle.',
        error.message
      );
    }
  }
);

// GET ONE MILEAGE LOG
appInstance.get(
  '/api/mileage-logs/:id/:vehicleId',
  async (req, res) => {
    const id = cleanString(req.params.id);
    const vehicleId = cleanString(
      req.params.vehicleId
    );

    if (!id || !vehicleId) {
      return sendError(
        res,
        400,
        'Mileage log ID and vehicle ID are required.'
      );
    }

    try {
      const { resource } =
        await containers.mileageLogs
          .item(id, vehicleId)
          .read();

      if (!resource) {
        return sendError(
          res,
          404,
          'Mileage log not found.'
        );
      }

      return sendSuccess(res, resource);

    } catch (error) {
      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Mileage log not found.'
        );
      }

      console.error(
        `GET /api/mileage-logs/${id}/${vehicleId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve mileage log.',
        error.message
      );
    }
  }
);

// CREATE MILEAGE LOG
appInstance.post(
  '/api/mileage-logs',
  async (req, res) => {
    const vehicleId = cleanString(
      req.body.vehicleId ||
      req.body.vehicleUnit
    );

    const driverName = cleanString(
      req.body.driverName
    );

    const tripDate = cleanString(
      req.body.tripDate
    );

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'vehicleId is required.'
      );
    }

    if (!driverName) {
      return sendError(
        res,
        400,
        'driverName is required.'
      );
    }

    if (!tripDate) {
      return sendError(
        res,
        400,
        'tripDate is required.'
      );
    }

    const startOdometer = parseNumber(
      req.body.startOdometer
    );

    const endOdometer = parseNumber(
      req.body.endOdometer
    );

    if (
      req.body.startOdometer !== undefined &&
      startOdometer === null
    ) {
      return sendError(
        res,
        400,
        'startOdometer must be a valid number.'
      );
    }

    if (
      req.body.endOdometer !== undefined &&
      endOdometer === null
    ) {
      return sendError(
        res,
        400,
        'endOdometer must be a valid number.'
      );
    }

    if (
      startOdometer !== null &&
      endOdometer !== null &&
      endOdometer < startOdometer
    ) {
      return sendError(
        res,
        400,
        'endOdometer cannot be less than startOdometer.'
      );
    }

    try {
      const mileageLog = {
        ...req.body,

        id:
          cleanString(req.body.id) ||
          cleanString(req.body.mileageLogId) ||
          createId('mileage'),

        vehicleId,

        // Keep vehicleUnit temporarily for frontend
        // compatibility.
        vehicleUnit: vehicleId,

        driverName,
        tripDate,

        startOdometer,
        endOdometer,

        createdAt: now(),
        updatedAt: now()
      };

      const { resource } =
        await containers.mileageLogs.items.create(
          mileageLog
        );

      return sendSuccess(
        res,
        resource,
        201
      );

    } catch (error) {
      console.error(
        'POST /api/mileage-logs:',
        error
      );

      return sendError(
        res,
        500,
        'Unable to create mileage log.',
        error.message
      );
    }
  }
);

// UPDATE MILEAGE LOG
appInstance.put(
  '/api/mileage-logs/:id',
  async (req, res) => {
    const id = cleanString(req.params.id);

    const vehicleId = cleanString(
      req.body.vehicleId ||
      req.body.vehicleUnit
    );

    if (!id) {
      return sendError(
        res,
        400,
        'Mileage log ID is required.'
      );
    }

    if (!vehicleId) {
      return sendError(
        res,
        400,
        'vehicleId is required to update a mileage log.'
      );
    }

    try {
      const { resource: existingLog } =
        await containers.mileageLogs
          .item(id, vehicleId)
          .read();

      if (!existingLog) {
        return sendError(
          res,
          404,
          'Mileage log not found.'
        );
      }

      const startOdometer =
        req.body.startOdometer !== undefined
          ? parseNumber(req.body.startOdometer)
          : existingLog.startOdometer;

      const endOdometer =
        req.body.endOdometer !== undefined
          ? parseNumber(req.body.endOdometer)
          : existingLog.endOdometer;

      if (
        startOdometer !== null &&
        endOdometer !== null &&
        endOdometer < startOdometer
      ) {
        return sendError(
          res,
          400,
          'endOdometer cannot be less than startOdometer.'
        );
      }

      const updatedLog = {
        ...existingLog,
        ...req.body,

        id,
        vehicleId,
        vehicleUnit: vehicleId,

        startOdometer,
        endOdometer,

        updatedAt: now()
      };

      const { resource } =
        await containers.mileageLogs
          .item(id, vehicleId)
          .replace(updatedLog);

      return sendSuccess(res, resource);

    } catch (error) {
      console.error(
        `PUT /api/mileage-logs/${id}:`,
        error
      );

      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Mileage log not found.'
        );
      }

      return sendError(
        res,
        500,
        'Unable to update mileage log.',
        error.message
      );
    }
  }
);

// DELETE MILEAGE LOG
appInstance.delete(
  '/api/mileage-logs/:id/:vehicleId',
  async (req, res) => {
    const id = cleanString(req.params.id);

    const vehicleId = cleanString(
      req.params.vehicleId
    );

    if (!id || !vehicleId) {
      return sendError(
        res,
        400,
        'Mileage log ID and vehicle ID are required.'
      );
    }

    try {
      await containers.mileageLogs
        .item(id, vehicleId)
        .delete();

      return sendSuccess(res, {
        message: 'Mileage log deleted successfully.',
        id,
        vehicleId
      });

    } catch (error) {
      console.error(
        `DELETE /api/mileage-logs/${id}/${vehicleId}:`,
        error
      );

      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Mileage log not found.'
        );
      }

      return sendError(
        res,
        500,
        'Unable to delete mileage log.',
        error.message
      );
    }
  }
);

// ============================================================
// RESERVATIONS
// ============================================================

// GET ALL RESERVATIONS
appInstance.get(
  '/api/reservations',
  async (req, res) => {
    try {
      const querySpec = {
        query: `
          SELECT * FROM c
          ORDER BY c.fromDate ASC, c.createdAt DESC
        `
      };

      const { resources } =
        await containers.reservations.items
          .query(querySpec)
          .fetchAll();

      return sendSuccess(res, resources);

    } catch (error) {
      console.error(
        'GET /api/reservations:',
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve reservations.',
        error.message
      );
    }
  }
);

// GET ONE RESERVATION
appInstance.get(
  '/api/reservations/:reservationId',
  async (req, res) => {
    const reservationId = cleanString(
      req.params.reservationId
    );

    if (!reservationId) {
      return sendError(
        res,
        400,
        'Reservation ID is required.'
      );
    }

    try {
      const { resource } =
        await containers.reservations
          .item(
            reservationId,
            reservationId
          )
          .read();

      if (!resource) {
        return sendError(
          res,
          404,
          'Reservation not found.'
        );
      }

      return sendSuccess(res, resource);

    } catch (error) {
      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Reservation not found.'
        );
      }

      console.error(
        `GET /api/reservations/${reservationId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to retrieve reservation.',
        error.message
      );
    }
  }
);

// CREATE RESERVATION
appInstance.post(
  '/api/reservations',
  async (req, res) => {
    try {
      const reservationId =
        cleanString(req.body.reservationId) ||
        createId('reservation');

      const reservation = {
        ...req.body,
        id: reservationId,
        reservationId,
        createdAt: now(),
        updatedAt: now()
      };

      const { resource } =
        await containers.reservations.items.create(
          reservation
        );

      return sendSuccess(
        res,
        resource,
        201
      );

    } catch (error) {
      console.error(
        'POST /api/reservations:',
        error
      );

      return sendError(
        res,
        500,
        'Unable to create reservation.',
        error.message
      );
    }
  }
);

// UPDATE RESERVATION
appInstance.put(
  '/api/reservations/:reservationId',
  async (req, res) => {
    const reservationId = cleanString(
      req.params.reservationId
    );

    if (!reservationId) {
      return sendError(
        res,
        400,
        'Reservation ID is required.'
      );
    }

    try {
      const { resource: existingReservation } =
        await containers.reservations
          .item(
            reservationId,
            reservationId
          )
          .read();

      if (!existingReservation) {
        return sendError(
          res,
          404,
          'Reservation not found.'
        );
      }

      const updatedReservation = {
        ...existingReservation,
        ...req.body,

        id: reservationId,
        reservationId,

        updatedAt: now()
      };

      const { resource } =
        await containers.reservations
          .item(
            reservationId,
            reservationId
          )
          .replace(updatedReservation);

      return sendSuccess(res, resource);

    } catch (error) {
      console.error(
        `PUT /api/reservations/${reservationId}:`,
        error
      );

      return sendError(
        res,
        500,
        'Unable to update reservation.',
        error.message
      );
    }
  }
);

// DELETE RESERVATION
appInstance.delete(
  '/api/reservations/:reservationId',
  async (req, res) => {
    const reservationId = cleanString(
      req.params.reservationId
    );

    if (!reservationId) {
      return sendError(
        res,
        400,
        'Reservation ID is required.'
      );
    }

    try {
      await containers.reservations
        .item(
          reservationId,
          reservationId
        )
        .delete();

      return sendSuccess(res, {
        message:
          'Reservation deleted successfully.',
        reservationId
      });

    } catch (error) {
      console.error(
        `DELETE /api/reservations/${reservationId}:`,
        error
      );

      if (error.code === 404) {
        return sendError(
          res,
          404,
          'Reservation not found.'
        );
      }

      return sendError(
        res,
        500,
        'Unable to delete reservation.',
        error.message
      );
    }
  }
);

// ============================================================
// 404 HANDLER
// ============================================================

appInstance.use((req, res) => {
  return sendError(
    res,
    404,
    `API endpoint not found: ${req.method} ${req.originalUrl}`
  );
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

appInstance.use(
  (error, req, res, next) => {
    console.error(
      'Unhandled server error:',
      error
    );

    if (error.message === 'CORS policy blocked this request.') {
      return sendError(
        res,
        403,
        'Request blocked by CORS policy.'
      );
    }

    return sendError(
      res,
      500,
      'An unexpected server error occurred.',
      error.message
    );
  }
);

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  try {
    await initializeCosmosDB();

    appInstance.listen(PORT, () => {
      console.log('');
      console.log('============================================================');
      console.log('🚀 MUSC FLEET MANAGEMENT API');
      console.log('============================================================');
      console.log(`Environment : ${NODE_ENV}`);
      console.log(`Port        : ${PORT}`);
      console.log(`Database    : ${DATABASE_ID}`);
      console.log('');
      console.log('API ENDPOINTS');
      console.log('------------------------------------------------------------');
      console.log('GET    /api');
      console.log('GET    /api/health');
      console.log('');
      console.log('VEHICLES');
      console.log('GET    /api/vehicles');
      console.log('POST   /api/vehicles');
      console.log('GET    /api/vehicles/:vehicleId');
      console.log('PUT    /api/vehicles/:vehicleId');
      console.log('DELETE /api/vehicles/:vehicleId');
      console.log('');
      console.log('DRIVERS');
      console.log('GET    /api/drivers');
      console.log('POST   /api/drivers');
      console.log('GET    /api/drivers/:driverId');
      console.log('PUT    /api/drivers/:driverId');
      console.log('DELETE /api/drivers/:driverId');
      console.log('');
      console.log('FUEL LOGS');
      console.log('GET    /api/fuel-logs');
      console.log('POST   /api/fuel-logs');
      console.log('GET    /api/fuel-logs/vehicle/:vehicleId');
      console.log('');
      console.log('MILEAGE LOGS');
      console.log('GET    /api/mileage-logs');
      console.log('POST   /api/mileage-logs');
      console.log('GET    /api/mileage-logs/vehicle/:vehicleId');
      console.log('GET    /api/mileage-logs/:id/:vehicleId');
      console.log('PUT    /api/mileage-logs/:id');
      console.log('DELETE /api/mileage-logs/:id/:vehicleId');
      console.log('');
      console.log('RESERVATIONS');
      console.log('GET    /api/reservations');
      console.log('POST   /api/reservations');
      console.log('GET    /api/reservations/:reservationId');
      console.log('PUT    /api/reservations/:reservationId');
      console.log('DELETE /api/reservations/:reservationId');
      console.log('============================================================');
      console.log('');
    });

  } catch (error) {
    console.error(
      '❌ Failed to start MUSC Fleet Management API:',
      error
    );

    process.exit(1);
  }
}

startServer();
