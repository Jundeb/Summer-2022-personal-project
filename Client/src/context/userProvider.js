import { createContext, useState } from "react";

//Can use user state anywhere needed
const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState({});

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
