const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");


const tripSchema = new Schema (
    {
        title: { type: String, required: true},
        description: { type: String },
        activities: [{
            type: String,
            enum: ['nature', 'concerts_and_events', 'gastronomy', 'touristic_places']
        }],
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        countryCode: { type: String, required: true },
        city: { type: String, required: true },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true },
        participants: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }]
    },
    {   
        timestamps: true
    }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;

