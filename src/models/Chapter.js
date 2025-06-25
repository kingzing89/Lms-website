import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
}, { timestamps: true });

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
export default Chapter;
