# MUSC Fleet Management System - Backend Setup Guide

## 📦 Project Structure

```
musc-fleet-system/
├── backend/                          # Node.js Express API
│   ├── server.js                     # Main API server
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment template
│   ├── .env                          # Environment config (create from .env.example)
│   ├── config/                       # Configuration files
│   ├── routes/                       # API route handlers (optional)
│   ├── models/                       # Data models (optional)
│   └── middleware/                   # Custom middleware (optional)
├── AZURE_COSMOS_SETUP.md             # Azure Cosmos DB setup instructions
├── FRONTEND_INTEGRATION.md           # How to update frontend with API
├── API_DOCUMENTATION.md              # Complete API reference
├── index.html                        # Frontend (to be updated)
├── driver.html                       # Frontend page
├── fuel-management.html              # Frontend page
├── mileage-log-management.html       # Frontend page
├── records.html                      # Frontend page
├── reservation.html                  # Frontend page
└── assets/                           # CSS, JS, images
    ├── site.css
    ├── site.js
    └── images/
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Copy the example .env file and add your Azure credentials:
```bash
copy .env.example .env
```

Edit `.env` with your credentials from Azure Portal:
```
COSMOS_ENDPOINT=https://<your-account>.documents.azure.com:443/
COSMOS_KEY=<your-primary-key>
COSMOS_DATABASE=fleet-management
PORT=3000
NODE_ENV=development
```

### Step 3: Start the Server
```bash
npm start
```

Expected output:
```
✅ Cosmos DB initialized successfully
🚀 MUSC Fleet Management API running on http://localhost:3000
```

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Azure Account** with Cosmos DB account created
- **Cosmos DB Connection Credentials**

---

## 🔧 Installation Details

### Install Node.js (if not already installed)
1. Download from https://nodejs.org/
2. Install with default settings
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Clone or Update Repository
```bash
git clone https://github.com/facilitiesmngt/musc-fleet-system.git
cd musc-fleet-system
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

This installs:
- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **@azure/cosmos** - Cosmos DB client library
- **dotenv** - Environment variable management
- **uuid** - ID generation
- **nodemon** (dev only) - Auto-restart on file changes

---

## 🌐 Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Azure Cosmos DB
COSMOS_ENDPOINT=https://musc-fleet-system.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
COSMOS_DATABASE=fleet-management

# Server
PORT=3000
NODE_ENV=development
```

**Security Note:** Never commit `.env` to GitHub. It's in `.gitignore` by default.

---

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test the API
```bash
# In another terminal
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "MUSC Fleet Management API is running",
  "timestamp": "2024-08-31T20:00:00.000Z"
}
```

---

## 📊 Available API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check API status |
| GET | `/api/vehicles` | List all vehicles |
| POST | `/api/vehicles` | Create vehicle |
| GET | `/api/vehicles/:id` | Get vehicle details |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| GET | `/api/drivers` | List all drivers |
| POST | `/api/drivers` | Create driver |
| GET | `/api/fuel-logs` | List fuel logs |
| POST | `/api/fuel-logs` | Add fuel log |
| GET | `/api/mileage-logs` | List mileage logs |
| POST | `/api/mileage-logs` | Add mileage log |
| GET | `/api/reservations` | List reservations |
| POST | `/api/reservations` | Create reservation |

See `API_DOCUMENTATION.md` for full details.

---

## 🧪 Testing the API

### Using cURL (Command Line)
```bash
# Get all vehicles
curl http://localhost:3000/api/vehicles

# Create a vehicle
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":"v1","make":"Toyota","model":"Camry"}'
```

### Using Postman (GUI Tool)
1. Download https://www.postman.com/downloads/
2. Create new request
3. Set URL: `http://localhost:3000/api/vehicles`
4. Set Method: GET
5. Send request

### Using JavaScript (Browser Console)
```javascript
fetch('http://localhost:3000/api/vehicles')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

---

## 🔒 Security Considerations

### For Pilot/Demo Phase
- ✅ Current setup is fine (no authentication)
- ✅ Development mode can have detailed error messages
- ✅ Limited to trusted demo users

### Before IT Handover
Add these for production:
1. **Authentication** - API keys or OAuth
2. **Authorization** - Role-based access control
3. **Rate Limiting** - Prevent abuse
4. **HTTPS** - Encrypted connections
5. **Input Validation** - Sanitize user input
6. **Logging** - Track API usage

See `PRODUCTION_CHECKLIST.md` for details.

---

## 🚨 Troubleshooting

### "Cannot find module '@azure/cosmos'"
```bash
npm install
```

### "EADDRINUSE: address already in use :::3000"
Port 3000 is already in use. Either:
1. Close other applications using port 3000
2. Change PORT in .env to 3001

### "Error connecting to Cosmos DB"
- Verify COSMOS_ENDPOINT format (should end with `:443/`)
- Check COSMOS_KEY is correct (copy again if needed)
- Ensure Cosmos DB account is fully deployed in Azure Portal

### "TypeError: cosmosClient is not defined"
- Ensure server.js is fully loaded
- Check for errors in initialization
- Restart the server

### "CORS error when calling from frontend"
- CORS is enabled in server.js
- Check that frontend is calling correct API URL
- Frontend must be on `http://localhost:3000` or adjust CORS settings

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `AZURE_COSMOS_SETUP.md` | Step-by-step Azure setup |
| `API_DOCUMENTATION.md` | Complete API reference |
| `FRONTEND_INTEGRATION.md` | How to update frontend |
| `PRODUCTION_CHECKLIST.md` | Prepare for production |
| `DEPLOYMENT_GUIDE.md` | Deploy to Azure |
| `README.md` (this file) | Backend setup guide |

---

## 🔄 Development Workflow

1. **Make changes to server.js**
   ```bash
   # Nodemon auto-restarts the server
   npm run dev
   ```

2. **Test changes**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Commit to GitHub**
   ```bash
   git add .
   git commit -m "Update API endpoints"
   git push
   ```

---

## 📦 Dependencies Explained

| Package | Purpose |
|---------|---------|
| `express` | Web server framework |
| `cors` | Handle cross-origin requests |
| `@azure/cosmos` | Connect to Cosmos DB |
| `dotenv` | Load environment variables |
| `uuid` | Generate unique IDs |
| `nodemon` | Auto-restart on changes (dev only) |

---

## 🚀 Next Steps

1. ✅ Install Node.js and npm
2. ✅ Set up Azure Cosmos DB (see `AZURE_COSMOS_SETUP.md`)
3. ✅ Configure `.env` file with Cosmos DB credentials
4. ✅ Run `npm install` to install dependencies
5. ✅ Run `npm start` to start the server
6. ✅ Test API endpoints with curl or Postman
7. ✅ Update frontend to use API (see `FRONTEND_INTEGRATION.md`)
8. ✅ Commit changes to GitHub
9. ✅ Prepare for handover to IT department

---

## 💡 Tips

- Always keep `.env` file secure (add to `.gitignore`)
- Use `npm run dev` during development for auto-reload
- Test API before updating frontend
- Keep API documentation updated as you add features
- Use meaningful IDs (e.g., `vehicle-001` not just `001`)

---

## ❓ FAQ

**Q: Do I need to pay for Cosmos DB?**
A: No! The FREE tier is included and sufficient for a pilot project with demo users.

**Q: Can I use this in production?**
A: Yes, but add authentication and security features first (see `PRODUCTION_CHECKLIST.md`).

**Q: What if I want to migrate to SQL Database later?**
A: Easy! The API layer abstracts the database, so you only change the backend connection.

**Q: How do I deploy this to Azure?**
A: See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.

---

## 📞 Support

- Check troubleshooting section above
- Review error logs in terminal
- Consult Azure documentation
- Check GitHub issues for similar problems

---


**Last Updated:** August 31, 2024
**Version:** 1.0.0
