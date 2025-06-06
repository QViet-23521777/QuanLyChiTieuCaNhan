#!/bin/bash

# Account API Test Commands - Kiểm tra Account CRUD operations
# File test cho Account API với interface Account

BASE_URL="http://localhost:3000/api/accounts"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRQM1owS0Fic1o1aEY2WXl3NExlIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlcy5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDkxMTE5NTgsImV4cCI6MTc0OTE5ODM1OH0.P8bNjmAyfOPqbaP_xw0s6zt47avTkJQlZgxnx4pJgyU"
ADMIN_ID="tP3Z0KAbsZ5hF6Yyw4Le"  # ID từ token - role admin
USER_ID="bkc2IRwmlpAbYQoZi9MJ"   # User ID để test
FAMILY_ID="MeILKsA8ebOjnLr5F3Ye" # Family ID để test
ACCOUNT_ID=""  # Sẽ được set sau khi tạo account

echo "🚀 Bắt đầu test Account API..."
echo "Token role: admin, Admin ID: $ADMIN_ID"
echo "User ID: $USER_ID, Family ID: $FAMILY_ID"
echo "=================================="

# 1. TEST POST - Tạo Account mới
echo "📝 Test 1: Tạo Account mới..."
RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tài khoản tiền mặt",
    "type": "cash",
    "balance": 1000000,
    "initialBalance": 1000000,
    "currency": "VND",
    "userId": "'"$USER_ID"'",
    "familyId": "'"$FAMILY_ID"'",
    "isActive": true
  }' \
  -w "\nHTTP Status: %{http_code}")

echo "$RESPONSE"
# Extract account ID from response if successful
ACCOUNT_ID=$(echo "$RESPONSE" | grep -o '"Id":"[^"]*"' | cut -d'"' -f4 | head -1)
if [ ! -z "$ACCOUNT_ID" ]; then
  echo "✅ Account created with ID: $ACCOUNT_ID"
else
  ACCOUNT_ID="test_account_123"  # Fallback ID for testing
  echo "⚠️ Using fallback Account ID: $ACCOUNT_ID"
fi

echo "=================================="

# 2. TEST GET - Lấy Account theo ID
echo "📋 Test 2: Lấy thông tin Account theo ID..."
curl -X GET "$BASE_URL/$ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 3. TEST GET - Lấy Account theo User ID
echo "👤 Test 3: Lấy Account theo User ID..."
curl -X GET "$BASE_URL/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 4. TEST GET - Lấy Account theo Family ID
echo "👨‍👩‍👧‍👦 Test 4: Lấy Account theo Family ID..."
curl -X GET "$BASE_URL/family/$FAMILY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 5. TEST GET - Lấy field cụ thể của Account
echo "🔍 Test 5a: Lấy tên Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/name" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "💰 Test 5b: Lấy balance của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/balance" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "🏦 Test 5c: Lấy type của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/type" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "💱 Test 5d: Lấy currency của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/currency" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "✅ Test 5e: Lấy isActive của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/isActive" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "👤 Test 5f: Lấy userId của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/userId" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "👨‍👩‍👧‍👦 Test 5g: Lấy familyId của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/familyId" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "💰 Test 5h: Lấy initialBalance của Account..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/initialBalance" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 6. TEST PUT - Cập nhật Account
echo "✏️ Test 6: Cập nhật thông tin Account..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tài khoản tiền mặt - Updated",
    "type": "bank",
    "currency": "USD"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 7. TEST PUT - Cập nhật số dư Account
echo "💰 Test 7a: Cập nhật số dư - Thêm tiền..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 500000,
    "operation": "add"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "💰 Test 7b: Cập nhật số dư - Trừ tiền..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 200000,
    "operation": "subtract"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "💰 Test 7c: Cập nhật số dư - Set số dư mới..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 2000000,
    "operation": "set"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 8. TEST PUT - Vô hiệu hóa Account
echo "⏸️ Test 8: Vô hiệu hóa Account..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/deactivate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 9. TEST PUT - Kích hoạt lại Account
echo "▶️ Test 9: Kích hoạt lại Account..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/activate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 10. TEST VALIDATION - Kiểm tra validation
echo "⚠️ Test 10: Kiểm tra validation..."

echo "Test 10a: Thiếu tên Account..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "cash",
    "balance": 100000,
    "userId": "'"$USER_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 10b: Thiếu type Account..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Account",
    "balance": 100000,
    "userId": "'"$USER_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 10c: Type không hợp lệ..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Account",
    "type": "invalid_type",
    "balance": 100000,
    "userId": "'"$USER_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 10d: Thiếu userId và familyId..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Account",
    "type": "cash",
    "balance": 100000
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 10e: Operation không hợp lệ cho balance..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 100000,
    "operation": "invalid_operation"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 10f: Thiếu amount cho balance update..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "operation": "add"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 11. TEST BALANCE VALIDATION
echo "💰 Test 11: Kiểm tra validation số dư..."

echo "Test 11a: Số dư âm cho tài khoản cash (sẽ fail)..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": -1000000,
    "operation": "set"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

# Tạo credit account để test số dư âm
echo "Test 11b: Tạo credit account để test số dư âm..."
CREDIT_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Thẻ tín dụng",
    "type": "credit",
    "balance": 0,
    "initialBalance": 0,
    "currency": "VND",
    "userId": "'"$USER_ID"'",
    "isActive": true
  }' \
  -w "\nHTTP Status: %{http_code}")

echo "$CREDIT_RESPONSE"

CREDIT_ACCOUNT_ID=$(echo "$CREDIT_RESPONSE" | grep -o '"Id":"[^"]*"' | cut -d'"' -f4 | head -1)
if [ ! -z "$CREDIT_ACCOUNT_ID" ]; then
  echo "✅ Credit account created with ID: $CREDIT_ACCOUNT_ID"
  
  echo "Test 11c: Số dư âm cho credit account (sẽ thành công)..."
  curl -X PUT "$BASE_URL/$CREDIT_ACCOUNT_ID/balance" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "amount": -500000,
      "operation": "set"
    }' \
    -w "\nHTTP Status: %{http_code}\n\n"
fi

echo "=================================="

# 12. TEST AUTHORIZATION - Kiểm tra quyền truy cập
echo "🔒 Test 12: Kiểm tra quyền truy cập..."

echo "Test 12a: Truy cập không có token..."
curl -X GET "$BASE_URL/$ACCOUNT_ID" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 12b: Truy cập với token không hợp lệ..."
curl -X GET "$BASE_URL/$ACCOUNT_ID" \
  -H "Authorization: Bearer invalid_token" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 13. TEST FIELD VALIDATION - Kiểm tra field không hợp lệ
echo "🔍 Test 13: Kiểm tra field không hợp lệ..."
curl -X GET "$BASE_URL/$ACCOUNT_ID/field/invalid_field" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 14. TEST EDGE CASES
echo "🧪 Test 14: Edge cases..."

echo "Test 14a: Account ID không tồn tại..."
curl -X GET "$BASE_URL/non_existent_account_id" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 14b: User ID không tồn tại..."
curl -X GET "$BASE_URL/user/non_existent_user_id" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 14c: Family ID không tồn tại..."
curl -X GET "$BASE_URL/family/non_existent_family_id" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 14d: Cập nhật account không tồn tại..."
curl -X PUT "$BASE_URL/non_existent_account_id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Name"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 14e: Vô hiệu hóa account đã vô hiệu hóa..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/deactivate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

curl -X PUT "$BASE_URL/$ACCOUNT_ID/deactivate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 14f: Kích hoạt account đã kích hoạt..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/activate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

curl -X PUT "$BASE_URL/$ACCOUNT_ID/activate" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 15. TEST DELETE SCENARIOS
echo "🗑️ Test 15: Kiểm tra xóa account..."

echo "Test 15a: Xóa account có số dư (sẽ fail)..."
curl -X DELETE "$BASE_URL/$ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 15b: Set số dư về 0 và xóa account..."
curl -X PUT "$BASE_URL/$ACCOUNT_ID/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 0,
    "operation": "set"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "Xóa account sau khi set số dư về 0..."
curl -X DELETE "$BASE_URL/$ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 15c: Xóa account không tồn tại..."
curl -X DELETE "$BASE_URL/non_existent_account_id" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="

# 16. TEST MULTIPLE ACCOUNT TYPES
echo "🏦 Test 16: Tạo nhiều loại tài khoản..."

echo "Test 16a: Tạo bank account..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tài khoản ngân hàng",
    "type": "bank",
    "balance": 5000000,
    "initialBalance": 5000000,
    "currency": "VND",
    "userId": "'"$USER_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 16b: Tạo saving account..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tài khoản tiết kiệm",
    "type": "saving",
    "balance": 10000000,
    "initialBalance": 10000000,
    "currency": "VND",
    "familyId": "'"$FAMILY_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "----------------------------------"

echo "Test 16c: Tạo others account..."
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Ví điện tử",
    "type": "others",
    "balance": 1000000,
    "initialBalance": 1000000,
    "currency": "VND",
    "userId": "'"$USER_ID"'"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=================================="
echo "✅ Hoàn thành tất cả test cases cho Account API!"
echo ""
echo "📊 Giải thích kết quả dự kiến:"
echo "  ✅ 200: Thành công (GET account, GET fields, PUT account, PUT balance, PUT activate/deactivate)"
echo "  ✅ 201: Tạo thành công (POST account)"
echo "  ❌ 400: Validation error (invalid data, missing fields, negative balance for non-credit)"
echo "  ❌ 401: Unauthorized (no token, invalid token)"
echo "  ❌ 404: Not found (invalid field, non-existent account/user/family)"
echo "  ❌ 500: Server error"
echo ""
echo "🔍 Lưu ý về Account API:"
echo "  - Account types: cash, bank, credit, saving, others"
echo "  - Balance operations: add, subtract, set"
echo "  - Credit accounts có thể có số dư âm"
echo "  - Không thể xóa account có số dư khác 0"
echo "  - Account phải thuộc về userId hoặc familyId"
echo ""
echo "💳 Interface Account fields:"
echo "  - Id: string (auto-generated)"
echo "  - name: string (required)"
echo "  - type: 'cash' | 'bank' | 'credit' | 'saving' | 'others' (required)"
echo "  - balance: number (default: 0)"
echo "  - initialBalance: number"
echo "  - currency: string (default: 'VND')"
echo "  - userId: string (required if no familyId)"
echo "  - familyId: string (required if no userId)"
echo "  - isActive: boolean (default: true)"
echo "  - createdAt: Timestamp | Date (auto-generated)"
echo "  - updatedAt: Timestamp | Date (auto-generated)"
echo ""
echo "📋 Test order được sắp xếp theo:"
echo "  1. Basic CRUD operations"
echo "  2. Field-specific operations"
echo "  3. Balance management"
echo "  4. Account activation/deactivation"
echo "  5. Validation tests"
echo "  6. Authorization tests"
echo "  7. Edge cases và delete scenarios"
echo "  8. Multiple account types"