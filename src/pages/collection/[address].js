import AuthHeader from '@/components/AuthHeader'
import { getNftByAddress } from '@/utils/getNftByAddress'
import Link from 'next/link'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'



export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  useEffect(() => {
    const getNfts = async () => {
      try {
  if (!router.isReady) return
        const { address } = router.query
        const nfts = await getNftByAddress(address)
        setNfts(nfts ?? [])
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    getNfts()
  }, [router.isReady])


  if (isLoading) {
    return (
      <div class="w-full h-full fixed top-0 left-0 bg-white opacity-100 z-50">
  <div class="flex justify-center items-center mt-[50vh]">
    <div class="fas fa-circle-notch fa-spin fa-5x text-violet-600"></div>
  </div>
</div>
    )
  }



  return (
    <div className='bg-gray-800 min-h-screen text-white '>
      <AuthHeader />
      <>
        {nfts.length == 0 ? <p className="text-center text-3xl">You Have No NFTs. Complete <a href="/" className="underline hover:no-underline text-amber-400">the game</a> to gain some!!</p> : null}
        {nfts.length > 0 ? <p className="text-3xl text-center m-4">Wow!!!. You have {nfts.length} NFTs. You have what it takes to <a href="/" className="underline hover:no-underline">Win More!</a></p>: null}
        <div className="mt-8 grid grid-cols-12 mx-auto max-w-[1000px] p-8 gap-4 justify-center">
              {
                nfts.map((nft, index) => (
                  <NftCard nft={nft} key={index} />

              ))
              }
        </div>
          </>
    </div >

  )

}


function NftCard({ nft }) {
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;


  return (
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5 lg:col-span-4">
      <CardHeader className="absolute z-10 top-1 flex justify-between">
        <h4 className="text-gray-200 font-semibold text-2xl">{nft.name}</h4>
        <p className="text-5xl text-white uppercase font-bold">{nft.token_id}</p>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={nft.image}
      />
      <CardFooter className="absolute bg-white/50 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <div>
          <p className="text-black text-base">View On Explorer</p>
        </div>
          <Link target={"_blank"} className="hover:underline" href={`https://explorer.testnet.immutable.com/token/${CONTRACT_ADDRESS}/instance/${nft.token_id}`}>
        <Button className="text-base" color="primary" radius="full" size="sm">
          Go
        </Button>
          </Link>
      </CardFooter>
    </Card>
  )

}