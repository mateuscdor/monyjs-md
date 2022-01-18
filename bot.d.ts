/// <reference types="ws" />
/// <reference types="node" />
import { AnyMessageContent, AnyWASocket, MiscMessageGenerationOptions } from '@adiwajshing/baileys-md';
declare const botArray: {
    [k: string]: AnyWASocket;
};
declare const sendText: (bot_id: string, number: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) => Promise<Error>;
declare const startWhatsapp: (bot_id: string, ws_id: string) => Promise<{
    processMessage: (message: import("@adiwajshing/baileys-md").proto.IWebMessageInfo, chatUpdate: Partial<import("@adiwajshing/baileys-md").Chat>) => Promise<void>;
    sendMessageAck: ({ tag, attrs }: import("@adiwajshing/baileys-md").BinaryNode, extraAttrs: {
        [key: string]: string;
    }) => Promise<void>;
    appPatch: (patchCreate: import("@adiwajshing/baileys-md").WAPatchCreate) => Promise<void>;
    sendPresenceUpdate: (type: import("@adiwajshing/baileys-md").WAPresence, toJid?: string) => Promise<void>;
    presenceSubscribe: (toJid: string) => Promise<void>;
    profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number) => Promise<string>;
    onWhatsApp: (...jids: string[]) => Promise<{
        exists: boolean;
        jid: string;
    }[]>;
    fetchBlocklist: () => Promise<string[]>;
    fetchStatus: (jid: string) => Promise<{
        status: string;
        setAt: Date;
    }>;
    updateProfilePicture: (jid: string, content: import("@adiwajshing/baileys-md").WAMediaUpload) => Promise<void>;
    updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
    getBusinessProfile: (jid: string) => Promise<void | import("@adiwajshing/baileys-md").WABusinessProfile>;
    resyncAppState: (collections: import("@adiwajshing/baileys-md").WAPatchName[]) => Promise<import("@adiwajshing/baileys-md").AppStateChunk>;
    chatModify: (mod: import("@adiwajshing/baileys-md").ChatModification, jid: string) => Promise<void>;
    resyncMainAppState: () => Promise<void>;
    assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
    relayMessage: (jid: string, message: import("@adiwajshing/baileys-md").proto.IMessage, { messageId: msgId, participant, additionalAttributes, cachedGroupMetadata }: import("@adiwajshing/baileys-md").MessageRelayOptions) => Promise<string>;
    sendReceipt: (jid: string, participant: string, messageIds: string[], type: "read" | "read-self") => Promise<void>;
    sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
    refreshMediaConn: (forceGet?: boolean) => Promise<import("@adiwajshing/baileys-md").MediaConnInfo>;
    waUploadToServer: import("@adiwajshing/baileys-md").WAMediaUploadFunction;
    fetchPrivacySettings: (force?: boolean) => Promise<{
        [_: string]: string;
    }>;
    sendMessage: (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) => Promise<import("@adiwajshing/baileys-md").proto.WebMessageInfo>;
    groupMetadata: (jid: string) => Promise<import("@adiwajshing/baileys-md").GroupMetadata>;
    groupCreate: (subject: string, participants: string[]) => Promise<import("@adiwajshing/baileys-md").GroupMetadata>;
    groupLeave: (id: string) => Promise<void>;
    groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
    groupParticipantsUpdate: (jid: string, participants: string[], action: import("@adiwajshing/baileys-md").ParticipantAction) => Promise<string[]>;
    groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
    groupInviteCode: (jid: string) => Promise<string>;
    groupRevokeInvite: (jid: string) => Promise<string>;
    groupAcceptInvite: (code: string) => Promise<string>;
    groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
    groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
    groupFetchAllParticipating: () => Promise<{
        [_: string]: import("@adiwajshing/baileys-md").GroupMetadata;
    }>;
    type: "md";
    ws: import("ws");
    ev: import("@adiwajshing/baileys-md").BaileysEventEmitter;
    authState: {
        creds: import("@adiwajshing/baileys-md").AuthenticationCreds;
        keys: import("@adiwajshing/baileys-md").SignalKeyStoreWithTransaction;
    };
    user: import("@adiwajshing/baileys-md").Contact;
    assertingPreKeys: (range: number, execute: (keys: {
        [_: number]: any;
    }) => Promise<void>) => Promise<void>;
    generateMessageTag: () => string;
    query: (node: import("@adiwajshing/baileys-md").BinaryNode, timeoutMs?: number) => Promise<import("@adiwajshing/baileys-md").BinaryNode>;
    waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
    sendNode: (node: import("@adiwajshing/baileys-md").BinaryNode) => Promise<void>;
    logout: () => Promise<void>;
    end: (error: Error) => void;
    waitForConnectionUpdate: (check: (u: Partial<import("@adiwajshing/baileys-md").ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}>;
export { startWhatsapp, botArray, sendText };
