import BaseAction from './base';

class CreateActionBase extends BaseAction {
    public constructor({
        friendlyName,
        apiPath,
        isResourceInProject,
        isRequestAllowed,
    }: $TSFixMe) {
        super({
            friendlyName,
            apiPath,
            isResourceInProject,
            isRequestAllowed,
            actionType: 'create',
        });
    }
}

export default CreateActionBase;
