import './styles/style.scss';
import './scripts/components/footer';

import { setCsrfToken } from './scripts/helpers/getCsrfToken';

setCsrfToken().catch(err => console.log(err));
