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

export async function createNewUser(userData: IUser): Promise<IUser | Error> {

    console.log("userData:", userData);

    const userE = await getUserWithEmail(userData.email);
    if (userE != null)
        return new Error("User with this email already exists!");

    const userN = await getUserWithEmail(userData.username);
    if (userN != null)
        return new Error("User with this username already exists!");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    verificationToken: verificationToken,
    verified: false,
  });

  await sendVerificationEmail(newUser.email, verificationToken);

  return newUser;
}

export async function deleteUserWithId(uuid: string) {
    await User.findByIdAndDelete(uuid).exec();
}