import { getRealtimeEvents } from "./getRealtimeEvents.js";

export const realtimeEventRegister = async () => {
    const realtimeEvents = await getRealtimeEvents();

    for (const event of realtimeEvents) {
        const { options: { schema, table, callback, event: eventAction }, type, channel } = event;

        await client.api.channel(`${schema}:${table}`).unsubscribe();

        client.api.channel(channel).on(type, { event: eventAction, schema, table }, callback).subscribe();
    }
}