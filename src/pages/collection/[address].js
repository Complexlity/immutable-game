import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useMyContext } from '@/store/passportStore'
import { getNftByAddress } from '@/utils/getNftByAddress'
import AuthHeader from '@/components/AuthHeader'

export default function Page() {
  const router = useRouter()
  const userAddress = useMyContext().userInfo.address

  let address = router.query.address
  if(!address) address = userAddress
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState({})
  useEffect(() => {
    const getNfts = async () => {
      try {
        const nfts = await getNftByAddress(address)
        console.log(nfts)
        setNfts(nfts)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    getNfts()
  }, [])


  if (isLoading) {
    return
  }



  return (
    <div className='bg-gray-800 min-h-screen text-white'>
      <AuthHeader />
      {
        isLoading
          ?
<p>Loading....</p>
          :
    < p> {JSON.stringify(nfts, null, 2)}</p>
      }
    </div >

  )
  // const address =
  // useEffect()
}