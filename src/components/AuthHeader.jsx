'use client'

import { useMyContext } from "@/store/passportStore";
import { passport } from "@imtbl/sdk";
import Head from "next/head";
import { useState } from 'react';

export default function AuthHeader() {
  const {passportState: passportInstance, userInfo, dispatch } = useMyContext();
  const [buttonState, setButtonState] = useState('Connect Passport')
  const [isLoading, setIsLoading] = useState(false)

  async function login() {
    if (!passportInstance) return
    setButtonState("...Connecting")
    setIsLoading(true)
    try {
      console.log("I am connecting now")
      const providerZkevm = passportInstance.connectEvm()
      console.log(providerZkevm)
      console.log(passportInstance)

      const accounts = await providerZkevm.request({ method: "eth_requestAccounts" })

      console.log(accounts)

      // Set the address
      dispatch({
        type: 'add_user_info',
        key: 'address',
        value: accounts[0]
      })
      const user = await passportInstance.getUserInfo()


      // Set the email
      dispatch({
        type: 'add_user_info',
        key: 'email',
        value: user.email
      })

      //set the nickname
      dispatch({
        type: 'add_user_info',
        key: 'nickname',
        value: user.nickname
      })

      const accessToken = await passportInstance.getAccessToken()


      // set the access token
      dispatch({
        type: 'add_user_info',
        key: 'accessToken',
        value: accessToken
      })


      const idToken = await passportInstance.getIdToken()

      // set the id token
      dispatch({
        type: 'add_user_info',
        key: 'idToken',
        value: idToken
      })

    } catch (error) {
    console.log("Something went wrong")
        console.log({ error })
        setButtonState('Connect Passport')
          throw error
    } finally {
      setIsLoading(false)
    }
    setButtonState('Connected')
    return

  }

  async function logout()  {
    await passportInstance.logout();
    setButtonState('Connect Passport')
}



  return (
 <>

<Head>
        <title>Immutable Planner App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-end pr-16 gap-4 top-0 backdrop-blur-md py-4   w-full">

          {
            buttonState === 'Connected'
            ?

            <>
              <p className="px-4 py-2 bg-green-700 rounded-lg text-gray-200 flex items-center justify-center">{userInfo.email ?? "Hello world"} </p>
                  <p className="px-4 py-2 bg-green-700 rounded-lg text-gray-200 flex items-center justify-center">{userInfo.address ?? "Hello world" }</p>


            <button onClick={logout} className="bg-red-500 text-grey-800 px-4 py-2 opacity-100 rounded-full text-lg  text-gray-100">Logout</button>
            </>
            : <button disabled={isLoading} className={`text-grey-100 px-4 py-2 opacity-100 rounded-full ${isLoading ? "bg-green-200" : "bg-green-500" }`} onClick={login}>
          {buttonState}
        </button>
          }

        </div>
      </>


  );
}


