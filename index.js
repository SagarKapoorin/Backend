import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import fetch from 'node-fetch';
import Event from "./model/Event.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

async function fetchData() {
  try {
    const response = await fetch(process.env.SCRIPT_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
}

app.get("/", async (req, res) => {
  try {
    const data = await fetchData();
    // Event.insertMany(data); one time only
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    try {
      const response = await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${process.env.CODE}==&latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`);
      const data = await response.json();
      return data.distance; 
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  async function getWeather(city, date) {
    try {
        const encodedCity = encodeURIComponent(city);
        const apiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${process.env.CODEE}==&city=${encodedCity}&date=${date}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

app.get("/events/find", async (req, res) => {
    try {
      const { latitude, longitude, date } = req.query;
      
      if (!latitude || !longitude || !date) {
        return res.status(400).json({ message: "Latitude, longitude, and date are required parameters." });
      }
      const specifiedDate = new Date(date);
      const endDate = new Date(specifiedDate);
      endDate.setDate(endDate.getDate() + 14);
      
      const events = await Event.find({
        date: {
          $gte: specifiedDate,
          $lt: endDate
        }
      })
      .sort({ date: 1 });
      let ans=[];
      let output={};
      let event1=[];
      let page=1;
        for(const event of events){
            const distance=await calculateDistance(latitude,longitude,event.latitude,event.longitude);
            if(distance<20830){
              const k=await getWeather(event.city_name,event.date)
                event1.push({ "event_name": `${event.event_name}`,
                "city_name": `${event.city_name}`,
                "date": `${event.date}`,
                "weather": `${k.weather}`,
                "distance_km": `${distance}`
    });
                if(event1.length>=10){
                    // console.log(event1);
                    output["events"]=[...event1];
                    output["page"]=page;
                    output["pageSize"]=10;
                    output["totalevents"]=44;
                    output["totalpages"]=Math.ceil(events.length/9);
                    ans.push({...output});
                output={};
                page++;
                event1=[];
                console.log(ans);
                }
            }
            
        } 
        if(event1.length!=0){
            output["events"]=[...event1];
            output["page"]=page;
            output["pageSize"]=10;
            output["totalevents"]=events.length;
            output["totalpages"]=Math.ceil(events.length/9);
        ans.push({...output});
        output={};
        event1=[];
        page++;
        }
    //   console.log(events);
      res.json(ans);
    } catch (error) {
      console.error('Error finding events:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
