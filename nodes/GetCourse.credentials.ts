import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GetCourseApi implements ICredentialType {
	name = 'getCourseApi';
	displayName = 'GetCourse API';
	documentationUrl = 'https://getcourse.ru/help/api';
	properties: INodeProperties[] = [
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