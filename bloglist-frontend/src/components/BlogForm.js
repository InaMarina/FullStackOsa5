import React, { useState } from "react";

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    console.log("create blog pressed");
    event.preventDefault();
    const newObject = {
      title: title,
      author: author,
      url: url,
    };
    handleSubmit(newObject);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={(event) => addBlog(event)}>
        <div>
          Title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
          ></input>
        </div>
        <div>
          Author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
          ></input>
        </div>
        <div>
          Url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
          ></input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
