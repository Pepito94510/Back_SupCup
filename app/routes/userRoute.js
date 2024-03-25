import { Router } from "express";
const userRouter = Router();
import { checkToken, createTokenFromData } from "../utils/tokens.js";
import * as userService from "../services/userService.js"
import * as sportService from "../services/sportService.js"
import * as equipeService from "../services/equipeService.js"
import * as eventService from "../services/eventService.js"
import * as barService from "../services/barService.js"

// favorite import
import * as favoriteSportService from "../services/favorites/favoriteSportService.js";
import * as favoriteTeamService from "../services/favorites/favoriteTeamService.js"
import * as favoriteBarService from "../services/favorites/favoriteBarService.js"

userRouter.get('/', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3
        let allUsers = await userService.getUsers();
        res.json(allUsers).status(200);
    }
});

userRouter.get('/find-one/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: token is required').status(404);
    } else {
        //ajouter check TOKEN > 3 

        if (!req.params) {
            res.json('Error: user id missing in parameters');
        } else {
            let user = await userService.getUser(req.params.userId);
            if (!user) {
                res.json('Error: this user id is unknow in database').status(404);
            } else {
                res.json(user).status(200);
            }
        }
    }
});

userRouter.post('/create', async (req, res) => {
    let userInBDD = await userService.findUserByMail(req.body.email);
    if (userInBDD) {
        res.json('Error: User already in database').status(409);
    } else {
        //AJOUTER CHECK DU BODY
        let newUser = await userService.createUser(req.body);
        if (!newUser) {
            res.json('Error: An error occured during the save').status(200);
        } else {
            res.json('User created').status(201);
        }
    }
});

userRouter.post('/login', async (req, res) => {
    let userInBDD = await userService.findUserByMail(req.body.email);

    if (!userInBDD) {
        res.json('Error: Email is unknow in database').status(409);
    } else {
        let isMatch = await userService.checkPassword(req.body.password, userInBDD.password);
        if (!isMatch) {
            res.json('Error: wrong password or email').status(409);
        } else {
            let jsonData = {
                id_user: userInBDD.id,
                role_id: userInBDD.role_id
            }
            let token = createTokenFromData(jsonData);
            res.json(token).status(200);
        }
    }
});

userRouter.put('/update/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: The token is incorect').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            // ajouter check TOKE N > 3
            if (!req.body.first_name || !req.body.last_name ||
                !req.body.email || !req.body.telephone ||
                !req.body.role_id) {
                res.json('Error: missing parameters').status(404);
            } else {
                await userService.upadteUser(req.params.userId, req.body.first_name, req.body.last_name,
                    req.body.email, req.body.telephone, req.body.role_id);
                res.json('User updated').status(200);
            }
        }
    }
});

userRouter.delete('/delete/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            let userDeleted = await userService.deleteUser(req.params.userId);
            if (!userDeleted) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                res.json('User deleted').status(200);
            }
        }
    }
});

// route API with JOIN for FAV SPORT

userRouter.get('/favorite_sport/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
        } else {
            let favorite_sport = await favoriteSportService.getFavoriteSport(req.params.userId);
            if (!favorite_sport) {
                res.json('Error: User unknow in database').status(404);
            } else {
                res.json(favorite_sport).status(200);
            }
        }
    }
})

userRouter.post('/favorite_sport/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                if (!req.body.sportId) {
                    res.json('Error: the sport_id is required').status(404);
                } else {
                    let checkSportId = await sportService.getSport(req.body.sportId)
                    if (!checkSportId) {
                        res.json('Error: This sport id is unknow in database').status(404);
                    } else {
                        let checkRelation = await favoriteSportService.checkUserSportRelation(req.params.userId, req.body.sportId);
                        if (checkRelation) {
                            res.json('Error: This relation is already in database').status(404);
                        } else {
                            await favoriteSportService.addFavoriteSport(req.params.userId, req.body.sportId);
                            res.json('Favorite sport added').status(201);
                        }
                    }
                }
            }

        }
    }
});

userRouter.delete('/favorite_sport/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);

        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                if (!req.body.sportId) {
                    res.json('Error: the sport_id is required').status(404);
                } else {
                    let checkSportId = await sportService.getSport(req.body.sportId)
                    if (!checkSportId) {
                        res.json('Error: This sport id is unknow in database').status(404);
                    } else {
                        let checkRelation = await favoriteSportService.checkUserSportRelation(req.params.userId, req.body.sportId);
                        if (!checkRelation) {
                            res.json('Error: This relation is unknow in database').status(404);
                        } else {
                            await favoriteSportService.deleteFavoriteSport(checkRelation.id);
                            res.json('Relation deleted').status(200);
                        }
                    }
                }
            }
        }
    }
});

// route API with JOIN for FAV TEAMS

userRouter.get('/favorite_teams/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                let favorite_teams = await favoriteTeamService.getFavoriteTeams(req.params.userId);
                res.json(favorite_teams).status(200);
            }
        }
    }
});

userRouter.post('/favorite_teams/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                let checkEquipeId = await equipeService.getEquipe(req.body.equipeId);
                if (!checkEquipeId) {
                    res.json("Error: This equipeId is unknow in database").status(404);
                } else {
                    let checkRelation = await favoriteTeamService.checkUserTeamRelation(req.params.userId, req.body.equipeId);
                    if (checkRelation) {
                        res.json("Error: This relation is already in database").status(404);
                    } else {
                        await favoriteTeamService.addFavoriteTeams(req.params.userId, req.body.equipeId);
                        res.json('Relation created').status(201);
                    }
                }
            }
        }
    }
});

userRouter.delete('/favorite_teams/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                let checkEquipeId = await equipeService.getEquipe(req.body.equipeId);
                if (!checkEquipeId) {
                    res.json("Error: This equipeId is unknow in database").status(404);
                } else {
                    let checkRelation = await favoriteTeamService.checkUserTeamRelation(req.params.userId, req.body.equipeId);
                    if (!checkRelation) {
                        res.json("Error: This relation is unknow in database").status(404);
                    } else {
                        await favoriteTeamService.deleteFavoriteTeam(checkRelation.id);
                        res.json('Relation deleted').status(201);
                    }
                }
            }
        }
    }
});

userRouter.get('/events/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                let eventsUser = await eventService.getEventsUser(req.params.userId);
                res.json(eventsUser).status(200);
            }
        }
    }
});

userRouter.post('/events/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.body.eventId) {
                res.json('Error: eventId is required').status(404);
            } else {
                let userObject = await userService.getUser(req.params.userId);
                if (!userObject) {
                    res.json('Error: This user is unknow in database').status(404);
                } else {
                    let checkEventId = await eventService.getEvent(req.body.eventId)
                    if (!checkEventId) {
                        res.json('Error: this eventId is unknow in database').status(404);
                    } else {
                        let checkRelation = await eventService.checkEventUserRelation(req.params.userId, req.body.eventId);
                        if (checkRelation) {
                            res.json('Error: This relation is already in database').status(404);
                        } else {
                            let createRelation = await eventService.createEventUserRelation(req.params.userId, req.body.eventId);
                            res.json(createRelation).status(201);
                        }
                    }
                }
            }
        }
    }
});

userRouter.delete('/event/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.body.eventId) {
                res.json('Error: eventId is required').status(404);
            } else {
                let userObject = await userService.getUser(req.params.userId);
                if (!userObject) {
                    res.json('Error: This user is unknow in database').status(404);
                } else {
                    let checkEventId = await eventService.getEvent(req.body.eventId)
                    if (!checkEventId) {
                        res.json('Error: this eventId is unknow in database').status(404);
                    } else {
                        let checkRelation = await eventService.checkEventUserRelation(req.params.userId, req.body.eventId);
                        if (!checkRelation) {
                            res.json('Error: This relation is unknow in database').status(404);
                        } else {
                            await eventService.createEventUserRelation(checkRelation.id);
                            res.json('Relation deleted').status(201);
                        }
                    }
                }
            }
        }
    }
});

// route API with JOIN for FAV BARS

userRouter.get('/favorite_bar/:userId', async (req, res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            let userObject = await userService.getUser(req.params.userId);
            if (!userObject) {
                res.json('Error: This user is unknow in database').status(404);
            } else {
                let eventsUser = await favoriteBarService.getFavoriteBars(req.params.userId);
                res.json(eventsUser).status(200);
            }
        }
    }
});

userRouter.post('/favorite_bar/:userId', async (req,res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.body.barId) {
                res.json('Error: barId is required').status(404);
            } else {
                let userObject = await userService.getUser(req.params.userId);
                if (!userObject) {
                    res.json('Error: This user is unknow in database').status(404);
                } else {
                    let checkBarId = await barService.getBar(req.body.barId)
                    if (!checkBarId) {
                        res.json('Error: this barId is unknow in database').status(404);
                    } else {
                        let checkRelation = await favoriteBarService.checkUserBarRelation(req.params.userId, req.body.barId);
                        if (checkRelation.length > 0) {
                            res.json('Error: This relation is already in database').status(404);
                        } else {
                            let createRelation = await favoriteBarService.addFavoriteBar(req.params.userId, req.body.barId);
                            res.json('Relation created').status(201);
                        }
                    }
                }
            }
        }
    }
});

userRouter.delete('/favorite_bar/:userId', async (req,res) => {
    if (!req.headers.token) {
        res.json('Error: You need a token').status(404);
    } else {
        const tokenOk = checkToken(req.headers.token);
        if (!tokenOk) {
            res.json('Error: The token is incorect').status(404);
            console.log('Error: Wrong token');
        } else {
            // check TOKEN >= 1
            if (!req.body.barId) {
                res.json('Error: barId is required').status(404);
            } else {
                let userObject = await userService.getUser(req.params.userId);
                if (!userObject) {
                    res.json('Error: This user is unknow in database').status(404);
                } else {
                    let checkBarId = await barService.getBar(req.body.barId)
                    if (!checkBarId) {
                        res.json('Error: this barId is unknow in database').status(404);
                    } else {
                        let checkRelation = await favoriteBarService.checkUserBarRelation(req.params.userId, req.body.barId);
                        console.log(checkRelation);
                        if (!checkRelation > 0) {
                            res.json('Error: This relation is unknow in database').status(404);
                        } else {
                            await favoriteBarService.deleteFavoriteBar(checkRelation[0].id);
                            res.json('Relation deleted').status(201);
                        }
                    }
                }
            }
        }
    }
});

export default userRouter;
