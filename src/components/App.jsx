"use client";

import { useMyContext } from "@/store/passportStore";
import { useEffect, useState } from "react";
import uniqid from "uniqid"; // Creates a unique id number to use in components. See https://www.npmjs.com/package/uniqid for more information
/* ----------------------------
Components
----------------------*/
import Cards from "./Cards";
import Header from "./Header";
import AuthHeader from "./AuthHeader";
import MintingModal from "./MintingModal";
import MobileHeader from "./MobileHeader";
//-----------------------------------------------

/*-----------------------
  Card Images
  -----------------------*/
import aang from "@/assets/aang.jpg";
import alita from "@/assets/alita.jpg";
import benTen from "@/assets/ben10.jpg";
import dLuff from "@/assets/d-luff.jpg";
import fighterGirl from "@/assets/fighter-girl.jpg";
import gingFreeccs from "@/assets/ging.jpg";
import gojoSatoru from "@/assets/gojo-satoru.jpg";
import levi from "@/assets/levi.jpg";
import naruto from "@/assets/naruto.jpg";
import optimusPrime from "@/assets/optimus-prime.jpg";
import spongeBob from "@/assets/spongebob.jpg";
import woody from "@/assets/woody.jpg";

//-------------------------------------------------

// Creates the initial card object using the images
const cardInit = [
  { title: "Naruto", avatar: naruto, id: uniqid(), selected: false },
  { title: "Aang", avatar: aang, id: uniqid(), selected: false },
  { title: "Alita", avatar: alita, id: uniqid(), selected: false },
  { title: "Ben 10", avatar: benTen, id: uniqid(), selected: false },
  { title: "D Luffy", avatar: dLuff, id: uniqid(), selected: false },
  {
    title: "Optimus Prime",
    avatar: optimusPrime,
    id: uniqid(),
    selected: false,
  },
  { title: "Woody", avatar: woody, id: uniqid(), selected: false },
  { title: "Gojo Satoru", avatar: gojoSatoru, id: uniqid(), selected: false },
  { title: "Ging Freeccs", avatar: gingFreeccs, id: uniqid(), selected: false },
  { title: "SpongeBob", avatar: spongeBob, id: uniqid(), selected: false },
  { title: "Levi", avatar: levi, id: uniqid(), selected: false },
  { title: "Jenny", avatar: fighterGirl, id: uniqid(), selected: false },
];

// Utitlity function to shuffle the array of objects
function getRandom(arr, n = arr.length) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

// This is the top level function which all the components and shared functions live
function App() {
  // Initializes all used state objects
  const [cards, setCards] = useState([...cardInit]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [max, setMax] = useState(false);
  const {
    showConfetti,
    userInfo: { address: userAddress },
  } = useMyContext();
  const [open, setOpen] = useState(false);

  // Function to get the best score from local storage as well as whether user has reached the max score attainable
  useEffect(() => {
    let yourScore = localStorage.getItem("MemoryScore");
    let maxScore = localStorage.getItem("Max");
    if (yourScore) setBestScore(yourScore);
    if (maxScore) setMax(true);
  }, []);

  // Takes in the id of a card object and either sets it as selected or if it already is, dispatches game loss
  async function makeSelected(id) {
    let myCards = [...cards];
    let result = selectId(myCards, id);
    let [allCards, clicked] = result;
    if (!clicked) {
      allCards = getRandom(allCards);
      setCards(allCards);
      let value = score;
      setScore(score + 1);
      if (value === 11) {
        localStorage.setItem("Max", true);
        localStorage.setItem("MemoryScore", 12);
        setMax(true);
        setBestScore(score);
        if (!userAddress) {
          alert("You Attained god hood. Congratulations");
          alert("Connect Immutable Passport!. We have exciting NFTs for you");
          resetToDefault(value);
        } else {
          setOpen(true);
          resetToDefault(value);
          return;
        }
      }
    } else {
      alert("Tough Luck. Try Again...");
      resetToDefault();
    }
  }

  // Filters the array to figure out if the clicked item was previously selected or not
  function selectId(arr, id) {
    let lost = false;
    for (let item of arr) {
      if (item.id == id) {
        if (item.selected) lost = true;
        item.selected = true;
      }
    }
    return [arr, lost];
  }

  // Resets the scores as well as the selected cards when game is either lost or max score is reacheed
  function resetToDefault(value = false) {
    let newCard = cardInit.map((card) => {
      card.id = uniqid();
      card.selected = false;
      return card;
    });
    setCards(getRandom(newCard));
    setScore(0);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("MemoryScore", score);
    }
    if (value) {
      setBestScore(12);
      localStorage.setItem("MemoryScore", 12);
    }
  }

  return (
    <div className="App bg-gray-800">
      <MintingModal open={open} setOpen={setOpen} />
      <AuthHeader />
      <Header score={score} bestScore={bestScore} max={max} />
      <MobileHeader score={score} bestScore={bestScore} max={max} />
      <Cards cards={cards} makeSelected={makeSelected} />
    </div>
  );
}

export default App;
