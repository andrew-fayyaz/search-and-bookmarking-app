import ReposSearch from './components/reposSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className='container'>
        <div className='row'>
          <h1 className='text-capitalize fw-bold mt-4'>Search and bookmarking app</h1>
          <ReposSearch />
        </div>
      </div>
    </div>
  );
}

export default App;
