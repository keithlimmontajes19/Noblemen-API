import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  primary_logo: {
    type: String,
    required: false,
  },
  primary_icon: {
    type: String,
    required: false,
  },
  alternate_logos_icons: {
    type: Array,
    required: false,
  },
});

const onboarding_creative_provider = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  images: {
    type: Array,
    required: false,
  },
  brand_marks: BrandSchema,
  colors: {
    type: Array,
    required: false,
  },
});

export const Creative = mongoose.model(
  'onboarding_creative_provider',
  onboarding_creative_provider,
);
