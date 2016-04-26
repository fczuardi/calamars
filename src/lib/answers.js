const createExactMatchRouter = routes => {
    const findRoute = text => {
        const route = routes.find(item => item[0] === text) || [null, null];
        return route[1];
    };
    return findRoute;
};

const createRegexRouter = routes => {
    const findAnswer = text => {
        const route = routes.find(item => item[0].test(text)) || [null, null];
        return route[1];
    };
    return findAnswer;
};

const createRegexFunctionRouter = routes => {
    const findAnswer = text => {
        const route = routes.find(item => item[0].test(text)) || null;
        if (route === null) {
            return null;
        }
        const matches = route[0].exec(text);
        return route[1](matches);
    };
    return findAnswer;
};

export {
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter
};
