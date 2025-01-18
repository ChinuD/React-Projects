import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ToDoItems from "./ToDoItems";

function ToDo() {
  const [todoList, setToDoList] = useState([]);
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const inputRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // Check if "Remember Me" is enabled and set persistence
  useEffect(() => {
    const rememberFlag = localStorage.getItem("rememberMe") === "true";

    if (rememberFlag) {
      setPersistence(auth, browserLocalPersistence).catch((error) =>
        console.error("Error setting persistence:", error)
      );
    } else {
      setPersistence(auth, browserSessionPersistence).catch((error) =>
        console.error("Error setting persistence:", error)
      );
    }
  }, []);

  // Automatically log in the user if they're already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch todos for logged-in user
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToDoList(todos);
      });
      return unsubscribe;
    } else {
      setToDoList([]);
    }
  }, [user]);

  // Add a todo to Firestore
  const add = async () => {
    const inputText = inputRef.current.value.trim();
    if (inputText === "") return;

    try {
      await addDoc(collection(db, "todos"), {
        userId: user.uid,
        text: inputText,
        isComplete: false,
      });
      inputRef.current.value = ""; // Clear the input field
    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  };

  // Toggle todo completion
  const toggle = async (id, currentStatus) => {
    try {
      const todoRef = doc(db, "todos", id); // Get the document reference
      await updateDoc(todoRef, { isComplete: !currentStatus }); // Update the field
    } catch (error) {
      console.error("Error toggling todo:", error.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id); // Get the document reference
      await deleteDoc(todoRef); // Delete the document
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  // Handle user login
  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      // Save "Remember Me" flag
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("rememberMe"); // Clear rememberMe flag
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
      {!user ? (
        <div>
          <h2>Login</h2>
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <>
          <button onClick={logout}>Logout</button>
          <h1 className="text-center">Welcome, {user.email}</h1>

          {/* Input Section */}
          <div className="flex items-center my-7 bg-gray-200 rounded-full">
            <input
              ref={inputRef}
              className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
              type="text"
              placeholder="Add your task"
            />
            <button
              onClick={add}
              className="border-none rounded-full bg-orange-600 w-32 h-14 text-white text-lg font-medium cursor-pointer"
            >
              Add +
            </button>
          </div>

          {/* ToDo List */}
          <div>
            {todoList.map((item) => (
              <ToDoItems
                key={item.id}
                id={item.id}
                text={item.text}
                isComplete={item.isComplete}
                deleteTodo={() => deleteTodo(item.id)}
                toggle={() => toggle(item.id, item.isComplete)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ToDo;
