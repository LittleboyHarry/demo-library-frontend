export = hook;
export as namespace hook;

declare namespace hook {

	function useMockableJsonFetch(
		options: {
			name: String;
			url: String;
			method?: String;
			body?: any;
			defaultData?: any;
			mockData?: any;
			blocked?: boolean = false;
			onFinish?: (success: boolean) => void;
		},
		dependency?: Array<any>
	): {
		loading: boolean;
		success: boolean;
		data?: any;
	};

	namespace useMockableJsonFetch {
		let enableMock: boolean;
	}

}