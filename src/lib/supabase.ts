import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = "https://elbgjrnrqrefkqyraavw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsYmdqcm5ycXJlZmtxeXJhYXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDU0NzUsImV4cCI6MjA2MDkyMTQ3NX0.pzZ6CgTcjT0Qy7RpzUHkYRXQ0hL_FgsqJiwQYGAm-YY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth functions
export const supabaseAuth = {
  // Sign up function
  signUp: async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (data.user) {
      // Create a profile for the new user
      await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id,
            email: email,
            name: email.split('@')[0],
            role: 'user'
          }
        ]);
    }
    
    return { data, error };
  },
  
  // Sign in function
  signIn: async ({ email, password }: { email: string; password: string }) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },
  
  // Sign out function
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  // Get the current user
  getUser: async () => {
    return await supabase.auth.getUser();
  }
};

// Database functions
export const supabaseDb = {
  // Get all devices
  getDevices: async () => {
    return await supabase
      .from('devices')
      .select('*');
  },
  
  // Get a specific device
  getDevice: async (id: number) => {
    return await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
  },
  
  // Update a device (priority, status, etc.)
  updateDevice: async (id: number, data: any) => {
    return await supabase
      .from('devices')
      .update(data)
      .eq('id', id);
  },
  
  // Get device consumption analytics
  getDeviceConsumption: async (timeframe: 'day' | 'week' | 'month' = 'week') => {
    // This will be enhanced when you have a consumption table
    // For now, we'll work with the devices data
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('power_max', { ascending: false });
      
    return { data, error };
  },
  
  // Get appliance categories distribution
  getCategoryDistribution: async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('appliance_category, power_max');
      
    if (data) {
      // Group by category and sum power_max
      const categories: Record<string, number> = {};
      data.forEach(device => {
        const category = device.appliance_category || 'Unknown';
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category] += Number(device.power_max) || 0;
      });
      
      // Convert to array format for charts
      const result = Object.entries(categories).map(([name, value]) => ({
        name,
        value
      }));
      
      return { data: result, error: null };
    }
    
    return { data: [], error };
  }
};
