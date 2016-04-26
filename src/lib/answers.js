const createExactMatchRouter = pairs => {
    const findAnswer = text => {
        const answer = pairs.find(item => item[0] === text);
        return !answer ? null : answer[1];
    };
    return findAnswer;
};

const createRegexRouter = pairs => {
    const findAnswer = text => {
        const answer = pairs.find(item => item[0].test(text));
        return !answer ? null : answer[1];
    };
    return findAnswer;
};

export {
    createExactMatchRouter,
    createRegexRouter
};
