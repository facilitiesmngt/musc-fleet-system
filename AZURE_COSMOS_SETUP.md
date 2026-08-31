# Azure Cosmos DB Setup Guide for MUSC Fleet Management System

## 📋 Overview
This guide walks you through setting up Azure Cosmos DB for the MUSC Fleet Management System pilot project. This FREE tier setup is perfect for demo/pilot usage and can be migrated to enterprise later.

---

## 🔧 Step-by-Step Setup

### Step 1: Create an Azure Cosmos DB Account (FREE Tier)

1. **Log in to Azure Portal**
   - Go to https://portal.azure.com
   - Sign in with your Azure account (081c271e-533a-4829-a682-6b99571406d1)

2. **Create Resource Group** (if not already created)
   - Click "Create a resource"
   - Search for "Resource Group"
   - Name: `musc-fleet-management-rg`
   - Region: `East US`
   - Click "Review + Create" → "Create"

3. **Create Cosmos DB Account**
   - Click "Create a resource"
   - Search for "Azure Cosmos DB"
   - Click "Create"
   - Select **Core (SQL)** - SQL API for document storage
   - Fill in details:
     - **Subscription**: 081c271e-533a-4829-a682-6b99571406d1
     - **Resource Group**: musc-fleet-management-rg
     - **Account Name**: `musc-fleet-system` (must be globally unique)
     - **Location**: East US
     - **Capacity mode**: **Serverless** (FREE TIER - only pay for operations)
     - Leave other settings as default
   - Click "Review + Create" → "Create"
   - Wait for deployment (2-5 minutes)

### Step 2: Get Connection Credentials

1. **Navigate to your Cosmos DB Account**
   - Go to Resource Group → musc-fleet-management-rg
   - Click on "musc-fleet-system" (Cosmos DB account)

2. **Get Connection String/Keys**
   - Click "Keys" in the left menu
   - Copy:
     - **URI** (Endpoint URL) - starts with `https://...`
     - **Primary Key** - long alphanumeric string

3. **Save these credentials** - you'll need them for the next step

---

## 💻 Step 3: Configure Backend API

1. **Navigate to backend folder**
   ```bash
   cd musc-fleet-system\backend
   ```

2. **Create .env file** (copy from .env.example)
   ```bash
   copy .env.example .env
   ```

3. **Edit .env file with your credentials**
   ```
   COSMOS_ENDPOINT=https://<your-cosmos-account>.documents.azure.com:443/
   COSMOS_KEY=<your-primary-key>
   COSMOS_DATABASE=fleet-management
   PORT=3000
   NODE_ENV=development
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the backend server**
   ```bash
   npm start
   ```

   Expected output:
   ```
   ✅ Cosmos DB initialized successfully
   🚀 MUSC Fleet Management API running on http://localhost:3000
   ```

---

## 🧪 Step 4: Test the Backend API

1. **Check API Health**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Add a Vehicle**
   ```bash
   curl -X POST http://localhost:3000/api/vehicles \
     -H "Content-Type: application/json" \
     -d '{
       "vehicleId": "vehicle-001",
       "make": "Toyota",
       "model": "Camry",
       "licensePlate": "ABC123",
       "status": "active"
     }'
   ```

3. **Get All Vehicles**
   ```bash
   curl http://localhost:3000/api/vehicles
   ```

---

## 🌐 Step 5: Update Frontend to Use API

Replace the local storage usage in your HTML files with API calls. Example:

**Before (Local Storage):**
```javascript
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
vehicles.push(newVehicle);
localStorage.setItem('vehicles', JSON.stringify(vehicles));
```

**After (API Call):**
```javascript
fetch('http://localhost:3000/api/vehicles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newVehicle)
})
.then(response => response.json())
.then(data => console.log('Vehicle saved:', data))
.catch(error => console.error('Error:', error));
```

See `FRONTEND_INTEGRATION.md` for complete frontend integration examples.

---

## 📊 Database Collections Created

The backend automatically creates these Cosmos DB collections:

| Collection | Purpose | Partition Key |
|-----------|---------|----------------|
| **vehicles** | Store vehicle information | vehicleId |
| **drivers** | Store driver details | driverId |
| **fuel-logs** | Track fuel consumption | vehicleId |
| **mileage-logs** | Track mileage records | vehicleId |
| **reservations** | Manage vehicle reservations | reservationId |
| **users** | User accounts (future) | userId |

---

## 💰 Cost Estimation (FREE Tier)

Azure Cosmos DB Serverless Mode is **completely FREE** until you exceed:
- **1 million RUs (Request Units) per month**

For a pilot with demo users: ✅ **You'll stay well within free limits**

When ready for enterprise:
- Your IT department can upgrade to provisioned throughput
- Easily migrate to Azure SQL Database or other options
- Already in Microsoft ecosystem for seamless handover

---

## 🚀 Deployment & Handover to IT

### For Pilot Phase (Now):
- ✅ Keep using Cosmos DB Serverless (FREE)
- ✅ Test features with demo users
- ✅ Gather feedback from stakeholders

### For Handover to IT (After Approval):
1. **Export Database Structure**
   - IT department can view collections in Azure Portal
   - Cosmos DB data is automatically backed up

2. **Migration Options**
   - Keep using Cosmos DB (upgrade to provisioned capacity if needed)
   - Migrate to Azure SQL Database (IT's choice)
   - Replicate to on-premises database

3. **Documentation Provided**
   - API documentation (see API_DOCUMENTATION.md)
   - Database schema (see SCHEMA.md)
   - Deployment guide (see DEPLOYMENT_GUIDE.md)
   - Source code with clear comments

---

## 🆘 Troubleshooting

### "Cosmos DB not responding"
- Check firewall rules in Azure Portal
- Verify credentials in .env file
- Ensure backend server is running

### "Connection timeout"
- Verify COSMOS_ENDPOINT format (should end with :443/)
- Check internet connection
- Restart backend server

### "Authentication failed"
- Copy COSMOS_KEY again (sometimes special characters copy incorrectly)
- Verify account name in COSMOS_ENDPOINT

### "Collection creation failed"
- Ensure your Cosmos DB account is fully deployed
- Check Azure Portal for any error messages

---

## 📚 Additional Resources

- [Azure Cosmos DB Documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Azure Cosmos DB Pricing](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)
- [Cosmos DB SDK for Node.js](https://learn.microsoft.com/en-us/azure/cosmos-db/sql/quickstart-nodejs)

---

## ✅ Next Steps

1. ✅ Follow this setup guide
2. ✅ Verify backend is running and connected
3. ✅ Update frontend to use API
4. ✅ Test with demo users
5. ✅ Push updates to GitHub
6. ✅ Submit to IT department for approval

---

**Questions?** Check the troubleshooting section or consult Azure documentation.
