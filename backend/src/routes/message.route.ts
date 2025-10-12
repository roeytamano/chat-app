import express from "express";

const router = express.Router();

router.get("/contacts", (req, res) => {
  // get contacts logic here
  res.send("List of contacts");
});

export default router;

    