import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import ErrorNotification from "./components/ErrorNotification";
import SuccessNotification from "./components/SuccessNotification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    console.log("logout pressed");
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser");
    window.location.reload(false);
  };

  const handleSubmit = (newBlog) => {
    console.log(newBlog);
    blogFormRef.current.toggleVisibility();
    blogService.create(newBlog).then((returnedBlog) => {
      console.log(returnedBlog);
      setBlogs(blogs.concat(returnedBlog));
      setSuccessMessage(
        "A new blog with the title " +
          returnedBlog.title +
          " was added to your list"
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };
  const addLike = (id) => {
    console.log("addlike pressed");
    //Hae blogi jolle addataan
    const blog = blogs.find((n) => id === n.id);
    console.log(blog);
    //Uusi blogi päivitetyillä tiedoilla
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    //lähetetään backendiin
    blogService.update(blog.id, newBlog).then((returnedBlog) => {
      console.log(returnedBlog);
      //päivitetään lista
      setBlogs(
        blogs.map((blog) => (blog.id !== returnedBlog.id ? blog : returnedBlog))
      );
      setSuccessMessage("You liked " + returnedBlog.title);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    });
  };

  const removeBlog = (id) => {
    console.log("remove pressed");
    //Hae blogi joka poistetaan
    const blog = blogs.find((n) => id === n.id);
    console.log(blog);
    //Window confirm
    const ok = window.confirm("Remove blog " + blog.title);
    if (ok) {
      blogService.remove(blog.id).then((returnedBlog) => {
        console.log("removed" + returnedBlog);
      });
    }
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  //RENDER
  if (user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div>
            Password:
            <input
              id="password"
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            ></input>
          </div>
          <button id="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h2>Blogs</h2>
      Logged in as {user.name}
      <button id="logOutButton" onClick={handleLogout}>
        log out
      </button>
      <SuccessNotification message={successMessage} />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleSubmit={handleSubmit}></BlogForm>
      </Togglable>
      {blogs
        .sort(function (a, b) {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog
            id="bloglistblog"
            user={user.username}
            key={blog.id}
            blog={blog}
            addLike={() => addLike(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
          />
        ))}
    </div>
  );
};

export default App;
