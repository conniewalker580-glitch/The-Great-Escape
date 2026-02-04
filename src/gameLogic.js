const FOUND = new Set()
const ANSWER = '314'
const REQUIRED_CLUES = 2

export function revealClue(obj) {
    if (!FOUND.has(obj.userData.clue)) {
        FOUND.add(obj.userData.clue)
        alert(obj.userData.clue)
    }
}

export function checkAnswer(value) {
    const msg = document.getElementById('message')
    if (value === ANSWER && FOUND.size >= REQUIRED_CLUES) {
        msg.textContent = 'Door unlocked. You escape.'
        msg.style.color = 'lightgreen'
    } else if (value === ANSWER && FOUND.size < REQUIRED_CLUES) {
        msg.textContent = 'You know the answer, but you haven\'t found enough clues.'
        msg.style.color = 'orange'
    } else {
        msg.textContent = 'The door remains sealed.'
        msg.style.color = 'red'
    }
}
