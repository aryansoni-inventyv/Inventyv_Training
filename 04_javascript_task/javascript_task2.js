function printPattern(size) {
    for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
            process.stdout.write(String(Math.min(i, j, size - i + 1, size - j + 1)));
            process.stdout.write(" "); 
        }
        console.log(); 
    }
}
printPattern(6);
