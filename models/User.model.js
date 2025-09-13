const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true
    },
    surname: {
      type: String,
      required: [true, 'Surname is required.'],
      trim: true
    },
    sexo: {
      type: String,
      enum: ['Male', 'Female'],
      required: [true, 'Country is required.']
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
      trim: true
    },
     username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: [ 3, 'Username must be at least 3 characters long.']
     },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match:  [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.']
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
