import './styles/style.scss';
import './scripts/components/footer';

import { setFlashMsg } from './scripts/helpers/flashMsg';
import { setCsrfToken } from './scripts/helpers/getCsrfToken';

setCsrfToken().catch(err => console.log(err));
setFlashMsg().catch(err => console.log(err));
