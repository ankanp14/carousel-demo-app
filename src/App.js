import './App.css';
import Carousel from './components/Carousel/Carousel';

import list from './items.json';

function App() {
  return (
    <div style={{ maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto', marginTop: 64 }}>
      <Carousel list={list} visibleItems={3} infinite={true}/>
    </div>
  );
}

export default App;
