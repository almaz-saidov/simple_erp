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

    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTimeoutReached(true);
            setLoading(false);
        }, 3000); // Задержка на 3 секунды

        try {
            const csrfToken = "almaz-ymeet-delat-graz";
            const init_data = retrieveLaunchParams().initDataRaw;
            console.log(init_data);

            const initializeAuth = async (postUrl) => {
                try {
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

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    localStorage.setItem('authorize', init_data);
                    navigate('/front');
                    window.location.reload();
                } catch (error) {
                    setLoading(false);
                    console.error('Ошибка при авторизации:', error);
                }
            };

            initializeAuth('https://asm3ceps.ru/api/auth');

        } catch (e) {
            setLoading(false);
            console.log("Error", e.message);
        }

        return () => clearTimeout(timeout); // Очистка таймера при размонтировании
    }, []);

    useEffect(() => {
        if (!loading && timeoutReached) {
            setLoading(false);
            console.log('end of loading')
        } else {
            setLoading(true);
        }
    }, [timeoutReached, loading]);

    return (
        <div className="App">
            {loading ? (
                // <div className='LoaderWrapper'>
                //     <SyncLoader color="#A7A7A7" />
                // </div>
                <div className='VideoLoaderWrapper'>
                    <div className='VideoWrapper'>
                        <video
                            className="LoaderVideo"
                            src="/loading.mp4" // Укажите путь к вашему видео
                            autoPlay
                            loop
                            muted
                            type="video/mp4"
                            position="block"
                        />
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
