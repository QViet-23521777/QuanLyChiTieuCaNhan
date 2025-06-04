#!/bin/bash
# Test Firebase Services với cURL

BASE_URL="http://localhost:3000"

echo "🔥 Testing Firebase Services Backend"
echo "=================================="

# 1. Test Health Check
echo "1. Testing Health Endpoint..."
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 2. Test Create User
echo "2. Testing Create User..."
curl -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "user123",
    "name": "Nguyen Van Test",
    "email": "test@example.com",
    "familyId": null,
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "phone": "0123456789"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 3. Test Get User
echo "3. Testing Get User..."
curl -X GET "$BASE_URL/api/users/user123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 4. Test Get All Users
echo "4. Testing Get All Users..."
curl -X GET "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 5. Test Create Family
echo "5. Testing Create Family..."
curl -X POST "$BASE_URL/api/families" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "family123",
    "name": "Gia dinh Test",
    "adminId": "user123",
    "membersId": ["user123"],
    "address": "123 Test Street, HCMC",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 6. Test Create Account
echo "6. Testing Create Account..."
curl -X POST "$BASE_URL/api/accounts" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "account123",
    "name": "Tai khoan tiet kiem",
    "type": "saving",
    "balance": 1000000,
    "initialBalance": 500000,
    "currency": "VND",
    "userId": "user123",
    "familyId": "family123",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 7. Test Create Category
echo "7. Testing Create Category..."
curl -X POST "$BASE_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "category123",
    "name": "An uong",
    "type": "expense",
    "familyId": "family123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 8. Test Create Transaction
echo "8. Testing Create Transaction..."
curl -X POST "$BASE_URL/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "transaction123",
    "type": "expense",
    "amount": 50000,
    "decription": "An trua tai nha hang",
    "categoryId": "category123",
    "accountId": "account123",
    "date": "2024-01-01T12:00:00.000Z",
    "userId": "user123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 9. Test Get Transactions by Family
echo "9. Testing Get Family Transactions..."
curl -X GET "$BASE_URL/api/transactions/family/family123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

# 10. Test Update User
echo "10. Testing Update User..."
curl -X PUT "$BASE_URL/api/users/user123" \
  -H "Content-Type: application/json" \
  -d '{
    "Id": "user123",
    "name": "Nguyen Van Updated",
    "email": "updated@example.com",
    "familyId": "family123",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "phone": "0987654321"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""

echo "✅ All tests completed!"
echo "=================================="

# Bonus: Test all endpoints availability
echo ""
echo "🔍 Testing endpoint availability..."
endpoints=(
  "/health"
  "/api/users"
  "/api/families"
  "/api/accounts"
  "/api/categories"
  "/api/transactions"
  "/api/albums"
  "/api/photos"
  "/api/chatrooms"
  "/api/messages"
  "/api/social-posts"
  "/api/reviews"
)

for endpoint in "${endpoints[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
  if [ "$status" -eq 200 ] || [ "$status" -eq 201 ]; then
    echo "✅ $endpoint - OK ($status)"
  else
    echo "❌ $endpoint - Failed ($status)"
  fi
done