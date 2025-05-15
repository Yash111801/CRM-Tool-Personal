// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const data = JSON.parse(localStorage.getItem("Data"));
    return data;
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    const data = JSON.parse(localStorage.getItem("Data"));
    return data?.profileImage || null;
  });

  const login = (data) => {
    localStorage.setItem("Data", JSON.stringify(data));
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem("Data");
    localStorage.removeItem("Role");
    setAdmin(null);
  };

  const updateProfilePhoto = (photoUrl) => {
    const userData = admin;
    userData.profileImage = photoUrl;
    localStorage.setItem("Data", JSON.stringify(userData));
    setProfilePhoto(photoUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthorized: !!admin?.token,
        login,
        logout,
        profilePhoto,
        updateProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
