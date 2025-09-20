const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    bio: { type: String, trim: true},
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: true },
    country: { type: String, trim: true },
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
       match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'] },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {
      type: String,
      default: "/images/icono_profile.png",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
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
