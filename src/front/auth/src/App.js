import React, { Fragment, useEffect, useState } from 'react'
import toast, { Toaster, useToasterStore } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg'


import gif from '../src/assets/1.gif'
import "./styles/LoaderWrapper.css"

import styles from './styles/App.module.css'

function App() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [timeoutReached, setTimeoutReached] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [state, setState] = useState('idol');
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && timeoutReached && isAuthorized) {
            // navigate('/front/test');
            // window.location.reload();
        }
    }, [loading, timeoutReached, navigate]);

    const handleLogin = () => {
        if (!password || !login || password.length === 0 || login.length === 0) {
            toast.error('Заполните все поля');
            return;
        }

        setState('loading');

        setTimeout(async() => {
            await fetch('http://192.168.10.10/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password
                }),
            })
                .then(res => {
                    setState('idol');
                    toast.success('URA');
                    // navigate('/front');
                    // window.location.reload();
                })
                .catch(e => {
                    setState('error');
                    toast.error(e.message);
                });
        }, 1500);
    };

    return (
        <div className={styles.App}>
            {state === 'idol' ?
                <div className={styles.content}>
                    <h1 className={styles.authHeader}>MG Parts</h1>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="loginInput">Login</label>
                        <input
                            id="loginInput"
                            name="login"
                            type="text"
                            value={login}
                            onChange={(e) => { setLogin(e.target.value) }}
                            className={styles.input}
                            required
                        />

                        <label htmlFor="passwordInput">Password</label>
                        <input
                            id="passwordInput"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" id="submitButton" className={styles.loginButton} onClick={handleLogin}>Login</button>
                </div>
                : state === 'loading' ? (
                    <div className={styles.VideoLoaderWrapper}>
                        <div className={styles.VideoWrapper}>
                            <img className={styles.LoaderGif} src={gif} alt="я джифка"></img>
                        </div>
                        <span>СОБИРАЕМ ДЕТАЛИ...</span>
                    </div>
                ) : (
                    <Fragment >
                        <FailIcon className={styles.FailAuthIcon} />
                        <h1 className={styles.FailAuthMessage}>Unauthorized Access</h1>
                    </Fragment>
                )}
            <ToasterWithMax toastOptions={{
                duration: 1000,
                style: {
                    backgroundColor: '#131313',
                    color: '#DBDBDB',
                }
            }} />
        </div >

    );
}

export default App;


function useMaxToasts(max) {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= max)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts, max]);
}

export function ToasterWithMax(props) {
    const { max = 1, ...restProps } = props;
    useMaxToasts(max);

    return <Toaster {...restProps} />;
}
