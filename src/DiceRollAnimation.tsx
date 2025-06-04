
import { useEffect } from "react"
import "./DiceRollAnimation.css"

export default function DiceRollAnimation() {

    useEffect(() => {
        rollDice()
    }, [])
    return <div className="center">
        <div id="dice" data-side="1">
            <div className="sides side-1">
                <span className="dot dot-1"></span>
            </div>
            <div className="sides side-2">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
            </div>
            <div className="sides side-3">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
            </div>
            <div className="sides side-4">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
            </div>
            <div className="sides side-5">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
                <span className="dot dot-5"></span>
            </div>
            <div className="sides side-6">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
                <span className="dot dot-4"></span>
                <span className="dot dot-5"></span>
                <span className="dot dot-6"></span>
            </div>
        </div>

        <div id="diceResult">Click to roll the dice!</div>
    </div>
}

function rollDice() {
    let dice = document.getElementById('dice');
    var outputDiv = document.getElementById('diceResult');

    function rollDice() {
        let result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        dice.dataset.side = result;
        dice.classList.toggle("reRoll");

        console.log(result);

        outputDiv.classList.remove("reveal");
        outputDiv.classList.add("hide");
        outputDiv.innerHTML = "You've got " + result;
        setTimeout(function () { outputDiv.classList.add("reveal"); }, 1500);
    }

    dice.addEventListener("click", rollDice);
}
