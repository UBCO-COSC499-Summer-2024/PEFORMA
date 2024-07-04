const { expect } = require('chai');
const sinon = require('sinon');
const faker = require('faker');
const pool = require('../db/index');
const { saveDataToDatabase } = require('../routes/DataEntry');

describe('saveDataToDatabase', function() {
    let queryStub;

    beforeEach(function() {
        queryStub = sinon.stub(pool, 'query');
    });

    afterEach(function() {
        queryStub.restore();
    });

    it('should save a Service Role with random data', async function() {
        const data = {
            selection: 'Service Role',
            serviceRoleTitle: faker.name.jobTitle(),
            serviceRoleDepartment: faker.random.arrayElement(['COSC', 'MATH', 'PHYS', 'STAT']),
            serviceRoleDescription: faker.lorem.sentence(),
            serviceRoleYear: faker.date.past().getFullYear(),
            selectedInstructors: [faker.datatype.number({ min: 1, max: 1000 })]
        };

        queryStub.onFirstCall().resolves();
        queryStub.onSecondCall().resolves({ rows: [{ serviceRoleId: faker.datatype.number({ min: 1, max: 1000 }) }] });
        queryStub.onThirdCall().resolves();
        queryStub.onCall(3).resolves();

        await saveDataToDatabase(data);

        console.log('queryStub.callCount:', queryStub.callCount);
        expect(queryStub.callCount).to.equal(3);
    });

    it('should save a Course with random data', async function() {
        const data = {
            selection: 'Course',
            courseTitle: faker.name.jobTitle(),
            courseDepartment: faker.random.arrayElement(['COSC', 'MATH', 'PHYS', 'STAT']),
            courseCode: faker.random.alphaNumeric(5),
            courseDescription: faker.lorem.sentence(),
            courseYear: faker.date.past().getFullYear(),
            courseTerm: faker.datatype.number({ min: 1, max: 4 }),
            selectedInstructors: [faker.datatype.number({ min: 1, max: 1000 })]
        };

        queryStub.onFirstCall().resolves();
        queryStub.onSecondCall().resolves({ rows: [{ courseId: faker.datatype.number({ min: 1, max: 1000 }) }] });
        queryStub.onThirdCall().resolves();
        queryStub.onCall(3).resolves();

        await saveDataToDatabase(data);

        console.log('queryStub.callCount:', queryStub.callCount);
        expect(queryStub.callCount).to.equal(4);
    });

    it('should handle errors during Service Role insertion', async function() {
        const data = {
            selection: 'Service Role',
            serviceRoleTitle: faker.name.jobTitle(),
            serviceRoleDepartment: faker.random.arrayElement(['COSC', 'MATH', 'PHYS', 'STAT']),
            serviceRoleDescription: faker.lorem.sentence(),
            serviceRoleYear: faker.date.past().getFullYear(),
            selectedInstructors: [faker.datatype.number({ min: 1, max: 1000 })]
        };

        queryStub.onFirstCall().resolves();
        queryStub.onSecondCall().rejects(new Error('Insertion error'));

        try {
            await saveDataToDatabase(data);
        } catch (error) {
            console.log('Error caught:', error.message);
            expect(error.message).to.equal('Insertion error');
        }

        console.log('queryStub.callCount:', queryStub.callCount);
        expect(queryStub.callCount).to.equal(3);
    });

    it('should handle errors during Course insertion', async function() {
        const data = {
            selection: 'Course',
            courseTitle: faker.name.jobTitle(),
            courseDepartment: faker.random.arrayElement(['COSC', 'MATH', 'PHYS', 'STAT']),
            courseCode: faker.random.alphaNumeric(5),
            courseDescription: faker.lorem.sentence(),
            courseYear: faker.date.past().getFullYear(),
            courseTerm: faker.datatype.number({ min: 1, max: 4 }),
            selectedInstructors: [faker.datatype.number({ min: 1, max: 1000 })]
        };

        queryStub.onFirstCall().resolves();
        queryStub.onSecondCall().rejects(new Error('Insertion error'));

        try {
            await saveDataToDatabase(data);
        } catch (error) {
            console.log('Error caught:', error.message);
            expect(error.message).to.equal('Insertion error');
        }

        console.log('queryStub.callCount:', queryStub.callCount);
        expect(queryStub.callCount).to.equal(2);
    });
});
