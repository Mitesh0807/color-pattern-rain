import { useState, useEffect } from "react";
import "./App.css";

const GRID_WIDTH = 15;
const GRID_HEIGHT = 20;
const MIN_DROP_LENGTH = 4;
const MAX_DROP_LENGTH = 8;
const COLOR_CHANGE_INTERVAL = 3000;

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return { hue, saturation: 100, lightness: 50 };
}

function App() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT)
      .fill()
      .map(() => Array(GRID_WIDTH).fill(null))
  );
  const [currentColor, setCurrentColor] = useState(getRandomColor());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dropInterval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);
        for (let y = GRID_HEIGHT - 1; y > 0; y--) {
          for (let x = 0; x < GRID_WIDTH; x++) {
            newGrid[y][x] = newGrid[y - 1][x];
          }
        }
        for (let x = 0; x < GRID_WIDTH; x++) {
          if (!newGrid[0][x] && Math.random() < 0.1) {
            const length = Math.floor(
              Math.random() * (MAX_DROP_LENGTH - MIN_DROP_LENGTH + 1)
            ) + MIN_DROP_LENGTH;
            newGrid[0][x] = { length, position: 0 };
          } else if (newGrid[0][x]) {
            newGrid[0][x] = {
              ...newGrid[0][x],
              position: newGrid[0][x].position + 1,
            };
            if (newGrid[0][x].position >= newGrid[0][x].length) {
              newGrid[0][x] = null;
            }
          }
        }
        return newGrid;
      });
    }, 100);

    const colorInterval = setInterval(() => {
      setCurrentColor(getRandomColor());
    }, COLOR_CHANGE_INTERVAL);

    return () => {
      clearInterval(dropInterval);
      clearInterval(colorInterval);
    };
  }, []);

  const handleTouch = () => {
    setCurrentColor(getRandomColor());
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="content">
    <div 
      className={`app-container ${isAnimating ? 'animate' : ''}`} 
      onTouchStart={handleTouch}
      onClick={handleTouch}
    >
      <div className="grid-container">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell ${cell ? 'active' : ''}`}
                style={{
                  backgroundColor: cell
                    ? `hsl(${currentColor.hue}, ${currentColor.saturation}%, ${Math.max(20, currentColor.lightness - (cell.position * 5))}%)`
                    : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default App;
