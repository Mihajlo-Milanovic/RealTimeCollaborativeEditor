import {INewReaction, IReaction} from "../data/interfaces/IReaction";
import Reaction from "../data/dao/ReactionSchema";
import Comment from "../data/dao/CommentSchema";
import {toReactionVew} from "../data/types/ReactionView";


export async function getReactionById(reactionId: string) {

    const reaction = await Reaction.findById(reactionId).exec();

    if (reaction == null)
        return null;
    else
        return toReactionVew(reaction);
}

export async function getReactionByCommentAndUser(userId: string, commentId: string) {

    const reaction =  await Reaction.findOne({reactor: userId, comment: commentId}).exec();

    if (reaction == null)
        return null;
    else
        return toReactionVew(reaction);
}

export async function createOrUpdateReaction(reaction: INewReaction) {

    const r =  await Reaction.findOne({
        reactor: reaction.reactor,
        comment: reaction.comment
    }).exec();

    if (r != null)
        return { updated: true, reaction: await updateReaction(r, reaction.reactionType)};
    else
        return { updated: false, reaction: await createNewReaction(reaction)};
}

export async function createNewReaction(reaction: INewReaction) {

    const newReaction: IReaction = await Reaction.create(reaction);

    // Atomično dodaj referencu u comment.reactions. NE radimo load-push-save
    // (čitanje celog niza pa prepisivanje) jer kod konkurentnih reakcija dva
    // korisnika učitaju stari niz i drugi pregazi referencu prvog (lost update).
    // $addToSet je atomičan na nivou baze i ne gubi konkurentne dodatke.
    await Comment.updateOne(
        {_id: reaction.comment},
        {$addToSet: {reactions: newReaction._id}}
    ).exec();

    return toReactionVew(newReaction);
}

export async function updateReaction(reaction: IReaction, newReactionType: string) {
    reaction.reactionType = newReactionType;

    const r = await Reaction.findByIdAndUpdate(reaction._id, reaction, {new: true}).exec();

    if (r == null)
        return null;
    else
        return toReactionVew(r);
}

export async function deleteReaction(reactionId: string) {

    const reaction = await Reaction.findByIdAndDelete(reactionId).exec();

    if (reaction == null)
        return null;

    // Ukloni referencu iz comment.reactions (inače ostaje orphan ObjectId koji
    // se kasnije populira u null i ruši prikaz komentara).
    await Comment.updateOne(
        {_id: reaction.comment},
        {$pull: {reactions: reaction._id}}
    ).exec();

    return toReactionVew(reaction);
}