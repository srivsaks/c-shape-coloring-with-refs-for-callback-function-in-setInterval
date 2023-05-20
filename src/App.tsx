import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

// Approach of using refs was inspired from here https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export default function App() {
  const [divs, setDivs] = useState(Array.from({ length: 7 }));
  const [uncolorOrder, setUnColorOrder] = useState([]);
  const [locked, setLocked] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const savedCb = useRef(null);

  const cb = useCallback(() => {
    //console.log(uncolorOrder);
    if (uncolorOrder.length === 0) {
      //clearTimeout(timerId);
      setLocked(false);
      savedCb.current = null;
      return;
    }

    const curr = uncolorOrder[0];
    const newArr = [...uncolorOrder];
    newArr.shift();
    setDivs((prev) => {
      const oldDivs = [...prev].map((div, currIndex) => {
        if (currIndex === curr) return "white";
        else return div;
      });
      return oldDivs;
    });
    setUnColorOrder(newArr);
    console.log(newArr);
  }, [uncolorOrder, divs]);

  useEffect(() => {
    savedCb.current = cb;
  });

  const onColorBox = useCallback(
    (e: any, index: number) => {
      if (divs[index] === "green" || locked) return;
      else {
        setDivs((prev) => {
          const oldDivs = [...prev].map((div, currIndex) => {
            if (currIndex === index) return "green";
            else return div;
          });
          return oldDivs;
        });
        setUnColorOrder((prev) => [index, ...prev]);
      }
    },
    [locked, divs]
  );

  useEffect(() => {
    if (locked) return;
    if (uncolorOrder.length === 7) {
      setLocked(true);

      function myNewCb() {
        if (savedCb.current) savedCb.current();
      }
      //startUncoloring();

      const id = setInterval(myNewCb, 1000);
      setTimerId(id);
    }
    return () => {
      if (timerId && !locked) clearTimeout(timerId);
    };
  }, [uncolorOrder, locked]);
  //console.log(savedCb.current ? savedCb.current.length : savedCb.current);
  //console.log(uncolorOrder, divs);
  return (
    <div className="container">
      {divs.map((_, index) => {
        return (
          <div
            onClick={(e) => {
              onColorBox(e, index);
            }}
            style={{ background: divs[index] }}
            className={`box ${index === 3 ? "three" : ""}`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}
