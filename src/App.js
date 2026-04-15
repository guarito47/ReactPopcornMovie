import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useMovies } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function SearchBox({ query, setQuery }) {
  /*we lift this query to the upper component (App)
  //const [query, setQuery] = useState("");*/
  const inputEl = useRef(null);
  /*we are passing what happend when a specific keypress is hitted, we handle if when its already focus 
  in search input and hits enter after typing this will clean the input and will clean the list of result,
  not good, so if its the case do nothing*/
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    setQuery(""); //also after focus we will clean the prvius text
  });

  // //useEffect to focus on input search box after every page load
  // useEffect(
  //   function () {
  //     //console.log(inputEl.current);
  //     /*we name a function on order to reference the exacta semae function in cleanUp return tpo remove it
  //   as all event handling we receive an event object*/
  //     function callBack(e) {
  //       if (e.code === "Enter") {
  //         /*we handle if when its already focus in search input and hits enter after typing this will clean the input
  //     and will clean the list of result, not good, so if its the case do nothing*/
  //         if (document.activeElement === inputEl.current) return;

  //         inputEl.current.focus();
  //         setQuery(""); //also after focus we will clean the prvius text
  //       }
  //     }

  //     document.addEventListener("keydown", callBack);

  //     return () => document.removeEventListener("keypress", callBack);
  //   },
  //   [setQuery], //no need to set setQuery because at the end this donesnt change but just because eslint suggest we set
  // );

  /* a way to focus the serach box (not the best instead better userf)
  useEffect(function () {
    const el = document.querySelector(".search");
    console.log(el);
    el.focus();
  }, []);*/

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    //once we reach the level where we will use the parameter id is where we use the callBack function
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {
        /*IMPORTANT NOTE: before was {children} but throw an error 
        // "Objects are not valid as a React child (found: object with keys {children})"
        basically means the we are cresting a new object, which is not neccesary, all that we want is
        really conditionaly render this children prop, so to do that just remove the {}*/
        isOpen && children
      }
    </div>
  );
}
/*
function BoxByElement({ element }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {
        /*IMPORTANT NOTE: before was {children} but throw an error 
         "Objects are not valid as a React child (found: object with keys {children})"
        basically means the we are cresting a new object, which is not neccesary, all that we want is
        really conditionaly render this children prop, so to do that just remove the {}*/ /*
        isOpen && element
      }
    </div>
  );
}*/

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        {/* IMPORTANT: correct way to pass the function in onClick: onClick={() => onDeleteWatched(movie.imdbID)}
           // this will execute in runtime/live, if we set onClick={onDeleteWatched(movie.imdbID)} without ()=>()
          will execute in render phase, without having the user intervention like compiling phase... */}
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// function WatchedBox() {
//   //now is deprecated because now we use the reusable component 'Box'
//   //to keet the functionality we lift whathed,setWatched states
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({}); //the movie fetched from selectedId movie
  const [isLoading, setIsLoading] = useState(false); //to handle motion icon when its loading the data
  const [error, setError] = useState(""); //keeps the error message
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);

  //no need list line but just to dont show its non use warning
  console.log(error);
  /*we cannot mutate(change value) the value of a useRef in the logic, we need to do it in a useEfeect
and we will do each time the userRating changes, to capture the times that change his mind*/
  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating],
  );

  /*to prevent to add an movie already rated, first just create a NEW ARRAY with only imdbID's (using map) 
  with that array we will ask if already exist in the whatched list*/
  const isWacthed = watched.map((movie) => movie.imdbID).includes(selectedId);
  /* also we will get the userRating in case that we select an already movie watched find() will return the object
  that meets the condition, IMPORTANT: to dont tyhrow error when try null.userRating, we only specify conditionally
  do this operation when is not null, that why we use the operator ? before trying top access a property*/
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating; //console.log(isWacthed);
  /*this is like a unwrap the fields of the object movie, but now renamed for each field as required, this case
//just by lowering the inicial capital letter*/
  const {
    Title: title, //we are renaming the uncoming fields of data, by just lowering the initial character
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating, //when no needed just leave it as it comes
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    //as the local data from unwrap the movie, having the movie info, just need to process into whatedMovie format
    const newWatched = {
      imdbID: selectedId, //because the selectedId is as well imdb id
      title,
      year,
      poster,
      imdbRating: Number(imdbRating), //casting to db format (number)
      /*runtime its shows 148 min we need just 148 and remove the " min"
      split cut where find " " the result us ["148", "min"], we keep [0] that contains ("148")*/
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatched);
    onCloseMovie();
  }

  /*console.log(title, year);//
  //because for a selectedId we need to FETCH their details (side effects), we need to use useEffect*/
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          );

          if (!res.ok)
            throw new Error(
              "something went wrong with fetching movie details...",
            );

          const data = await res.json();
          //now will handle when theres no movies with the specific selectedId
          if (data.Response === "False") throw new Error("Movie not found...");
          //as you know updateStates dont ocurr as soon we read the intruction, instead its batched

          //console.log(data);
          setMovie(data);
        } catch (error) {
          console.log(error);
          setError(error.message + " by setErrorMovieDetails");
        } finally {
          setIsLoading(false);
        }
      }

      if (selectedId === null) {
        setError("");
        setIsLoading("false");
      }

      getMovieDetails();
    },
    [selectedId],
  );

  useEffect(
    function () {
      /*to handle the first time that title is undefined we will not change nothing just leave this function
      //otherwise if ewxist a title will jump the condition and will change the document title*/
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "UsePopcorn";
        //console.log(`cleanup effect for movie ${title}`);
      };
    },
    [title], //if we  set [] only once will be executed and not for the rest interactions, so we need to specify
    //everytime that title changes we need to to re render with the newest title
  );

  useKey("Escape", onCloseMovie); //to handle esc keypress to do the same a back movie details button

  // useEffect(
  //   function () {
  //     /*as we know useffect is to do tasks outside react, in this case interacting with the DOM outside react
  //     but this is a good example to use cleanUp return function, here as you can see the addListener will ADD
  //     a new keydown function each time that this code runs, you can see by seeing the console.log repeationg +1
  //     each time that we close a selected movie*/
  //     /*as you know we can directly set this function as anonymous directly in the add listener but because
  //     we will need to reffer this exact function later when we neer to remove this exact one, thats why we need
  //     to name thsi function   */
  //     function callBack(e) {
  //       if (e.code === "Escape") onCloseMovie(); //console.log("closing by escape key");
  //     }
  //     document.addEventListener("keydown", callBack);

  //     return function () {
  //       /*so in this cleanUp function everytime that a component is mounted or unmounted
  //       we will remove the existing keydown event, like only happen while its alive the component
  //        */
  //       document.removeEventListener("keydown", callBack);
  //     };
  //   },
  //   [onCloseMovie],
  // );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWacthed ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    /*IMPORTANT: here we dont implement a function to handle this update, we can do it of course and can works fine
but by just sending directly the setter the StarRating receives as prop an in their implementation and it execute 
like this onSetRating(rate); that translate as setUserRating(rate) */
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      +Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you rated this movie {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>{actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}

      {/* //if we will not pass any argument to the function we can leave the single name without callBack */}
    </div>
  );
}

const KEY = "5861a758";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  /* live test about use types of useEffect behavior 
  useEffect(function () {
    console.log("function [] after(despues) first render A");
  }, []);

  useEffect(function () {
    console.log("function empty after(despues) every render B");
  });

  useEffect(
    function () {
      console.log(
        "function dependecy after(despues) change state of dependecy D",
      );
    },
    [query],
  );

  console.log("during render C");*/

  /* older version using a based promise  function
  useEffect(function () {
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      //this fetch return a promise that why we use then inside the result is a response object
      .then((res) => res.json()) //we recieve this response and we tell to return as .json object
      /*this return as a promise again so we chain another then when we recieve a data which
    //for now will see it in the console
    //we know is Search property because first we saw in the console the json structure
    //by updating a state (setMovies) inside the component will cause a infinite loop
    //by the nature to render again by changing a state component
    //.then((data) => setMovies(data.Search));
    // but if we move tho an useEffect now can works as we need
     .then((data) => setMovies(data.Search));
  //}, []); //empty array neabs onbly will run on mount/first render*/

  /* newest function using asyc/await, 
  //IMPORTANT: but when using as useEffect function is not directly allowed
  //from React: Effect callbacks are synchronous to prevent race conditions. Put the async function inside: ()=>
  so react indicates to put inside a callback function again, also function (){} works as well*/

  function handleSelectMovie(newSelectedId) {
    /*deprecated way, no handle when click the same already movieId selected, this time will close
    //setSelectedId(movieID);*/
    /*IMPORTANT: because we will use function var like selectedId, we need to pass as function parameter
    //this line works but dont guarantee the latest selectedId state, use always the instructor way
    //setSelectedId(() => (selectedId === newSelectedId ? null : newSelectedId));*/
    setSelectedId((selectedId) =>
      selectedId === newSelectedId ? null : newSelectedId,
    );
  }

  function handleCloseMovie() {
    //when click the rounded button with arrow left, menmas close the movie details
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    watched.filter((w) => w.imdbID === movie.imdbID).length === 0 &&
      setWatched((watched) => [...watched, movie]);
    /*this instruction was moved to an effect to reutilize the process to store like in cache browser in key value pairs
    // the watched list, in order to dont have the hugly empty box of watched movies
    //as you know doing in the below way will not have the updated and we cant pass a function so we
    //redo the same operation as setWatched
    //localStorage.setItem("watched", watched);
    // also we convert this array into string, because the value only can be string (maybe an object)
    localStorage.setItem("watched", JSON.stringify([...watched, movie]));*/
  }

  /* own solution to dont duplicate movies in already whatched list also retrieves the userRating is already exist 
  function handleIsAlreadyRated(selectedId) {

    const rated = watched.filter((w) => w.imdbID === selectedId);
    console.log("rated length " + rated.length);
    return rated.length === 0 ? "" : rated.at(0).userRating;
  }
  */

  function handleDelete(id) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/*Another way to pass components by props
        <BoxByElement element={<MovieList movies={movies} />} />
        <BoxByElement
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {
            /* deprecated way
          //isLoading ? <Loader /> : <MovieList movies={movies} />
          //to append the error condition in the line above will incurr in a ugly nested conditions, instead
          //we can handle one by one in a single conditions, where only one condition can be true over the all conditions
          //if isLoading is true we will print the loader*/
            isLoading && <Loader />
          }
          {
            //if isLoading is !false (already finish the fetch) and theres no error !("") then print the movieList
            !isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )
          }
          {
            //if theres an error then proint the error
            error && <ErrorMessage message={error} />
          }
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
