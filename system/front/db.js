rosa.db = {
    init() {

    },
    set(table,row,value) {
        const stringify = JSON.stringify;
        const parse = JSON.parse;
        if(!localStorage.getItem(`rosa-${table}`)) {
            localStorage.setItem(`rosa-${table}`,"{}")
        }
        const data = parse( localStorage.getItem(`rosa-${table}`) );
        data[row] = value;
        localStorage.setItem(`rosa-${table}`,stringify(data));
        console.info(`rosa_${table} value \n ${stringify(value)} \n setted to the row ${row}`);
        return data;
    },
    get(table,row) {
        const data = JSON.parse( localStorage.getItem(`rosa-${table}`) );
        return data[row];
    }
}