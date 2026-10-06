import mongoose from 'mongoose';

const equipoSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'El id del equipo es requerido'],
      min: [1, 'El id debe ser un entero positivo'],
      validate: {
        validator: Number.isInteger,
        message: 'El id debe ser un número entero'
      }
    },
    abbreviation: {
      type: String,
      required: [true, 'La abreviatura es requerida'],
      trim: true,
      lowercase: true,
      minlength: [3, 'La abreviatura debe tener exactamente 3 caracteres'],
      maxlength: [3, 'La abreviatura debe tener exactamente 3 caracteres']
    },
    country: {
      type: String,
      required: [true, 'El país es requerido'],
      trim: true
    },
    confederation: {
      type: String,
      required: [true, 'La confederación es requerida'],
      trim: true,
      uppercase: true
    }
  },
  {
    collection: 'equipos'
  }
);

equipoSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Equipo = mongoose.model('Equipo', equipoSchema);
