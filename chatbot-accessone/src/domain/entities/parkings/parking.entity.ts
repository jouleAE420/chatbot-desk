export interface ParkingEntityOptions {
    id: string;
    name: string;
    address: string;
    city: string;
    rate: number;
    email: string;
    phone: string;
}

export class ParkingEntity {
    public name: string;
    public id: string;
    public address: string;
    public city: string;
    public rate: number;
    public email: string;
    public phone: string;

    constructor(options: ParkingEntityOptions) {
        const { email, name, address, city, rate, phone, id } = options;
        this.name = name;
        this.address = address;
        this.city = city;
        this.rate = rate;
        this.email = email;
        this.id = id;
        this.phone = phone;
    }

    static fromJson = (json: string): ParkingEntity => {
        const { name, address, city, rate, email, phone, id } = JSON.parse(json);
        return new ParkingEntity({
            id,
            name,
            address,
            city,
            email,
            rate,
            phone,
        });
    };

    static fromObject = (object: { [key: string]: any }): ParkingEntity => {
        const { name, address, city, rate, email, phone, id } = object;
        if (!name) throw "Name is required";
        if (!id) throw "ID is required";
        if (!city) throw "City is required";
        if (!address) throw "address is required";
        if (!rate) throw "Rate is required";
        if (!phone) throw "Phone is required";
        return new ParkingEntity({
            id,
            name,
            phone,
            address,
            city,
            rate,
            email,
        });
    };
}
