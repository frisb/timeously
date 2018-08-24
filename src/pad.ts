export function pad(num: string | number, size = 2) {
	if (typeof(num) === 'number')
		num = '' + num;

	if (num.length === size)
		return num;

	let s = `000000000${ num }`;
	return s.substr(s.length - size);
}
