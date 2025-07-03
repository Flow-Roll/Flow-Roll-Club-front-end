import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { useNavigate } from 'react-router';

const diceGames = [
  {
    id: 1,
    title: "Classic Dice",
    prizePool: "$1,200",
    totalBets: 134,
    betAmount: "$10",
    rollUnder: 50,
    payout: "2x",
  },
  {
    id: 2,
    title: "High Roller",
    prizePool: "$5,000",
    totalBets: 57,
    betAmount: "$100",
    rollUnder: 30,
    payout: "3.33x",
  },
  {
    id: 3,
    title: "Lucky 7",
    prizePool: "$750",
    totalBets: 200,
    betAmount: "$5",
    rollUnder: 70,
    payout: "1.43x",
  },
  {
    id: 4,
    title: "Lucky 8",
    prizePool: "$750",
    totalBets: 200,
    betAmount: "$5",
    rollUnder: 70,
    payout: "1.43x",
  },
  {
    id: 5,
    title: "Lucky 9",
    prizePool: "$750",
    totalBets: 200,
    betAmount: "$5",
    rollUnder: 70,
    payout: "1.43x",
  },
  {
    id: 6,
    title: "Lucky 37",
    prizePool: "$750",
    totalBets: 200,
    betAmount: "$5",
    rollUnder: 70,
    payout: "1.43x",
  },
  {
    id: 7,
    title: "Lucky 67",
    prizePool: "$750",
    totalBets: 200,
    betAmount: "$5",
    rollUnder: 70,
    payout: "1.43x",
  },
];


const DiceGameCard = ({ game, id }) => {

  const navigate = useNavigate();
  const avatar = createAvatar(shapes, {
    seed: game.title,
    backgroundColor: [],
    shape1Color: ["#00fdc8"]
    // ... other options
  });

  const svg = avatar.toString();

  const encodedSvg = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  const backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;

  return (
    <div
      // style={{ backgroundColor: "#CCFFF1", }}
      className="cursor-pointer bg-gradient-to-br text-black rounded-xl shadow-lg p-5 min-w-[250px] transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
      onClick={() => { navigate(`/games/${id}`) }}

    >
      <div className="relative w-full h-">{id}</div>
      <div
      // className="w-40 h-40 bg-no-repeat bg-center bg-contain shadow"
      // style={{ backgroundImage }}
      >
        <h3 className="text-xl font-semibold mb-2 p-2">🎲{game.title}</h3>


      </div>
      <div className=" space-y-1">

        <p className="flex items-center gap-2">
          <span>Prize Pool: <strong>{game.prizePool}</strong></span>
        </p>
        <p className="flex items-center gap-2">

          <span>Total Bets: {game.totalBets}</span>
        </p>
        <p className="flex items-center gap-2">

          <span>Bet Amount: <strong>{game.betAmount}</strong></span>
        </p>
        <p className="flex items-center gap-2">
          🎯 <span>Roll: Bet</span>
        </p>
        <p className="flex items-center gap-2">
          💸 <span>Payout: 10% of Prize Pool  </span>
        </p>

      </div>
    </div>

  );
};

const DiceGameRow = () => {
  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-800  mb-4">🎲 Dice Games</h2>
      <div className="flex flex-wrap gap-4 justify-start">
        {diceGames.map(game => (
          <DiceGameCard key={game.id} game={game} id={game.id} />
        ))}
      </div>
    </div>
  );
};


export default DiceGameRow;