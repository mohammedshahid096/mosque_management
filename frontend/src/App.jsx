import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import allRoutesMapper from './routes';
import { Toaster } from 'react-hot-toast';
import Welcome from './views/components2/home/Welcome';
import MetaData from './utils/MetaData';

const OtherComponets = () => {
  return (
    <>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <div className="app">
      <MetaData />
      {/* <Welcome /> */}
      <BrowserRouter>
        <Routes>
          {allRoutesMapper?.map((singleroute, index) => (
            <Route key={index} path={singleroute.path} element={singleroute.component} />
          ))}
        </Routes>
      </BrowserRouter>

      <OtherComponets />
    </div>
  );
}

export default App;
