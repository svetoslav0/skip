export interface IClassesResponseBuilder {
    data: {
        classId: number;
        success: boolean;
        message: string;
        errors: string[];
    }
}
