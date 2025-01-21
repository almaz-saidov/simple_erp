import { useEffect, useState, Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg';
import { useNavigate } from 'react-router-dom';
import { retrieveLaunchParams } from "@telegram-apps/sdk";

import './styles/App.css';
import "./styles/LoaderWrapper.css";

function App() {
    const [loading, setLoading] = useState(true);
    const [timeoutReached, setTimeoutReached] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const timeout = setTimeout(() => {
            setTimeoutReached(true);
            setLoading(false);
        }, 3000); // Задержка на 3 секунды

        try {
            const csrfToken = "almaz-ymeet-delat-graz";
            const init_data = retrieveLaunchParams().initDataRaw;
            //console.log(init_data);

            const initializeAuth = async (postUrl) => {
                try {

                    //console.log("RESPONSE__TRY");
                    const response = await fetch(postUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': csrfToken,
                        },
                        body: JSON.stringify(
                            {
                                initData: init_data,
                            }
                        ),
                    });
                    //console.log("RESPONSE__1", response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log("RESPONSE_DATA", data);
                    //console.log("USER_STATUS", data.user_status);
                    localStorage.setItem('user_status', data.user_status);
                    setIsAuthorized(true);
                    // Теперь этот редирект будет происходить в следующем useEffect 
                    timeoutReached && setLoading(false); // Обновляем состояние загрузки
                    return; // Выходим из функции
                } catch (error) {
                    timeoutReached && setLoading(false);
                    console.error('Ошибка при авторизации:', error);
                }
            };

            initializeAuth('https://asm3ceps.ru/api/auth');

        } catch (e) {
            timeoutReached && setLoading(false);
            console.log("Error", e.message);
        }

        return () => clearTimeout(timeout); // Очистка таймера при размонтировании
    }, []);

    useEffect(() => {
        if (!loading && timeoutReached && isAuthorized) {
            navigate('/front');
            window.location.reload();
        }
    }, [loading, timeoutReached, navigate]);

    return (
        <div className="App">
            {loading || isAuthorized ? (
                <div className='VideoLoaderWrapper'>
                    <div className='VideoWrapper'>
                        <img className="LoaderGif" src="/static/1.gif" alt="я джифка"></img>
                    </div>
                    <span>СОБИРАЕМ ДЕТАЛИ...</span>
                </div>
            ) : (
                <Fragment>
                    <FailIcon className='FailAuthIcon' />
                    <h1 className='FailAuthMessage'>Unauthorized Access</h1>
                </Fragment>
            )}
        </div>
    );
}

export default App;
