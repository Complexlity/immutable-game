import { useMyContext } from "@/store/passportStore";
import { mintNft } from "@/utils/mintNft";
import { getNft } from '@/utils/getNft';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, Progress, useDisclosure, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function MintingModal({open, setOpen}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [currentState, setCurrentState] = useState("");
  const userAddress = useMyContext().userInfo.address
  const [minting, setMinting] = useState(false);
  const [nftItem, setNftItem] = useState({})
  const [totalMinted, setTotalMinted] = useState('')

  console.log({userAddress})

  useEffect(() => {
    if (open) {
      const mintNftAndSetState = async () => {
        try {
          setMinting(true)
          const { tokenId } = await fetch('api/token').then(res => res.json())
          console.log({tokenId})
          setTotalMinted(tokenId)
          setCurrentState('Minting Your Nft...')
          const tokenMinted = await mintNft(userAddress, tokenId);
          console.log({tokenMinted})
          setCurrentState("Fetching Minted Nft...");
          console.log(tokenId)
          const tokenFetched = await getNft(tokenId)
          console.log(tokenFetched)
          setNftItem(tokenFetched)
          setMinting(false);

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
        <ModalContent>
          {(onClose) => (
            <>
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
                      <p>{nftItem?.name}</p>
                      <img
                        src={nftItem?.image}
                        className="mx-auto h-[200px] w-[200px] rounded-xl"
                      />
                      <p>Congratulation!!!. You win a free Nft</p>
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
                      <Link href={`/collection/${userAddress}`} underline="hover">
                      View Your NFTs
                    </Link>
                      </Button>

                    <Button color="danger" variant="light" onPress={() => {
                      onClose()
                      setOpen(false)
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


