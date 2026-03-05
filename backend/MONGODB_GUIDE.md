# How to Check MongoDB Users in Atlas

## Step 1: Go to MongoDB Atlas
1. Open your browser and go to: https://cloud.mongodb.com
2. Login with:
   - Email: imca@gmail.com (or your MongoDB account)
   - Password: imca

## Step 2: Navigate to Your Database
1. Click on **"Clusters"** in the left sidebar
2. Click on **"Cluster0"** (or your cluster name)
3. Click the **"Collections"** tab (or "Browse Collections")

## Step 3: Find the Users Collection
- Select Database: **movie_booking**
- You should see the **users** collection
- Click on it to view all registered users

## Users Collection Location:
```
Cluster0 
  └── Databases
      └── movie_booking
          └── Collections
              └── users
```

## What You Should See:
Each user document should look like:
```json
{
  "_id": ObjectId("699bfe6d27fd577ed46195b7"),
  "name": "New User",
  "email": "newuser@example.com",
  "password": "$2a$10$...(hashed password)",
  "role": "user",
  "createdAt": ISODate("2026-02-23T07:00:00.000Z"),
  "updatedAt": ISODate("2026-02-23T07:00:00.000Z"),
  "__v": 0
}
```

## If You Don't See Users:

### Option 1: Check Database Name
Make sure the database is actually named `movie_booking`:
- In MongoDB Atlas, databases are created automatically when you first insert data
- If users were registered, the database should exist

### Option 2: Verify Connection String
Check your `.env` file in the backend folder:
```
MONGODB_URI=mongodb+srv://imca:imca@cluster0.cj0rpbm.mongodb.net/movie_booking
```

The database name is after the last `/` = **movie_booking**

### Option 3: Check Network Access
Make sure your IP is whitelisted:
1. Go to MongoDB Atlas → Network Access
2. Make sure your IP address is in the whitelist
3. Or allow all IPs: 0.0.0.0/0 (for development only)

### Option 4: Test with Backend
Run this test to confirm MongoDB is saving users:

```bash
npm start
```

Then in another terminal, register a test user:
```powershell
$body = @{ name = "Test User"; email = "test@mongodb.com"; password = "password123" } | ConvertTo-Json
Invoke-WebRequest http://localhost:5000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
```

You should see in the backend terminal:
```
✓ User registered: test@mongodb.com
```

This confirms the user is in MongoDB!

## Verify Users from Backend

You can also check if users exist by trying to login:
```powershell
$body = @{ email = "newuser@example.com"; password = "password123" } | ConvertTo-Json
Invoke-WebRequest http://localhost:5000/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
```

If login succeeds and returns user data, the user definitely exists in MongoDB!

## Current Registered Users

Based on backend logs, these users have been registered:
- ✓ test@example.com
- ✓ newuser@example.com

Try logging in with either of these emails to confirm they exist!
