import React, {
    useRef,
    useState,
    useEffect,
    useContext
} from "react";
import {
    Container,
    Form,
    InputGroup,
    Button
} from "react-bootstrap";
import "../css/LoggedOut.css";
import AuthContext from "../../context/AuthProvider";

import axios from "../../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
    const { setAuth } = useContext(AuthContext); // to set auth state and store it in the global context

    const userRef = useRef(); // to set the focus on first input when component loads
    const errRef = useRef(); // to set the focus on the errors if they occur

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus(); // sets focus on first input when component loads
    }, []) 

    useEffect(() => {
        setErrMessage(""); // empties error message if user changes state of username or password
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault(); // stops page from reloading
        
        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({username, password}),
                {
                    header: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({ username, password, roles, accessToken }); // saved in the global context

            setUsername("");
            setPassword("");
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                // there is no response but still error
                setErrMessage("No server respone");
            } else if (err.respone?.status === 400) {
                // expected info was not recieved
                setErrMessage("Missing username or password");
            } else if (err.response?.status === 401) {
                setErrMessage("Unauthorized");
            } else {
                setErrMessage("Login failed");
            }
            errRef.current.focus(); // sets focus on error display
        }
    }

    return(
        <>
            {success ? (
                <section>
                    <h2>You are logged in!</h2>
                    <br />
                </section>
            ) : (
                <Container>
                    {/* Displays any error message */}
                    <p ref={errRef} className={errMessage ? "errmsg" :
                    "offscreen"} aria-live="assertive">{errMessage}</p>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Username:</label>
                        <input 
                            type="text" 
                            id="username"
                            ref={userRef} // Sets focus on this input
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />
                        <label>Password:</label>
                        <input 
                            type="password" 
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an account? <br />
                        <span>
                            {/* put router link here */}
                            <a href="#">Register</a>
                        </span>
                    </p>
                </Container>
            )}
        </>
    )
}

export default Login