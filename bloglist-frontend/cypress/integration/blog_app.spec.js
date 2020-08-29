const { func } = require("prop-types");

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "Testikäyttäjä",
      username: "testikäyttäjä",
      password: "salasana",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login from is shown", function () {
    cy.contains("Login to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("testikäyttäjä");
      cy.get("#password").type("salasana");
      cy.get("#login-button").click();

      cy.contains("Logged in as Testikäyttäjä");
    });
    it("fails with wrong credentials", function () {
      cy.get("#username").type("testikäyttäjä");
      cy.get("#password").type("väärä salasana");
      cy.get("#login-button").click();

      cy.contains("wrong username or password");
    });
  });

  describe.only("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "testikäyttäjä", password: "salasana" });
    });

    it("User is logged in", function () {
      cy.contains("Logged in as Testikäyttäjä");
    });
    it("A blog can be created", function () {
      cy.contains("new blog").click();

      cy.contains("Create a new blog");

      cy.get("#author").type("testikäyttäjä");
      cy.get("#title").type("Testikäyttäjän blogi");
      cy.get("#url").type("www.testikäyttäjänblogi.fi");

      cy.contains("create").click();

      cy.contains("Testikäyttäjän blogi");
    });

    it("A blog can be liked", function () {
      cy.contains("new blog").click();
      cy.get("#author").type("testikäyttäjä");
      cy.get("#title").type("Testikäyttäjän blogi");
      cy.get("#url").type("www.testikäyttäjänblogi.fi");

      cy.contains("create").click();
      cy.contains("view").click();

      cy.contains("Likes: 0");
      cy.contains("like").click();
      cy.contains("Likes: 1");
    });

    it("A blog can be removed by right user", function () {
      cy.createBlog({
        author: "Tämä blogi poistetaan",
        title: "23",
        url: "234",
        user: "testikäyttäjä",
      });
      cy.createBlog({
        author: "22",
        title: "2323",
        url: "234234",
        user: "testikäyttäjä",
      });

      cy.contains("view").click();
      cy.contains("remove").click();

      cy.get("html").should("not.contain", "Tämä blogi poistetaan");
    });
    it("Blogs are ordered correctly", function () {
      cy.createBlog({
        author: "Blogi 1",
        title: "1",
        url: "1",
      });
      cy.createBlog({
        author: "Blogi 2",
        title: "2",
        url: "2",
      });
      cy.createBlog({
        author: "Blogi 3",
        title: "3",
        url: "3",
      });
      cy.createBlog({
        author: "Blogi 4",
        title: "4",
        url: "3",
      });
      cy.contains("1").parent().parent().as("blog1");
      cy.contains("2").parent().parent().as("blog2");
      cy.contains("3").parent().parent().as("blog3");
      cy.contains("4").parent().parent().as("blog4");

      cy.get("@blog1").contains("view").click();
      cy.get("@blog2").contains("view").click();
      cy.get("@blog3").contains("view").click();
      cy.get("@blog4").contains("view").click();

      cy.get("@blog3").contains("like").click();
      cy.get("@blog3").contains("Likes: 1");

      cy.get(".blog").then((blogs) => {
        cy.wrap(blogs[0]).contains("Likes: 1");
      });
    });
  });
});
