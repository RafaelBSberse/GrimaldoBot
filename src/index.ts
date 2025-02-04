import 'dotenv/config';

import ApplicationCommand from './templates/ApplicationCommand.js';
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { registerCommands } from './utils/registerCommands.js';
import { registerEvents } from './utils/registerEvents.js';
import { deployCommands } from './utils/deployCommands.js';
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase/types/supabase.js';
import { apiRealtimeSubscriptions } from './utils/apiRealtimeSubscriptions.js';

await deployCommands();

globalThis.client = Object.assign(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
        ]
    }),
    {
        commands: new Collection<string, ApplicationCommand>(),
        api: createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    }
)

await registerCommands();
await registerEvents();

await client.login(process.env.BOT_TOKEN);

await apiRealtimeSubscriptions();