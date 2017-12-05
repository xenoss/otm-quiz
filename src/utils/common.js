export function shuffle(arr) {
    let j;
    let x;
    let i;
    const a = arr.slice();
    for (i = a.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function getScore(positiveAnswers, totalAnswers, base = 5) {
    return (base * positiveAnswers) / totalAnswers;
}
