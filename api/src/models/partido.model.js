import mongoose from 'mongoose';

const partidoSchema = new mongoose.Schema({
  equipo1: {
    type: String,
    required: true,
    trim: true
  },
  equipo2: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{2}\/\d{2}\/\d{2}$/.test(v);
      },
      message: 'La fecha debe estar en formato DD/MM/YY'
    }
  },
  hora: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(0?[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s(a|p)\.\s?m\.$/i.test(v);
      },
      message: 'La hora debe estar en formato HH:MM:SS a. m. o HH:MM:SS p. m.'
    }
  }
});

partidoSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Partido = mongoose.model('Partido', partidoSchema, 'partidos');

export { Partido };
