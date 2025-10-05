import mongoose from 'mongoose';
import { CLIENTS } from '../constants/clientsBase.js';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(CLIENTS),
  },
});

export const ClientModel = mongoose.model('Clients', clientSchema);
