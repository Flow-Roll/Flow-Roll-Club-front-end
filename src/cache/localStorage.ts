// Save any value under a numeric ID
export function saveToLocalStorage(id: number, value: any): void {
    const key = `item_${id}`;
    localStorage.setItem(key, stringifyWithBigInt(value));
}

// Fetch any value by numeric ID
export function fetchFromLocalStorage<T = any>(id: number): T | null {
    const key = `item_${id}`;
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
        return parseWithBigInt(item) as T;
    } catch (err) {
        console.error(`Error parsing data for ID ${id}:`, err);
        return null;
    }
}

function stringifyWithBigInt(obj: any) {
    return JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? `${value}n` : value
    );
}

function parseWithBigInt(json: string) {
    return JSON.parse(json, (_, value) => {
        if (typeof value === 'string' && /^\d+n$/.test(value)) {
            return BigInt(value.slice(0, -1)); // Remove 'n' and convert
        }
        return value;
    });
}