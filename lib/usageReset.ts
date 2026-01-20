import { db } from '@/lib/db';

export function resetIfNewMonth(userId: string) {
    const user = db.getUser(userId);
    if (!user) return;

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (user.usageMonth !== currentMonth) {
        db.updateUser(userId, {
            roomsPlayed: 0,
            usageMonth: currentMonth
        });
    }
}
