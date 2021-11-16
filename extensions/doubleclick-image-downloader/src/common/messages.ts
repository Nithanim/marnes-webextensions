const signals = ["getImagesInSelection", "hotkeyTriggered"] as const;

export function signal<T extends typeof signals[number]>(subject: T): {subject: T} {
    return {subject};
}

//

const topics = {
    afterHotkeyTriggered: "afterHotkeyTriggered",
    downloadFinished: "downloadFinished",
    downloadRequested: "downloadRequested",
    downloadStarted: "downloadStarted"
} as const;

export type DownloadChangedMessage = {subject: typeof topics.downloadStarted | typeof topics.downloadFinished; downloadId: number};
export function started(downloadId: number): DownloadChangedMessage {
    return {
        downloadId,
        subject: topics.downloadStarted
    };
}
export function finished(downloadId: number): DownloadChangedMessage {
    return {
        downloadId,
        subject: topics.downloadFinished
    };
}

type RequestedMessage = {subject: typeof topics.downloadRequested; imageUrl: string};
export function requestDownload(image: HTMLImageElement): RequestedMessage {
    return {
        imageUrl: image.src,
        subject: topics.downloadRequested
    };
}

export type TriggeredMessage = {subject: typeof topics.afterHotkeyTriggered; imageFound: boolean};
export function hotkeyTriggered(imageFound: boolean): TriggeredMessage {
    return {
        imageFound,
        subject: topics.afterHotkeyTriggered
    };
}

//

const subjects = [...signals, ...Object.values(topics)] as string[];

export type Message = ReturnType<typeof signal> | DownloadChangedMessage | RequestedMessage | TriggeredMessage;

function hasSubject(value: {subject?: unknown}): value is {subject: string} {
    return typeof value.subject == "string";
}

function isMessage(value: unknown): value is Message {
    return typeof value == "object" && value != null && hasSubject(value) && subjects.includes(value.subject);
}

export function asMessage(value: unknown): Message {
    if (isMessage(value)) {
        return value;
    } else {
        throw new Error(`${JSON.stringify(value)} is not a message`);
    }
}
