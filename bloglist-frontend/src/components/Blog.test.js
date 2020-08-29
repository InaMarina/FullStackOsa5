import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, prettyDOM } from "@testing-library/react";
import Blog from "./Blog";

test("renders title", () => {
  const blog = {
    title: "Testititteli",
    author: "Testaaja",
    likes: 3,
    url: "www.testi.fi",
    likes: 3,
    user: {
      username: "Testintekijä",
      name: "Matti",
    },
  };
  const user = {
    username: "Testintekijä",
    name: "Matti",
  };
  const component = render(<Blog blog={blog} />);

  const div = component.container.querySelector(".blog");
  expect(div).toHaveTextContent("Testititteli", "Testaaja");
  console.log(prettyDOM(div));
});

test("button view shows blog details", async () => {
  const blog = {
    title: "Testititteli",
    author: "Testaaja",
    likes: 3,
    url: "www.testi.fi",
    likes: 3,
    user: {
      username: "Testintekijä",
      name: "Matti",
    },
  };
  const user = {
    username: "Testintekijä",
    name: "Matti",
  };

  const component = render(<Blog blog={blog} />);
  const button = component.getByText("view");
  fireEvent.click(button);

  const div = component.container.querySelector(".blogextended");
  expect(div).not.toHaveStyle("display: none");
  expect(div).toHaveTextContent("www.testi.fi", 3);
  console.log(prettyDOM(div));
});

test("like is clicked twice -> 2 functioncalls", async () => {
  const blog = {
    title: "Testititteli",
    author: "Testaaja",
    likes: 3,
    url: "www.testi.fi",
    likes: 3,
    user: {
      username: "Testintekijä",
      name: "Matti",
    },
  };
  const user = {
    username: "Testintekijä",
    name: "Matti",
  };
  const mockHandler = jest.fn();
  const component = render(<Blog blog={blog} addLike={mockHandler} />);

  const button = component.getByText("like");
  fireEvent.click(button);
  fireEvent.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
