import { AnyWASocket } from "@adiwajshing/baileys-md";
interface Payload {
    bot: AnyWASocket;
    bot_id: string;
    other?: any;
}
export declare const botContext: ({
    state: string;
    callback: (id: string, payload: Payload) => string;
} | {
    state: string;
    callback: (id: string, payload: Payload) => Promise<import("@adiwajshing/baileys-md").proto.WebMessageInfo>;
})[];
export {};
