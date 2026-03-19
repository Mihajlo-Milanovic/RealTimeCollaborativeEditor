import {Request, Response, Router} from "express";
import * as oc from "../controllers/organizationController";
import * as validation from "../middlewares/validation/httpRequestValidation";
import {
    validateChildrenAdmission,
    validateIdFromPath, validateMembersByUsernames, validateMembersIds, validateMembersIdsAndRoles,
    validateOrganization,
    validateString
} from "../middlewares/validation/httpRequestValidation";
import {updateOrganization} from "../controllers/organizationController";

export const organizationRouter = Router();

organizationRouter.get('/name/:name',
    validateString('name'),
    oc.getOrganizationByName
);

organizationRouter.get('/:id',
    validateIdFromPath('id'),
    oc.getOrganizationById
);

organizationRouter.post('/create',
    validateOrganization(),
    oc.createOrganization
);

organizationRouter.put('/:id/addChildren',
    validateIdFromPath('id'),
    validateChildrenAdmission(),
    oc.addChildrenByIds
);

organizationRouter.put('/:id/removeChildren/',
    validateIdFromPath('id'),
    validateChildrenAdmission(),
    oc.removeFromChildrenByIds
);

organizationRouter.put('/:id/update/',
    validateIdFromPath('id'),
    validateOrganization(),
    oc.updateOrganization
);


organizationRouter.put('/:id/addMembers',
    validateIdFromPath('id'),
    validateMembersIdsAndRoles(),
    oc.addMembersByIds
);

organizationRouter.put('/:id/addMembersByUsername',
    validateIdFromPath('id'),
    validateMembersByUsernames(),
    oc.addMembersByUsername
);

organizationRouter.put('/:id/removeMembers/',
    validateIdFromPath('id'),
    validateMembersIds(),
    oc.removeFromMembersByIds
);

organizationRouter.put('/:id/addProjections/',
    validateIdFromPath("id"),
    validateChildrenAdmission(),
    oc.addProjectionsByIds
);

organizationRouter.put('/:id/removeProjections/',
    validateIdFromPath("id"),
    validateChildrenAdmission(),
    oc.removeFromProjectionsByIds
);

organizationRouter.delete('/:id/delete/userId/:userId',
    validation.validateIdFromPath("id"),
    validation.validateIdFromPath("userId"),
    oc.deleteOrganization
);


// organizationRouter.get(
//   "/user/:userId",
//   validation.validateIdFromPath("userId"),
//   oc.getOrganizationsForUser
// )
//
// organizationRouter.put(
//   "/:id/addMemberByUsername",
//   validation.validateIdFromPath("id"),
//   validation.validateString("username"),
//   validation.validateIdFromPath("applicantId"),
//   oc.addMemberByUsername
// )
//
// organizationRouter.delete(
//   "/:id/leave/userId/:userId",
//   validation.validateIdFromPath("id"),
//   validation.validateIdFromPath("userId"),
//   oc.leaveOrganization
// )