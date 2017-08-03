import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {
  blueGrey500, blueGrey700, blueGrey50,
  amber500, amber700, amber100,
  grey700, fullWhite, darkBlack, fullBlack, blueGrey100,
  red500
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  ...darkBaseTheme,
  spacing: spacing,
  palette: {
    primary1Color: blueGrey500,
    primary2Color: blueGrey700,
    primary3Color: blueGrey50,
    accent1Color: amber500,
    accent2Color: amber100,
    accent3Color: amber700,
    textColor: fullWhite,
    alternateTextColor: blueGrey100,
    // borderColor: grey700,
    disabledColor: fade(darkBlack, 0.5),
    pickerHeaderColor: amber500,
    // clockCircleColor: fade(darkBlack, 0.07),
    // shadowColor: fullBlack,
  },
};

