process.env.ENVIRONMENT = "test";

import { server, database } from "../server";
import { UsersModel } from "../models/UsersModel";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const usersModel: UsersModel = new UsersModel(database);

const DEFAULT_CONTENT_TYPE: string = "application/x-www-form-urlencoded";
const CONTENT_TYPE_HEADING: string = "content-type";

const USERS_CONTROLLER_URL: string = "/users";
const LOGIN_URL: string = `${USERS_CONTROLLER_URL}/login`;
const REGISTER_URL: string = `${USERS_CONTROLLER_URL}/register`;

describe(`${USERS_CONTROLLER_URL} tests`, () => {
   describe(`POST ${LOGIN_URL} tests`, () => {
       it("Should login successfully. Username and password are correct.", () => {
           const usernameToSend: string = "hristofor";
           const passwordToSend: string = "hristofor";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatusCode: number = 200;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatusCode);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).to.have.header(expectedAuthHeader);
                   await expect(result).header(expectedAuthHeader).not.to.be.null;
               });
       });

       it("Should not login and return error. Username exists but the password is wrong.", () => {
           const usernameToSend: string = "hristofor";
           const passwordToSend: string = "kolumb";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatusCode: number = 400;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatusCode);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).not.to.have.header(expectedAuthHeader);
               });
       });

       it("Should not login and return error. This user does not exist.",  () => {
           const usernameToSend: string = "nonExistingUsername";
           const passwordToSend: string = "someRandPassword";
           const expectedPropertyData: string = "data";
           const expectedPropertyMessage: string = "message";
           const expectedAuthHeader: string = "auth-token";

           const expectedStatus: number = 400;

           const objectToSend = {
               username: usernameToSend,
               password: passwordToSend
           };

           return request(server)
               .post(LOGIN_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatus);
                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result).not.to.have.header(expectedAuthHeader);
               });
       });
   });

   describe(`POST ${REGISTER_URL} tests`, () => {
       it("Should register a new user. After then test passed, the new user should be deleted.",() => {
           const usernameToSend: string = "trifon";
           const emailToSend: string = "trifon@tri.fon";
           const passwordToSend: string = "trifon";
           const firstNameToSend: string = "Trifon";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatus: number = 201;

           let userId: number = 0;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatus);

                   userId = result.body.data.userId;
               })
               .then(async () => {
                   await usersModel.removeById(userId);
               });
       });

       it("Should not register a new user. The given username already exists in the database.", () => {
           const usernameToSend: string = "ivanivan";
           const emailToSend: string = "trifonivanov@tri.fon";
           const passwordToSend: string = "Ivan123";
           const firstNameToSend: string = "Trifon";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 2;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatus: number = 400;

           const expectedPropertyData: string = "data";
           const expectedPropertySuccess: string = "success";
           const expectedPropertyMessage: string = "message";
           const expectedPropertyErrors: string = "errors";

           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                    await expect(result.status).to.eql(expectedHttpStatus);

                    await expect(result.body).to.have.property(expectedPropertyData);
                    await expect(result.body.data).to.have.property(expectedPropertySuccess);
                    await expect(result.body.data).to.have.property(expectedPropertyMessage);
                    await expect(result.body.data).to.have.property(expectedPropertyErrors);

                    await expect(result.body.data.success).to.eql(expectedSuccess);
                    await expect(result.body.data.message).to.be.a("string");
                    await expect(result.body.data.errors).to.be.an("array");
                    await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. Missing 'username' parameter.",  () => {
           const emailToSend: string = "dimitarkirov@abv.bg";
           const passwordToSend: string = "John123nhoj";
           const firstNameToSend: string = "John";
           const lastNameToSend: string = "Kirov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedStatus: number = 400;

           const expectedPropertyData: string = "data";
           const expectedPropertySuccess: string = "success";
           const expectedPropertyMessage: string = "message";
           const expectedPropertyErrors: string = "errors";

           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatus);

                   await expect(result.body).to.have.property(expectedPropertyData);
                   await expect(result.body.data).to.have.property(expectedPropertySuccess);
                   await expect(result.body.data).to.have.property(expectedPropertyMessage);
                   await expect(result.body.data).to.have.property(expectedPropertyErrors);

                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   // TODO: Will not work properly until GH-2 is resolved
                   // await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given username is too short.", () => {
           const usernameToSend: string = "sh";
           const emailToSend: string = "doesitmatteranyway@abv.bg";
           const passwordToSend: string = "John123as";
           const firstNameToSend: string = "John";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 2;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedStatus: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatus);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given username is too long.", () => {
           const usernameToSend: string = "ashrosenbergashrosenbergashrosenbergashrosenbergashrosenbergashrosenberg";
           const emailToSend: string = "doesthatmatteranyway@abv.bg";
           const passwordToSend: string = "john123john";
           const firstNameToSend: string = "Johny";
           const lastNameToSend: string = "Johsef";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatus: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatus);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given email is invalid.", () => {
           const usernameToSend: string = "ashrosenberg";
           const emailToSend: string = "bademail";
           const passwordToSend: string = "John123";
           const firstNameToSend: string = "Johneff";
           const lastNameToSend: string = "George";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedStatusCode: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedStatusCode);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given email already exists in the database.", () => {
           const usernameToSend: string = "johnwastetimer";
           const emailToSend: string = "hristofor@abv.bg";
           const passwordToSend: string = "John123";
           const firstNameToSend: string = "John";
           const lastNameToSend: string = "Trifonov";
           const roleIdToSend: number = 1;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatusCode: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatusCode);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given password is too short.", () => {
           const usernameToSend: string = "johnywastetimer";
           const emailToSend: string = "hristoforoff@abv.bg";
           const passwordToSend: string = "sh";
           const firstNameToSend: string = "Marvin";
           const lastNameToSend: string = "John";
           const roleIdToSend: number = 2;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatusCode: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatusCode);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });

       it("Should not register a new user. The given password is too long.", () => {
           const usernameToSend: string = "johnywastetimer2";
           const emailToSend: string = "hristoforoff2@abv.bg";
           const passwordToSend: string = "dontaskmehowlongisthispassworditswaaaaaaaaaaaaaaaaaaaaaaaaaytooooooooooooooooooooooooloooooooooooooooooooooooooooongdaaaaaaaaaaaaaaaaaaaaaaaaaaamn";
           const firstNameToSend: string = "Marvinski";
           const lastNameToSend: string = "Johneff";
           const roleIdToSend: number = 2;

           const objectToSend = {
               username: usernameToSend,
               email: emailToSend,
               password: passwordToSend,
               firstName: firstNameToSend,
               lastName: lastNameToSend,
               roleId: roleIdToSend
           };

           const expectedHttpStatusCode: number = 400;
           const expectedSuccess: boolean = false;
           const expectedErrorsCount: number = 1;

           return request(server)
               .post(REGISTER_URL)
               .set(CONTENT_TYPE_HEADING, DEFAULT_CONTENT_TYPE)
               .send(objectToSend)
               .then(async (result) => {
                   await expect(result.status).to.eql(expectedHttpStatusCode);
                   await expect(result.body.data.success).to.eql(expectedSuccess);
                   await expect(result.body.data.errors.length).to.eql(expectedErrorsCount);
               });
       });
   });
});
