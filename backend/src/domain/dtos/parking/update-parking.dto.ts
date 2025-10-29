interface UpdateParkingDtoInterface {
    name?: string;
    address?: string;
    email?: string;
    city?: string;
    rate?: number;
}

export class UpdateParkingDto {
    private constructor(public readonly createParkingDto: UpdateParkingDtoInterface) {}

    get values() {
        const returnObj: { [key: string]: any } = {};
        if (this.createParkingDto.name) returnObj.name = this.createParkingDto.name;
        if (this.createParkingDto.rate) returnObj.rate = this.createParkingDto.rate;
        if (this.createParkingDto.address) returnObj.address = this.createParkingDto.address;
        if (this.createParkingDto.city) returnObj.city = this.createParkingDto.city;
        if (this.createParkingDto.email) returnObj.email = this.createParkingDto.email;
        return returnObj;
    }

    static update(props: { [key: string]: any }): [string?, UpdateParkingDto?] {
        const {  name, address, city, rate, email } = props;

        // if (!name || !address || !city || !rate) return ["You're missing some property", undefined];
        return [undefined, new UpdateParkingDto({ name, address, city, rate, email })];
    }
}
