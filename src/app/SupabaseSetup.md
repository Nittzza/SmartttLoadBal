
# Supabase Integration for Smart Load Optimizer

This file contains instructions for integrating Supabase with the Smart Load Optimizer platform.

## Required Setup in Supabase

1. **Authentication**
   - Enable Email/Password sign-up method
   - Set up Email templates for verification

2. **Database Tables**
   - Users table (created automatically by Supabase Auth)
   - Devices table
   - PowerReadings table
   - Recommendations table

## Table Schemas

### Devices Table
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'inactive',
  power_consumption NUMERIC,
  priority TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Users can only see their own devices
CREATE POLICY "Users can view their own devices" 
  ON devices FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own devices
CREATE POLICY "Users can insert their own devices" 
  ON devices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own devices
CREATE POLICY "Users can update their own devices" 
  ON devices FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own devices
CREATE POLICY "Users can delete their own devices" 
  ON devices FOR DELETE 
  USING (auth.uid() = user_id);
```

### PowerReadings Table
```sql
CREATE TABLE power_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  kwh NUMERIC NOT NULL,
  is_on BOOLEAN DEFAULT TRUE
);

-- Create RLS policies
ALTER TABLE power_readings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own power readings
CREATE POLICY "Users can view their own power readings" 
  ON power_readings FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own power readings
CREATE POLICY "Users can insert their own power readings" 
  ON power_readings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

### Recommendations Table
```sql
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own recommendations
CREATE POLICY "Users can view their own recommendations" 
  ON recommendations FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can update their own recommendations (to mark as read)
CREATE POLICY "Users can update their own recommendations" 
  ON recommendations FOR UPDATE 
  USING (auth.uid() = user_id);
```

## Edge Functions

### Function for Device Priority Calculation
Create an edge function that runs on a schedule to:
1. Analyze device usage patterns
2. Calculate priority tags based on:
   - Frequency of use
   - Average power consumption
   - Time of day usage patterns
3. Update the device priorities in the database

### Function for Generating Recommendations
Create an edge function that runs on a schedule to:
1. Analyze user power consumption patterns
2. Generate personalized recommendations
3. Store them in the recommendations table

Once Supabase is integrated, replace the mock data functions in `src/lib/supabase.ts` with real Supabase client calls.
