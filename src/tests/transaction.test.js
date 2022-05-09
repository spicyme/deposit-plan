const request = require('supertest')
const app = require('../server.js')
const db = require('../db/models')
const currency = require('currency.js')

describe('Login systems', () => {
    let thisDb = db
    let userToken = ''
    let user = ''
    const userData = {
        email: "tester@gmail.com",
        password: "TesterDeposit127",
        name: "Daniel"
    };
    const portfolio1 = {
        portfolio_id: 1,
        name: "My first portfolio",
    };
    const portfolio2 = {
        portfolio_id: 2,
        name: "My second portfolio",
    };
    const myDepositPlan = {
        portfolio: { '1': { id: 1, value: 122 }, '2': { id: 2, value: 51 } }
    };
    const transaction1 = {
        isMonthly: true,
        value: 111.39
    };
    const transaction2 = {
        isMonthly: true,
        value: 50.96
    };

    beforeAll(async () => {
        await thisDb.sequelize.sync({ force: true, logging: false })
        await request(app)
            .post("/api/v1/signup")
            .send(userData)
            .expect(200)

        const userResData = await request(app)
            .post("/api/v1/login")
            .send(userData)
            .expect(200)

        userToken = userResData.body.token
        user = userResData.body.user
    })

    it("Add first portfolio to my account", async () => {
        const createdPortfolio = await request(app)
            .post("/api/v1/uportfolio")
            .set({ "Authorization": `Bearer ${userToken}` })
            .send(portfolio1)
            .expect(200)

        expect(createdPortfolio.body.userPortfolios).toEqual(
            expect.objectContaining({
                user_id: user.id,
                portfolio_id: portfolio1.portfolio_id,
                value: 0,
                name: portfolio1.name,
            })
        );
    })

    it("Add second portfolio to my account", async () => {
        const createdPortfolio = await request(app)
            .post("/api/v1/uportfolio")
            .set({ "Authorization": `Bearer ${userToken}` })
            .send(portfolio2)
            .expect(200)

        expect(createdPortfolio.body.userPortfolios).toEqual(
            expect.objectContaining({
                user_id: user.id,
                portfolio_id: portfolio2.portfolio_id,
                value: 0,
                name: portfolio2.name,
            })
        );
    })

    it("Account should have two portfolios", async () => {
        const userDepositPlans = await request(app)
            .get("/api/v1/depositplan")
            .set({ "Authorization": `Bearer ${userToken}` })
            .expect(200)
        expect(userDepositPlans.body.depositPlans).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isMonthly: false,
                    user_id: user.id,
                    portfolio: { '1': { id: portfolio1.portfolio_id, value: 0 }, '2': { id: portfolio2.portfolio_id, value: 0 } }
                }),
                expect.objectContaining({
                    isMonthly: true,
                    user_id: user.id,
                    portfolio: { '1': { id: portfolio1.portfolio_id, value: 0 }, '2': { id: portfolio2.portfolio_id, value: 0 } }
                })
            ])
        );
    })

    test('should have two pre-create user deposit plan', async () => {
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

    test('update deposit plan', async () => {
        await request(app)
            .put("/api/v1/depositplan/2")
            .set({ "Authorization": `Bearer ${userToken}` })
            .send(myDepositPlan)
            .expect(200)

        const myDepositPlanData = await request(app)
            .get("/api/v1/depositplan")
            .set({ "Authorization": `Bearer ${userToken}` })
            .expect(200)
        expect(myDepositPlanData.body.depositPlans).toEqual(
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

    test('test create first transaction', async () => {
        const transactionData = await request(app)
            .post("/api/v1/transaction")
            .set({ "Authorization": `Bearer ${userToken}` })
            .send({ ...transaction1, ref: user.ref })
            .expect(200)

        expect(transactionData.body.createdTransaction).toEqual(
            expect.objectContaining({
                isMonthly: transaction1.isMonthly,
                value: transaction1.value,
                ref: user.ref
            }),
        );

    })

    test('test create second transaction', async () => {

        const transactionData2 = await request(app)
            .post("/api/v1/transaction")
            .set({ "Authorization": `Bearer ${userToken}` })
            .send({ ...transaction2, ref: user.ref })
            .expect(200)

        expect(transactionData2.body.createdTransaction).toEqual(
            expect.objectContaining({
                isMonthly: transaction2.isMonthly,
                value: transaction2.value,
                ref: user.ref
            }),
        );

    })

    test('test transaction data', async () => {
        const myTransactionData = await request(app)
            .get("/api/v1/transaction")
            .set({ "Authorization": `Bearer ${userToken}` })
            .expect(200)
    })

    test('test portfolio statement', async () => {
        const myPortfolioData = await request(app)
            .get("/api/v1/uportfolio")
            .set({ "Authorization": `Bearer ${userToken}` })
            .expect(200)
        let portfolioA = myPortfolioData.body.userPortfolios
        let sum = 0
        for (let i = 0; i < portfolioA.length; i++) {
            sum = currency(sum).add(portfolioA[i].value)
        }
        expect(sum).toEqual(
            currency(transaction1.value).add(transaction2.value)
        );
    })

    afterAll(async () => {
        await thisDb.sequelize.close()
    })
})
