let express = require("express");
let app = express();
let path = require("path");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "..")));
app.use(bodyParser.json());
const upload = multer();

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API);

app.route("/")
.get((req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.route("/material-symbols/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, "..", `/node_modules/material-symbols/${req.params.path}`));
});

app.route("/@iconscout/unicons/css/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, "..", `/node_modules/@iconscout/unicons/css/${req.params.path}`));
});

app.route("/@iconscout/unicons/fonts/:type/:path")
.get((req, res) => {
    res.sendFile(path.join(__dirname, "..", `/node_modules/@iconscout/unicons/fonts/${req.params.type}/${req.params.path}`));
});

app.post("/generate", upload.single("image"), async (req, res) => {
    const prompt = req.body.prompt;
    const imageFile = req.file;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    if (!imageFile) {
        return res.status(400).json({ error: "Image is required" });
    }
    try {
        const imageBase64 = imageFile.buffer.toString("base64");
        const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { mimeType: imageFile.mimetype, data: imageBase64 } }
        ]);
        res.json({ response: result.response.text() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000);