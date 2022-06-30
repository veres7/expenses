import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';

import Main from './components/Box';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <Main />
        </header>
      </div>
    </QueryClientProvider>
  );
}

export default App;
