import {Queue} from "@Infra/JobScheduler/Queue/Queue";
import {MongoQueue} from "@Infra/JobScheduler/Queue/MongoQueue";
import {Subscriber} from "@Infra/JobScheduler/Queue/Subscriber";

class QueuesSingleton {
    private queues: { [key:string]: Queue<Subscriber> } = {};

    private add(queueEntity: Queue<Subscriber>, queueName: string) {
        this.queues[queueName] = queueEntity;
    }

    getByName(queueName: string): Queue<Subscriber> {
        return this.queues[queueName];
    }

    getAll() {
        return this.queues
    }

    create(queueName: string): Queue<Subscriber> {
        this.uniqueName(queueName);

        let queue = new Queue(queueName);
        this.add(queue, queueName)

        return queue;
    }

    createMongo(
        collectionPrefix: string,
    ): MongoQueue {
        this.uniqueName(collectionPrefix);

        let queue = new MongoQueue(collectionPrefix);
        this.add(queue, collectionPrefix)

        return queue;
    }

    private uniqueName(queueName: string) {
        if (this.queues[queueName]) {
            throw new Error(`Queue ${queueName} already exists`)
        }
    }
}

export class JOBDevTracker {
    public active: boolean = false

    log(message: any) {
        if (this.active) {
            console.log('\n');
            console.log('   JobDebugger dev log   ');
            console.log(message);
        }
    }
}

const QueuesSingletonInstance = new QueuesSingleton();
const JobDebugger = new JOBDevTracker();

export {
    QueuesSingletonInstance,
    JobDebugger
}
