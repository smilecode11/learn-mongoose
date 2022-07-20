import { AbilityBuilder, Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra';
import { pick } from 'lodash';

class Work {
    constructor(attrs) {
        Object.assign(this, attrs)
    }
}

interface IUser {
    id: number,
    role: 'admin' | 'normal' | 'vip'
}

const adminUser: IUser = {
    id: 1,
    role: 'admin'
}

const normalUser: IUser = {
    id: 2,
    role: 'normal'
}

const payedUser: IUser = {
    id: 3,
    role: 'vip'
}

//  限定返回字段
const WORK_FIELDS = ['id', 'author', 'isTemplate', 'title', 'content', 'uuid'];
const options = { fieldsFrom: rule => rule.fields || WORK_FIELDS };

const normalWork = new Work({ id: 1, author: 2, isTemplate: false, title: 'title', content: 'content', uuid: 'abc' });
const vipWork = new Work({ id: 1, author: 3, isTemplate: true, title: 'title', content: 'content', uuid: 'xyz' });

function defineRules(user: IUser) {
    const { can, cannot, build } = new AbilityBuilder(Ability);
    if (user.role === 'admin') {
        can('manage', 'all')
    } else if (user.role === 'vip') {
        can('download', 'Work')
        can('read', 'Work')
        can('delete', 'Work', { author: user.id })
        can('update', 'Work', ['uuid', 'title', 'content'], { author: user.id })   //  fields 即可修改属性 string[]
    }
    if (user.role === 'normal' || user.role === 'vip') {
        can('read', 'Work')
        can('delete', 'Work', { author: user.id })
        can('update', 'Work', ['title', 'content'], { author: user.id })
    }
    return build()
}

//  admin roles
const rules = defineRules(adminUser)
console.log('admin', rules.can('download', 'Work'));
console.log('admin', rules.can('delete', 'Work'));
console.log('admin', rules.can('update', vipWork));
console.log('admin', rules.can('update', normalWork));

//  vip roles
const rules2 = defineRules(payedUser)
console.log('vip', rules2.can('download', 'Work'));
console.log('vip update', rules2.can('update', vipWork, 'title'))
console.log('vip update', rules2.can('update', vipWork, 'uuid'))

//  normal roles
const rules3 = defineRules(normalUser)
console.log('normal', rules3.can('download', 'Work'));
console.log('normal', rules3.can('delete', 'Work'));
console.log('normal', rules3.can('update', normalWork));
console.log('normal', rules3.can('update', vipWork));
console.log('normal update', rules3.can('update', normalWork, 'title'))
console.log('normal update', rules3.can('update', normalWork, 'uuid'))

//  check allowed fileds
const files = permittedFieldsOf(rules2, 'update', vipWork, options)
console.log('vip allowed update', files)

const files2 = permittedFieldsOf(rules3, 'update', normalWork, options)
console.log('normal allowed update', files2)

//  normal User request
const reqBody = {
    title: 'CASL',
    content: 'powerful',
    uuid: 'dsad'
}
//  普通用户传入非能力之内更新的字段, 使用 lodash.pick 进行过滤
const rawWork = pick(reqBody, files2);
console.log('normal user power update data', rawWork)
