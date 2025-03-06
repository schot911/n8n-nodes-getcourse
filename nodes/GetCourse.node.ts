import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export class GetCourse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GetCourse',
		name: 'getCourse',
		icon: 'file:getcourse.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Взаимодействие с API GetCourse',
		defaults: {
			name: 'GetCourse',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'getCourseApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Ресурс',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Пользователь',
						value: 'user',
					},
					{
						name: 'Сделка',
						value: 'deal',
					},
					{
						name: 'Группа',
						value: 'group',
					},
				],
				default: 'user',
			},
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'user',
						],
					},
				},
				options: [
					{
						name: 'Создать',
						value: 'create',
						description: 'Создать пользователя',
					},
					{
						name: 'Обновить',
						value: 'update',
						description: 'Обновить пользователя',
					},
					{
						name: 'Получить',
						value: 'get',
						description: 'Получить пользователя',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
					},
				},
				options: [
					{
						name: 'Создать',
						value: 'create',
						description: 'Создать сделку',
					},
					{
						name: 'Обновить',
						value: 'update',
						description: 'Обновить сделку',
					},
					{
						name: 'Получить',
						value: 'get',
						description: 'Получить сделку',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'group',
						],
					},
				},
				options: [
					{
						name: 'Добавить пользователя',
						value: 'addUser',
						description: 'Добавить пользователя в группу',
					},
					{
						name: 'Удалить пользователя',
						value: 'removeUser',
						description: 'Удалить пользователя из группы',
					},
					{
						name: 'Получить список',
						value: 'getList',
						description: 'Получить список групп',
					},
				],
				default: 'addUser',
			},

			// Поля для пользователя - создание и обновление
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				description: 'Email пользователя',
			},
			{
				displayName: 'Имя',
				name: 'firstName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				description: 'Имя пользователя',
			},
			{
				displayName: 'Фамилия',
				name: 'lastName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				description: 'Фамилия пользователя',
			},
			{
				displayName: 'Телефон',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				description: 'Телефон пользователя',
			},
			{
				displayName: 'Дополнительные поля',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Добавить поле',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				options: [
					{
						displayName: 'Город',
						name: 'city',
						type: 'string',
						default: '',
						description: 'Город пользователя',
					},
					{
						displayName: 'Страна',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Страна пользователя',
					},
					{
						displayName: 'Пользовательские поля',
						name: 'customFields',
						placeholder: 'Добавить пользовательское поле',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Поле',
								values: [
									{
										displayName: 'Имя поля',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Имя пользовательского поля',
									},
									{
										displayName: 'Значение',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Значение пользовательского поля',
									},
								],
							},
						],
					},
				],
			},

			// Поля для пользователя - получение
			{
				displayName: 'Идентификатор пользователя',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'get',
						],
					},
				},
				description: 'ID или email пользователя',
			},

			// Поля для сделки - создание и обновление
			{
				displayName: 'Email пользователя',
				name: 'userEmail',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				description: 'Email пользователя для сделки',
			},
			{
				displayName: 'Название предложения',
				name: 'offerName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
						operation: [
							'create',
						],
					},
				},
				description: 'Название предложения для сделки',
			},
			{
				displayName: 'ID сделки',
				name: 'dealId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
						operation: [
							'update',
							'get',
						],
					},
				},
				description: 'ID сделки',
			},
			{
				displayName: 'Статус',
				name: 'status',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
						operation: [
							'update',
						],
					},
				},
				description: 'Новый статус сделки',
			},
			{
				displayName: 'Дополнительные поля сделки',
				name: 'dealAdditionalFields',
				type: 'collection',
				placeholder: 'Добавить поле',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'deal',
						],
						operation: [
							'create',
							'update',
						],
					},
				},
				options: [
					{
						displayName: 'Сумма',
						name: 'price',
						type: 'number',
						default: 0,
						description: 'Сумма сделки',
					},
					{
						displayName: 'Комментарий',
						name: 'comment',
						type: 'string',
						default: '',
						description: 'Комментарий к сделке',
					},
					{
						displayName: 'Пользовательские поля',
						name: 'customFields',
						placeholder: 'Добавить пользовательское поле',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Поле',
								values: [
									{
										displayName: 'Имя поля',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Имя пользовательского поля',
									},
									{
										displayName: 'Значение',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Значение пользовательского поля',
									},
								],
							},
						],
					},
				],
			},

			// Поля для группы
			{
				displayName: 'Email пользователя',
				name: 'userEmail',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'addUser',
							'removeUser',
						],
					},
				},
				description: 'Email пользователя для добавления/удаления из группы',
			},
			{
				displayName: 'ID группы',
				name: 'groupId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'group',
						],
						operation: [
							'addUser',
							'removeUser',
						],
					},
				},
				description: 'ID группы',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('getCourseApi');
		const account = credentials.account as string;
		const secretKey = credentials.secretKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				
				let endpoint = '';
				let method = 'POST';
				let body: any = {};

				// Базовый URL для API GetCourse
				const baseUrl = `https://${account}.getcourse.ru/pl/api`;

				if (resource === 'user') {
					if (operation === 'create' || operation === 'update') {
						endpoint = '/users';
						
						const email = this.getNodeParameter('email', i) as string;
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							city?: string;
							country?: string;
							customFields?: {
								field: Array<{
									name: string;
									value: string;
								}>;
							};
						};

						const userData: any = {
							email,
							first_name: firstName,
							last_name: lastName,
							phone,
						};

						if (additionalFields.city) userData.city = additionalFields.city;
						if (additionalFields.country) userData.country = additionalFields.country;

						if (additionalFields.customFields && additionalFields.customFields.field) {
							for (const field of additionalFields.customFields.field) {
								userData[field.name] = field.value;
							}
						}

						body = {
							user: userData,
						};
					} else if (operation === 'get') {
						endpoint = '/users/search';
						const userId = this.getNodeParameter('userId', i) as string;
						body = {
							user: {
								id: userId,
							},
						};
					}
				} else if (resource === 'deal') {
					if (operation === 'create') {
						endpoint = '/deals/create';
						
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						const offerName = this.getNodeParameter('offerName', i) as string;
						const additionalFields = this.getNodeParameter('dealAdditionalFields', i) as {
							price?: number;
							comment?: string;
							customFields?: {
								field: Array<{
									name: string;
									value: string;
								}>;
							};
						};

						const dealData: any = {
							user_email: userEmail,
							offer_code: offerName,
						};

						if (additionalFields.price) dealData.price = additionalFields.price;
						if (additionalFields.comment) dealData.comment = additionalFields.comment;

						if (additionalFields.customFields && additionalFields.customFields.field) {
							for (const field of additionalFields.customFields.field) {
								dealData[field.name] = field.value;
							}
						}

						body = {
							deal: dealData,
						};
					} else if (operation === 'update') {
						endpoint = '/deals/update';
						
						const dealId = this.getNodeParameter('dealId', i) as string;
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						const status = this.getNodeParameter('status', i) as string;
						const additionalFields = this.getNodeParameter('dealAdditionalFields', i) as {
							price?: number;
							comment?: string;
							customFields?: {
								field: Array<{
									name: string;
									value: string;
								}>;
							};
						};

						const dealData: any = {
							id: dealId,
							user_email: userEmail,
						};

						if (status) dealData.status = status;
						if (additionalFields.price) dealData.price = additionalFields.price;
						if (additionalFields.comment) dealData.comment = additionalFields.comment;

						if (additionalFields.customFields && additionalFields.customFields.field) {
							for (const field of additionalFields.customFields.field) {
								dealData[field.name] = field.value;
							}
						}

						body = {
							deal: dealData,
						};
					} else if (operation === 'get') {
						endpoint = '/deals/search';
						const dealId = this.getNodeParameter('dealId', i) as string;
						body = {
							deal: {
								id: dealId,
							},
						};
					}
				} else if (resource === 'group') {
					if (operation === 'addUser') {
						endpoint = '/groups/add';
						
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;

						body = {
							user: {
								email: userEmail,
							},
							group: {
								id: groupId,
							},
						};
					} else if (operation === 'removeUser') {
						endpoint = '/groups/remove';
						
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;

						body = {
							user: {
								email: userEmail,
							},
							group: {
								id: groupId,
							},
						};
					} else if (operation === 'getList') {
						endpoint = '/groups/list';
						method = 'GET';
					}
				}

				// Подготовка запроса к API
				const options: OptionsWithUri = {
					method,
					uri: `${baseUrl}${endpoint}`,
					qs: {},
					body: {
						auth: secretKey,
						action: 'action',
						params: body,
					},
					json: true,
				};

				if (method === 'GET') {
					options.qs = {
						key: secretKey,
					};
					delete options.body;
				}

				// Выполнение запроса
				const responseData = await this.helpers.request(options);
				
				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 