import { useState } from "react";
//to specify the kind of object into props, modern way to just use TypeScript
import { PropTypes } from "prop-types";

const containerStyle = {
  display: "flex", //to place 2 elements side by side
  alingItems: "center", //aling the element vertically
  gap: "16px",
};

const starContainerStyle = {
  display: "flex", //to place 2 elements side by side
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func,
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  //when descontructing the parameters object we can specify a default value like 5 in this case
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);
  /*before this properties was outside the component because when  we specify by ourselves this values
  //but now it depend from the user (props0 so its needed to live inside to be assigned the values)*/
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color, //instead of writeing color:${color}
    fontSize: `${size / 1.5}px`,
  };

  function handleRating(rate) {
    setRating(rate); //this setter the internal rate
    //this set the external rating something like return function to use our Rate useState from outside
    onSetRating(rate);
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {
          /*we will create dinamically the x number of stars using this function "from",
          // like map will return an array, we just need to specify and object as follow
          //({arrayLenght: length}, function that will be applied for each array position)
          //(_,i) when we will not use the element we can set "_" and work with the index only
          //(_, i) => (<span>S{i + 1}</span>) return an array with span with S (star)+ index
          */
          Array.from({ length: maxRating }, (_, i) => (
            // older implementation that works
            // <Star key={i} onRate={() => setRating(i + 1)} />
            <Star
              key={i}
              onRate={() => handleRating(i + 1)}
              /*dont forget that full only says if the start will be render as fill or empty
              //so for each one we decide depending our tempRating or rating. If we are place hover a star
              //we will have a tempRating position now depending if tempRating is ahead of idex will render full or not
              //but if we are placed out of the starts the mainsRating will decide in the same manner*/
              full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
              //if we mouse over tempRating will setted with the actual i+1 position
              onHoverIn={() => setTempRating(i + 1)}
              //if we leave, wer dont want to store any previus i position we just reset to 0
              onHoverOut={() => setTempRating(0)}
              //now we pass the custom style from the user
              color={color}
              size={size}
            />
          ))
        }
      </div>
      {
        //NOW LETS RENDER THE NUMBER OF THE STARTS SELECTED, IT WILL BE A NUMBER IF WE DONT RECEIVE MESSAGES
      }
      <p style={textStyle}>
        {
          //mains condition, if we receive maxRating equal size of the messages array size
          messages.length === maxRating //
            ? //if yes we have to extract the correcponding message depending the start selected and the corralitive index
              messages[tempRating ? tempRating - 1 : rating - 1]
            : /*if not we will place a number and it will depend first if theres no tempRating selected then rating 
             //rating||"" is a short circuting means if theres no rating (or is 0) put "" to dont show 0 
        //also if we add more || will execute secuencially, means will check tempRating, then rating then...*/
              tempRating || rating || ""
        }
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
