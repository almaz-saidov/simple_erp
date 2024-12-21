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

  const preventCollapse = (event) => {
    if (window.scrollY === 0) {
      // Prevent the default touch behavior if at the top of the page
      event.preventDefault();
      window.scrollTo(0, 1); // Scroll slightly down to avoid collapsing
    }
  }

  // Attach the above function to the touchstart event handler of the scrollable element


  useEffect(() => {

    const handleResize = () => {
      // Например, вы можете установить флаг о том, что клавиатура открыта
      if (window.innerHeight < window.outerHeight) {
        // Клавиатура открыта
        document.body.style.overflow = 'hidden'; // Прекратить прокрутку
      } else {
        // Клавиатура закрыта
        document.body.style.overflow = 'auto'; // Включить прокрутку
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    document.addEventListener("touchstart", preventCollapse);
    document.addEventListener("touchmove", preventCollapse);

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
    }

    return () => {
      document.removeEventListener("touchstart", preventCollapse);
      document.removeEventListener("touchmove", preventCollapse);
      window.removeEventListener('resize', handleResize);

    };
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
