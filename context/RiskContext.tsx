import React, { createContext, useState } from 'react';

interface RiskContextType {
  riskNumbers: string[];
  setRiskNumbers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const RiskContext = createContext<RiskContextType>({
  riskNumbers: [],
  setRiskNumbers: () => {},
});

export const RiskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [riskNumbers, setRiskNumbers] = useState<string[]>([]);
  return (
    <RiskContext.Provider value={{ riskNumbers, setRiskNumbers }}>
      {children}
    </RiskContext.Provider>
  );
};
