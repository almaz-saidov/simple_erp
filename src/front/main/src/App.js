import './styles/App.css';
import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import History from './cards/history/History';
import Issuance from './cards/issuance/Issuance';
import Receipt from './cards/receipt/Receipt';
import Returns from './cards/returns/Returns';
import Search from './cards/search/Search';
import { Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { auth } from './api/Api';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg'
import toast, { Toaster } from 'react-hot-toast';
import { retrieveLaunchParams } from "@telegram-apps/sdk";
function App() {
  const [currentCardId, setCurrentCardId] = useState(0);
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false); // Start with loading true

  // useEffect(() => {
  //   const checkAuthorization = async () => {
  //     try {
  //       // Call the auth function and wait for it to resolve
  //       const authSuccess = await auth();
  //       setAuthorized(authSuccess); // Set authorized based on the result
  //     } catch (error) {
  //       console.error("Authorization error:", error);
  //       setAuthorized(false); // In case of an error, set authorized to false
  //     } finally {
  //       setLoading(false); // Stop loading regardless of success or failure
  //     }
  //   };

  //   checkAuthorization(); // Call the authorization function on component mount
  // }, []); // Empty dependency array means this runs once when the component mounts

  useEffect(() => {
    // Вызываем метод SDK при монтировании компонента
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const cards = [<Search />, <Issuance />, <Receipt />, <Returns />, <History />];

  const renderComponent = () => {
    return cards[currentCardId];
  };

  return (
    <div className="App">
      {loading ? (  // Show the loader while loading
        <div className='LoaderWrapper'>
          <SyncLoader color="#A7A7A7" />
        </div>
      ) : authorized ? (  // Show the main content if authorized
        <Fragment>
          <div className='Card'>
            {renderComponent()}
          </div>
          <Nav getCurrentCardId={() => currentCardId} setCurrentCardId={setCurrentCardId} />
          <Toaster toastOptions={{
            duration: 1000,
            style: {
              backgroundColor: '#131313',
              color: '#DBDBDB',
            }
          }} />
        </Fragment>
      ) : (  // Show the unauthorized message if not authorized
        <Fragment>
          <FailIcon className='FailAuthIcon' />
          <h1 className='FailAuthMessage'>Unauthorized Access</h1>

        </Fragment>
      )}

    </div>
  );
}

export default App;
