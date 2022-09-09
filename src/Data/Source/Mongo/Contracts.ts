export interface IJobRaw {
    _id: any;
    scheduledTo: Date,
    scheduledAt: Date,
    params: { [key: string]: any }
}

export interface IJobRawV2<T> {
    _id: any;
    scheduledTo: Date;
    scheduledAt: Date;
    params: T;
}

export interface IQuizClose {
    classId: string;
    userId: number;
    teamId: number;
    subdomain: string;
}