
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

        <div id="diceResult">Flow Roll Club</div>
    </div>
}

function rollDice() {
    let dice = document.getElementById('dice') as HTMLElement;
    var outputDiv = document.getElementById('diceResult') as HTMLDivElement;

    function rollDice() {
        let result = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        dice.dataset.side = result.toString();
        dice.classList.toggle("reRoll");

        outputDiv.classList.remove("reveal");
        outputDiv.classList.add("hide");
        outputDiv.innerHTML = "Rolled " + result;
        setTimeout(function () { outputDiv.classList.add("reveal"); }, 1500);
    }

    setInterval(() => {
        rollDice()
    }, 3000)

    // dice.addEventListener("click", rollDice);
}
