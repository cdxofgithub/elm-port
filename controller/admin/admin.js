import AdminModel from '../../models/admin/admin'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'


class Admin extends AddressComponent {
    constructor() {
        super()
        this.login = this.login.bind(this)
    }

    async login(req, res, next) {
        const {user_name, password, status = 1} = req.body;
        req.session.user_name = user_name
        try {
            if (!user_name) {
                throw new Error('用户名参数错误')
            } else if (!password) {
                throw new Error('密码参数错误')
            }
        } catch (err) {
            console.log(err.message, err);
            res.send({
                status: 0,
                type: 'GET_ERROR_PARAM',
                message: err.message,
            })
            return
        }
        // const newpassword = this.encryption(password)
        try {
            const admin = await AdminModel.findOne({user_name})
            if (!admin) {
                const adminTip = status == 1 ? '管理员' : '超级管理员'
                const admin_id = await this.getId('admin_id');
                // const cityInfo = await this.guessPosition(req);
                const newAdmin = {
                    user_name,
                    password: password,
                    id: admin_id,
                    create_time: dtime().format('YYYY-MM-DD HH:mm'),
                    admin: adminTip,
                    status,
                    city: '上海'
                }
                await AdminModel.create(newAdmin)
                req.session.admin_id = admin_id
                req.session.save();
                console.log('设置session')
                console.log(req.session)
                res.send({
                    status: 1,
                    success: '注册管理员成功',
                })
            } else if (password.toString() != admin.password.toString()) {
                res.send({
                    status: 0,
                    type: 'ERROR_PASSWORD',
                    message: '该用户已存在，密码输入错误',
                })
            } else {
                req.session.admin_id = admin.id;
                res.send({
                    status: 1,
                    success: '登录成功'
                })
            }
        } catch (err) {
            console.log('登录管理员失败', err);
            res.send({
                status: 0,
                type: 'LOGIN_ADMIN_FAILED',
                message: '登录管理员失败',
            })
        }

    }

    async getAdminInfo(req, res, next) {
        const admin_id = req.session.admin_id
        console.log('获取session')
        console.log(req.session)
        if (!admin_id || Number(admin_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '获取管理员信息失败'
            })
            return
        }
        try {
            const info = await AdminModel.findOne({
                id: admin_id
            })
            if (!info) {
                throw new Error('未找到当前管理员')
            } else {
                res.send({
                    status: 1,
                    data: info
                })
            }
        } catch
            (err) {
            console.log('获取管理员信息失败');
            res.send({
                status: 0,
                type: 'GET_ADMIN_INFO_FAILED',
                message: '获取管理员信息失败'
            })
        }
    }

    async signout(req, res, next) {
        try {
            delete req.session.admin_id
            res.send({
                status: 1,
                success: '退出成功'
            })
        } catch(err) {
            res.send({
                status: 0,
                message: '退出失败'
            })
        }
    }

    //密码加密
    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }
}


export default new Admin()