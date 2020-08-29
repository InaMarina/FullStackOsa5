import React, { useState } from "react";

const Blog = ({ blog, addLike, user, removeBlog }) => {
  //tyyli
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  //statehook blogin näkyvyydelle
  const [visible, setVisible] = useState(false);

  //css-display jolla joko näkyy tai ei (inlinetyyli)
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog" style={hideWhenVisible}>
        <div>
          {blog.title}
          <button onClick={() => setVisible(true)}>view</button>
        </div>
        <div>{blog.author}</div>
      </div>
      <div className="blogextended" style={showWhenVisible}>
        <div>
          {blog.title} <button onClick={() => setVisible(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          Likes: {blog.likes} <button onClick={addLike}>like</button>
        </div>
        <div>{blog.author}</div>
        <div>
          {user === blog.user.username ? (
            <button onClick={removeBlog}>remove</button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Blog;
