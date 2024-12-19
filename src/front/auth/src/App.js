import { useEffect, useState, Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg';
import { useNavigate } from 'react-router-dom';
import { retrieveLaunchParams } from "@telegram-apps/sdk";

import './styles/App.css';
import "./styles/LoaderWrapper.css";


function App() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

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

                    setAuthorized(true);
                    localStorage.setItem('authorize', init_data);
                    navigate('/front');
                    window.location.reload();
                } catch (error) {
                    console.error('Ошибка при авторизации:', error);
                }
            };

            initializeAuth('https://asm3ceps.ru/api/auth');

        } catch (e) {
            console.log("Error", e.message);
        }
        setLoading(false);
    }, []);

    return (
        <div className="App">
            {loading || authorized ? (
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div>
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
