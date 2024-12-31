import './styles/App.css';
import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import History from './cards/history/History';
import Sells from './cards/sells/Sells';
import Purchases from './cards/purchases/Purchases';
import Returns from './cards/returns/Returns';
import Search from './cards/search/Search';
import { Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg'
import { Toaster } from 'react-hot-toast';
function App() {
  const [currentCardId, setCurrentCardId] = useState(0);
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false); // Start with loading true


  const cards = [<Search />, <Sells />, <Purchases />, <Returns />, <History />];

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
