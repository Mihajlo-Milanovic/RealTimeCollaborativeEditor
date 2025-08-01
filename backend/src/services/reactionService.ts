import {IReaction, SimpleReaction} from "../data/interfaces/IReaction";
import Reaction from "../data/models/Reaction";
import Comment from "../data/models/Comment";
import {IComment} from "../data/interfaces/IComment";


export async function getAllReactionsForComment(commentId: string): Promise<Array<IReaction> | null> {

    const comment: IComment | null = await Comment.findById(commentId);
    if(comment)
        return Reaction.find({comment: commentId});
    else
        return null;
}

export async function getReactionByCommentAndUser(uuid: string, commentId: string): Promise<IReaction | null> {
    return Reaction.findOne({reactor: uuid, comment: commentId});
}

export async function createNewReaction(reaction: SimpleReaction): Promise<IReaction> {

    const newReaction: IReaction = await Reaction.create(reaction);
    await newReaction.populate('comment');
    if(newReaction.populated('comment')) {
        const comment = newReaction.comment as unknown as IComment;
        comment.reactions.push(newReaction);
        await comment.save();
    }
    return newReaction;
}

export async function updateReaction(reaction: IReaction, newReactionType: string): Promise<IReaction | null> {
    reaction.reactionType = newReactionType;
    return Reaction.findByIdAndUpdate(reaction._id, reaction, {new: true}).exec();
}

export async function deleteReaction(reactionId: string): Promise<IReaction | null> {
    return await Reaction.findByIdAndDelete(reactionId).exec();
}