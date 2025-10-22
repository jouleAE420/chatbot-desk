interface CreateParkingDtoInterface {
    name: string;
    address: string;
    email: string;
    city: string;
    rate: number;
    phone:string
}

export class CreateParkingDto {
    private constructor(public readonly createParkingDto: CreateParkingDtoInterface) {}

    static create(props: { [key: string]: any }): [string?, CreateParkingDto?] {
        const { name, address, city, rate, email,phone } = props;

        if (!name || !address || !city || !rate || !email||!phone)
            return ["You're missing some property", undefined];
        
        return [undefined, new CreateParkingDto({ name, address, city, rate, email,phone })];
    }
}
