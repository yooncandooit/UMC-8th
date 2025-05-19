import './App.css'
import Todo from './components/Todo';
import Todobefore from './components/Todobefore';
import { TodoProvider } from './context/TodoContext';

function App(): Element {
  return (
    <TodoProvider>
      <Todo />
      <Todobefore/>
    </TodoProvider>
  );
}

export default App;
