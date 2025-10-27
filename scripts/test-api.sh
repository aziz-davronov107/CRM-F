#!/bin/bash

# BRANCHES API Integration Test Script
# Bu script API ning ishlashini tekshiradi

echo "🧪 Testing Branches API Integration..."
echo "=================================="

# API Base URL
API_URL="http://localhost:5000"

echo ""
echo "1️⃣  Testing Centers API..."
echo "GET $API_URL/centers"

# Test centers endpoint
curl -X GET "$API_URL/centers" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "2️⃣  Testing Branches API..."
echo "GET $API_URL/branches"

# Test branches endpoint
curl -X GET "$API_URL/branches" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "3️⃣  Testing Branch Creation..."
echo "POST $API_URL/branches"

# Test create branch
curl -X POST "$API_URL/branches" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Frontend Integration",
    "region": "Toshkent",
    "district": "Chilonzor", 
    "address": "Test address for frontend",
    "phone": "+998901234567",
    "status": "ACTIVE",
    "center_id": 1
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "4️⃣  Testing Branch with Filters..."
echo "GET $API_URL/branches?region=Toshkent&status=ACTIVE"

# Test with filters
curl -X GET "$API_URL/branches?region=Toshkent&status=ACTIVE" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "5️⃣  Testing Branch by ID..."
echo "GET $API_URL/branches/1"

# Test get by ID
curl -X GET "$API_URL/branches/1" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "✅ API Tests Completed!"
echo ""
echo "📋 Frontend Integration Checklist:"
echo "[ ] API server running on localhost:5000"
echo "[ ] GET /centers returns centers list"
echo "[ ] GET /branches returns branches list"
echo "[ ] POST /branches creates new branch"
echo "[ ] Frontend forms show centers dropdown"
echo "[ ] Filters work with center_id parameter"
echo ""
echo "🚀 Ready for Frontend Testing!"