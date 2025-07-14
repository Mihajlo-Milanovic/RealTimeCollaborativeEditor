import * as validator from 'express-validator';
import { getUserWithUsername, getUserWithEmail } from "../../services/userService";
import {IDirectory} from "../../interfaces/IDirectory";


/**
 * @param fieldName
 * Name used for field that holds the ID
 *
 * @return
 * Validation chain for validating ID from Query
 */
export function validateId(fieldName: string) {
    return validator.query(fieldName, `Invalid ${fieldName}!`)
        .trim()
        .notEmpty().bail().withMessage(`Field '${fieldName}' is missing!`)
        .isMongoId();
}

/**
 * @param fieldName
 * Name used for field that holds the ID
 *
 * @return
 * Object representation of the Mongo ID validation chain
 */
function mongoIdObject(fieldName: string) {
    return {
        trim: true,
        notEmpty: true,
        errorMessage: `Field '${fieldName}' is required!`,
        isMongoId: { errorMessage: `Invalid value for filed '${fieldName}'!` },
    }
}

/**
 * @return
 * Object representation of the optional array of Mongo IDs (trimmed) validation chain
 */
function optionalArrayOfTrimmedMongoIdsObject(){
    return {
        optional: true,
        isArray: true,
        trim: true,
        isMongoId: {errorMessage: "Invalid ID!"}
    }
}

/**
 * @return
 * Validation chain for validating Directory from Body
 */
export function validateDirectory()  {
    return validator.checkSchema(
        {
            name: {
                trim: true,
                notEmpty: { errorMessage: "Field 'name' is required!" },
            },
            owner: mongoIdObject('owner'),
            parent: {
                optional: true,
                ...mongoIdObject('parent'),
            },
            children: optionalArrayOfTrimmedMongoIdsObject(),
            files: optionalArrayOfTrimmedMongoIdsObject(),
            collaborators: optionalArrayOfTrimmedMongoIdsObject()
        },
        ['body']
    );
}

/**
 * @return
 * Validation chain for validating User from Body
 */
export function validateUser()  {
    return validator.checkSchema(
        {
            username: {
                trim: true,
                notEmpty: { errorMessage: "Field 'name' is required!" },
                unique:{
                    custom: validateUsernameUniqueness,
                    errorMessage: "Specified username is already taken."
                }
            },
            email: {
                trim: true,
                isEmail: { errorMessage: "Invalid E-mail address!" },
                unique: {
                    custom: validateEmailUniqueness,
                    errorMessage: "Specified e-mail is already taken."
                }
            }
        },
        ['body']
    );
}


/**
 *@return
 * Validation chain for validating children to be added to directory
 */
export function validateChildrenAdmission(){
    return validator.checkSchema(
        {
            directory: mongoIdObject('directory'),
            children: optionalArrayOfTrimmedMongoIdsObject()
        },
        ['body']
    )
}

/**
 *@return
 * Validation chain for validating files to be added to directory
 */
export function validateFilesAdmission(){
    return validator.checkSchema(
        {
            directory: mongoIdObject('directory'),
            files: optionalArrayOfTrimmedMongoIdsObject()
        },
        ['body']
    )
}


async function validateUsernameUniqueness(username: string){
    const user = await getUserWithUsername(username);
    if (user)
        throw new Error("Username is already taken!");
}

async function validateEmailUniqueness(email: string){
    const user = await getUserWithEmail(email);
    if (user)
        throw new Error("E-mail is already taken!");
}