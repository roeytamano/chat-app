import express from "express";

const router = express.Router();


router.post("/signup", (req, res) => {
  // signup logic here
  res.send("User signed up");
});
router.post("/login", (req, res) => {
  // login logic here
  res.send("User logged in");
});

router.post("/logout", (req, res) => {
  // logout logic here
  res.send("User logged out");
});

export default router;