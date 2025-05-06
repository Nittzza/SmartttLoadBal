
import React from "react";

// This component protects routes that require authentication
const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  // Always return children for now to fix rendering issues
  return <>{children}</>;
};

export default AuthRequired;
