
// Mock data generation functions for Smart Load Optimizer

import { format, subDays, subHours, addHours } from "date-fns";

// Random number generator with min/max range
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate a random date within the past days
const randomRecentDate = (days: number) => {
  const date = subDays(new Date(), randomNumber(0, days));
  return format(date, "MMM d, yyyy");
};

// Generate a random time within the day
const randomTime = () => {
  const hours = randomNumber(0, 23);
  const minutes = randomNumber(0, 59);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Device types
const deviceTypes = [
  "Refrigerator",
  "Television",
  "Washing Machine",
  "Air Conditioner",
  "Computer",
  "Microwave",
  "Dishwasher",
  "Water Heater",
  "Coffee Maker",
  "Oven",
  "Vacuum Cleaner",
  "Lighting",
  "Game Console",
  "Router",
  "Printer",
];

// Device locations
const deviceLocations = [
  "Kitchen",
  "Living Room",
  "Bedroom",
  "Bathroom",
  "Office",
  "Basement",
  "Garage",
  "Dining Room",
  "Laundry Room",
];

// Calculate priority based on power consumption
const calculatePriority = (
  powerConsumption: number
): "low" | "medium" | "high" => {
  if (powerConsumption < 50) return "low";
  if (powerConsumption < 200) return "medium";
  return "high";
};

// Generate mock device data
export const generateMockDeviceData = (count: number) => {
  const devices = [];

  for (let i = 0; i < count; i++) {
    const powerConsumption = randomNumber(10, 500);
    const status = Math.random() > 0.3 ? "active" : "inactive";
    const lastActiveDate = randomRecentDate(7);
    const lastActiveTime = randomTime();
    const lastActive = `${lastActiveDate} ${lastActiveTime}`;

    devices.push({
      id: `device-${i + 1}`,
      name: `${deviceTypes[randomNumber(0, deviceTypes.length - 1)]} ${i + 1}`,
      type: deviceTypes[randomNumber(0, deviceTypes.length - 1)],
      status,
      powerConsumption,
      priority: calculatePriority(powerConsumption),
      lastActive,
      location: deviceLocations[randomNumber(0, deviceLocations.length - 1)],
    });
  }

  return devices;
};

// Generate mock consumption data for a given number of days
export const generateMockConsumptionData = (days: number) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const kWh = randomNumber(50, 200) / 10;
    const cost = kWh * 0.15; // Assuming $0.15 per kWh

    data.push({
      date: format(date, "MMM d"),
      kWh,
      cost,
    });
  }

  return data;
};

// Generate hourly usage data
export const generateHourlyData = () => {
  const data = [];
  const baseHour = new Date();
  baseHour.setMinutes(0, 0, 0);

  for (let i = 0; i < 24; i++) {
    const hour = addHours(baseHour, i);
    const hourLabel = format(hour, "haaa");
    
    let usage = 0;
    // Create a realistic usage pattern with peaks in morning and evening
    if (i >= 6 && i <= 9) {
      // Morning peak
      usage = randomNumber(50, 80);
    } else if (i >= 17 && i <= 22) {
      // Evening peak
      usage = randomNumber(70, 100);
    } else {
      // Lower usage during other hours
      usage = randomNumber(20, 40);
    }

    data.push({
      hour: hourLabel,
      usage,
    });
  }

  return data;
};

// Generate mock user data for admin view
export const generateMockUserData = (count: number) => {
  const users = [];
  const statuses = ["active", "inactive"];

  for (let i = 0; i < count; i++) {
    const firstName = [
      "John", "Jane", "Michael", "Sarah", "David", "Emily", 
      "Robert", "Lisa", "James", "Jessica", "Daniel", "Jennifer",
      "Matthew", "Laura", "Andrew", "Michelle", "Thomas", "Elizabeth"
    ][randomNumber(0, 17)];
    
    const lastName = [
      "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", 
      "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas",
      "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia"
    ][randomNumber(0, 17)];
    
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const devices = randomNumber(1, 10);
    const status = statuses[randomNumber(0, 1)];
    const lastActive = randomRecentDate(14);
    const totalConsumption = randomNumber(50, 250) + randomNumber(0, 99) / 100;

    users.push({
      id: `user-${i + 1}`,
      name,
      email,
      devices,
      status,
      lastActive,
      totalConsumption,
    });
  }

  return users;
};

// Generate analytics data
export const generateMockAnalyticsData = () => {
  // Generate usage patterns (daily consumption over time)
  const usagePatterns = [];
  const today = new Date();
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    const dayLabel = dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    
    // Weekend vs weekday variation
    let kWh;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend
      kWh = randomNumber(120, 180) / 10;
    } else {
      // Weekday
      kWh = randomNumber(80, 140) / 10;
    }
    
    const cost = kWh * 0.15;
    
    usagePatterns.push({
      name: dayLabel,
      kWh,
      cost,
    });
  }
  
  // Generate hourly usage distribution
  const hourlyUsage = generateHourlyData();
  
  return {
    usagePatterns,
    hourlyUsage
  };
};
