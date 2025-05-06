import { PlaydeckStatusInterface } from '../PlaydeckStatusInterface.js'


export class PlaydeckStatusV4 extends PlaydeckStatusInterface<PlaydeckProjectValues, PlaydeckChannelValues> {
	#common: PlaydeckProjectValues
	#channel: PlaydeckChannelValues[]
	#json?: string
	#rawData: string | null = null
	constructor(json: string) {
        super()
		this.#json = json
		try {
			this.#rawData = JSON.parse(this.#json)
		} catch (error) {
			console.log(`PlaydeckStatusV3 Parsing error: ${error.message}`)
		}
        this.#common = {
            d: 12,
        }
        this.#channel= [{ g: 53 }],
	}
	getValues(): PlaydeckValuesV4 | null {
		if (this.#rawData === null) return null
		return {
			common: this.#common,
			channel: this.#channel,
		}
	}
}

export interface PlaydeckValuesV4 {
	common: PlaydeckProjectValues
	channel: PlaydeckChannelValues[]
}

interface PlaydeckProjectValues {
	d: number
}

interface PlaydeckChannelValues {
	g: number
}
