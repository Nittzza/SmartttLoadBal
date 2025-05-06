
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface OverloadWarningProps {
  autoManagementEnabled: boolean;
}

const OverloadWarning: React.FC<OverloadWarningProps> = ({ autoManagementEnabled }) => {
  return (
    <div className="bg-red-50 p-3 rounded-md text-red-700">
      <p className="font-semibold flex items-center gap-2">
        <AlertTriangle size={16} />
        OVERLOAD DETECTED!
      </p>
      <p className="text-sm mt-1">
        {autoManagementEnabled 
          ? 'Automatic management is active. Low priority devices will be turned off to reduce power consumption.'
          : 'Warning: Auto management is disabled. Enable it to automatically handle overloads by turning off low priority devices first.'}
      </p>
    </div>
  );
};

export default OverloadWarning;
