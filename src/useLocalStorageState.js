import { useState, useEffect } from "react";
//before this was o app, then we reutilize by having their own useHook
//list of whatched movies
//const [watched, setWatched] = useState([]);
/*as initial value we can set as well a function that the value returned will be the initial value
  and we we have a localStorage where is watched list, we can initialized with that
  IMPORTANT: need to be a pure functions meand without parameters
  IMPORTANT: wherever we need to calculate the initial value we will always PASSING a function (){}
  that means a function that react can use at initial render, we are not CALLING we are PASSING
  so we DO NOT do this: useState(localStorage.getItem("watched")); because CALLING will execute every time
  and if this function is heavy to process this will slow the app, but it its just to launch for the very
  first time we and start with some data instead empty, we need to PASS A FUNCTION  that will execute once, */
/*
  const [watched, setWatched] = useState(function () {
    const storeValue = localStorage.getItem("watched");
    //remember that is stored as string we need to convert to an object
    console.log("executing function to setWatched once");
    return JSON.parse(storeValue);
  });*/

export function useLocalStorageState(initialState, keyName) {
  const [value, setValue] = useState(function () {
    const storeValue = localStorage.getItem(keyName);
    /*remember that is stored as string we need to convert to an object (JSON.parse)
    also we wil handle for the first launch will have empty localstorage so in tyhis case we will
    return an empty array[]  (initialState)*/
    return storeValue ? JSON.parse(storeValue) : initialState;
  });

  /*effect to reutilize the process to store like in cache browser in key value pairs
    the watched list, in order to dont have the hugly empty box of watched movies*/
  /*IMPORTANT> as you can see this useEffect is inside a this customHook (leke useState, useEffect, etc)
  so it can contain other useStates, useEffect implementations and this will be still present where 
  in the context where used this customHook (like if was placedc in a separated file))*/
  useEffect(
    function () {
      localStorage.setItem(keyName, JSON.stringify(value));
    },
    /*by set watched as the state trigger, obnly when weatched are changing with effect will run this sideEffect
    //out of React (browser handling(localStorage))*/
    [value, keyName],
  );

  return [value, setValue];
}
