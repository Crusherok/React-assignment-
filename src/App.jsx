import React, { useState } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const searchWord = async () => {
    if (!word) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('No definitions found. Try another word.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Dictionary App</h1>
      
      <div className="search-box">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word..."
          onKeyPress={(e) => e.key === 'Enter' && searchWord()}
        />
        <button onClick={searchWord}>Search</button>
      </div>
      
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {result && (
        <div className="result">
          <h2>{result[0].word}</h2>
          
          {result[0].phonetics.length > 0 && result[0].phonetics[0].audio && (
            <div className="phonetic">
              <p>{result[0].phonetics[0].text}</p>
              <button onClick={() => {
                const audio = new Audio(result[0].phonetics[0].audio);
                audio.play();
              }}>
                Play Sound
              </button>
            </div>
          )}
          
          {result[0].meanings.map((meaning, i) => (
            <div key={i} className="meaning">
              <h3>{meaning.partOfSpeech}</h3>
              
              <div className="definitions">
                {meaning.definitions.slice(0, 3).map((def, j) => (
                  <div key={j} className="def">
                    <p>• {def.definition}</p>
                    {def.example && <p className="example">Example: "{def.example}"</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <footer>
        <p>Created by Elroy</p>
      </footer>
    </div>
  );
}

export default App;