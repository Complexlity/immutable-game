"use client"

import { createContext, useContext, useState, useReducer } from 'react';
import { config, passport } from '@imtbl/sdk';

const passportConfig = {
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX
  }),
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL,
  logoutRedirectUri: process.env.NEXT_PUBLIC_LOGOUT_URL,
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
};



const passportInstance = typeof window !== 'undefined' ? new passport.Passport(passportConfig) : undefined

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [passportState] = useState(passportInstance ?? "");
  const [userInfo, dispatch] = useReducer(reducer, {address: null, email: null, nickname: null, idToken: null, accessToken: null})
  const [showConfetti, setShowConfetti] = useState(true)

  function reducer(state, action) {
    const key = action.key
    const value = action.value
    switch (action.type) {
      case `add_user_info`: {
        return {
          ...state,
          [key]: value
        }
      }
      default: return state
    }
  }

  return (
    <MyContext.Provider value={{ passportState , userInfo, dispatch, showConfetti, setShowConfetti }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
