import {Router} from "express";
import * as oc from "../controllers/organizationController";
import * as validation from "../middlewares/validation/httpRequestValidation";
import {
    validateChildrenAdmission,
    validateIdFromPath, validateMembersByUsernames, validateMembersIds, validateMembersIdsAndRoles, validateNamesArray,
    validateOrganization,
    validateString
} from "../middlewares/validation/httpRequestValidation";

export const organizationRouter = Router();

organizationRouter.get('/names',
    validateNamesArray(),
    oc.getOrganizationsByNames
);

organizationRouter.get('/:id',
    validateIdFromPath('id'),
    oc.getOrganizationById
);

organizationRouter.post('/',
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

organizationRouter.delete('/:id/:userId',
    validation.validateIdFromPath("id"),
    validation.validateIdFromPath("userId"),
    oc.deleteOrganization
);
