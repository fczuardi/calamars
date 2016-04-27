const createExactMatchRouter = routes => {
    const findRoute = text => {
        const route = routes.find(item => item[0] === text) || [null, null];
        return route[1];
    };
    return findRoute;
};

const createRegexRouter = routes => {
    const findRoute = text => {
        const route = routes.find(item => item[0].test(text)) || [null, null];
        return route[1];
    };
    return findRoute;
};

const createRegexFunctionRouter = routes => {
    const findRoute = text => {
        const route = routes.find(
            item => item[0].test(text)
        ) || [new RegExp(null), null];
        const matches = route[0].exec(text);
        return route[1](matches);
    };
    return findRoute;
};

const createRouter = routes => {
    const findRoute = payload => {
        const route = routes.find(
            item => item[0](payload)
        ) || [null, null];
        return route[1](payload);
    };
    return findRoute;
};

export {
    createExactMatchRouter,
    createRegexRouter,
    createRegexFunctionRouter,
    createRouter
};
