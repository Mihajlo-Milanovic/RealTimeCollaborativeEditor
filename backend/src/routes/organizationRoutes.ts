import {Request, Response, Router} from "express";
import * as oc from "../controllers/organizationController";
import * as validation from "../middlewares/validation/httpRequestValidation";

export const organizationRouter = Router();

organizationRouter.all('/',
    (req: Request, res: Response) => {

        const routes: Array<string> = organizationRouter.stack.map(({route}) =>
            `[${[...new Set(route?.stack?.map(entry => entry.method))]}] ${route?.path}`
        );
        res.json(routes).end();
    });

organizationRouter.get('/getOrganizationByName/',
    validation.validateString('organizationName'),
    oc.getOrganizationByName
);

organizationRouter.get('/getOrganizationById/',
    validation.validateIdFromQuery('organizationId'),
    oc.getOrganizationById
);

organizationRouter.get('/createOrganization/',
    validation.validateOrganization(),
    oc.createOrganization
);

organizationRouter.get('/addChildrenByIds/',
    oc.addChildrenByIds
);

organizationRouter.get('/removeFromChildrenByIds/',
    oc.removeFromChildrenByIds
);

organizationRouter.get('/addFilesByIds/',
    oc.addFilesByIds
);

organizationRouter.get('/removeFromFilesByIds/',
    oc.removeFromFilesByIds
);

organizationRouter.get('/addMembersByIds/',
    oc.addMembersByIds
);

organizationRouter.get('/removeFromMembersByIds/',
    oc.removeFromMembersByIds
);

organizationRouter.get('/addProjectionsByIds/',
    oc.addProjectionsByIds
);

organizationRouter.get('/removeFromProjectionsByIds/',
    oc.removeFromProjectionsByIds
);


organizationRouter.delete('/deleteOrganization',
    validation.validateIdFromQuery('organizationId'),
    validation.validateIdFromQuery('applicantId'),
    oc.deleteOrganization
);