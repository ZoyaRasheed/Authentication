#!/bin/bash

# Authentication API Test Suite
# This script tests all endpoints of the authentication API

# Configuration
API_BASE_URL="http://localhost:4000/v1"
EMAIL="test.user@example.com"
PASSWORD="TestPassword123!"
NAME="Test User"
PHONE_NUMBER="1234567890"
LAT="37.7749"
LONG="-122.4194"

# Text formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Store tokens and session data
ACCESS_TOKEN=""
CONFIRMATION_TOKEN=""
CONFIRMATION_CODE=""
RESET_TOKEN=""

# Helper function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS:${NC} $2"
  else
    echo -e "${RED}✗ FAIL:${NC} $2"
    echo "Response: $3"
  fi
}

# Helper function to extract values from JSON response
extract_json_value() {
  echo $1 | grep -o "\"$2\":\"[^\"]*\"" | sed "s/\"$2\":\"//g" | sed "s/\"//g"
}

echo -e "${YELLOW}Starting Authentication API Tests${NC}"
echo "Base URL: $API_BASE_URL"
echo "-------------------------------------"

# 1. Test Register Endpoint
echo -e "\n${YELLOW}[1/10] Testing Registration${NC}"
REGISTER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"emailAddress\": \"$EMAIL\",
    \"phoneNumber\": \"$PHONE_NUMBER\",
    \"password\": \"$PASSWORD\",
    \"consent\": true,
    \"lat\": $LAT,
    \"long\": $LONG
  }")

if [ "$REGISTER_RESPONSE" -eq 200 ] || [ "$REGISTER_RESPONSE" -eq 201 ]; then
  print_result 0 "Registration successful"
  
  # Here we would ideally extract confirmation token and code
  # This would normally come from checking the email or database directly
  # For testing purposes, you might need to manually check for these values
  echo -e "${YELLOW}Note: For testing, manually check the database or logs for confirmation token and code${NC}"
  echo -e "Enter confirmation token (from email/database):"
  read CONFIRMATION_TOKEN
  echo -e "Enter confirmation code (from email/database):"
  read CONFIRMATION_CODE
else
  print_result 1 "Registration failed" $REGISTER_RESPONSE
  # If the user already exists, we continue with the test
  echo -e "${YELLOW}Proceeding with tests assuming user already exists${NC}"
fi

# 2. Test Account Confirmation
if [ ! -z "$CONFIRMATION_TOKEN" ] && [ ! -z "$CONFIRMATION_CODE" ]; then
  echo -e "\n${YELLOW}[2/8] Testing Account Confirmation${NC}"
  CONFIRM_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE_URL/confirmation/$CONFIRMATION_TOKEN/?code=$CONFIRMATION_CODE")
  
  if [ "$CONFIRM_RESPONSE" -eq 200 ]; then
    print_result 0 "Account confirmation successful"
  else
    print_result 1 "Account confirmation failed" $CONFIRM_RESPONSE
    echo -e "${YELLOW}Proceeding with tests assuming account is already confirmed${NC}"
  fi
else
  echo -e "\n${YELLOW}[2/10] Skipping Account Confirmation - no token/code available${NC}"
fi

# 3. Test Login
echo -e "\n${YELLOW}[3/10] Testing Login${NC}"
LOGIN_OUTPUT=$(curl -s -X POST "$API_BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"emailAddress\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

LOGIN_STATUS=$?
if [ $LOGIN_STATUS -eq 0 ] && [ $(echo $LOGIN_OUTPUT | grep -c "accessToken") -gt 0 ]; then
  print_result 0 "Login successful"
  # Extract the access token
  ACCESS_TOKEN=$(extract_json_value "$LOGIN_OUTPUT" "accessToken")
  echo -e "${YELLOW}Access Token: ${NC}$ACCESS_TOKEN"
else
  print_result 1 "Login failed" "$LOGIN_OUTPUT"
  echo -e "${YELLOW}Cannot proceed with authenticated tests. Will continue with health checks.${NC}"
  # Set a flag to skip authenticated tests
  SKIP_AUTH_TESTS=1
fi

# 4. Test Self-identification (requires auth)
if [ ! -z "$ACCESS_TOKEN" ] && [ -z "$SKIP_AUTH_TESTS" ]; then
  echo -e "\n${YELLOW}[4/10] Testing Self-identification${NC}"
  SELF_ID_RESPONSE=$(curl -s -w "%{http_code}" -X GET "$API_BASE_URL/self-identification" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  
  SELF_ID_STATUS=${SELF_ID_RESPONSE: -3}
  SELF_ID_CONTENT=${SELF_ID_RESPONSE:0:${#SELF_ID_RESPONSE}-3}
  
  if [ "$SELF_ID_STATUS" -eq 200 ]; then
    print_result 0 "Self-identification successful"
    echo "User profile: $SELF_ID_CONTENT"
  else
    print_result 1 "Self-identification failed" "$SELF_ID_STATUS: $SELF_ID_CONTENT"
  fi
else
  echo -e "\n${YELLOW}[4/8] Skipping Self-identification - no access token${NC}"
fi

# 5. Test Forgot Password
if [ -z "$SKIP_AUTH_TESTS" ]; then
  echo -e "\n${YELLOW}[5/10] Testing Forgot Password${NC}"
  FORGOT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE_URL/forgot-password" \
    -H "Content-Type: application/json" \
    -d "{
      \"emailAddress\": \"$EMAIL\"
    }")

  if [ "$FORGOT_RESPONSE" -eq 200 ]; then
    print_result 0 "Forgot password request successful"
    # Here we would ideally extract reset token
    # This would normally come from checking the email or database directly
    echo -e "${YELLOW}Note: For testing, manually check the database or logs for reset token${NC}"
    echo -e "Enter reset token (from email/database):"
    read RESET_TOKEN
  else
    print_result 1 "Forgot password request failed" $FORGOT_RESPONSE
  fi
else
  echo -e "\n${YELLOW}[5/10] Skipping Forgot Password - authentication failed${NC}"
fi

# 6. Test Reset Password (if we have a token)
if [ ! -z "$RESET_TOKEN" ] && [ -z "$SKIP_AUTH_TESTS" ]; then
  echo -e "\n${YELLOW}[6/10] Testing Reset Password${NC}"
  RESET_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE_URL/reset-password/$RESET_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"newPassword\": \"${PASSWORD}Updated!\"
    }")
  
  if [ "$RESET_RESPONSE" -eq 200 ]; then
    print_result 0 "Password reset successful"
    # Update the password variable for future tests
    PASSWORD="${PASSWORD}Updated!"
  else
    print_result 1 "Password reset failed" $RESET_RESPONSE
  fi
else
  echo -e "\n${YELLOW}[6/8] Skipping Reset Password - no reset token available${NC}"
fi

# 7. Test Change Password (requires auth)
if [ ! -z "$ACCESS_TOKEN" ] && [ -z "$SKIP_AUTH_TESTS" ]; then
  echo -e "\n${YELLOW}[7/10] Testing Change Password${NC}"
  CHANGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE_URL/change-password" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "{
      \"oldPassword\": \"$PASSWORD\",
      \"newPassword\": \"$PASSWORD\"
    }")
  
  if [ "$CHANGE_RESPONSE" -eq 200 ]; then
    print_result 0 "Password change successful"
  else
    print_result 1 "Password change failed" $CHANGE_RESPONSE
  fi
else
  echo -e "\n${YELLOW}[7/8] Skipping Change Password - no access token${NC}"
fi

# 8. Test Logout (requires auth)
if [ ! -z "$ACCESS_TOKEN" ] && [ -z "$SKIP_AUTH_TESTS" ]; then
  echo -e "\n${YELLOW}[8/10] Testing Logout${NC}"
  LOGOUT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE_URL/logout" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  
  if [ "$LOGOUT_RESPONSE" -eq 200 ]; then
    print_result 0 "Logout successful"
  else
    print_result 1 "Logout failed" $LOGOUT_RESPONSE
  fi
else
  echo -e "\n${YELLOW}[8/8] Skipping Logout - no access token${NC}"
fi

# 9. Test Health Endpoint
echo -e "\n${YELLOW}[9/10] Testing Health Endpoint${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE_URL/health")

HEALTH_STATUS=${HEALTH_RESPONSE##*
\n'}
HEALTH_CONTENT=${HEALTH_RESPONSE%
\n'*}

if [ "$HEALTH_STATUS" -eq 200 ]; then
  print_result 0 "Health check successful"
  echo "Health response: $HEALTH_CONTENT"
else
  print_result 1 "Health check failed" "$HEALTH_STATUS: $HEALTH_CONTENT"
fi

# 10. Test Self Endpoint
echo -e "\n${YELLOW}[10/10] Testing Self Endpoint${NC}"
SELF_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE_URL/self")

SELF_STATUS=${SELF_RESPONSE##*
\n'}
SELF_CONTENT=${SELF_RESPONSE%
\n'*}

if [ "$SELF_STATUS" -eq 200 ]; then
  print_result 0 "Self check successful"
  echo "Self response: $SELF_CONTENT"
else
  print_result 1 "Self check failed" "$SELF_STATUS: $SELF_CONTENT"
fi

# Summary
echo -e "\n${YELLOW}Test Summary${NC}"
echo "-------------------------------------"
echo "Tests completed. Check the results above for any failures."
echo "If any tests failed, check your API logs for more details."