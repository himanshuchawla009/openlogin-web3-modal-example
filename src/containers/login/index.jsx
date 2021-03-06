import "./style.css";

import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import Loader from "../../components/Loader/loader";
import CreateLoginHandler from "../../modules/handlerFactory";

function Login() {
  const [web3LoginHandler, setWeb3LoginHandler] = useState(null);
  const [openloginHandler, setOpenloginHandler] = useState(null);
  const [isLoading, setLoadingStatus] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const existingLoginMethod = localStorage.getItem("LOGIN_METHOD");
    if (existingLoginMethod) {
      history.push("/dashboard");
      return;
    }
    const Web3LoginHandler = CreateLoginHandler("WEB3_MODAL");
    const OpenloginHandler = CreateLoginHandler("OPENLOGIN");
    setWeb3LoginHandler(Web3LoginHandler);
    setOpenloginHandler(OpenloginHandler);
  }, [history]);

  const handleOpenlogin = async (e) => {
    try {
      e.preventDefault();
      setLoadingStatus(true);
      await openloginHandler.connectWeb3();
      // if web3 is initialized it means user has been loggedin
      if (openloginHandler.web3) {
        localStorage.setItem("LOGIN_METHOD", "OPENLOGIN");
        history.push("/dashboard");
      } else {
        localStorage.setItem("LOGIN_METHOD", "OPENLOGIN");
        await openloginHandler.login(e.target[0].value);
      }
      // setTimeout(() => {
      //   setLoadingStatus(false);
      // }, 500);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("error while login", error);
      setLoadingStatus(false);
    }
  };

  const handleWeb3Login = async (e) => {
    try {
      e.preventDefault();
      setLoadingStatus(true);
      await web3LoginHandler.connectWeb3();
      // if web3 is initialized it means user has been loggedin
      if (web3LoginHandler.web3) {
        localStorage.setItem("LOGIN_METHOD", "WEB3_MODAL");
        history.push("/dashboard");
      } else {
        localStorage.setItem("LOGIN_METHOD", "WEB3_MODAL");
        await web3LoginHandler.login();
        history.push("/dashboard");
      }
      setLoadingStatus(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("error while login", error);
      setLoadingStatus(false);
    }
  };

  return isLoading ? (
    <Loader isDone={isLoading} />
  ) : (
    <div className="content-center">
      <div className="login-container">
        <h2>LOGIN</h2>
        <form onSubmit={handleOpenlogin}>
          <div className="col">
            <input type="email" required placeholder="Email" />
            <button type="submit" className="btn-light">
              Sign in with email
            </button>
          </div>
        </form>
        <div className="row">
          <hr className="divider" />
          <div>or</div>
          <hr className="divider" />
        </div>
        <button onClick={handleWeb3Login} type="button" className="btn-solid">
          Sign in with wallet
        </button>
      </div>
    </div>
  );
}

export default Login;
