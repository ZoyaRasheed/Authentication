# Register a new user
curl -X POST http://localhost:3000/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "emailAddress": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "password": "securePassword123",
    "consent": true,
    "lat": 37.7749,
    "long": -122.4194
  }'

# Confirm account
curl -X GET "http://localhost:3000/v1/confirmation/YOUR_TOKEN/?code=YOUR_CODE"

# Login
curl -X POST http://localhost:3000/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "john.doe@example.com",
    "password": "securePassword123"
  }'

# Logout (requires authentication token)
curl -X GET http://localhost:3000/v1/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Self-identification (get user profile, requires authentication)
curl -X GET http://localhost:3000/v1/self-identification \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Forgot password
curl -X POST http://localhost:3000/v1/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "john.doe@example.com"
  }'

# Reset password
curl -X POST http://localhost:3000/v1/reset-password/YOUR_RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "newSecurePassword123"
  }'

# Change password (requires authentication)
curl -X POST http://localhost:3000/v1/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "oldPassword": "securePassword123",
    "newPassword": "newSecurePassword123"
  }'