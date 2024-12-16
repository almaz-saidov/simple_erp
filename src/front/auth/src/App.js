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
        // setTimeout(() => {
        //     setLoading(false);
        // }, 4000);

        try {
            const csrfToken = "almaz-ymeet-delat-graz"; // Замените на реальный токен
            const init_data = window.Telegram.WebApp.initData;
            //const { init_data } = retrieveLaunchParams();
            //const init_data  = "user_id=123456789&auth_date=1609459200&first_name=John&last_name=Doe&username=johndoe&photo_url=https://example.com/photo.png&hash=abcdef1234567890"
            //const init_data = 'query_id=123&user=%7B%22id%22%3A1230%2C%22first_name%22%3A%22TestFirstName%22%2C%22last_name%22%3A%22TestSurname%22%2C%22username%22%3A%22TestUsername%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1729453387&hash=123'
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
                        ), // Правильное использование JSON.stringify
                    });



                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setAuthorized(true);
                    localStorage.setItem('authorize', init_data);
                    navigate('/front', { state: { init_data } }); // используйте правильный путь для редиректа
                    window.location.reload();
                } catch (error) {
                    console.error('Ошибка при авторизации:', error);
                    //navigate('front/error');
                }
            };

            initializeAuth('http://127.0.0.1:5000/api/auth');

        } catch (e) {
            console.log("Error", e.message);
        }
        setLoading(false);
    }, []); // Добавляем navigate в зависимости

    return (
        <div className="App">
            {loading ? (
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div>
            ) : authorized ? (
                <Fragment>
                    <FailIcon className='FailAuthIcon' />
                    <h1 className='FailAuthMessage'> Access</h1>
                </Fragment>
            ) :
                (
                    <Fragment>
                        <FailIcon className='FailAuthIcon' />
                        <h1 className='FailAuthMessage'>Unauthorized Access</h1>
                    </Fragment>
                )}
        </div>
    );
}

export default App;
