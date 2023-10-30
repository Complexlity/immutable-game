'use client'
import React from "react";
import Link from 'next/link'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,

  Button,
} from "@nextui-org/react";
import AcmeLogo  from "@/assets/favicon.ico";
import { useMyContext } from "@/store/passportStore";
import Head from "next/head";
import { useState } from 'react';

export default function NewAuthHeader() {
  const {passportState: passportInstance, userInfo, dispatch } = useMyContext();
  const [buttonState, setButtonState] = useState('Connect Passport')
  const [isLoading, setIsLoading] = useState(false)
  console.log(userInfo)

   async function login() {
    if (!passportInstance) return
    setButtonState("Connecting")
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
    setIsLoading(true)
    await passportInstance.logout();
    setButtonState('Connect Passport')
    setIsLoading(false)
}
  return (
    <Navbar isBordered>
      <NavbarBrand className="gap-2">
        <img src="favicon.ico" alt="immutable logo" />
        <p className="font-bold text-inherit">Immutable</p>
      </NavbarBrand>
      {buttonState === "Connected" || userInfo?.email ? (
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Link href={`/collection/${userAddress}`} className="hover:underline text-base">
                      My NFTs
                    </Link>
          </NavbarItem>
          <NavbarItem>{userInfo.email}</NavbarItem>
          <NavbarItem isActive>{userInfo.emaiil}</NavbarItem>
        </NavbarContent>
      ) : null}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            color="primary"
            variant="bordered"
            size="xl"
            onPress={buttonState === "Connected" ? logout : login}
          >
            {buttonState}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
