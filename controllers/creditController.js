exports.transferCredit = async (req, res) => {
  try {
    res.json({ message: "Credit route working ✅" });
  } catch (err) {
    res.status(500).json({ error: "Credit transfer failed" });
  }
};
