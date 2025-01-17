import express from "express";
import fs from "fs";
import bodyParser from "body-parser";






const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  res.json(book);
});

app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/users", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  const body = req.body;  // Datos a actualizar
  const updatedUsers = [];

  // Actualiza todos los usuarios cuyo nombre comience con la letra 'T'
  data.users.forEach((user) => {
    if (user.name && user.name.startsWith('T')) {
      updatedUsers.push({
        ...user,
        ...body,
      });
    }
  });

  // Si se encontraron usuarios para actualizar
  if (updatedUsers.length > 0) {
    // Reemplaza los usuarios actualizados en la lista original
    data.users = data.users.map((user) =>
      updatedUsers.find((updatedUser) => updatedUser.id === user.id) || user
    );

    writeData(data); // Guarda los datos actualizados en la base de datos
    res.json({ message: "Users updated successfully" });
  } else {
    res.status(404).json({ message: "No users found with names starting with 'T'" });
  }
});


app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

