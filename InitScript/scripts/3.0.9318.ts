import { find, update } from '../util/db';

const subscriberCollection: string = 'subscribers';

async function run(): void {
    const subscribers: $TSFixMe = await find(subscriberCollection, {
        notificationType: { $exists: false },
    });

    for (let i: $TSFixMe = 0; i < subscribers.length; i++) {
        const subscriber: $TSFixMe = subscribers[i];
        let notificationType: $TSFixMe = null;
        if (subscriber.statusPageId) {
            notificationType = {
                announcement: false,
                incident: false,
                scheduledEvent: false,
            };
        }
        await update(
            subscriberCollection,
            { _id: subscriber._id },
            {
                notificationType,
            }
        );
    }
}

export default run;
