import { ClientEvents, Events } from "discord.js";

export default class ApplicationEvent<Event extends keyof ClientEvents> {
    name: Event;
    once: boolean;
    execute: (...args: ClientEvents[Event]) => Promise<void> | void;

    constructor(object: {
        name: Event;
        once?: boolean;
        execute: (...args: ClientEvents[Event]) => Promise<void> | void;
    }) {
        this.name = object.name;
        this.once = object.once ?? false;
        this.execute = object.execute;
    }
}