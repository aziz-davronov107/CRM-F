#!/bin/bash

echo "🔍 API Server Connection Test"
echo "=============================="

# Test API server connection
API_URL="http://localhost:5000"

echo ""
echo "1. Testing server connection..."
curl -I $API_URL --connect-timeout 5 2>/dev/null | head -1

echo ""
echo "2. Testing /branches endpoint..."
curl -X GET "$API_URL/branches" \
  -H "Content-Type: application/json" \
  --connect-timeout 10 \
  -v 2>&1 | head -20

echo ""
echo "3. Testing /centers endpoint..."
curl -X GET "$API_URL/centers" \
  -H "Content-Type: application/json" \
  --connect-timeout 10 \
  -v 2>&1 | head -20

echo ""
echo "4. Alternative test with PowerShell..."
echo "   Run this in PowerShell:"
echo "   Invoke-RestMethod -Uri 'http://localhost:5000/branches' -Method Get"
echo ""
echo "5. Browser test:"
echo "   Open: http://localhost:5000/branches"
echo "   Open: http://localhost:5000/centers"