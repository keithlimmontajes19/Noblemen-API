import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const onboarding_project_brief = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  you_tell_the_brand: {
    type: String,
    required: true,
  },
  you_what_products_service: {
    type: String,
    required: true,
  },
  you_what_apart_competitors: {
    type: String,
    required: true,
  },
  goal_what_accomplish_new_website: {
    type: String,
    required: true,
  },
  goal_what_accomplish_similar_goals: {
    type: String,
    required: true,
  },
  goal_what_do_you_like_about_website: {
    type: String,
    required: true,
  },
  audience_who_target: {
    type: String,
    required: true,
  },
  audience_what_they_care: {
    type: String,
    required: true,
  },
  audience_what_they_need_to_be_seen: {
    type: String,
    required: true,
  },
});

export const Onboarding = mongoose.model(
  'onboarding_project_brief',
  onboarding_project_brief,
);
