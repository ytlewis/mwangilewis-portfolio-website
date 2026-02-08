# MongoDB Atlas Setup Guide

## Current Connection Issue

The connection string appears to have a DNS resolution issue. This typically means:

1. **Incorrect cluster hostname** - The cluster URL might be wrong
2. **Network/Firewall issue** - Your IP might not be whitelisted
3. **Cluster not running** - The MongoDB Atlas cluster might be paused

## How to Get the Correct Connection String

### Step 1: Log into MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Log in with your credentials

### Step 2: Get Connection String
1. Click on "Database" in the left sidebar
2. Find your cluster (Cluster0)
3. Click the "Connect" button
4. Choose "Connect your application"
5. Select "Node.js" as the driver
6. Copy the connection string

### Step 3: Update Connection String
The connection string should look like:
```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `<username>` with: `ytlewis`
- Replace `<password>` with: `Lewis001!` (URL-encoded as `Lewis001%21`)
- Replace `<cluster-url>` with the actual cluster URL from Atlas
- Replace `<database>` with: `portfolio`

### Step 4: Whitelist Your IP Address
1. In MongoDB Atlas, go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Either:
   - Click "Add Current IP Address" to whitelist your current IP
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development

### Step 5: Verify Database User
1. Go to "Database Access" in the left sidebar
2. Verify that user `ytlewis` exists
3. Verify the password is correct
4. Ensure the user has "Read and write to any database" permissions

## Current Connection String Format

Your provided string was:
```
mongodb+srv://ytlewis:<Lewis001!>@cluster0.q5hcdie.mongodb.net/?portfolio=Cluster0
```

This format is incorrect. The correct format should be:
```
mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority
```

## Testing the Connection

Once you have the correct connection string:

1. Update `backend/.env` file with the correct `MONGODB_URI`
2. Run the test script:
   ```bash
   npm run db:test --prefix backend
   ```

## Initialize Admin User

After successful connection:

1. Run the initialization script:
   ```bash
   npm run db:init --prefix backend
   ```

2. This will create an admin user with:
   - Email: gathaiyalewis1122@gmail.com
   - Password: Lewis001!

3. Access the admin dashboard at: http://localhost:3000/admin

## Troubleshooting

### Error: "querySrv ECONNREFUSED"
- **Cause**: DNS resolution failed for the cluster hostname
- **Solution**: Verify the cluster URL is correct in MongoDB Atlas

### Error: "Authentication failed"
- **Cause**: Incorrect username or password
- **Solution**: 
  - Verify credentials in MongoDB Atlas
  - Ensure password special characters are URL-encoded
  - `!` should be `%21`
  - `@` should be `%40`
  - `#` should be `%23`

### Error: "IP not whitelisted"
- **Cause**: Your IP address is not allowed to connect
- **Solution**: Add your IP in Network Access settings

### Error: "Connection timeout"
- **Cause**: Network or firewall blocking connection
- **Solution**: 
  - Check your internet connection
  - Check firewall settings
  - Try allowing access from anywhere (0.0.0.0/0)

## Next Steps

1. Get the correct connection string from MongoDB Atlas
2. Update `backend/.env` with the correct `MONGODB_URI`
3. Run `npm run db:test --prefix backend` to verify connection
4. Run `npm run db:init --prefix backend` to create admin user
5. Start the backend server: `npm run dev --prefix backend`
6. Access admin dashboard: http://localhost:3000/admin

## Need Help?

If you continue to have issues:
1. Share a screenshot of your MongoDB Atlas cluster page
2. Verify the cluster is running (not paused)
3. Check the "Connect" button in Atlas for the exact connection string
