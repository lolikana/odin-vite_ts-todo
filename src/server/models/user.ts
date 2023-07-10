import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Email cannot be blank'], unique: true },
  username: { type: String, required: [true, 'Username cannot be blank'], unique: true }
  // hashedPassword: {
  //   type: String,
  //   required: [true, 'Password cannot be blank']
  // }
});

UserSchema.plugin(passportLocalMongoose);

export const UserModel = mongoose.model('user', UserSchema);
