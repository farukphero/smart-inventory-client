const toBeInclude = ["brand", "productType", "test1"];
const toBeIncludeMotor = ["brand", "productType"];

// Move fields into features
export const updatedInput = (input: any) => {
	const newFeatures = [...input.features];

	toBeInclude.forEach((key) => {
		if (input[key]) {
			// const item = input[key];
			// newFeatures.push({
			// 	name: key, // you can localize/rename if needed
			// 	label: item.label ?? String(item),
			// 	value: item.value ?? String(item),
			// });
			delete input[key]; // remove from root
		}
	});

	return { ...input, features: newFeatures };
};

export const removeUndefined = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj
			.map((item) => removeUndefined(item))
			.filter((item) => item !== undefined);
	} else if (obj && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj)
				.filter(([_, v]) => v !== undefined)
				.map(([k, v]) => [k, removeUndefined(v)]),
		);
	}
	return obj;
};

export const removeEmptyValues = (
	obj: Record<string, any>,
): Record<string, any> =>
	Object.fromEntries(
		Object.entries(obj)
			.filter(([_, value]) => {
				if (value === undefined || value === null) return false;
				if (Array.isArray(value) && value.length === 0) return false;
				if (typeof value === "string" && value.trim() === "")
					return false;
				if (
					typeof value === "object" &&
					!Array.isArray(value) &&
					Object.keys(value).length === 0
				)
					return false;
				return true;
			})
			.map(([key, value]) => [
				key,
				typeof value === "object" && !Array.isArray(value)
					? removeEmptyValues(value)
					: value,
			]),
	);
