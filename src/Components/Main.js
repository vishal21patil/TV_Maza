import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Main.css";
import Shows from "./Shows";

function Main() {
  const [inp, setInp] = useState("");
  const [search, setSearch] = useState("people");
  const [showList, setShowList] = useState([]);

  let heightRef = useRef(100);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.tvmaze.com/search/${search}?q=${inp}`
      );
      let data = await res.json();

      if (search === "people") {
        const personObj = data.find((ele) => {
          return ele.person.name.toLowerCase() === inp.toLowerCase();
        });
        const id = await personObj.person.id;

        const res1 = await fetch(
          `https://api.tvmaze.com/people/${id}/castcredits?embed=show`
        );
        data = await res1.json();
      }

      setShowList([...data]);
      if (data.length > 0) {
        heightRef.current = 75;
      } else {
        heightRef.current = 100;
      }
    };
    fetchData();
  }, [inp]);

  const change = (e) => {
    setInp(e.target.value);
  };

  const debounce = function (func, delay, immediate) {
    let timer;

    return (e) => {
      if (!timer && immediate) {
        func(e);
      }
      clearTimeout(timer);

      timer = setTimeout(() => {
        func(e);
      }, 500);
    };
  };
  const inputChange = useCallback(debounce(change, 500, true), []);

  return (
    <>
      <div className="container" style={{ height: `${heightRef.current}vh` }}>
        <div className="input">
          <span className="heading">
            TV<span className="innerHeading">maze</span>
          </span>
          <span className="subHeading">Search your favorite shows</span>

          <input
            type={"radio"}
            name={"radio"}
            id={"actor"}
            className={"option"}
            checked={search === "people" ? true : false}
            onClick={() => {
              setSearch("people");
              setInp("");
              setShowList([]);
            }}
          ></input>

          <label for={"actor"}>Actor</label>

          <input
            type={"radio"}
            name={"radio"}
            id={"shows"}
            className={"option"}
            onClick={() => {
              setSearch("shows");
              setInp("");
              setShowList([]);
            }}
          ></input>

          <label for={"shows"}>Shows</label>

          <div>
            <span className="searchtip">Enter {search} below</span>

            <input
              type={"text"}
              onChange={inputChange}
              placeholder={search === "people" ? "e.g:- Robert Downey Jr." : "e.g:- IronMan"}
              className={"search"}
            ></input>
          </div>
          {inp && showList.length === 0 ? (
            <h2 style={{ color: "red" }}>Oops...No Result found &#128542;</h2>
          ) : null}
        </div>
      </div>
      <div className="showBox">
        {showList.map((show) => (
          <Shows search={search} eachShow={show}></Shows>
        ))}
      </div>
    </>
  );
}

export default Main;
