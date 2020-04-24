import {IsDefined, IsDateString, IsPositive, Validate, IsDate} from "class-validator";

import { IsReportIdExisting } from "../validators/IsReportIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { IsClassIdExisting } from "../validators/IsClassIdExisting";
import {IsClassRoleIdExisting, IsClassRoleIdExistingConstraint} from "../validators/IsClassRoleIdExisting";

export class ReportEntityDTO {

    @IsReportIdExisting({
        message: MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _reportId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsClassIdExisting({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsClassRoleIdExisting({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classRoleId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.DATE_FIELD_NOT_DEFINED
    })
    @IsDate({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.DATE_FIELD_NOT_VALID_DATE
    })
    private _date: Date;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.HOURS_SPEND_FIELD_NOT_DEFINED
    })
    @IsPositive({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.HOURS_SPEND_FIELD_NOT_POSITIVE
    })
    private _hoursSpend: number;

    constructor(reqBody: any) {
        this._reportId = reqBody.reportId;
        this._classId = reqBody.classId;
        this._classRoleId = reqBody.classRoleId;
        this._date = new Date(reqBody.date);
        this._hoursSpend = +reqBody.hoursSpend;
    }


    get reportId(): number {
        return this._reportId;
    }

    set reportId(value: number) {
        this._reportId = value;
    }

    get classId(): number {
        return this._classId;
    }

    set classId(value: number) {
        this._classId = value;
    }

    get classRoleId(): number {
        return this._classRoleId;
    }

    set classRoleId(value: number) {
        this._classRoleId = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get hoursSpend(): number {
        return this._hoursSpend;
    }

    set hoursSpend(value: number) {
        this._hoursSpend = value;
    }
}
