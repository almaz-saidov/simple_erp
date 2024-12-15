import './styles/App.css';
import { useEffect, useState, Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import $ from 'jquery';

import "./styles/LoaderWrapper.css";

export const auth = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(false);
        }, 2000);
    });
};

function App() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Используем useNavigate

    useEffect(() => {
        window.AuthPostRequest = {}

        window.AuthPostRequest.initialize = function (post_url) {
            const csrfToken = "{{ secret_key }}"
            const init_data = window.Telegram.WebApp.initData
            setLoading(true);
            $.ajax({
                url: post_url,
                type: 'POST',
                headers: {
                    'Authorization': `Bearer ${init_data}`,
                },
                data: {
                    csrf_token: csrfToken,
                    initData: init_data,
                },
                success: function (response) {
                    setAuthorized(true);
                    localStorage.setItem('authorize', init_data);
                    navigate('response.redirect_url', { state: { init_data } });
                    window.location.reload()
                },
                error: function (xhr, status, error) {
                    navigate('front/error');
                    console.log(error)
                },
            })
            setLoading(false);
        }

        window.AuthPostRequest.initialize(window.location.href)
    }, [navigate]); // Добавляем navigate в зависимости



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
