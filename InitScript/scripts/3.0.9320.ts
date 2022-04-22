import { customUpdate } from '../util/db';

const statusPageCollection: string = 'statuspages';

async function run(): void {
    await customUpdate(
        statusPageCollection,
        {
            'layout.invisible.key': {
                $nin: ['externalStatusPage'],
            },
            'layout.visible.key': {
                $nin: ['externalStatusPage'],
            },
        },
        {
            $push: {
                'layout.invisible': {
                    name: 'External Status Pages',
                    key: 'externalStatusPage',
                },
            },
        }
    );
    return `Script completed`;
}

export default run;
