const { Schema, model } = require('mongoose');

const countrySchema = new Schema (
    {
        code: { 
            type: String, 
            required: true, 
            unique: true, 
            uppercase: true, 
            trim: true },
        name: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true },
        cities: [{ 
            type: Schema.Types.ObjectId, 
            ref: "City",
            required: true, 
        }]    
    },
    {
        timestamps: true
    }
);

const Country = model('Country', countrySchema);

module.exports = Country;