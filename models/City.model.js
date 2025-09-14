const { Schema, model } = require('mongoose');

const citySchema = new Schema (
    {
        code: { 
            type: String, 
            required: true, 
            unique: true, 
            uppercase: true, 
            trim: true },
        name: { type: String, 
            required: true, 
            unique: true, 
            trim: true },
        country: { 
            type: Schema.Types.ObjectId, 
            ref: "Country", 
            required: true }
    },
    {
        timestamps: true
    }
);

const City = model('City', citySchema);

module.exports = City;