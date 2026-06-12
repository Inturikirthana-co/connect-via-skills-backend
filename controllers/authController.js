const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully",
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Registration failed"
    });
  }
};

// LOGIN
// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid password"
      });

    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({

      message: "Login successful",

      token,

      user: {

        id: user.id,
        name: user.name,
        email: user.email,

        // ADD THESE
        credit: user.credit,
        completed_sessions: user.completed_sessions

      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Login failed"
    });

  }

};