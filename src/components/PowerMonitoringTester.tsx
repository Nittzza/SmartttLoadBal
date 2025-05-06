
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Zap } from 'lucide-react';

const PowerMonitoringTester: React.FC = () => {
  const [power, setPower] = useState('3000');
  const [loading, setLoading] = useState(false);
  
  const simulateOverload = async () => {
    try {
      setLoading(true);
      const powerValue = parseInt(power);
      
      if (isNaN(powerValue)) {
        toast({
          title: 'Invalid Input',
          description: 'Please enter a valid number for power',
          variant: 'destructive'
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('power-utils', {
        body: { 
          action: 'set_test_overload', 
          params: { 
            deviceCount: 5,
            powerPerDevice: powerValue / 5
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Test Updated',
        description: `Power monitoring set to ${powerValue}W`,
        variant: powerValue > 2000 ? 'destructive' : 'default'
      });
      
    } catch (error) {
      console.error('Error simulating overload:', error);
      toast({
        title: 'Error',
        description: 'Failed to set test values',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-amber-500" />
          Power Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="power">Set Current Power (W)</Label>
          <Input 
            id="power"
            type="number" 
            value={power} 
            onChange={(e) => setPower(e.target.value)}
            placeholder="Enter power in watts"
          />
          <p className="text-xs text-gray-500">
            Enter a value over 2000W to simulate an overload
          </p>
        </div>
        
        <Button 
          onClick={simulateOverload}
          disabled={loading} 
          variant="destructive"
          className="w-full"
        >
          {loading ? 'Updating...' : 'Simulate Power Level'}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          This will update the current_load in the power_monitoring table directly.
          Make sure Auto Management is enabled to see automatic device control.
        </p>
      </CardContent>
    </Card>
  );
};

export default PowerMonitoringTester;
