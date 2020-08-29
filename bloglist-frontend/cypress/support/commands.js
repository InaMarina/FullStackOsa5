Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3001/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedBlogUser", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});
Cypress.Commands.add("createBlog", ({ author, title, url }) => {
  cy.request({
    url: "http://localhost:3001/api/blogs",
    method: "POST",
    body: { author, title, url },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("loggedBlogUser")).token
      }`,
    },
  });

  cy.visit("http://localhost:3000");
});
