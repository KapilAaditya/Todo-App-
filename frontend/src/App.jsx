import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'



function App() {
  const [todos, setTodos] = useState([]);


  useEffect(() => {
    fetch('http://localhost:4000/todos')
    .then(async(res) =>await res.json())
    .then((data) => {
      console.log(data);
      setTodos(data.todos);
    })
    .catch((err) => console.error(err));
  }, []);


  return (
    <div>
      <CreateTodo />
      <Todos todos={todos} setTodos={setTodos } />
    </div>
  );
}

export default App;

