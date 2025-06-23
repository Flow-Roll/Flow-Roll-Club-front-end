// UserProfile.jsx
import { useParams } from 'react-router-dom';
import WalletSelectHeader from "../components/WalletSelectHeader";



export default function GamePage() {
    const { id } = useParams();

    return <div>
        <WalletSelectHeader></WalletSelectHeader>
        <div>Game ID: {id}</div></div>;
}
