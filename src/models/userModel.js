import { model, Schema } from 'mongoose';
import { ROLES } from '../constants/roles.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.keys(ROLES),
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.hasPermission = function (permission) {
  const role = this.role;
  const roleData = ROLES[role];
  if (!roleData) return false;
  return roleData.permissions.includes(permission);
};

export const UserModel = model('User', userSchema);
