const createBarData = {
    barName: "Bar test",
    barAddress: "30 rue du test",
    barPostCode: "75001",
    barCity: "Paris",
    barMail: "bar@test.com",
    barUserId: "15",
    barDescription: "This bar is a test"
}

const createBarDataError = {
    barName: "Bar test",
    barAddress: "30 rue du test",
    barCity: "Paris",
    barMail: "bar@test.com",
    barUserId: "15",
    barDescription: "This bar is a test"
}

const updateBarData = {
    barName: "Bar updated",
    barAddress: "30 rue du test à jour",
    barPostCode: "75002",
    barCity: "Lyon",
    barMail: "bar@test-updated.com",
    barUserId: "14",
    barDescription: "This bar is a test updated"
}

export default { createBarData, createBarDataError, updateBarData }
