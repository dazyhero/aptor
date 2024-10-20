import { InferSelectModel } from 'drizzle-orm';
import * as schema from '@/database/schemas';

export type Appointment = InferSelectModel<typeof schema.appointments>;
