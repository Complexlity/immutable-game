const { useMyContext } = require("@/store/passportStore")
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';


export default function CustomConfetti() {
  const [width, height] = useWindowSize()
  const { showConfetti } = useMyContext()


  return (
    <>
      {showConfetti && <ReactConfetti width={width} height={height} />}
  </>
    )

}