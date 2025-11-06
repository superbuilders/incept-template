import type { DataTableProps } from "@/widgets/generators/data-table"

export const dataTableExamples: DataTableProps[] = [
	{
		type: "dataTable",
		caption: "Monthly Temperature Data",
		headers: ["Month", "Temperature (°F)", "Rainfall (inches)"],
		rows: [
			["January", "45", "3.2"],
			["February", "48", "2.8"],
			["March", "55", "3.5"],
			["April", "62", "2.1"]
		],
		rowHeaders: false
	},
	{
		type: "dataTable",
		caption: "Properties of States of Matter",
		headers: ["Property", "Solid", "Liquid", "Gas"],
		rows: [
			["Shape", "Fixed", "Takes container shape", "Takes container shape"],
			["Volume", "Fixed", "Fixed", "Takes container volume"],
			["Compressible", "No", "No", "Yes"]
		],
		rowHeaders: true
	},
	{
		type: "dataTable",
		caption: null,
		headers: [
			"Substance",
			{ text: "Density (g/cm", mathml: "<msup><mrow/><mn>3</mn></msup>" },
			"Phase"
		],
		rows: [
			["Water", "1.0", "Liquid"],
			["Ice", "0.92", "Solid"],
			["Aluminum", "2.7", "Solid"],
			["Mercury", "13.6", "Liquid"]
		],
		rowHeaders: false
	}
]
