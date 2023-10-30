import '@/styles/globals.css'
import { MyProvider } from '@/store/passportStore'
import {NextUIProvider} from "@nextui-org/react";

export default function App({ Component, pageProps }) {
  return (
     <NextUIProvider>
      <MyProvider>
      <main className="dark text-foreground bg-background">
    <Component {...pageProps} />
    </main>
      </MyProvider>
     </NextUIProvider>

  )
}
