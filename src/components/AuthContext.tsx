import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext<{ email: string | null }>({ email: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const cookieEmail = Cookies.get("email");
    if (cookieEmail) {
      setEmail(cookieEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ email }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
