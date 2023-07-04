import { config } from '@@/config/config';

import { createClient } from '@supabase/supabase-js';

const admin = createClient(
	`https://${config.SUPABASE_PROJECT_ID}.supabase.co`,
	config.SUPABASE_SERVICE_ROLE
);

const { auth } = admin;
export { auth };
export default admin;
