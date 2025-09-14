import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.EXCHANGE_API_KEY;
const API_URL = process.env.EXCHANGE_API_URL;

app.get("/convert", async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({ error: "Missing params" });
    }

    try {
        const response = await fetch(`${API_URL}/latest?access_key=${API_KEY}&symbols=${from},${to}`);
        const data = await response.json();

        if(!data.success) {
            return res.status(500).json( {error: "Fixer API error", details: data });
        }

        const rates = data.rates;
        const rate = rates[to] / rates[from];
        const converted = amount * rate

        res.json({
            from,
            to,
            amount,
            converted,
            rate
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})