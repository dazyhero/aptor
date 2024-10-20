import { InferSelectModel } from 'drizzle-orm';
import * as schema from '@/database/schemas';

export type Client = InferSelectModel<typeof schema.clients>;
