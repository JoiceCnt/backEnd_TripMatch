const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const tripSchema = new Schema({
  title: { type: String, required: true },
  preferences: [{
    type: String,
    enum: ["nature", "concerts_and_events", "gastronomy", "touristic_places"],
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  country: { type: String },
  countryCode: { type: String },
  city: { type: String, required: true },
  heroImageUrl: { type: String },
  heroImagePublicId: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


tripSchema.index({ createdBy: 1, startDate: 1 });
tripSchema.index({ city: 1, countryCode: 1, startDate: 1 });

tripSchema.pre("validate", function (next) {
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
