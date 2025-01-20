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
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // Initialize rememberMe state from localStorage
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    setRememberMe(remembered);
    setIsLoading(false);
  }, []);

  // Handle persistence changes when rememberMe changes
  useEffect(() => {
    if (!isLoading) {
      const setPersistenceType = async () => {
        try {
          await setPersistence(
            auth, 
            rememberMe ? browserLocalPersistence : browserSessionPersistence
          );
          
          // Store rememberMe preference
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
        } catch (error) {
          console.error("Error setting persistence:", error);
        }
      };

      setPersistenceType();
    }
  }, [rememberMe, isLoading]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
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

  const add = async () => {
    const inputText = inputRef.current.value.trim();
    if (inputText === "") return;

    try {
      await addDoc(collection(db, "todos"), {
        userId: user.uid,
        text: inputText,
        isComplete: false,
      });
      inputRef.current.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggle = async (id, currentStatus) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { isComplete: !currentStatus });
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Login failed:", error.message);
      // You might want to show this error to the user
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      // Clear form fields
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
      
      // Only clear rememberMe if it was previously set
      if (rememberMe) {
        setRememberMe(false);
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }

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