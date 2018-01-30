class Statis {
    constructor() {

    }
    async userCount(req, res, next) {
        const date = req.params.data
        if (!date) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
            return
        }
    }
}
export default new Statis()