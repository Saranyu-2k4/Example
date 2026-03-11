# API Documentation - Findora

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "student",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "identifier": "johndoe",
  "password": "password123"
}
```

### Verify Email
**POST** `/auth/verify-email` (Protected)

**Body:**
```json
{
  "otp": "123456"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## Items Endpoints

### Create Item
**POST** `/items` (Protected)

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
- type: "lost" or "found"
- category: "NIC", "Student ID", "Bank Card", "Wallet", "Other"
- item_name: string
- description: string (optional)
- location: string
- date: YYYY-MM-DD
- time: HH:MM
- image: file (optional)

### Get All Items
**GET** `/items?type=lost&category=Wallet&search=black` (Protected)

**Query Parameters:**
- type: "lost" or "found"
- category: string
- status: "active", "claimed", "closed"
- search: string
- date: YYYY-MM-DD
- limit: number

### Get Single Item
**GET** `/items/:id` (Protected)

### Get My Items
**GET** `/items/my/items` (Protected)

### Update Item Status
**PUT** `/items/:id/status` (Protected)

**Body:**
```json
{
  "status": "claimed"
}
```

### Delete Item
**DELETE** `/items/:id` (Protected)

---

## Claims Endpoints

### Create Claim
**POST** `/claims` (Protected)

**Body:**
```json
{
  "item_id": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim created successfully. OTP sent to your email.",
  "claimId": 10
}
```

### Get My Claims
**GET** `/claims/my` (Protected)

### Get Claim Details
**GET** `/claims/:id` (Protected)

### Get Pending Claims
**GET** `/claims/pending` (Protected - Security/Admin)

---

## Security Endpoints

### Verify Claim
**POST** `/security/verify-claim` (Protected - Security/Admin)

**Body:**
```json
{
  "claim_id": 10,
  "otp": "123456"
}
```

### Receive Item
**POST** `/security/receive-item` (Protected - Security/Admin)

**Body:**
```json
{
  "item_id": 5,
  "received_from": "John Doe",
  "notes": "Item in good condition"
}
```

### Get Transactions
**GET** `/security/transactions?type=receive&date=2024-01-01` (Protected - Security/Admin)

### Get Security Stats
**GET** `/security/stats` (Protected - Security/Admin)

---

## Admin Endpoints

### Get All Users
**GET** `/admin/users?role=student` (Protected - Admin)

### Get Pending Approvals
**GET** `/admin/pending-approvals?role=security` (Protected - Admin)

### Approve User
**PUT** `/admin/approve-user/:id` (Protected - Admin)

### Ban/Unban User
**PUT** `/admin/ban-user/:id` (Protected - Admin)

**Body:**
```json
{
  "banned": true
}
```

### Suspend/Unsuspend User
**PUT** `/admin/suspend-user/:id` (Protected - Admin)

**Body:**
```json
{
  "suspended": true
}
```

### Get Reports
**GET** `/admin/reports?status=pending` (Protected - Admin)

### Handle Report
**PUT** `/admin/reports/:id` (Protected - Admin)

**Body:**
```json
{
  "status": "resolved",
  "admin_notes": "Issue resolved",
  "action": "delete_item"
}
```

**Actions:**
- "delete_item" - Delete the reported item
- "ban_user" - Ban the item owner
- null - No action

### Get Dashboard Stats
**GET** `/admin/stats` (Protected - Admin)

---

## Notifications Endpoints

### Get Notifications
**GET** `/notifications` (Protected)

### Get Unread Count
**GET** `/notifications/unread-count` (Protected)

### Mark as Read
**PUT** `/notifications/:id/read` (Protected)

### Mark All as Read
**PUT** `/notifications/read-all` (Protected)

### Delete Notification
**DELETE** `/notifications/:id` (Protected)

---

## Reports Endpoints

### Create Report
**POST** `/reports` (Protected)

**Body:**
```json
{
  "item_id": 5,
  "reason": "This item is inappropriate"
}
```

### Get My Reports
**GET** `/reports/my` (Protected)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Item not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details"
}
```

---

## Rate Limiting
Currently not implemented. Consider adding rate limiting in production.

## Pagination
Currently returns all results. Consider adding pagination for large datasets:
```
GET /items?page=1&limit=10
```

## Websockets
Not implemented. For real-time notifications, consider adding Socket.io.
