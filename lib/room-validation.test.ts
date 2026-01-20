import { ROOMS } from './game-data';

/**
 * Normalization logic copied from app/play/[roomId]/page.tsx
 */
const normalize = (s: string) => s?.toLowerCase().trim().replace(/[^a-z0-9]/g, '') || "";

function validateRooms() {
    console.log("Starting Room Audit...\n");
    let failures = 0;

    ROOMS.forEach(room => {
        console.log(`Checking Room: ${room.title} (${room.id})`);
        room.puzzles.forEach((puzzle, idx) => {
            const answers = Array.isArray(puzzle.answer) ? puzzle.answer : [puzzle.answer];

            if (answers.length === 0) {
                console.error(`  [FAIL] Puzzle ${idx + 1}: No answer defined.`);
                failures++;
                return;
            }

            // Simple check: does the solution explanation contain the answer? (Heuristic)
            const normalizedExplanation = normalize(puzzle.solution_explanation);
            const found = answers.some(ans => normalizedExplanation.includes(normalize(ans)));

            if (!found) {
                console.warn(`  [WARN] Puzzle ${idx + 1}: Answer "${answers.join(', ')}" not found in explanation: "${puzzle.solution_explanation}"`);
            } else {
                console.log(`  [OK] Puzzle ${idx + 1}: "${puzzle.question.substring(0, 30)}..."`);
            }
        });
    });

    if (failures === 0) {
        console.log("\nAudit complete. No critical failures detected.");
    } else {
        console.error(`\nAudit failed with ${failures} critical errors.`);
        process.exit(1);
    }
}

validateRooms();
