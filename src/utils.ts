export function getFiveDayAgoDate(): string {
	const fiveDayAgo = new Date();
	fiveDayAgo.setDate(fiveDayAgo.getDate() - 5);
	return fiveDayAgo.toISOString();
}
