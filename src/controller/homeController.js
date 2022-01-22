/* schema */
import {Onboarding} from '../models/onboardingSchema';
import {User} from '../models/userSchema';
import {Creative} from '../models/onboardingCreative';

/* helpers */
import {RESPONSE} from '../helpers/responseHelper';
import CONSTANTS from '../config/constants';
import STATUS_CODE from '../config/statusCode';

export const postWebsiteOnboarding = async (req, res) => {
  try {
    const localUser = res.locals.user;
    const user = await User.findOne({email: localUser.email});

    const onboarding = new Onboarding({
      _userId: user.id,
      you_tell_the_brand: req.body.you_tell_the_brand,
      you_what_products_service: req.body.you_what_products_service,
      you_what_apart_competitors: req.body.you_what_apart_competitors,
      goal_what_accomplish_new_website:
        req.body.goal_what_accomplish_new_website,
      goal_what_accomplish_similar_goals:
        req.body.goal_what_accomplish_similar_goals,
      goal_what_do_you_like_about_website:
        req.body.goal_what_do_you_like_about_website,
      audience_who_target: req.body.audience_who_target,
      audience_what_they_care: req.body.audience_what_they_care,
      audience_what_they_need_to_be_seen:
        req.body.audience_what_they_need_to_be_seen,
    });

    const response = await onboarding.save();

    return res.status(200).json({
      status: 200,
      message: 'Successfully saved.',
      data: response,
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: 'Failed to saved.',
      data: e.message,
    });
  }
};

export const postCreativeProvider = async (req, res) => {
  try {
    const localUser = res.locals.user;
    const user = await User.findOne({email: localUser.email});

    const creative = new Creative({
      _userId: user.id,
      images: req.body.images,
      brand_marks: {
        primary_logo: req.body.brand_marks.primary_logo,
        primary_icon: req.body.brand_marks.primary_icon,
        alternate_logos_icons: req.body.brand_marks.alternate_logos_icons,
      },
      colors: req.body.colors,
    });

    // brand_marks.markModified('brand_marks');
    const response = await creative.save();

    return res.status(200).json({
      status: 200,
      message: 'Successfully saved.',
      data: response,
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: 'Failed to saved.',
      data: e.message,
    });
  }
};
