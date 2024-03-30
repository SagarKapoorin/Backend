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
    const response = await fetch('https://script.google.com/macros/s/AKfycbwJyhrZgLuTXLq5A7lnzIxMMK8fHVngiRYiClA-0A_GNK5vNOvSjWpMh0aHOiozCS2rFw/exec');
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
      const response = await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`);
      const data = await response.json();
      return data.distance; 
    } catch (error) {
      console.error('Error calculating distance:', error);
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
      let event1={};
      let page=1;
        for(const event of events){
            const distance=await calculateDistance(latitude,longitude,event.latitude,event.longitude);
            if(distance<20830){
                event1["event_name"]=event.name;
            event1["city_name"]= event.city;
            event1["date"]= event.date;
            event1["weather"]= "jo";
            event1["distance_km"]=distance;
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
