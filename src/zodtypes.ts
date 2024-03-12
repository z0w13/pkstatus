import { Dayjs } from 'dayjs';
import { z } from 'zod';

export const dayjs = () =>
  z.custom<Dayjs>((v) => v instanceof Dayjs, 'Invalid date');
