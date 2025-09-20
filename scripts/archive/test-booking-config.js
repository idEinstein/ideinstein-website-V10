#!/usr/bin/env node
/**
 * Test Booking Configuration
 * Checks if all booking-related environment variables are properly set
 */

require("dotenv").config({ path: ".env.production" });

console.log("🔍 Testing Booking Configuration\n");

// Check booking-specific environment variables
const bookingVars = {
  BOOKINGS_SERVICE_ID: process.env.BOOKINGS_SERVICE_ID,
  BOOKINGS_STAFF_ID: process.env.BOOKINGS_STAFF_ID,
  BOOKINGS_WORKSPACE_ID: process.env.BOOKINGS_WORKSPACE_ID,
  BOOKINGS_TIME_ZONE: process.env.BOOKINGS_TIME_ZONE,
  ZOHO_BOOKINGS_REFRESH_TOKEN: process.env.ZOHO_BOOKINGS_REFRESH_TOKEN,
};

console.log("📋 Booking Environment Variables:");
Object.entries(bookingVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: MISSING`);
  }
});

// Test the booking availability API with detailed logging
async function testBookingAPI() {
  console.log("\n📅 Testing Booking Availability API...");

  try {
    const testDate = "2025-09-23"; // Monday
    const url = `https://ideinstein.com/api/bookings/availability?date=${testDate}`;

    console.log(`📡 Calling: ${url}`);

    const response = await fetch(url);
    console.log(`📥 Response: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("📊 Response Data:", JSON.stringify(data, null, 2));

      if (data.source === "fallback") {
        console.log("\n⚠️  ISSUE: Still using fallback slots");
        console.log("   Possible causes:");
        console.log("   1. Zoho Bookings API is returning empty results");
        console.log(
          "   2. BOOKINGS_SERVICE_ID or BOOKINGS_STAFF_ID is incorrect"
        );
        console.log("   3. Date format or timezone issues");
        console.log("   4. Zoho Bookings API response format changed");

        if (data.warning) {
          console.log(`   Warning: ${data.warning}`);
        }
      } else if (data.source === "zoho") {
        console.log("\n✅ SUCCESS: Getting actual Zoho slots");
        console.log(`   Found ${data.slots.length} available slots`);
      }
    } else {
      const errorText = await response.text();
      console.log("❌ API Error:", errorText);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function testZohoBookingsToken() {
  console.log("\n🔑 Testing Zoho Bookings Token...");

  try {
    // Test the debug endpoint for bookings specifically
    const response = await fetch(
      "https://ideinstein.com/api/debug/zoho-tokens?service=bookings",
      {
        headers: {
          Authorization: "Bearer Aradhana@2014#",
        },
      }
    );

    console.log(`📥 Token Test: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("🔑 Token Result:", {
        success: data.success,
        tokenObtained: data.tokenObtained,
        duration: data.duration,
        environment: data.environment,
      });
    } else {
      const errorText = await response.text();
      console.log("❌ Token Error:", errorText);
    }
  } catch (error) {
    console.error("❌ Token test failed:", error.message);
  }
}

async function main() {
  await testZohoBookingsToken();
  await testBookingAPI();

  console.log("\n🔧 Troubleshooting Steps:");
  console.log("1. Verify all booking environment variables are set in Vercel");
  console.log("2. Check Vercel function logs for detailed error messages");
  console.log("3. Test with different dates (weekdays only)");
  console.log("4. Verify Zoho Bookings service configuration");

  console.log("\n📋 Required Vercel Environment Variables:");
  Object.entries(bookingVars).forEach(([key, value]) => {
    if (value) {
      console.log(`${key}=${value}`);
    } else {
      console.log(`${key}=MISSING - ADD THIS TO VERCEL`);
    }
  });
}

main().catch(console.error);
