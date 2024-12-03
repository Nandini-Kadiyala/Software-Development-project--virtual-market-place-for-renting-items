import { createContext, useState } from "react";

const AppContext = createContext({
    user: null,
    setUser: () => {},
    loading: false,
    setLoading: () => {},
    properties: [],
    setProperties: () => {},
});

const prevUser = JSON.parse(localStorage.getItem('currUser'));

export const AppContextProvider = ({children})=>{
    const [user, setUser] = useState(prevUser ? prevUser : null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <AppContext.Provider value={{
            user, setUser, 
            loading, setLoading,
            properties, setProperties, 
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;