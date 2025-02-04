import { Client } from 'discord.js'
import ApplicationCommand from './templates/ApplicationCommand.ts'
import { SupabaseClient } from '@supabase/supabase-js'

interface GrimaldoClient extends Client {
    commands: Collection<string, ApplicationCommand>
    api: SupabaseClient
}

declare global {
    var client: GrimaldoClient

    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            BOT_CLIENT_ID: string;
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
        }
    }
}

export {}