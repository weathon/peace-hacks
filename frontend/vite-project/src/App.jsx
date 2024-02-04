import { BlurFilter } from 'pixi.js';
import { useEffect, useMemo, useState, useCallback } from 'react';

const App = () => {
  const blurFilter = useMemo(() => new BlurFilter(4), []);
  const [background, setBGI] = useState("/lab.png")
  const [x, setX] = useState(512)
  const [y, setY] = useState(512)
  const checkKeyPress = useCallback((e) => {
    const { key, keyCode } = e;
    if (key === 'w') {
      setY(y-20)
    }
    else if (key === 's') {
      setY(y+20)
    }
    else if (key === 'a') {
      setX(x-20)
    }
    else if (key === 'd') {
      setX(x+20)
    }
  }, [x,y]);

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress);
    return () => {
      window.removeEventListener("keydown", checkKeyPress);
    };
  }, [checkKeyPress]);

  return (
    <div style={{ background: `url('${background}')`, backgroundRepeat: "no-repeat", width: "1024px", height: "1024px", left: "0px", top: "0px", position: "absolute" }}>
      <h1 style={{ transform: `translate(${x}px, ${y}px)` }}>a</h1>

    </div>
  );
};

export default App;