import React, { useEffect,useState, useRef } from "react";
import todo_icon from "../assets/todo-app-assets/assets/todo_icon.png";
import ToDoItems from "./ToDoItems";

function ToDo() {
  const [todoList, setToDoList] = useState([]);

  const inputRef = useRef();

  const add = () => {
    const inputText = inputRef.current.value.trim();
    // console.log(inputText)

    if (inputText === "") {
      return null;
    }

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: true,
    };

    setToDoList((prev) => [...prev, newTodo]);

    inputRef.current.value = "";
  };

  const deleteTodo = (id) => {
    setToDoList((prvTodos) => {
      return prvTodos.filter((todo) => todo.id !== id);
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      add();
    }
  };

  const toggle = (id) => {
    setToDoList((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {...todo, isComplete: !todo.isComplete};
        }
        return todo;
      });
    });
  };

  useEffect(()=>{
    console.log(todoList)
  },[todoList])

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
      {/* ------------ title ------------ */}
      <div className="flex items-center mt-7 gap-2">
        <img className="w-8" src={todo_icon} />
        <h1 className="text-3xl font-semibold">To Do List</h1>
      </div>

      {/* ------------ input box --------- */}
      <div className="flex items-center my-7 bg-gray-200 rounded-full">
        <input
          ref={inputRef}
          className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
          type="text"
          placeholder="Add your task"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={add}
          className="border-none rounded-full bg-orange-600 w-32 h-14 text-white text-lg font-medium cursor-pointer"
        >
          Add +
        </button>
      </div>

      {/* ------------ ToDo List --------- */}
      <div>
        {todoList.map((item, index) => {
          // console.log("Executing")
          return (
            <ToDoItems
              key={index}
              text={item.text}
              isComplete={item.isComplete}
              deleteTodo={() => deleteTodo(item.id)}
              toggle = {()=> toggle(item.id)} 
            />
          );
        })}
      </div>
    </div>
  );
}

export default ToDo;
