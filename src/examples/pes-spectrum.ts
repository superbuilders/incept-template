import type { PESSpectrumProps } from "@/widgets/generators/pes-spectrum"

// Valid examples for the PES Spectrum widget
export const pesSpectrumExamples: PESSpectrumProps[] = [
	{
		type: "pesSpectrum",
		title: "Photoelectron Spectrum of Carbon",
		width: 400,
		height: 300,
		yAxisLabel: "Relative Number of Electrons",
		peaks: [
			{
				energy: 11.3,
				heightUnits: 4,
				topLabel: "2p"
			},
			{
				energy: 19.4,
				heightUnits: 2,
				topLabel: "2s"
			},
			{
				energy: 284,
				heightUnits: 2,
				topLabel: "1s"
			}
		]
	},
	{
		type: "pesSpectrum",
		title: "Photoelectron Spectrum of Nitrogen",
		width: 450,
		height: 320,
		yAxisLabel: "Relative Number of Electrons",
		peaks: [
			{
				energy: 14.5,
				heightUnits: 3,
				topLabel: "2p"
			},
			{
				energy: 25.6,
				heightUnits: 2,
				topLabel: "2s"
			},
			{
				energy: 410,
				heightUnits: 2,
				topLabel: "1s"
			}
		]
	},
	{
		type: "pesSpectrum",
		title: null,
		width: 350,
		height: 300,
		yAxisLabel: "Number of Electrons",
		peaks: [
			{
				energy: 5.1,
				heightUnits: 1,
				topLabel: null
			},
			{
				energy: 9.3,
				heightUnits: 6,
				topLabel: null
			},
			{
				energy: 18.6,
				heightUnits: 2,
				topLabel: null
			},
			{
				energy: 207,
				heightUnits: 2,
				topLabel: null
			}
		]
	},
	{
		type: "pesSpectrum",
		title: "PES Analysis of Unknown Element",
		width: 500,
		height: 350,
		yAxisLabel: "Photoelectron Count",
		peaks: [
			{
				energy: 6.8,
				heightUnits: 6,
				topLabel: "3p"
			},
			{
				energy: 12.1,
				heightUnits: 2,
				topLabel: "3s"
			},
			{
				energy: 25.3,
				heightUnits: 6,
				topLabel: "2p"
			},
			{
				energy: 31.8,
				heightUnits: 2,
				topLabel: "2s"
			},
			{
				energy: 347,
				heightUnits: 2,
				topLabel: "1s"
			}
		]
	}
]
