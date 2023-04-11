import React, {
    useRef,
    useState,
    useEffect
} from "react";
import axios from "../../api/axios";

/* REGEX statments - used to validate username and password */
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
    const userRef = useRef(); // to set the focus on first input when component loads
    const errRef = useRef(); // to set the focus on the errors if they occur

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false); // name validates or not
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false); // passwords validates or not
    const [passwordFocus, setPasswordFocus] = useState(false); 

    const [matchPassword, setMatchPassword] = useState("");
    const [validMatch, setValidMatch] = useState(false); // passwords match or not
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMessage, setErrMessage] = useState("");
    const [success, setSuccess] = useState(false);

    /* Setting the focus when component loads */
    useEffect(() => {
        userRef.current.focus();
    }, [])

    /* Validates the username */
    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidUsername(result);
    }, [username])

    /* Validates the password */
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
        const match = password == matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    /* Clears error message when user changes values */
    useEffect(() => {
        setErrMessage("");
    }, {username, password, matchPassword})

    const handleSubmit = async (e) => {
        e.preventDefault(); // stops page from reloading

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username, password }), 
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMessage("No server response");
            } else if (err.response?.status === 409) {
                setErrMessage("Username taken");
            } else {
                setErrMessage("Registration failed");
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <div>
                    <h2>Success!</h2>
                </div>
            ): (
                <div>
                    {/* Displays any error message */}
                    <p ref={errRef} className={errMessage ? "errmsg" : 
                    "offscreen"} aria-live="assertive">{errMessage}</p>

                    <h2>Register</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Username:</label>
                        <input 
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            aria-invalid={validUsername ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && username &&
                        !validUsername ? "instructions" : "offscreen"}>
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, number, underscores, hyphens allowd. 
                        </p>

                        <label>Password:</label>
                        <input 
                            type="password"
                            if="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" :
                        "offscreen"}>
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special
                            character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <label>Confirm Password:</label>
                        <input 
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPassword(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" :
                        "offscreen"}>
                            Must match the first password input field.
                        </p>

                        <button disabled={!validUsername || !validPassword || !validMatch ? true : false}>
                            Sign Up
                        </button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span>
                            {/* put router link here */}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </div>
            )}
        </>
    )
}

export default Register;