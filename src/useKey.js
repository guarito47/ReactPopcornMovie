import { useEffect } from "react";

export function useKey(keyPress, action) {
  //keypress can be 'Escape' or 'Enter', action will replace the onCloseMovie, so we can send what happend
  useEffect(
    function () {
      /*as we know useffect is to do tasks outside react, in this case interacting with the DOM outside react
      but this is a good example to use cleanUp return function, here as you can see the addListener will ADD
      a new keydown function each time that this code runs, you can see by seeing the console.log repeationg +1 
      each time that we close a selected movie*/
      /*as you know we can directly set this function as anonymous directly in the add listener but because 
      we will need to reffer this exact function later when we neer to remove this exact one, thats why we need
      to name thsi function   */
      function callBack(e) {
        //to handle mistakes in writing EscApE escapE, we unify the letters before compare
        if (e.code.toLowerCase() === keyPress.toLowerCase())
          //if is the keyprss that we want then do the action that we sent as argument
          action(); //console.log("closing by escape key");
      }
      document.addEventListener("keydown", callBack);

      return function () {
        /*so in this cleanUp function everytime that a component is mounted or unmounted 
        we will remove the existing keydown event, like only happen while its alive the component
         */
        document.removeEventListener("keydown", callBack);
      };
    },
    [action, keyPress],
  );
}
