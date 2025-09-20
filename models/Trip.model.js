const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");


const tripSchema = new Schema (
    {
        title: { type: String, required: true},
        preferences:  [{
            type: String,
            enum: ["nature", "concerts_and_events", "gastronomy", "touristic_places"],
        }],
        activities: [
            new Schema(  
                {
                    when: { type: Date, required: true },
                    title: { type: String, required: true }, 
                    location: { type: String },
                    notes: { type: String },
                },
                { _id: false }  
            )        
        ],
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        country: { type: String, required: true},
        countryCode: { type: String, required: true },
        city: { type: String, required: true },

        heroImageUrl: { type: String },
        heroImagePublicId: { type: String },

        documents:  [
            new Schema(
                {
                    name: { type: String, required: true }, 
                    url: { type: String, required: true }, 
                    mimeType: { type: String }, 
                    tag: { 
                        type: String, 
                        enum: ["outbound", "return", "other"], 
                        default: "other" },
                    sizeBytes: { type: Number },
                    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
                    uploadedAt: { type: Date, default: Date.now },
                    cloudinaryPublicId: { type: String },
                },
                { _id: false }
            )
        ],

        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
        maxParticipants: { type: Number, default: 10 },
    },
    {   
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);


tripSchema.index({ createdBy: 1, startDate: 1 });
tripSchema.index({ city: 1, countryCode: 1, startDate: 1 });

tripSchema.pre("validate", function(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    return next(new Error("endDate must be after startDate"));
  }
  next();
});

tripSchema.virtual("status").get(function () {
  const today = new Date();
  if (this.startDate <= today && today <= this.endDate) return "active";
  if (today < this.startDate) return "upcoming";
  return "past";
});

const Trip = model("Trip", tripSchema);

module.exports = Trip;

