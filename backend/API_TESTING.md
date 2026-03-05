# Movie Booking API Testing Guide

## Getting Started

### 1. Start the Backend Server
From the backend directory:
```bash
npm start
```
Or from the root directory:
```bash
npm run backend
```

The server will run on `http://localhost:5000`

### 2. MongoDB Connection
- **Database**: movie_booking (Atlas)
- **URL**: mongodb+srv://imca:imca@cluster0.cj0rpbm.mongodb.net/movie_booking
- Users collection will be created automatically on first registration

## Running Both Frontend and Backend

From the **root directory**, run:
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

**Both must be running for authentication to work!**

## API Endpoints

### 1. Health Check ✓
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "message": "Server is running",
  "status": "OK",
  "env": "development"
}
```

### 2. Register a New User ✓
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

Success Response (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "699bfe6d27fd577ed46195b7",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Error Response (400 - User exists):
```json
{
  "message": "User already exists"
}
```

### 3. Login ✓
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Success Response (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "699bfe6d27fd577ed46195b7",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Error Response (401 - Invalid credentials):
```json
{
  "message": "Invalid credentials"
}
```

### 4. Get Current User (Requires Auth Token) ✓
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "699bfe6d27fd577ed46195b7",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Testing with PowerShell

### Register:
```powershell
$body = @{ name = "John Doe"; email = "john@example.com"; password = "password123" } | ConvertTo-Json
Invoke-WebRequest http://localhost:5000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
```

### Login:
```powershell
$body = @{ email = "john@example.com"; password = "password123" } | ConvertTo-Json
$response = Invoke-WebRequest http://localhost:5000/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
$response.Content | ConvertFrom-Json
```

## Testing with cURL (Git Bash or WSL)

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Current User (replace TOKEN with actual JWT):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Testing with Postman

1. **Register**:
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Body (JSON): 
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**:
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body (JSON):
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Get User**:
   - Method: GET
   - URL: http://localhost:5000/api/auth/me
   - Headers: Add Authorization header
     - Key: `Authorization`
     - Value: `Bearer <your_jwt_token>`

## Verification in MongoDB

Users are automatically saved in MongoDB. To verify:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Log in with: imca / imca
3. Navigate to: Cluster0 → Databases → movie_booking → users
4. You'll see all registered users with hashed passwords

## Frontend Integration

The frontend is now connected to the real backend:
- Registration/Login forms send requests to the backend
- User data is stored in MongoDB
- JWT tokens are used for session management
- Token is stored in `localStorage` as `movie_app_token`

### Test Login Flow:
1. Run: `npm run dev` from root directory
2. Go to http://localhost:5173
3. Click Register
4. Create a new account
5. You'll be logged in and redirected
6. Check MongoDB Atlas to verify the user was saved

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify internet connection

### "Port 5000 already in use"
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "CORS error" on frontend
- Make sure backend is running on http://localhost:5000
- CORS is enabled for all origins (*)

### Password not matching on login
- Passwords are hashed with bcrypt
- Ensure correct password is being sent
- Check error logs in backend terminal

## Backend Architecture

- **Express.js**: REST API server
- **MongoDB with Mongoose**: Data persistence
- **JWT**: User session management
- **bcryptjs**: Password security (10 salt rounds)
- **CORS**: Cross-origin requests enabled

## Files Structure

```
backend/
├── index.js           ← Main server file
├── db.js              ← MongoDB connection
├── .env               ← Environment variables
├── models/
│   └── User.js        ← User schema with validation
├── routes/
│   └── auth.js        ← Authentication endpoints
└── package.json       ← Dependencies
```

## Security Features

✓ Passwords hashed with bcryptjs (10 salt rounds)
✓ JWT tokens with 30-day expiration
✓ Email validation
✓ Input validation
✓ CORS protection
✓ Error handling

## Environment Variables

```
MONGODB_URI=mongodb+srv://imca:imca@cluster0.cj0rpbm.mongodb.net/movie_booking
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

Change `JWT_SECRET` in production!

