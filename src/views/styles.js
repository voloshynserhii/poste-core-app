import { makeStyles } from '@material-ui/core/styles';
import { formStyle } from '../utils/styles';

export const useFormStyles = makeStyles((theme) => ({
  formBody: {
    ...formStyle(theme),
  },
}));
