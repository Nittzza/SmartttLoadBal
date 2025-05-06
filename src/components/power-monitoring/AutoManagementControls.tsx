
import React from 'react';
import { Button } from '@/components/ui/button';

interface AutoManagementControlsProps {
  isEnabled: boolean;
  onToggle: () => void;
  onTriggerManagement: () => void;
  isLoading: boolean;
}

const AutoManagementControls: React.FC<AutoManagementControlsProps> = ({
  isEnabled,
  onToggle,
  onTriggerManagement,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>
          Auto Management: {' '}
          <span className={isEnabled ? "text-green-600 font-medium" : "text-gray-600"}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </span>
        <Button 
          variant={isEnabled ? 'destructive' : 'default'}
          size="sm"
          onClick={onToggle}
        >
          {isEnabled ? 'Disable' : 'Enable'} Auto Management
        </Button>
      </div>
      
      <div className="pt-2 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onTriggerManagement}
          disabled={isLoading}
        >
          {isLoading ? 'Managing Power...' : 'Manually Run Power Check'}
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This will evaluate current power loads and automatically manage devices if needed.
        </p>
      </div>
    </div>
  );
};

export default AutoManagementControls;
