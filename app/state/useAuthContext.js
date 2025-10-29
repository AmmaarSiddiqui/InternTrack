import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({ profile: null, setProfile: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user object
  const [profile, setProfile] = useState(null); // {name, goal, gym}
  return (
    <AuthContext.Provider value={{ user, setUser, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
