import mongoose from 'mongoose';

const jugadorSchema = new mongoose.Schema(
  {
    team: {
      type: String,
      required: [true, 'El equipo es requerido'],
      trim: true
    },
    numero: {
      type: Number,
      required: [true, 'El número es requerido'],
      min: [1, 'El número debe ser un entero positivo'],
      validate: {
        validator: Number.isInteger,
        message: 'El número debe ser un entero'
      }
    },
    posicion: {
      type: String,
      required: [true, 'La posición es requerida'],
      trim: true,
      uppercase: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    fechaNacimiento: {
      type: String,
      required: [true, 'La fecha de nacimiento es requerida'],
      trim: true,
      validate: {
        validator: function(value) {
          return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
        },
        message: 'La fecha de nacimiento debe estar en formato DD.MM.YYYY'
      }
    },
    nombreCamiseta: {
      type: String,
      required: [true, 'El nombre de camiseta es requerido'],
      trim: true
    },
    club: {
      type: String,
      required: [true, 'El club es requerido'],
      trim: true
    },
    estatura: {
      type: Number,
      required: [true, 'La estatura es requerida'],
      min: [1, 'La estatura debe ser un número positivo'],
      validate: {
        validator: Number.isInteger,
        message: 'La estatura debe ser un entero'
      }
    },
    peso: {
      type: Number,
      required: [true, 'El peso es requerido'],
      min: [1, 'El peso debe ser un número positivo'],
      validate: {
        validator: Number.isInteger,
        message: 'El peso debe ser un entero'
      }
    }
  },
  {
    collection: 'jugadores'
  }
);

jugadorSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Jugador = mongoose.model('Jugador', jugadorSchema);
