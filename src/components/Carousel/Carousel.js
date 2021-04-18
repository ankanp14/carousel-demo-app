import React, { useState, useEffect } from 'react'
import './Carousel.css';

const Carousel = (props) => {
  const {list, visibleItems, infinite} = props;

  let items;

  const [filterValue, setFilter] = useState('all');
  items = filterValue === 'all' ? Object.assign([], list) : list.filter((item) => item.category.toLowerCase() === filterValue);
  items = items.map((item, i) => ({
    id: i + 1,
    ...item
  }));

  const [currentIndex, setCurrentIndex] = useState(infinite ? visibleItems : 0);
  const [length, setLength] = useState(items.length);

  const [isRepeating, setIsRepeating] = useState(infinite && items.length > visibleItems);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setLength(items.length);
    setIsRepeating(infinite && items.length > visibleItems);
  }, [items, infinite, visibleItems]);

  useEffect(() => {
    if (isRepeating) {
      if (currentIndex === visibleItems || currentIndex === length) {
        setTransitionEnabled(true);
      }
    }
  }, [currentIndex, isRepeating, visibleItems, length])

  const next = () => {
    if (isRepeating || currentIndex < length - visibleItems) {
        setCurrentIndex(prevState => prevState + 1);
        setIsTransitioning(true);
    }
  }
  
  const prev = () => {
    if (isRepeating || currentIndex > 0) {
        setCurrentIndex(prevState => prevState - 1);
        setIsTransitioning(true);
    }
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (isRepeating) {
      if (currentIndex === 0) {
        setTransitionEnabled(false);
        setCurrentIndex(length);
      } else if (currentIndex === length + visibleItems) {
        setTransitionEnabled(false);
        setCurrentIndex(visibleItems);
      }
    }
  }

  const addToPrev = () => {
    let output = []
    for (let i = 0; i < visibleItems; i++) {
      if (items[length - 1 - i]) {
        output.push(carouselContent(items[length - 1 - i]));
      }
    }
    output.reverse();
    return output;
  }

  const addToNext = () => {
    let output = []
    for (let i = 0; i < visibleItems; i++) {
      if (items[i]) {
        output.push(carouselContent(items[i]));
      }
    }
    return output;
  }

  const handleFilter = (e) => {
    if (e.target.value === 'all') {
      items = Object.assign([], list);
    } else {
      items = list.filter((item) => item.category.toLowerCase() === e.target.value);
    }
    setFilter(e.target.value);
  }

  const carouselContent = (item) => (
    <div 
      key={`content-${item.id}`} 
      className={(item.id === currentIndex-1 || (item.id === currentIndex-length-1) || (item.id-length === currentIndex-1)) ? "carousel-content-highlighted" : null}
    >
      <img key={item.id} src={item.imageUrl} alt={`image-${item.id+1}`} style={{width: '100%'}} />
      <div className="carousel-content-info">
        <div>
          Name: {item.name}
        </div>  
        <div>
          Price: Rs. {item.price}
        </div>
        <div>
          Category: {item.category}
        </div>
      </div>
    </div>);

  return <div>
    <div>
      Filter By: 
      <select defaultValue={filterValue} onChange={handleFilter} >
        <option value="all">All</option>
        <option value="tour">Tour</option>
        <option value="camping">Camping</option>
        <option value="hiking">Hiking</option>
      </select>
    </div>
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {
          (isRepeating || currentIndex > 0) && <button disabled={isTransitioning} onClick={prev} className="left-arrow">&lt;</button>
        }
        <div className="carousel-content-wrapper">
          <div 
            className={`carousel-content visible-${visibleItems}`} 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              transition: !transitionEnabled ? 'none' : undefined
            }}
            onTransitionEnd={() => handleTransitionEnd()}
          >
            { length > visibleItems && isRepeating && addToPrev() }
            
            {items.map((item) => carouselContent(item))}
            
            { length > visibleItems && isRepeating && addToNext() }
          </div>
        </div>
        {
          (isRepeating || currentIndex < (length - visibleItems)) && <button disabled={isTransitioning} onClick={next} className="right-arrow">&gt;</button>
        }
      </div>
    </div>
  </div>;
}

export default Carousel