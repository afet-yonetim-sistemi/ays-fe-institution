export const removeAccents = (string: string) => {
	var r = string.toLowerCase();
	r = r.replace(new RegExp("\\s", "g"), "");
	r = r.replace(new RegExp("[àáâãäå]", "g"), "a");
	r = r.replace(new RegExp("æ", "g"), "ae");
	r = r.replace(new RegExp("ç", "g"), "c");
	r = r.replace(new RegExp("[èéêë]", "g"), "e");
	r = r.replace(new RegExp("[ìíîï]", "g"), "i");
	r = r.replace(new RegExp("ñ", "g"), "n");
	r = r.replace(new RegExp("[òóôõö]", "g"), "o");
	r = r.replace(new RegExp("œ", "g"), "oe");
	r = r.replace(new RegExp("[ùúûü]", "g"), "u");
	r = r.replace(new RegExp("[ýÿ]", "g"), "y");
	r = r.replace(new RegExp("\\W", "g"), "");
	return r;
};
