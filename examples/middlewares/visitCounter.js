
module.exports = () => {
    let visits = 0;
    return (req,res,next) => {
        visits++;
        req.visits = visits;
        next();
    }
}