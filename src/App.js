import './App.css';
import WordScramble from "./components/word-scramble";
import LoadingScreen from './components/loading-screen';
import {useEffect, useState} from "react";

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000)
    }, [])

    return (
        <div className='App'>
            {loading && <LoadingScreen />}
            <main>
                <WordScramble />
            </main>
        </div>
    );
}

export default App;
