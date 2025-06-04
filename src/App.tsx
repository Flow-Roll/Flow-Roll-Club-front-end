import FRCLogo from "/FlowRollClubLogo.svg"
import './App.css'
import "./DiceRollAnimation";
import DiceRollAnimation from './DiceRollAnimation'

function App() {
  return (
    <>
      <div>
        <a href="https://flowroll.club" target="_blank">
          <img src={FRCLogo} className="logo" alt="Flow Roll Club Logo" />
        </a>
      </div>
      <h1>Coming Soon</h1>
      <div className="card">

        <DiceRollAnimation></DiceRollAnimation>
      </div>
     
    </>
  )
}

export default App
