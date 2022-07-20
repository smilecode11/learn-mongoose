function docFactory(brand: string) {
    return function (prototype, key: string, descriptor: PropertyDescriptor) {
        //  descriptor 是 undefined wtf!!!
        console.log(`${brand} this is descriptor`, prototype, key, descriptor)
    }
}

class Car {
    brand: string;
    constructor(brand: string) {
        this.brand = brand
    }
    @docFactory('小鹏滴滴滴')
    run() {
        console.log(this.brand + 'running')
    }
}

const car = new Car('BMW')
car.run()