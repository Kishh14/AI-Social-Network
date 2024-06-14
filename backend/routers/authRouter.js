const { Router } = require("express");
const { AddUser, LoginUser } = require("../controllers/userController");

const router = Router();

router.post('/register', AddUser);
router.post('/login', LoginUser);

module.exports = router;
