const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OpenAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

// ====== Middleware goes here ============= //
app.use(express.json());
// ======= End of Middleware ================ //

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  console.log(configuration);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("You've reached the root of the server.\n");
});

// POST request endpoint
app.post("/ask", async (req, res) => {
  // getting prompt question from request
  const prompt = req.body.prompt;

  try {
    if (!prompt) {
      console.log(req.body.prompt);
      throw new Error("Uh oh, no prompt was provided");
    }
    console.log(req.body.prompt);
    // Trigger a response from OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });

    // retrieve the completion text from response
    const completion = response.data.choices[0].text;
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));
