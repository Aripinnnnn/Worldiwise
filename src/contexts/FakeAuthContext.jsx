import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false
}

function reducer(state, action) {
    switch(action.type) {
        case 'login':
            return {...state, user: action.payload, isAuthenticated: true}

        case 'logout':
            return {...state, user: null, isAuthenticated: false}

        default: throw new Error("unknown type of action");
    }
} 

const FAKE_USER = {
    name: "Ipin",
    email: "Ipin@example.com",
    password: "qwerty",
    avatar: "https://gravatar.com/avatar/fcf651f8cefefe102b3cd2d3b5a9472c?s=400&d=robohash&r=x",
  };

function AuthProvider({children}) {
    const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState);
    function login(email, password) {
        if(email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({type: 'login', payload: FAKE_USER})
        }
    }

    function logout() {
        dispatch({type: 'logout'})
    }
    return (
        <AuthContext.Provider value={{user, login, isAuthenticated, logout}}>{children}</AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined) throw new Error("Authcontext was used outside AuthProvider")
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {AuthProvider, useAuth}