import { useMyContext } from "@/store/passportStore"
import ReactConfetti from 'react-confetti'
import {useWindowSize} from 'react-use'

export default function Confetti() {
  const { showConfetti } = useMyContext()
  return (
    <>
      {showConfetti && <ReactConfetti width={"400px"} />}
  </>
    )

}