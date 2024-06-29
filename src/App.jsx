import { useState, useEffect } from "react";
import "./App.css";

const GRID_WIDTH = 15;
const GRID_HEIGHT = 20;
const MIN_SQUARE_SIZE = 0;
const MAX_SQUARE_SIZE = Math.max(
  Math.ceil(GRID_HEIGHT / 2),
  Math.ceil(GRID_WIDTH / 2)
);
const COLOR_CHANGE_INTERVAL = 3000;

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return { hue, saturation: 100, lightness: 50 };
}

function App() {
  const [grid, setGrid] = useState(
    Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(null))
  );
  const [currentColor, setCurrentColor] = useState(getRandomColor());
  const [isAnimating, setIsAnimating] = useState(false);
  const [squareSize, setSquareSize] = useState(MIN_SQUARE_SIZE);

  const centerY = Math.floor(GRID_HEIGHT / 2);
  const centerX = Math.floor(GRID_WIDTH / 2);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map(row => [...row]);
        
        // Clear the previous square
        if (squareSize > 0) {
          for (let i = -squareSize + 1; i <= squareSize - 1; i++) {
            if (centerY + squareSize - 1 < GRID_HEIGHT) newGrid[centerY + squareSize - 1][centerX + i] = null;
            if (centerY - squareSize + 1 >= 0) newGrid[centerY - squareSize + 1][centerX + i] = null;
            if (centerX + squareSize - 1 < GRID_WIDTH) newGrid[centerY + i][centerX + squareSize - 1] = null;
            if (centerX - squareSize + 1 >= 0) newGrid[centerY + i][centerX - squareSize + 1] = null;
          }
        }

        // Draw the new square
        for (let i = -squareSize; i <= squareSize; i++) {
          if (centerY + squareSize < GRID_HEIGHT) newGrid[centerY + squareSize][centerX + i] = { position: 0 };
          if (centerY - squareSize >= 0) newGrid[centerY - squareSize][centerX + i] = { position: 0 };
          if (centerX + squareSize < GRID_WIDTH) newGrid[centerY + i][centerX + squareSize] = { position: 0 };
          if (centerX - squareSize >= 0) newGrid[centerY + i][centerX - squareSize] = { position: 0 };
        }

        return newGrid;
      });

      setSquareSize((prevSize) => {
        // Check if the square has reached either the last row or last column
        if (
          centerY + prevSize >= GRID_HEIGHT - 1 ||
          centerY - prevSize <= 0 ||
          centerX + prevSize >= GRID_WIDTH - 1 ||
          centerX - prevSize <= 0
        ) {
          // Reset the grid and square size
          setGrid(Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(null)));
          return MIN_SQUARE_SIZE;
        }
        return prevSize + 1;
      });
    }, 500);

    const colorInterval = setInterval(() => {
      setCurrentColor(getRandomColor());
    }, COLOR_CHANGE_INTERVAL);

    return () => {
      clearInterval(updateInterval);
      clearInterval(colorInterval);
    };
  }, [centerX, centerY, squareSize]);

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
                      ? `hsl(${currentColor.hue}, ${currentColor.saturation}%, ${currentColor.lightness}%)`
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