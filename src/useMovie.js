import { useEffect, useState } from "react";

const KEY = "5861a758";
export function useMovies(query) {
  //result of movies by search
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); //keeps the error message

  useEffect(
    function () {
      /*this handle when we start a new search, the current selected movie will be closed
      IMPORTANT: THE (?.) means tyhath if (?) this function EXIST then execute, 
      also if the user did not pass this function will work anyway, we comented for now for an complex
      infitite loop that we will ressolve later, by setting in the dependency array*/
      //handleCloseMovie?.();
      /*AborController is a native browser function that we will use to avoid concurrent race api calls,
      this we need to connect as parameter in the fetch operation*/
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true); //everytime that we are trying to fetch we will start with loading component
          setError(""); //by reset the error we will unblock the (error && <ErrorMessage message={error} )

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }, //here we connect our abortController as signal
          );
          /*since this line we can handle if we receive the data or was interrupted by internet conecction or wherever*/
          if (!res.ok)
            throw new Error("something went wrong with fetching movies...");

          const data = await res.json();
          //now will handle when theres no movies with the specific query movie
          if (data.Response === "False") throw new Error("Movie not found...");
          //as you know updateStates dont ocurr as soon we read the intruction, instead its batched
          setMovies(data.Search);
          /*thats why this intruction doesnt reflect in an updated movie, this will log [] =
      console.log(movies);
        we remove setIsLoading(false); from this line and moved to finally block to remove the loading
        no matter is fecth the data or found an error, this loading ist just while trying to fetch data
          console.log(data);//to show how is the response structure*/
          //also we need to disable the error state because we successfully have our data at this point
          setError("");
        } catch (err) {
          /*we will handle if the error is not caused by an intentional abort by cancel request when fast typing*/
          if (err.name !== "AbortError") {
            console.log(err.message);
            //so only when is not a error caused by ourselves, we have a real error
            setError(err.message + " by setError");
          }
        } finally {
          setIsLoading(false);
        }
      }
      /*we notice that when serachbox input is empty by initial state or by deleting text
      always show the error message of no results for "" movie, so wil handle when reach a "" input*/

      if (query.length < 3) {
        /*to limitate the operation to look movies with 2 letters
        //if we have a "".lenght*/
        setMovies([]); //to dont show the previous result search
        setError(""); //to unblock error && <ErrorMessage message={error}
        return; //if "" input no needed to try to look a movie with "" to dont execute the line below
      }

      /*IMPORTANT: as soon we finish to implement the async function we need to call it, if not will not executed
      //dont forget that this is calling inside the function()*/
      fetchMovies();
      //this is the cleanup function of our useEffect hook
      return function () {
        /**IMPORTANT: as we want to dont launch multiple ongoing request while is typing letter by letter, 
         * and as the nature of a cleanUp funtion this runs before and after a rerender occurs, so in our case, 
         * after(despues) the fetch and render, will like close the connection by aborting something already finished 
          but before(antes) executing the render logic will abort any other previous ongoing fetch in process,
          that in fact will speed and save memory to catch innecesary data*/
        controller.abort();
      };
    },
    [query],
  );

  return { movies, isLoading, error };
}
