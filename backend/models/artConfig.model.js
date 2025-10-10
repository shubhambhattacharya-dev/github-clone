import mongoose from 'mongoose';

const artConfigSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  },
  svgData: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ArtConfig = mongoose.model('ArtConfig', artConfigSchema);

export default ArtConfig;