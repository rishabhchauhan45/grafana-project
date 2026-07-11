const express = require("express");
const client = require("prom-client")
const { doSomeHeavyTask } = require("./util");

const app = express();

const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register })


app.get("/", (req, res) => {
    return res.json({ message: "Hello World!" });
});

app.get("/slow", async (req, res) => {
    try {
        const timeTaken = await doSomeHeavyTask();

        return res.json({
            status: "success",
            message: `Heavy task completed in ${timeTaken}ms`,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType)
    const metrics = await client.register.metrics();
    res.send(metrics)
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});