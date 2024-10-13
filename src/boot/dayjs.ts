import { boot } from 'quasar/wrappers';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export default boot(() => {
  dayjs.extend(relativeTime);
});
