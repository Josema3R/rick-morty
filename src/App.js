import imageRickMorty from './img/rick-morty.png';
import './App.css';
import { useState, useEffect } from 'react';
import Characters from './components/Characters';
import InfiniteScroll from 'react-infinite-scroll-component';


function App() {
  const [characters, setCharacters] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPagesNumber, setTotalPagesNumber] = useState(0);
  const [hasMoreItems, sethasMoreItems] = useState(true);

  useEffect(() => {
    reqTotalPages();
  }, [pageNumber]);

  const reqApi = async () => {
    const nextPage = pageNumber + 1;
    if (nextPage !== 0 && nextPage <= totalPagesNumber) {
      const api = await fetch('https://rickandmortyapi.com/api/character/?page=' + pageNumber);
      const characterApi = await api.json();
  
      if (characters) {
        const allCharacters = characterApi.results ? characters.concat(characterApi.results) : characterApi.results;
        setCharacters(allCharacters);
      }
      else {
        setCharacters(characterApi.results);
      }
      setPageNumber(nextPage);
    }
    else {
      sethasMoreItems(false);
    }
  };


  const reqTotalPages = async () => {
    const api = await fetch('https://rickandmortyapi.com/api/character');
    const pagesNumber = await api.json();
    setTotalPagesNumber(pagesNumber.info.pages);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Rick & Morty</h1>
        {characters ?
          <InfiniteScroll
            dataLength={characters.length}
            next={() => reqApi()}
            hasMore={hasMoreItems}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Characters characters={characters} setCharacters={setCharacters} setPageNumber={setPageNumber} sethasMoreItems={sethasMoreItems} />
          </InfiniteScroll>
          :
          <>
            <img src={imageRickMorty} alt="Rick&Morty" className="img-home" />
            <button onClick={() => reqApi()} className="btn-search">Search characters</button>
          </>
        }

      </header>

    </div>
  );
}

export default App;
