export default function pad(num, size) {
	if (typeof(num) !== 'string')
		num = '' + num;

	if (!size)
		size = 2;

	if (num.length === size)
		return num;

	let s = `000000000${num}`;
	return s.substr(s.length - size);
}