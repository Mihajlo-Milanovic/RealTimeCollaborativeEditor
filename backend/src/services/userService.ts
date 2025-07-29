import User from "../models/User";
import {IUser} from "../interfaces/IUser";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {sendVerificationEmail} from "../mailer/mailer"


export async function getAllUsers(): Promise<Array<IUser>> {
    return User.find();
}

export async function getUserById(uuid: string): Promise<IUser | null> {
    return User.findById(uuid);
}

export async function getUserWithUsername(username: string): Promise<IUser | null> {
    return User.findOne({username: username});
}

export async function getUserWithEmail(email: string): Promise<IUser | null> {
    return User.findOne({email: email});
}

export async function getUserByVerificationToken(verificationToken: string): Promise<IUser | null> {
    return User.findOne({verificationToken: verificationToken});
}

export async function createNewUser(user: IUser): Promise<IUser | Error> {

    let usr = await getUserWithEmail(user.email);
    if (usr)
        return new Error("User with this email already exists!");

    usr = await getUserWithUsername(user.username);
    if (usr)
        return new Error("User with this username already exists!");

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verified: false,
    });

    await sendVerificationEmail(newUser.email, verificationToken);

    return newUser;
}

export async function verifyUser(verificationToken: string): Promise<IUser | null> {

    const user: IUser | null = await User.findOne({ verificationToken: verificationToken });

    console.log(verificationToken);
    console.log(user);

    if (user){
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
    }

    return user;
}

export async function deleteUserWithId(uuid: string) {
    await User.findByIdAndDelete(uuid).exec();
}