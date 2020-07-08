const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");
const Book = require("../../models/Book/Book");

router.get("/", (req, res) => {
  Book.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

router.get("/:id", (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post("/", verify, (req, res) => {
  const book = new Book(req.body);
  book
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log("error");
      res.json({ message: err });
    });
});

router.delete("/:id", verify, (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

//update
router.patch("/:id", verify, (req, res) => {
  Book.updateOne({ _id: req.params.id }, { $set: { title: req.body.title } })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

module.exports = router;
