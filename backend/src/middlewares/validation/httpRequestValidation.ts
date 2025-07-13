import * as validator from 'express-validator';
import {IDirectory} from "../../interfaces/IDirectory";


/**
 * @Return
 * Validation chain for validating UUID from Query
 */
export function validateUUID(){
    return validator.query('uuid', "Invalid UUID!")
        .trim()
        .notEmpty().bail().withMessage("Field 'uuid' is missing!")
        .isMongoId();
}

/**
 * @Return
 * Validation chain for validating directory ID from Query
 */
export function validateDirectoryId()  {
    return validator.query('dirId')
        .trim()
        .notEmpty().bail().withMessage("Field 'dirId' is missing!")
        .isMongoId();
}

/**
 * @Return
 * Validation chain for validating Directory from Body
 */
export function validateDirectory()  {
    return validator.checkSchema(
        {
            name: {
                trim: true,
                notEmpty: { errorMessage: "Field 'name' is required!" },
            },
            owner: {
                trim: true,
                notEmpty: true,
                errorMessage: "Field 'owner' is required!",
                isMongoId: { errorMessage: "Invalid value for filed 'owner'!" },
            },
            parent: {
                optional: true,
                isMongoId: { errorMessage: "Invalid value for filed 'parent'!" },

            },
            children: {
                optional: true,
                isArray: true,
                checkElementsTypes: {
                    custom: isElementTypeMongoId,
                }
            },
            files: {
                optional: true,
                isArray: true,
                checkElementsTypes: {
                    custom: isElementTypeMongoId,
                }
            },
            collaborators: {
                optional: true,
                isArray: true,
                // checkElementsTypes: {
                //     custom: isElementTypeMongoId,
                // }
            }
        },
        ['body']
    );
}

const isElementTypeMongoId = (value: Array<any>) => {
    value.forEach(it => {
        if(!it.isMongoId())
            throw ("Invalid IDs in the array!");
    });
    return true;
}