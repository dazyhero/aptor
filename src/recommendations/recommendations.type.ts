import { InferSelectModel } from 'drizzle-orm';
import * as schema from '@/database/schemas';

export type Recommendation = InferSelectModel<
  typeof schema.recommendedReminders
>;
