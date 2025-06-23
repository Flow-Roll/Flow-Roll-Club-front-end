// UserProfile.jsx
import { useParams } from 'react-router-dom';

export default function GamePage() {
    const { id } = useParams();

    return <div>Game ID: {id}</div>;
}
