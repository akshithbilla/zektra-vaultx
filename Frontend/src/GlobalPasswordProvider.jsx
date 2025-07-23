import { createContext, useContext, useState } from "react";
export const PasswordContext = createContext();

export function useGlobalPassword() {
  return useContext(PasswordContext);
}

export function GlobalPasswordProvider({ children }) {
  const [globalPassword, setGlobalPassword] = useState(null);
  return (
    <PasswordContext.Provider value={{ globalPassword, setGlobalPassword }}>
      {children}
    </PasswordContext.Provider>
  );
}