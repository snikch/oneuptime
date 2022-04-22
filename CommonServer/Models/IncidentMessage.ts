import mongoose, {
    RequiredFields,
    UniqueFields,
    EncryptedFields,
    Schema,
} from '../Infrastructure/ORM';

const schema: Schema = new Schema({
    incidentId: {
        type: Schema.Types.ObjectId,
        ref: 'Incident',
        alias: 'incident',
        index: true,
    },
    content: String,
    type: {
        type: String,
        enum: ['investigation', 'internal'],
        required: true,
    },
    incident_state: String,
    createdById: { type: String, ref: 'User', index: true }, //UserId.
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updated: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    deletedAt: {
        type: Date,
    },

    deletedById: { type: String, ref: 'User', index: true },
    postOnStatusPage: { type: Boolean, default: false },
});

schema.virtual('incident', {
    localField: '_id',
    foreignField: 'incidentId',
    ref: 'Incident',
    justOne: true,
});
export const requiredFields: RequiredFields = schema.requiredPaths();

export const uniqueFields: UniqueFields = [];
export const encryptedFields: EncryptedFields = [];

export const slugifyField: string = '';

export default mongoose.model('IncidentMessage', schema);
