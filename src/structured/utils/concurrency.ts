import * as errors from "@superbuilders/errors"
/**
 * Executes an array of async task functions in parallel with a specified concurrency limit.
 *
 * @param tasks An array of functions, where each function returns a Promise.
 * @param limit The maximum number of tasks to run concurrently.
 * @returns A Promise that resolves to an array of results in the same order as the input tasks,
 *          matching the structure of `Promise.allSettled`.
 */
export async function runWithConcurrency<T>(
	tasks: Array<() => Promise<T>>,
	limit: number
): Promise<Array<PromiseSettledResult<T>>> {
	const results: Array<PromiseSettledResult<T>> = []
	const executing: Array<Promise<void>> = []
	let i = 0

	const execute = async (taskIndex: number) => {
		const res = await errors.try(tasks[taskIndex]())
		if (res.error) {
			results[taskIndex] = { status: "rejected", reason: res.error }
			return
		}
		results[taskIndex] = { status: "fulfilled", value: res.data }
	}

	const enqueue = (): Promise<void> | undefined => {
		if (i >= tasks.length) {
			return undefined
		}
		const taskIndex = i++
		const promise = execute(taskIndex).then(() => {
			const index = executing.indexOf(promise)
			if (index > -1) {
				executing.splice(index, 1)
			}
			const nextPromise = enqueue()
			if (nextPromise) {
				executing.push(nextPromise)
			}
		})
		return promise
	}

	while (executing.length < limit && i < tasks.length) {
		const promise = enqueue()
		if (promise) {
			executing.push(promise)
		}
	}

	await Promise.all(executing)

	return results
}
