import Link from "next/link";
import { useMyContext } from "@/store/passportStore";
import { mintNft } from "@/utils/mintNft";
import { getNft } from '@/utils/getNft';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, Progress, useDisclosure,  } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Confetti from './Confetti'


export default function MintingModal({ open, setOpen }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {showConfetti, setShowConfetti } = useMyContext()
  const [currentState, setCurrentState] = useState("");
  const userAddress = useMyContext().userInfo.address
  const [minting, setMinting] = useState(false);
  const [nftItem, setNftItem] = useState({})
  const [totalMinted, setTotalMinted] = useState('')

  useEffect(() => {
    if (open) {
      const mintNftAndSetState = async () => {
        try {
          setMinting(true)
          setCurrentState('Getting A Unique Token Id...')
          const { tokenId } = await fetch('api/token').then(res => res.json())
          setCurrentState('Minting Your NFT...')
          const tokenMinted = await mintNft(userAddress, tokenId);
          setCurrentState("Fetching Minted Nft...");
          const tokenFetched = await getNft(tokenId - 1)
          setNftItem(tokenFetched)
          setMinting(false);
          setShowConfetti(true)

        } catch (error) {
          // alert("Something Went Wrong.gaa Try Again Later");
          console.log(error)
          onClose();
          setOpen(false);
          alert("Something Went Wrong Please Try Again Later")
        }
      };
      onOpen()
      mintNftAndSetState();
    }
  }, [open]);


  return (
    <>
      <Modal
        hideCloseButton={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      classNames="dark"
      >
        <ModalContent classNames="!overflow-hidden">
          {(onClose) => (
            <>
              <div className="!max-w-full">
            <Confetti />
            </div>
              <ModalBody>
                <div className="grid min-h-[400px] w-full content-center items-center gap-8 text-center">
                  {minting ? (
                    <>
                      <p>Please wait...</p>
                      <Progress
                        size="sm"
                        isIndeterminate
                        aria-label="Loading..."
                        className="max-w-md"
                      />
                      <p className="text-center">{currentState}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-blue-800 ">{nftItem?.name}</p>
                      <img
                        src={nftItem?.image}
                        className="mx-auto h-[200px] w-[200px] rounded-xl"
                      />
                      <p className="text-xl"><span className="font-bold">Congratulations!!!.</span> You win an Nft</p>
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="items-center">
                {!open || !minting ? (
                  <>
                    {totalMinted ? (
                      <p>
                        <span className="italic text-blue-900 font-bold">Total Minted</span>: {totalMinted}/100
                      </p>
                    ) : null}
                    <Button color="success" variant="light"
                    >
                      <Link href={`/collection/${userAddress}`} className="hover:underline text-base">
                      View Your NFTs
                    </Link>
                      </Button>

                    <Button className="text-base" color="danger" variant="light" onPress={() => {
                      onClose()
                      setOpen(false)
                      setShowConfetti(false)

                    }}>
                      Close
                    </Button>
                  </>
                ) : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


