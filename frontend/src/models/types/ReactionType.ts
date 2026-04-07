

export type ReactionType =
    | "thumbs_up"
    | "heart"
    | "smile"
    | "sad"
    | "angry"
    | "wow"
    | "relaxed";

export const emojisMap = new Map<string, string>([
    ["thumbs_up", '👍'] as const,
    ["heart", '💗'] as const,
    ["smile", '😊'] as const,
    ["sad", '😢'] as const,
    ["angry", '😠'] as const,
    ["scared", '😱'] as const,
    ["wow", '😲'] as const,
    ["relaxed", '😌'] as const,
] as const);