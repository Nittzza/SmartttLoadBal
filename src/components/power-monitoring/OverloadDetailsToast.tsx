
import React from 'react';
import { DisabledDevice } from '@/hooks/usePowerMonitoring';

interface OverloadDetailsToastProps {
  message: string;
  devicesDisabled: DisabledDevice[];
}

const OverloadDetailsToast: React.FC<OverloadDetailsToastProps> = ({ 
  message, 
  devicesDisabled 
}) => {
  return (
    <div className="mt-2 space-y-2">
      <p>{message}</p>
      <div className="text-sm mt-2">
        <strong>Devices turned off:</strong>
        <ul className="list-disc pl-4 mt-1">
          {devicesDisabled.map((device) => (
            <li key={device.id}>
              {device.name} ({device.power}W, {device.priority} priority)
              {device.location && ` - ${device.location}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OverloadDetailsToast;
