function createCounter() {
	let val = 0;
	return {
		increment() {
			val++;
		},
		getVal() {
			return val;
		},
	};
}

const counter = createCounter();
counter.increment();
console.log(counter.getVal()); // 1
counter.increment();
console.log(counter.getVal()); // 2

// pnpm tsx closure/intex.ts
