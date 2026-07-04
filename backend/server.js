import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;

function predictRain(weatherData){
  const humidity = weatherData.main.humidity
  const clouds = weatherData.clouds.all
  const pressure = weatherData.main.pressure
  const temp = weatherData.main.temp-273.15

  let humidityScore = humidity>50 ? ((humidity-50)/50)*40 : 0
  let cloudScore = (clouds /100)*30
  let pressureScore = pressure<1013 ? (Math.min(1013 - pressure, 20)/20)*20 : 0
  const dewPoint = temp - ((100-humidity)/5)
  const spread = Math.abs(temp-dewPoint)
  let spreadScore = spread<4 ? ((4-spread)/4)*10 :0

  let probability = Math.round(humidityScore+cloudScore+pressureScore+spreadScore)
  probability = Math.max(0, Math.min(100, probability))

  let classification = "No Rain Expected"
  let color = '#00f0ff'

  if(probability>75){
    classification = "High Chance of Rain"
    color = '#ff0055'
  } else if(probability>50){
    classification = "Showers Likely"
    color = "#ff8800"
  } else if(probability>25){
    classification = "Light Drizzle Possible"
    color = '#ffff00'
  }

  return {
    probability,
    classification,
    color
  }
}

app.get("/", (req, res) => {
  res.send("Rain Prediction Backend is Running 🚀");
});

app.post("/api/predict", async(req, res) => {
  const {city} = req.body

  if(!city)
    return res.status(400).json({error: "City is required.."})

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    )

    const weatherData = response.data
    const prediction = predictRain(weatherData)

    res.json({
      success:true,
      city: weatherData.name,
      temp: Math.round(weatherData.main.temp-273.15),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      clouds: weatherData.clouds.all,
      description: weatherData.weather[0].description,
      prediction: prediction
    })
  } catch (error) {
    res.status(500).json({error: "Failed to fetch weather data.."})
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});