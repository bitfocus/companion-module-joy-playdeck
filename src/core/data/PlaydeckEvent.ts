export class PlaydeckEvent {
	#sData!: string
	constructor(sData: string) {
		this.#sData = sData
	}
	getPlaydeckValues(): Array<any> {
		return []
	}
	log(): void {
		console.log(this.#sData)
	}
}
