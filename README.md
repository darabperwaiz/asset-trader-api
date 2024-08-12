#### `README.md`
```markdown
# Asset Trading Tracker API

## Project Setup

1. Clone the repository.
2. Install dependencies.
3. Set up your `.env` file with the following:

JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri

4. Run the server:
   npm start

Install devDependencies for test the endpoints

#### npm i --save-d @babel/preset-env jest supertest
5. Run tests:
   npm test


## API Endpoints

### Auth
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login an existing user

### Assets
- `POST /assets` - Create a new asset
- `POST /assets/:id` - Update an asset
- `PUT /assets/:id/publish` - List an asset on the marketplace
- `GET /assets/:id` - Get asset details
- `GET /user/:id/assets` - Get user's assets

### Marketplace
- `GET /marketplace/assets` - Get assets available on the marketplace
- `POST /assets/:id/request` - Request to buy an asset
- `PUT /requests/:id/negotiate` - Negotiate a purchase request
- `PUT /request/:id/accept` - Accept a purchase request
- `PUT /requests/:id/deny` - Deny a purchase request
- `GET /users/:id/requests` - Get user's purchase requests



## Authentication
All routes that require authentication use Bearer tokens in the `Authorization` header.

Example: Authorization: Bearer <token>


