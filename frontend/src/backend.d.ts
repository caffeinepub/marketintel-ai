import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface AnalysisRecord {
    trend: string;
    timeframe: string;
    resistanceLevels: Array<number>;
    summary: string;
    supportLevels: Array<number>;
    assetSymbol: string;
    timestamp: Time;
    riskLevel: string;
    rsiStatus: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAnalysisHistory(): Promise<Array<AnalysisRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    saveAnalysis(record: AnalysisRecord): Promise<void>;
}
