"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCourseApi = void 0;
class GetCourseApi {
    constructor() {
        this.name = 'getCourseApi';
        this.displayName = 'GetCourse API';
        this.documentationUrl = 'https://getcourse.ru/help/api';
        this.properties = [
            {
                displayName: 'Аккаунт',
                name: 'account',
                type: 'string',
                default: '',
                placeholder: 'myaccount',
                description: 'Имя вашего аккаунта GetCourse (например, myaccount из myaccount.getcourse.ru)',
            },
            {
                displayName: 'Секретный ключ',
                name: 'secretKey',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
                description: 'Секретный ключ API GetCourse',
            },
        ];
    }
}
exports.GetCourseApi = GetCourseApi;
//# sourceMappingURL=GetCourse.credentials.js.map