export enum EQueueEventType {
    JobExecuted = 0,
    JobCancelled = 1,
    JobAddedIntoCurrentTick = 2,
    JobAddedIntoMongo = 3,
}