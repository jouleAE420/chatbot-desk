interface CreateCitygDtoInterface {
    name: string;
    state: string;
    rate: number;
}

export class CreateCityDto {
    private constructor(public readonly createCityDto: CreateCitygDtoInterface) {}

    static create(props: { [key: string]: any }): [string?, CreateCityDto?] {
        const { name, rate, state } = props;

        if (!name || !rate || !state) return ["You're missing some property", undefined];

        return [undefined, new CreateCityDto({ name, rate,  state })];
    }
}
