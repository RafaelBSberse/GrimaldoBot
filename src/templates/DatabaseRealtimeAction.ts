import { REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel, RealtimePostgresChangesPayload, RealtimePostgresDeletePayload, RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Database } from "../supabase/types/supabase.js";

type GetRowType<T extends keyof Database, Table extends keyof Database[T]["Tables"]> = 
  Database[T]["Tables"][Table] extends { Row: infer R } 
    ? R extends { [key: string]: any } 
      ? R 
      : never
    : never;

type ActionPayloadMap<T extends keyof Database, Table extends keyof Database[T]["Tables"], E extends REALTIME_POSTGRES_CHANGES_LISTEN_EVENT> =
    E extends REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT
    ? { table: string; event: E; schema: T; callback: (payload: RealtimePostgresInsertPayload<GetRowType<T, Table>>) => void }
    : E extends REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
    ? { table: string; event: E; schema: T; callback: (payload: RealtimePostgresUpdatePayload<GetRowType<T, Table>>) => void }
    : E extends REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE
    ? { table: string; event: E; schema: T; callback: (payload: RealtimePostgresDeletePayload<GetRowType<T, Table>>) => void }
    : { table: string; event: E; schema: T; callback: (payload: RealtimePostgresChangesPayload<GetRowType<T, Table>>) => void };

export default class DatabaseRealtimeAction<T extends keyof Database, Table extends keyof Database[T]["Tables"], E extends REALTIME_POSTGRES_CHANGES_LISTEN_EVENT> {
    options: ActionPayloadMap<T, Table, E>;

    type: REALTIME_LISTEN_TYPES = REALTIME_LISTEN_TYPES.POSTGRES_CHANGES;
    channel: string;

    constructor(options: ActionPayloadMap<T, Table, E>) {
        this.options = options;
        this.channel = {
            [REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL]: "",
            [REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT]: "custom-insert-channel",
            [REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE]: "",
            [REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE]: ""
        }[options.event];
    }
}
