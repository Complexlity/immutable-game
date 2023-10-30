'use client'
import { useMyContext } from "@/store/passportStore";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle,  } from "@nextui-org/react";
import Link from 'next/link';
import { useState } from 'react';

export default function AuthHeader() {
  const {passportState: passportInstance, userInfo, dispatch } = useMyContext();
  const [buttonState, setButtonState] = useState('Connect Passport')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

   async function login() {
    if (!passportInstance) return
    setButtonState("Connecting...")
    setIsLoading(true)
    try {
      const providerZkevm = passportInstance.connectEvm()

      const accounts = await providerZkevm.request({ method: "eth_requestAccounts" })

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
    alert("Something went wrong. Please try again")
        console.log({ error })
        setButtonState('Connect Passport')
    } finally {
      setIsLoading(false)
    }
    setButtonState('Logout')
    return

  }

  async function logout()  {
    setIsLoading(true)
    await passportInstance.logout();
    setButtonState('Connect Passport')
    setIsLoading(false)
}
  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

        <Link href="/">
      <NavbarBrand className="gap-2">
        <img src="/favicon.ico" alt="immutable logo" />
        <p className="font-bold text-inherit">Immutable</p>
      </NavbarBrand>
        </Link>

      {buttonState === "Connected" || userInfo?.email ? (
        <NavbarContent className="hidden gap-4 md:flex" justify="center">
          <NavbarItem>
            <Link
              href={`/collection/${userInfo?.address}`}
              className="text-base underline hover:no-underline"
            >
              My NFTs
            </Link>
          </NavbarItem>
          <NavbarItem className="text-base">{userInfo.email}</NavbarItem>
          <NavbarItem className="text-base">{userInfo.address}</NavbarItem>
        </NavbarContent>
      ) : null}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            color={buttonState === 'Logout' ? "danger" : "primary"}
            variant="bordered"
            size="xl"
            onPress={buttonState === "Logout" ? logout : login}
          >
            {buttonState}
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem className="px-8 text-xl">
          {userInfo.email}
        </NavbarMenuItem>
        <NavbarMenuItem className="px-8 text-xl">
          {userInfo.address}
        </NavbarMenuItem>
        <NavbarMenuItem className="px-8 text-xl">
          <Button color="success" >
          <Link
            href={`/collection/${userInfo?.address}`}
            className="underline hover:no-underline"
          >
            My NFTs
          </Link>
            </Button>

        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
