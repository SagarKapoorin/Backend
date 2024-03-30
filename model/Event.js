import mongoose from "mongoose";

const EventSchema = mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    city_name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    latitude: {
      type: Number,
      required: true
  },
  longitude: {
      type: Number,
      required: true
  },
  time: {
    type: String, // for simplicity sotoring in form of String
    required: true
},
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

export default Event;