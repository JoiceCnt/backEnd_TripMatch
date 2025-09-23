const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");


// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Usermane is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 3,
      maxLength: 32,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'] 
    },
    password: { type: String, required: true, minLength: 6 },  

    name: { type: String, required: true },
    surname: { type: String, required: true },
    bio: { type: String, maxlength: 500 },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: true },
    country: { type: String, trim: true },

    profilePic: {
      type: String,
      default: "/images/icono_profile.png",
    },
    photoUrl: { type: String },             
    photoPublicId: { type: String },
    preferences: [
      {
        type: String,
        enum: ["nature", "concerts_and_events", "gastronomy", "touristic_places"],
      },
    ],
    favoriteCities: [{ type: String }],


    tripsCreated: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    tripsJoined: [{ type: Schema.Types.ObjectId, ref: "Trip" }],

    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      lang: { type: String, enum: ["en", "pt", "es"], default: "en"},
      emailNotif: { type: Boolean, default: true },
      inAppNotif: { type: Boolean, default: true },
      isPublicProfile: { type: Boolean, default: true },
      postVisibility: { type: String, enum: ["everyone", "friends", "private"], default: "everyone"},
      twoFA: { type: Boolean, default: false}
    }
  },
  {    
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};


const User = model("User", userSchema);

module.exports = User;
