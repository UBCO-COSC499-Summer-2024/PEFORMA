const { getMeetings } = require('../../../app/backend/services/ShowList/meetingService');
const pool = require('../../../app/backend/db/index');

// Mock the database pool
jest.mock('../../../app/backend/db/index', () => ({
    query: jest.fn(),
}));

describe('Meeting Service', () => {
    beforeEach(() => {
        // Mock the current date to a fixed value for consistent testing
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2023-07-30'));
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('should fetch meetings from the last 3 days and future meetings', async () => {
        // Mock data
        const mockMeetings = [
            {
                id: 1,
                meetingTitle: 'Old Meeting',
                location: 'Room A',
                date: new Date('2023-07-26'), // More than 3 days ago
                time: '09:00:00',
                participants: [{ ubcid: '12345', name: 'John Doe' }],
            },
            {
                id: 2,
                meetingTitle: 'Recent Meeting 1',
                location: 'Room B',
                date: new Date('2023-07-28'), // Within last 3 days
                time: '14:00:00',
                participants: [],
            },
            {
                id: 3,
                meetingTitle: 'Today Meeting',
                location: 'Room C',
                date: new Date('2023-07-30'), // Today
                time: '10:00:00',
                participants: [{ ubcid: '67890', name: 'Jane Smith' }],
            },
            {
                id: 4,
                meetingTitle: 'Future Meeting',
                location: 'Room D',
                date: new Date('2023-08-01'), // In the future
                time: '11:00:00',
                participants: [],
            },
        ];

        // Mock the database query response
        // This simulates the SQL query's filtering and ordering
        const filteredAndOrderedMeetings = mockMeetings
            .filter(meeting => meeting.date >= new Date('2023-07-27')) // 3 days ago
            .sort((a, b) => b.date - a.date);

        pool.query.mockResolvedValue({ rows: filteredAndOrderedMeetings });

        // Call the function
        const result = await getMeetings();

        // Assertions
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(3); // 3 meetings should be returned
        expect(result[0]).toEqual({
            id: 4,
            meetingTitle: 'Future Meeting',
            location: 'Room D',
            date: '2023-08-01',
            time: '11:00',
            participants: [],
        });
        expect(result[1]).toEqual({
            id: 3,
            meetingTitle: 'Today Meeting',
            location: 'Room C',
            date: '2023-07-30',
            time: '10:00',
            participants: [{ ubcid: '67890', name: 'Jane Smith' }],
        });
        expect(result[2]).toEqual({
            id: 2,
            meetingTitle: 'Recent Meeting 1',
            location: 'Room B',
            date: '2023-07-28',
            time: '14:00',
            participants: [],
        });
        // Ensure old meeting is not included
        expect(result.find(m => m.id === 1)).toBeUndefined();
    });

    it('should handle database errors', async () => {
        // Mock a database error
        const dbError = new Error('Database error');
        pool.query.mockRejectedValue(dbError);

        // Call the function and expect it to throw
        await expect(getMeetings()).rejects.toThrow('Database error');

        // Ensure the query was attempted
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});