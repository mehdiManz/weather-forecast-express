const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const port = 3500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "1f29c029989bfc0c3232406db392fc76";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;

  https.get(url, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      res.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/styles.css" />
            <title>Weather App</title>
          </head>
          <body>
            <div class="container">
              <div class="result">
                <h1 class="temperature">The temperature in ${query} is ${temperature} degrees Celsius.</h1>
                <h3 class="description">The weather is currently ${description}</h3>
                <div class="weather-icon">
                  <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                </div>
                <button onclick="location.href='/'" class="reset-button">Reset</button>
              </div>
            </div>
          </body>
        </html>
      `);
      res.send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is active on port ${port}.`);
});
