const request = require('supertest')
const app = require('../server.js')
const db = require('../db/models')

describe('Login systems', () => {
    let thisDb = db
    let userToken = ''
    let user = ''
    const userData = {
        email: "tester@gmail.com",
        password: "TesterDeposit127",
        name: "Daniel"
    };

    beforeAll(async () => {
        await thisDb.sequelize.sync({ force: true })
    })

    it("should succeed sign up with valid credential", async () => {
        const response = await request(app)
            .post("/api/v1/signup")
            .send(userData)
            .expect(200)
        expect(response.body.userData[0].name).toEqual(userData.name)
    })

    it("should succeed login with valid credential", async () => {
        const userResData = await request(app)
            .post("/api/v1/login")
            .send(userData)
            .expect(200)

        userToken = userResData.body.token
        user = userResData.body.user
        expect(userResData.body.user.email).toBe(userData.email);
        expect(userResData.body.info.message).toBe('Logged In Successfully');
        expect(userResData.body.token).not.toBe('');
    })

    test('should have two precreate deposit plan', async () => {
        const userDepositPlans = await request(app)
            .get("/api/v1/depositplan")
            .set({ "Authorization": `Bearer ${userToken}` })
            .expect(200)
        expect(userDepositPlans.body.depositPlans).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isMonthly: false,
                    user_id: user.id,
                }),
                expect.objectContaining({
                    isMonthly: true,
                    user_id: user.id,
                })
            ])
        );
    });

    it("should failed when inserting non valid password", async () => {
        const WrongUser = {
            email: "co2ssol@gmail.com",
            password: "232390kfsdc"
        };

        const response = await request(app)
            .post("/api/v1/signup")
            .send(WrongUser)
            .expect(400)

        expect(response.body.error).toEqual(
            'Password is not valid. Password must fulfull below criteria: 1. min length of 8. 2. have uppercase. 3. have lowercase. 4. must have digits. 5. must not have spaces'
        )
    })

    afterAll(async () => {
        await thisDb.sequelize.close()
    })
})
