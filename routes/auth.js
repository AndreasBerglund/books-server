const router = require("express").Router();
const Author = require("../models/Author/Author");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./api/verifyToken");
const { registerValidationSchema } = require("../models/Author/validateAuthor");

router.post("/register", async (req, res) => {
  //validate input
  const { error } = registerValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email exist
  const emailExist = await Author.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //hash pw
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  //create new user
  const author = new Author({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  author
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/login", async (req, res) => {
  //validate input
  //   const { error } = registerValidationSchema.validate(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  //check if email exist
  const author = await Author.findOne({ email: req.body.email });
  if (!author) return res.status(400).send("Email or password wrong");

  //check password
  const validPass = await bcryptjs.compare(req.body.password, author.password);
  if (!validPass) return res.status(400).send("Email or password wrong");

  //add token
  const token = jwt.sign({ _id: author.id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({ token : token, author : author});
});

//get users
router.get("/", verify, (req, res) => {
  const authors = Author.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

//get logged in author
router.get("/current", verify, (req, res) => {
  const logged_in_author = Author.findOne({ _id: req.user._id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(401).json({ message: err });
    });
});

module.exports = router;
