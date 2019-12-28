export = hook;
export as namespace hook;

declare namespace hook {

	function useMockableJsonFetch(
		name: String,
		param: {
			url: String;
			method?: String;
			body?: any;
		},
		defaultData?: any,
		mock?: any
	): {
		loading: boolean;
		success: boolean;
		data?: any;
	};

	namespace useMockableJsonFetch {
		let enableMock: boolean;
	}

}