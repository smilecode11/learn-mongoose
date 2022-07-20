import { connect, disconnect, model, Schema } from 'mongoose'
async function main() {
    try {
        await connect('mongodb://localhost:27017/test')
        console.log('[egg-mongoose] connected successful')
        //  通过 model 约束数据格式
        // const ProductSchema = new Schema({
        //     name: { type: String },
        //     price: { type: Number }
        // })
        // const ProductModal = model('Product', ProductSchema);
        // 使用构造函数静态方法进行数据保存
        // await ProductModal.create({
        //     name: "cellphone2",
        //     price: 1400
        // })
        //  是否实例方法调用进行数据保存
        // const ipad = new ProductModal({
        //     name: 'ipad2',
        //     price: 4500,
        // })
        // await ipad.save()

        //  查询数据库中已存在文档, 需要第二个参数支持
        const UserSchema = new Schema({
            name: { type: String },
            age: { type: Number },
            hobbies: { type: Array },
            dept_id: { type: Schema.Types.ObjectId }
        }, { collection: 'user' })
        const UserModel = model('User', UserSchema)
        // console.log(await UserModel.find({ name: { $regex: /smiling_400/g } }).exec())
        console.log(await UserModel.find({ dept_id: { $exists: true } }).exec())

    } catch (e) {
        console.error(e)
    } finally {
        disconnect()
    }
}

main()