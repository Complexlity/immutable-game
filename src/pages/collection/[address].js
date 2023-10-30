import AuthHeader from "@/components/AuthHeader";
import { getNftByAddress } from "@/utils/getNftByAddress";
import Link from "next/link";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Redirect from "@/components/Redirect";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const getNfts = async () => {
      try {
        if (!router.isReady) return;
        const { address } = router.query;
        const nfts = await getNftByAddress(address);
      if(!nfts) router.push('/')
        setNfts([]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getNfts();
  }, [router.isReady]);

  if (isLoading) {
    return (
      <div class="fixed left-0 top-0 z-50 h-full w-full bg-white opacity-100">
        <div class="mt-[50vh] flex items-center justify-center">
          <div class="fas fa-circle-notch fa-spin fa-5x text-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white ">
      <Redirect />
      <AuthHeader />
      <>
        {nfts.length == 0 ? (
          <p className="text-center text-3xl m-8">
            No NFTs Found. Complete{" "}
            <Link
              href="/"
              className="text-amber-400 underline hover:no-underline"
            >
              the game
            </Link>{" "}
            to gain some!!
          </p>
        ) : null}
        {nfts.length == 1 ? (
          <p className="text-center text-3xl">
            Good job!. There's a lot more{" "}
            <Link
              href="/"
              className="text-amber-400 underline hover:no-underline"
            >
              to win
            </Link>{" "}
          </p>
        ) : null}
        {nfts.length > 1 ? (
          <p className="m-4 text-center text-3xl">
            Wow. You have {nfts.length} NFTs!. We have more easter eggs for you.{" "}
            <Link href="/" className="underline hover:no-underline">
              Win More!
            </Link>
          </p>
        ) : null}
        <div className="mx-auto mt-8 grid max-w-[1000px] grid-cols-12 justify-center gap-x-6 gap-y-12 p-8">
          {nfts.map((nft, index) => (
            <NftCard nft={nft} key={index} />
          ))}
        </div>
      </>
    </div>
  );
}

function NftCard({ nft }) {
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  return (
    <Card
      isFooterBlurred
      className="col-span-12 h-[300px] w-full sm:col-span-5 lg:col-span-4"
    >
      <CardHeader className="absolute top-1 z-10 flex justify-between">
        <h4 className="text-2xl font-semibold text-gray-200">{nft.name}</h4>
        <p className="text-5xl font-bold uppercase text-white">
          {nft.token_id}
        </p>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 h-full w-full -translate-y-6 scale-125 object-cover hover:scale-150"
        src={nft.image}
      />
      <CardFooter className="absolute bottom-0 z-10 justify-between border-t-1 border-zinc-100/50 bg-white/50">
        <div>
          <p className="text-base text-black">View On Explorer</p>
        </div>
        <Link
          target={"_blank"}
          className="hover:underline"
          href={`https://explorer.testnet.immutable.com/token/${CONTRACT_ADDRESS}/instance/${nft.token_id}`}
        >
          <Button className="text-base" color="primary" radius="full" size="sm">
            Go
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
