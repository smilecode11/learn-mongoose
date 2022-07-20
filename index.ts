import { MongoClient, FindOptions, UpdateFilter, ObjectId } from 'mongodb'
const url = "mongodb://localhost:27017/"
const client = new MongoClient(url)

async function run() {
    try {
        await client.connect()
        const db = client.db('test')
        // await db.command({ ping: 1 })   //  简单的验证数据库是否链接成功
        /** 数据插入*/
        const testCollection = db.collection<{ name: string, hobbies: string[] }>('user')
        // await testCollection.insertOne({ name: 'smiling.', age: "27" })
        // await testCollection.insertMany([{ name: 'viking.' }, { name: '小白' }])

        /** 数据查找*/
        // await testCollection.findOne({ name: "smiling." })
        //  查询多条记录  1. 使用 forEach, 检索对象上的数据
        // const cursor = testCollection.find({ name: 'smiling.' })  //  查询多条记录, 返回不会是记录, 而是一个特殊的对象
        // await cursor.forEach(doc => console.log(doc))
        //  2. 使用 toArray, 注意数据量过大导致内存曝出
        // await testCollection.find({ name: 'smiling.' }).toArray();
        //  mongodb 内置查询条件(操作符)
        //  a.比较操作符 $gt $lt
        // const results = await testCollection.find({ age: { $lt: 30 } }).toArray()
        //  b.逻辑操作符 $and $or
        // const results = await testCollection.find({ age: { $lt: 30 }, name: 'smiling' }).toArray()   //  逻辑与
        // const condition = { //  逻辑或
        //     $or: [
        //         { age: { $lt: 30 } },
        //         { name: 'smiling' }
        //     ],
        // }
        // const results = await testCollection.find(condition).toArray()
        //  c. element 操作符   $exists $type
        // const condition = {
        //     age: { $exists: true, $type: 'string' } //  找 age 存在的, 值为 string 类型的数据
        // }
        // const results = await testCollection.find(condition).toArray()
        //  数据结果操作
        // const options: FindOptions = {
        //     limit: 2,   //  限制条数
        //     skip: 0, //  跳过条数
        //     sort: { age: -1 },   //  排序 1 / -1
        //     projection: { _id: 0, name: 1 },    //  隐藏 _id, 必须显式设置为 0
        // }
        // const results = await testCollection.find({ age: { $lt: 30, $type: 'number' } }, options).toArray()
        // console.log(results)

        /** 数据修改*/
        // const replaceDoc = await testCollection.replaceOne({ name: 'smiling.', age: 28 }, { name: 'Smiling.' })
        // const updateFilter: UpdateFilter<{ name: string, age: number }> = {
        //     $set: {
        //         name: 'Smiling.',
        //     },
        //     $inc: { //  递增
        //         age: 1
        //     },
        // }
        //  向数组中添加元素
        // const updateFilter: UpdateFilter<{ name: string, age: number, hobbies: string[] }> = {
        // $push: {
        //     // hobbies: 'golf'
        //     // hobbies: {
        //     //     $each: ['eating 2'],
        //     //     $position: 0    //  位置
        //     // }
        // }

        // $pop: {
        //     hobbies: -1 //  删除第一项
        // }

        // $set: {
        // "hobbies.0": '滴滴滴'   //  修改 hobbies 中的第一项为滴滴滴
        // }
        // }
        // const replaceDoc = await testCollection.updateOne({ name: "Smiling." }, updateFilter)
        // console.log(replaceDoc)

        //  模糊查找
        // const result = await testCollection.findOne({
        // name: { $regex: /miling/g }
        // hobbies: { $all: ['滴滴滴'] }
        // hobbies: '滴滴滴'
        // hobbies: { $regex: /run/g }
        // })
        // console.log(result)

        //  查找更新
        // const updateFilter: UpdateFilter<{ name: string, hobbies: string[] }> = {
        //     $set: {
        //         "hobbies.$": 'golf' //  命中更新为 golf-new
        //     }
        // }
        // const updateDoc = await testCollection.updateOne({
        //     name: 'Smiling.',   //  查找name 为 Smiling.
        //     hobbies: {
        //         $regex: /girl/g //  更新 hobbies 中被正则命中的项
        //     }
        // }, updateFilter)
        // console.log(updateDoc)

        //  索引查找
        // let tempArr = []
        // for (let i = 0; i <= 50000; i++) {
        //     tempArr.push({ type: 'test', name: `smiling_${i}`, age: [26, 27, 28, 29][i % 4] })
        // }
        // await testCollection.insertMany(tempArr)
        // explain() 返回查询信息
        // const result = await testCollection.find({ name: "smiling_520" }).explain()
        // console.log(result)
        // {
        //     queryPlanner: {
        //     },
        //     executionStats: {
        //         executionSuccess: true,
        //         nReturned: 1,
        //         executionTimeMillis: 18,
        //         totalKeysExamined: 0,
        //         totalDocsExamined: 50006,
        //     }
        // }

        //  使用索引进行查询
        // const result = await testCollection.find({_id: new ObjectId("62a54745218e44bfb4051d4e")}).explain()
        // {
        //     queryPlanner: {
        //       plannerVersion: 1,
        //       namespace: 'test.user',
        //       indexFilterSet: false,
        //       parsedQuery: { _id: [Object] },
        //       winningPlan: { stage: 'IDHACK' },
        //       rejectedPlans: []
        //     },
        //     executionStats: {
        //       executionSuccess: true,
        //       nReturned: 1,
        //       executionTimeMillis: 0,
        //       totalKeysExamined: 1,
        //       totalDocsExamined: 1,
        //     }
        //   }


        //  创建索引
        // await testCollection.createIndex({ name: 1 })
        // console.log(await testCollection.listIndexes().toArray())   //  查看文档的索引
        //  删除索引
        // await testCollection.dropIndex('name_1')
        // const result = await testCollection.find({ name: 'smiling_520' }).explain()
        // console.log(result)


        //  聚合查询
        // const pipLine = [
        //     { $match: { age: { $lt: 30 } } },    //  $match 过滤数据
        //     { $group: { _id: "$age", total: { $sum: '$age' }, avg: { $avg: "$age" }, count: { $sum: 1 } } }, //  $group 分组, 属性 _id 必需指定, 输出相关统计字段及其结果
        //     { $sort: { total: 1 } } //  排序
        // ]
        // const results = await testCollection.aggregate(pipLine).toArray()
        // console.log(results)


        //  设置 users 部分数据添加 dept_id 属性
        // const updateFilter: UpdateFilter<{ name: string, dept_id: ObjectId }> = {
        //     $set: {
        //         dept_id: new ObjectId("62a56d6e791bfc45bded57e0")
        //     }
        // }
        // const updateDoc = await testCollection.updateMany({ name: { $regex: /^smiling_6/g } }, updateFilter)
        // console.log(updateDoc)

        //  使用聚合操作符 $lookup 进行多表连接查询
        const pipLine = [
            {
                $match: { dept_id: { $exists: true } }
            },
            {
                $lookup: {
                    from: 'depts',
                    localField: 'dept_id',
                    foreignField: "_id",
                    as: 'dept'
                }
            }
        ]
        const deptWithUsers = await testCollection.aggregate(pipLine).toArray()
        console.log(deptWithUsers[0])
        // {
        //     _id: new ObjectId("62a54745218e44bfb4051b77"),
        //     type: 'test',
        //     name: 'smiling_5',
        //     age: 27,
        //     dept_id: new ObjectId("62a56d5f791bfc45bded57dd"),
        //     dept: [
        //       {
        //         _id: new ObjectId("62a56d5f791bfc45bded57dd"),
        //         name: '组织部',
        //         user_ids: [Array]
        //       }
        //     ]
        //   }


        const deptCollection = db.collection<{ name: string }>('depts')
        const pipLine2 = [
            { $match: { name: '组织部' } },
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_ids',
                    foreignField: '_id',
                    as: "user"
                }
            }
        ]
        const userWithDept = await deptCollection.aggregate(pipLine2).toArray()
        console.log(userWithDept[0])
        // {
        //     _id: new ObjectId("62a56d5f791bfc45bded57dd"),
        //     name: '组织部',
        //     user_ids: [
        //         new ObjectId("62a49fd69d4814685dbc8250"),
        //         new ObjectId("62a4a01a35ae3cf1539a2943")
        //     ],
        //     user: [
        //         {
        //         _id: new ObjectId("62a49fd69d4814685dbc8250"),
        //         name: 'Smiling.',
        //         age: 31,
        //         gender: 'male',
        //         hobbies: [Array]
        //         },
        //         { _id: new ObjectId("62a4a01a35ae3cf1539a2943"), name: 'viking.' }
        //     ]
        // }
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
    }
}

run()