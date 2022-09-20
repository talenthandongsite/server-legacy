
export function parseAbbribiatedNumber(numbers: string): number {
    const multiple = numbers.search(/[bB]/) > -1 ? 1000000000 : numbers.search(/[mM]/) > -1 ? 1000000 : 1;
    return parseFloat(numbers.replace(/\$/g, '')) * multiple;
}

export function safeParseFloat(numbers: string): number {
    return isNaN(parseFloat(numbers)) ? 0 : parseFloat(numbers);
}

export function safeParseInt(numbers: string): number {
    return isNaN(parseInt(numbers)) ? 0 : parseInt(numbers);
}

export function safePercentage(numbers: string): number {
    return isNaN(parseFloat(numbers)) ? 0 : parseFloat(numbers) / 100;
}