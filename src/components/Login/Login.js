import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

//REDUCER FN
const emailReducer = (state, action) => {
  //if there is user input retun the new snapshot
  if (action.type === "USER_INPUT") {
    //difference betwen val and value
    //Dispacth is the action
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
//REDUCER FN
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  //USE REDUCER DECLARE
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    console.log("EFFECT RUNNING");
    return () => {
      console.log("EFFECT CLEAN");
    };
  }, []);
  //onject destructing by giving aliat emailIsValid optimze use effect so that the functiondoes not do extra chekign after the from was already valid, only check when there is change in validity

  //USE REDUCERE STATE emailState
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  useEffect(() => {
    //effect function rerun when entered email of password changes
    const identifier = setTimeout(() => {
      console.log("check form validity");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("cleanup");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    //updating state based on two other states, NEEDs funnction form. IF NEXT state update depends on prev state snapshot of SAME state. Here we depends on two other state snapshots of different  states not SetFormValidity
    // setFormIsValid can run before before enteredPassword state updaate processes (may not have latest enteres passowrd )

    //ACTIVATE DISPATCH FN in email changehandler
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    //can comment out if useEffect
    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);

    //DISPATCH FN
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    //isValidstate depends on the enteredemail state and cant pass prevstate in setEmail valid because the prevs ate is not that of the entered email
    //can also do email state onbject with value and valid in same object

    // setEmailIsValid(emailState.isValid);

    //ACTIVATE DISPATCH FN in validate email changehandler
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);

    //DISPATCH FN when is BLUR
    dispatchPassword({ type: "INPUT_BLUR" });
  };
  console.log(formIsValid);
  const submitHandler = (event) => {
    event.preventDefault();
    console.log(formIsValid);
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
      console.log(formIsValid);
    } else if (!emailIsValid) {
      //focus back on the invalis input
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          label="E-mail"
          // for  props.isValid or  props.emailState.isValid
          isValid={emailIsValid}
          type="email"
          id="email"
          //USE REDUCER EMAIL STE
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />

        <Input
          ref={passwordInputRef}
          label="password"
          id="password"
          // for  props.isValid or  props.emailState.isValid
          isValid={passwordIsValid}
          type="password"
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
            //remove to be always clickable disabled={!formIsValid}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
