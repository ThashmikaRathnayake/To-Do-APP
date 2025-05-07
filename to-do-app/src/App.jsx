import { useEffect, useState } from 'react'
import './App.css'
import supabase from "./supabase-client"

function App() {

  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  //Fetch the data
  useEffect(() => {
    fetchTodo()
  }, []);


  const handleAddNewTodo = (e) => {
    setNewTodo (e.target.value);
  }

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const {data,error} = await supabase
      .from("ToDoList")
      .insert([newTodoData])
      .single();

      if(error){
        console.log("Error adding todo: " , error);
      } else {
        // Adding the new todo item to previous list
        setTodoList ((prev) => [...prev, data]);
        // Reset the input
        setNewTodo("")
      }
  };

  const fetchTodo = async () => {
      const {data,error} = await supabase
        .from("ToDoList")
        .select('*');

        if(error){
          console.log("Error fetching: " , error);
        } else {
          setTodoList (data);
        }
  };

  const completeTask = async (id, isCompleted) => {
    const {data,error} = await supabase
      .from("ToDoList")
      .update({isCompleted: !isCompleted})
      .eq("id", id);

      if(error){
        console.log("Error toggling task: " , error);
      } else {
        const updatedTodoList = todoList.map((todo) => 
          todo.id === id ? {...todo, isCompleted: !isCompleted}: todo
        );
        setTodoList(updatedTodoList);
      }

  } 

  const deleteTask = async (id) => {
    const {data,error} = await supabase
      .from("ToDoList")
      .delete()
      .eq("id", id);

      if(error){
        console.log("Error deleting task: " , error);
      } else {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
      } 
    }

  return (
    <div>
      {" "}
      <h1> To do List </h1>
      <div>
        <input 
          type='text'
          placeholder='New todo..'
          value={newTodo}
          onChange={handleAddNewTodo}
        />
        <button onClick={addTodo}>Add Todo Item</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li>
            <p>{todo.name}</p>
            <button onClick={() => completeTask(todo.id, todo.isCompleted)}> 
              {" "}
              {todo.isCompleted? "undo" : "complete"}</button>
            <button onClick={() => deleteTask(todo.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
