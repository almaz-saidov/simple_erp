import './styles/App.css';
import { useEffect, useState, Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { retrieveLaunchParams } from "@telegram-apps/sdk";

import "./styles/LoaderWrapper.css";


function App() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // Используем useNavigate

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 4000);

        try {
            const csrfToken = "{{ secret_key }}"; // Замените на реальный токен
            const { init_data } = retrieveLaunchParams();
            console.log(init_data);

            //`const initializeAuth = async (postUrl) => {
            //     try {
            //         const response = await fetch(postUrl, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'X-CSRFToken': csrfToken,
            //             },
            //             body: JSON.stringify({ initData: init_data }),
            //         });

            //         if (!response.ok) {
            //             throw new Error('Network response was not ok');
            //         }

            //         const data = await response.json();
            //         setAuthorized(true);
            //         localStorage.setItem('authorize', init_data);
            //         navigate(data.redirect_url, { state: { init_data } }); // используйте правильный путь для редиректа
            //         window.location.reload();
            //     } catch (error) {
            //         console.error('Ошибка при авторизации:', error);
            //         navigate('front/error');
            //     }
            // };

            //initializeAuth('https://asm3ceps.ru/api/auth');

        } catch (e) {
            console.log("Error", e.message);
        }

    }, []); // Добавляем navigate в зависимости

    return (
        <div className="App">
            {loading || authorized ? (
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
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
