export abstract class CronTaskEntity {
    public abstract execute(): Promise<any>;
}
